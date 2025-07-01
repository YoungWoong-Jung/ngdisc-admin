'use client'

import Button from "@/component/button/Button";
import { ContextMenuItem } from "@/component/gnb/ContextMenu";
import LnbHeader from "@/component/lnb/LnbHeader";
import Table, { TableCol, useTableData } from "@/component/table/Table";
import { etccd } from "@/types/Etccd";
import {report} from "@/types/report";
import { test, test_cate } from "@/types/test"
import API from "@/util/API";
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random";
import toast from "@/util/toast";
import { RowClickedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import useSWR, { SWRResponse } from "swr"

export default function Page(){

    const [selectedTestCate, setSelectedTestCate] = useState<test_cate | null>(null)

    const {data:testCates, isLoading:testCatesLoading, mutate:mutateTestCates}: SWRResponse<test_cate[]> = useSWR('/admin-api/test/testCates', Fetcher);
    const {data:tests, isLoading: testsLoading, mutate:mutateTests}: SWRResponse<test[]> = useSWR(`/admin-api/test/tests${selectedTestCate ? `?test_cate_id=${selectedTestCate.test_cate_id}` : ''}`, Fetcher)
    const {data:reports, isLoading: reportsLoading, mutate:mutateReports}: SWRResponse<report[]> = useSWR('/admin-api/report/reports', Fetcher)
    // 코드
    const {data: testClassify, isLoading: testClassifyLoading}: SWRResponse<etccd[]> = useSWR('/admin-api/test/testClassify', Fetcher)
    const {data: testStatus, isLoading: testStatusLoading}: SWRResponse<etccd[]> = useSWR('/admin-api/test/testStatus', Fetcher)
    const {data: testLogic, isLoading: testLogicLoading}: SWRResponse<etccd[]> = useSWR('/admin-api/test/testLogic', Fetcher)

    const [testCateData, setTestCateData] = useTableData<test_cate>(testCates || [], 'test_cate_id')
    const [testData, setTestData] = useTableData<test>(tests || [], 'test_id')

    const testCateTableRef = useRef<AgGridReact<test_cate>>(null)
    const testTableRef = useRef<AgGridReact<test>>(null)

    const testCateColDef: TableCol[] = [
        {headerName: 'id', field:'test_cate_id', type: 'number', editable: true},
        {headerName: '이름', field:'test_cate_name', type: 'text', editable: true, required: true},
        {headerName: '이미지', field:'test_cate_img', type: 'image', editable: true, required: true},
        {headerName: '사용여부', field:'test_cate_useyn', type: 'boolean', editable: true, required: true},
        {headerName: '설명', field:'test_cate_desc', type: 'post', editable: true, required: true, flex: 1},
    ]

    const testColDef: TableCol[] = [
        {headerName:'id', field: 'test_id', type: 'number', editable: false},
        {headerName:'검사 상태', field: 'test_status', type: 'select', required: true, editable: true, cellEditorParams: {options: testStatus?.map(status => ({value: status.etccd_id, label: status.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const status = testStatus?.find(status => status.etccd_id === params.value)
            const color = status?.etccd_id === 'TST-STS-EXPR' ? 'text-redTone' : status?.etccd_id === 'TST-STS-PREP' ? 'text-theme' : 'text-blueTone'
            return <p className={`font-semibold !m-0 ${color}`}>{status?.etccd_value_1}</p>
        }},
        {headerName:'검사 대분류', field: 'test_cate_id', type: 'select', editable: true, cellEditorParams: {options: testCates?.map(cate => ({value: cate.test_cate_id, label: cate.test_cate_name}) )}, cellRenderer: (params: any) => {
            const cate = testCates?.find(cate => cate.test_cate_id === params.value)
            return cate?.test_cate_name
        }},
        {headerName:'검사 분류', field: 'test_classify', type: 'select', editable: true, cellEditorParams: {options: testClassify?.map(classify => ({value: classify.etccd_id, label: classify.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const classify = testClassify?.find(classify => classify.etccd_id === params.value)
            return classify?.etccd_value_1
        }},
        {headerName:'검사 이름', field: 'test_title', type: 'text', editable: true, required: true},
        {headerName:'설명', field: 'test_desc', type: 'longText', editable: true},
        {headerName:'시작일', field: 'test_start_date', type: 'date', editable: true},
        {headerName:'종료일', field: 'test_end_date', type: 'date', editable: true},
        {headerName:'질문 순서 변경', field: 'test_random_sort', type: 'boolean', editable: true},
        {headerName:'버전', field: 'test_version', type: 'number', editable: true, required: true},
        {headerName:'차수', field: 'test_revision', type: 'number', editable: true, required: true},
        {headerName:'메모', field: 'test_memo', type: 'longText', editable: true},
        {headerName:'키워드', field: 'test_tags', type: 'longText', editable: true},
        {headerName:'로직', field: 'test_logic', type: 'select', required: true, editable: true, cellEditorParams: {options: testLogic?.map(logic => ({value: logic.etccd_id, label: logic.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const logic = testLogic?.find(logic => logic.etccd_id === params.value)
            return logic?.etccd_value_1
        }},
        {headerName:'이미지', field: 'test_img', type: 'image', editable: true},
        {headerName:'썸네일', field: 'test_thumbnail', type: 'image', editable: true},
        {headerName:'무료여부', field: 'test_free', type: 'boolean', editable: true},
        {headerName:'보고서', field: 'report_id', type: 'select', editable: true, cellEditorParams: {options: reports?.map(report => ({value: report.report_id, label: report.report_title}) )}, cellRenderer: (params: any) => {
            const report = reports?.find(report => report.report_id === params.value)
            return report ?  `${report?.report_title} (${report?.report_version}.${report?.report_revision})` : '-'
        }},
        {headerName:'문항수', field: 'question_count', type: 'text', editable: true},
        {headerName:'소요시간', field: 'time_taken', type: 'text', editable: true},
    ]


    const handleTestCateSelect = (row: RowClickedEvent) => {
        const selected = testCateTableRef?.current?.api.getSelectedRows()?.[0]
        if(selected){
            setSelectedTestCate(selected)
        } else {
            setSelectedTestCate(null)
        }
    }
    const addTest = async () => {
        if(!selectedTestCate){
            toast('검사 대분류를 선택해주세요')
            return
        }
        const newId = - Random.number(0,99999)        
        const newTest = {
            test_id: newId,
            test_cate_id: selectedTestCate?.test_cate_id || 0,
            _id: newId,
            _status: 'create'
        } as unknown as test;

        setTestData(prev => [...prev, newTest] as any)
    }

    const saveTestUpdates = async () => {
        console.log(testData)
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        testData.forEach(d => {
            if(d._status === 'create'){
                createRows.push(d)
            } else if(d._status === 'update'){
                updateRows.push(d)
            } else if(d._status === 'delete'){
                deleteRows.push(d)
            }
        })

        const result = await API.POST('/admin-api/test/changeTests', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateTests()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    const addTestCate = async () => {
        const newId = - Random.number(0,99999)        
        const newTestCate = {
            test_cate_id: newId,
            _id: newId,
            _status: 'create'
        } as unknown as test_cate;

        setTestCateData(prev => [...prev, newTestCate] as any)
    }

    const saveTestCateUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        testCateData.forEach(d => {
            if(d._status === 'create'){
                createRows.push(d)
            } else if(d._status === 'update'){
                updateRows.push(d)
            } else if(d._status === 'delete'){
                deleteRows.push(d)
            }
        })
        const result = await API.POST('/admin-api/test/changeTestCates', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateTestCates()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    return <>
        <div className="w-full h-full p-4 grid grid-rows-[auto_1fr_3fr] gap-3">
            <LnbHeader title="검사 관리"/>
            <Table label="검사 대분류" keyColumn="test_cate_id" colDefs={testCateColDef} rowSelection={{mode: 'singleRow'}} data={testCateData} originalData={testCates || []} setData={setTestCateData} onRowSelected={handleTestCateSelect} ref={testCateTableRef}>
                <Button onClick={addTestCate} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveTestCateUpdates}>저장</Button>
            </Table>
            <Table keyColumn="test_id" colDefs={testColDef} data={testData} setData={setTestData} originalData={tests || []} ref={testTableRef} label="검사">
                <Button onClick={addTest} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveTestUpdates}>저장</Button>
            </Table>
        </div>
    </>
}