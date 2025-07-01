'use client'

import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import { profile_card_template } from "@/types/profile"
import { etccd } from "@/types/Etccd"
    import { report, report_template } from "@/types/report"
import Fetcher from "@/util/Fetcher"
import useSWR, { SWRResponse } from "swr"
import { useEffect } from "react"
import Button from "@/component/button/Button"
import Random from "@/util/random"
import API from "@/util/API"
import toast from "@/util/toast"
import Link from "next/link"

export default function Page () {
    const {data: reportClassifies, mutate: mutateReportClassifies}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_cate=report&etccd_subcate=classify', Fetcher)
    const {data: reportTemplates}: SWRResponse<report_template[]> = useSWR('/admin-api/report/reportTemplates', Fetcher)
    const {data: profileCardTemplates}: SWRResponse<profile_card_template[]> = useSWR('/admin-api/profileCard/profileCardTemplates', Fetcher)

    const {data: reports, mutate: mutateReports}: SWRResponse<report[]> = useSWR('/admin-api/report/reports', Fetcher)
    const [reportsData, setReportsData] = useTableData<report>(reports || [], 'report_id');

    const reoportColDef: TableCol[] = [
        {headerName: 'id', field: 'report_id', type: 'id', editable: false},
        {headerName: '제목', field: 'report_title', type: 'text', required: true},
        {headerName: '버전', field: 'report_version', type: 'number', required: true},
        {headerName: '차수', field: 'report_revision', type: 'number', required: true},
        {headerName: '보고서 종류', field: 'report_classify', type: 'select', required: true, cellEditorParams: {options: reportClassifies?.map(cl => ({value: cl.etccd_id, label: cl.etccd_value_1})) || []}, cellRenderer: (params: any) => {
            const classify = reportClassifies?.find(cl => cl.etccd_id === params.value)
            return classify?.etccd_value_1
        }},
        {headerName: '보고서 탬플릿 아이디', field: 'report_template_id', type: 'select', required: true, cellEditorParams: {options: reportTemplates?.map(template => ({value: template.report_template_id, label: template.report_template_title})) || []}, cellRenderer: (params: any) => {
            const template = reportTemplates?.find(template => template.report_template_id === params.value)
            return template ? template.report_template_title : ''
        }},
        {headerName: '프로필 카드 탬플릿 아이디', field: 'profile_card_template_id', type: 'select', required: true, cellEditorParams: {options: profileCardTemplates?.map(template => ({value: template.profile_card_template_id, label: template.profile_card_template_name})) || []}, cellRenderer: (params: any) => {
            const template = profileCardTemplates?.find(template => template.profile_card_template_id === params.value)
            return template ? template.profile_card_template_name : ''
        }},
        {
            headerName: '수정', field: 'report_id', type: 'text', editable: false,
            cellRenderer: (params: any) => {
                return <Link className="text-xs bg-black bg-opacity-10 text-black-700 px-2 py-1 rounded-md" href={`/report/content?report_id=${params.value}`}>내용 편집</Link>
            }
        }
    ]

    const addReport = () => {
        const newId = - Random.number(0,99999)
        const newReport = {
            report_id: newId,
            report_title: '',
            report_version: 1,
            report_revision: 1,
            report_classify: '',
            report_template_id: '',
            profile_card_template_id: '',
            _id: newId,
            _status: 'create'
        } as unknown as report
        setReportsData(prev => [...prev, newReport] as any)
    }

    const saveReportUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        reportsData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)   
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result = await API.POST('/admin-api/report/changeReports', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateReports()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    return <>
        <div className="w-full h-full p-4 gap-3 grid grid-cols-1 grid-rows-[auto_1fr]">
            <LnbHeader title="보고서 관리"/>

            <Table
                colDefs={reoportColDef}
                data={reportsData}
                setData={setReportsData}
                keyColumn="report_id"
                label="보고서 목록"
                deletable={true}
                editable={true}
                originalData={reports}
            >
                <Button onClick={addReport} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveReportUpdates}>저장</Button>
            </Table>
        </div>
    </>
}