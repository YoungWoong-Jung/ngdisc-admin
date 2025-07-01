'use client'

import Button from "@/component/button/Button"
import Select from "@/component/input/select"
import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import disc_type from "@/types/disc_type"
import { etccd } from "@/types/Etccd"
import { report, report_content, report_template_config } from "@/types/report"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random"
import toast from "@/util/toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"

export default function Page () {
    const searchParams = useSearchParams()
    const reportId = searchParams.get('report_id')
    const router = useRouter()

    const {data: reports}: SWRResponse<report[]> = useSWR('/admin-api/report/reports', Fetcher)
    const {data:discTypes}:SWRResponse<disc_type[]> = useSWR('/admin-api/core/discTypes', Fetcher)
    const {data:contentTypes}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_cate=report&etccd_subcate=config', Fetcher)


    const [selectedReportId, setSelectedReportId] = useState<number | null>(reportId ? Number(reportId) : null)
    const [selectedDiscType, setSelectedDiscType] = useState<string | null>(null)

    const {data: reportTemplateConfigs}: SWRResponse<report_template_config[]> = useSWR(`/admin-api/report/reportTemplateConfigsByReportId?report_id=${selectedReportId || ''}`, Fetcher)

    const {data: reportContents, mutate: reportContentsMutate}: SWRResponse<report_content[]> = useSWR(`/admin-api/report/reportContents?report_id=${selectedReportId || ''}&disc_type=${selectedDiscType || ''}`, Fetcher)
    const [reportContentsCopy, setReportContentsCopy] = useState<report_content[]>([])  // 복사본, 선택한 유형에 contents가 없는경우 config에서 붙여넣기 위해 copy로 임시 데이터처럼 사용
    const [reportContentsData, setReportContentsData] = useTableData<report_content>(reportContentsCopy || [], 'report_content_id')

    
    const reportContentsColDef: TableCol[] = [
        {headerName: 'id', field: 'report_content_id', type: 'id', editable: false},
        {headerName: '유형', field: 'disc_type', type: 'select', cellEditorParams: {options: discTypes?.map(discType => ({value: discType.disc_type, label: `${discType.disc_type_letter}`})) || []}, required: true, cellRenderer: (params: any) => {
            const discType = discTypes?.find(discType => discType.disc_type === params.value)
            return discType?.disc_type_letter
        }},
        {headerName: '표시', field: 'content_type', type: 'select', cellEditorParams: {options: contentTypes?.map(contentType => ({value: contentType.etccd_id, label: contentType.etccd_value_1})) || []}, required: true, cellRenderer: (params: any) => {
            const contentType = contentTypes?.find(contentType => contentType.etccd_id === params.value)
            return contentType?.etccd_value_1
        }},
        {headerName:'페이지', field: 'page_name', type: 'text', editable: true, required: true},
        {headerName: '내용', field: 'content', type: 'longText', editable: true, required: true, flex: 1},
        {headerName: '순서', field: 'seq', type: 'number', editable: true, required: true},
    ]

    useEffect(() => {
        if(!selectedDiscType) {
            setReportContentsCopy(reportContents || [])
            return
        }
        if(!reportContents || reportContents.length === 0){
            const config = reportTemplateConfigs?.map(c => ({
                report_id: selectedReportId,
                report_content_id: - Random.number(1, 999999999),
                disc_type: selectedDiscType,
                content_type: c.report_template_config_type,
                page_name: c.report_template_config_page_name,
                content: c.report_template_config_default,
                seq: c.report_template_config_seq,
                _status: 'create'
            })) || []
            setReportContentsCopy(config as unknown as report_content[])
        } else {
            setReportContentsCopy(reportContents)
        }

    }, [selectedDiscType, reportContents])

    const saveReportContentsUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        reportContentsData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result = await API.POST('/admin-api/report/changeReportContents', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            reportContentsMutate()
        } else {
            toast(result.message)
        }
    }

    const saveTempData = async () => {
        if(!selectedReportId || !selectedDiscType){
            toast('보고서와 유형을 선택해주세요.')
            return
        }
        const result = await API.POST<{tempReportId: number; tempReportContentId: number}>('/admin-api/report/saveTempDataForPreview', {
            reportContents: reportContentsData,
            report_id: selectedReportId,
            disc_type: selectedDiscType
        })
        if(result.ok){
            toast('임시 저장되었습니다.')
            return result.data
        } else {
            toast(result.message)
            return null
        }
    }

    const preview = async () => {
        const tempData = await saveTempData()
        if(!tempData) return
        const url = `${process.env.NEXT_PUBLIC_URL}/report/admin_temp?tempReportId=${tempData.tempReportId}&tempReportContentId=${tempData.tempReportContentId}&disc_type=${selectedDiscType}&name=${'테스트'}&d_score=25&i_score=25&s_score=25&c_score=25`
        window.open(url, '_blank', 'width=480,height=768')
    }

    return <>
        <div className="w-full h-full p-4 gap-3 grid grid-cols-1 grid-rows-[auto_auto_1fr]">
            <LnbHeader title="보고서 내용 편집">
            </LnbHeader>
            <div className="flex justify-between gap-6 items-center bg-black-50 rounded-xl p-4">
                <div  className="flex gap-3">
                    <Select label="보고서" options={reports?.map(report => ({value: report.report_id, label: `${report.report_title} (${report.report_version}.${report.report_revision})`})) || []} value={selectedReportId} setValue={setSelectedReportId} className="w-64"></Select>
                    <Select label="유형" options={discTypes?.map(discType => ({value: discType.disc_type, label: `${discType.disc_type_letter}`})) || []} value={selectedDiscType} setValue={setSelectedDiscType} className="w-64"></Select>
                </div>
            </div>
            <Table
                keyColumn="report_content_id"
                label="보고서 내용"
                colDefs={reportContentsColDef}
                deletable={true}
                data={reportContentsData}
                setData={setReportContentsData}
                originalData={reportContents || []}
            >
                <Button onClick={preview} className="bg-blueTone-100 text-blueTone">미리보기</Button>
                <Button onClick={saveTempData} className="bg-blueTone-100 text-blueTone">임시 저장</Button>
                <Button onClick={saveReportContentsUpdates}>저장</Button>
            </Table>
        </div>
    </>
}