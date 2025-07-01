'use client'

import Button from "@/component/button/Button"
import Select from "@/component/input/select"
import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import { etccd } from "@/types/Etccd"
import { question, question_item, test, test_cate } from "@/types/test"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random"
import toast from "@/util/toast"
import { AgGridReact } from "ag-grid-react"
import { useEffect, useRef, useState } from "react"
import useSWR, { SWRResponse } from "swr"

export default function Page () {

    const questionsRef = useRef<AgGridReact<question>>(null)
    const questionItemsRef = useRef<AgGridReact<question_item>>(null)

    const {data: questionTypes}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_cate=question&etccd_subcate=type', Fetcher)

    const [selectedTestCateId, setSelectedTestCateId] = useState<number | null>(null)
    const [selectedTestClassify, setSelectedTestClassify] = useState<string | null>(null)
    const [selectedTestId, setSelectedTestId] = useState<number | null>(null)
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)

    const {data: testCates}: SWRResponse<test_cate[]> = useSWR('/admin-api/test/testCates', Fetcher)
    const {data: testClassifies}: SWRResponse<etccd[]> = useSWR('/admin-api/test/testClassify', Fetcher)
    const {data: tests}: SWRResponse<test[]> = useSWR(`/admin-api/test/tests?test_cate_id=${selectedTestCateId || ''}&test_classify=${selectedTestClassify || ''}&test_status=TST-STS-PREP`, Fetcher)

    const [questionSearchUrl, setQuestionSearchUrl] = useState<string>('')
    const {data: questions, mutate: mutateQuestions}: SWRResponse<question[]> = useSWR(questionSearchUrl, Fetcher)
    const [questionsData, setQuestionsData] = useTableData<question>(questions || [], 'question_id')

    const [questionItemsSearchUrl, setQuestionItemsSearchUrl] = useState<string>('')
    const {data: questionItems, mutate: mutateQuestionItems}: SWRResponse<question_item[]> = useSWR(questionItemsSearchUrl, Fetcher)
    const [questionItemsData, setQuestionItemsData] = useTableData<question_item>(questionItems || [], 'question_item_id')

    const handleSearch = () => {
        if(selectedTestId){
            setQuestionSearchUrl(`/admin-api/test/questions?test_id=${selectedTestId}`)
        } else {
            toast('검사를 선택해주세요')
            setQuestionSearchUrl('')
        }
    }

    const handleQuestionCellClicked = (params: any) => {
        const question_id = params.data.question_id
        setSelectedQuestionId(question_id)
        setQuestionItemsSearchUrl(`/admin-api/test/questionItems?question_id=${question_id}`)
    }

    const questionsColDefs: TableCol[]= [
        {headerName: 'id', field: 'question_id', type: 'id', editable: false,},
        {headerName: '질문', field: 'question_content', type: 'text', editable: true, flex: 1, required: true},
        {headerName: '질문 유형', field: 'question_type', type: 'select', editable: true, required: true, cellEditorParams: {options: questionTypes?.map(type => ({value: type.etccd_id, label: type.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const type = questionTypes?.find(type => type.etccd_id === params.value)
            return type?.etccd_value_1
        }},
        {headerName: '메모 (관리자용)', field: 'question_memo', type: 'longText', editable: true},
        {headerName: '필수선택', field: 'question_required', type: 'boolean', editable: true},
        // {headerName: '선택지 수정', field: 'question_id', editable: false, cellRenderer: (params: any) => {
        //     return <Button className="bg-black bg-opacity-10 rounded-sm text-xs text-black-600" onClick={() => {
        //         handleQuestionCellClicked(params)
        //     }}>선택지 수정</Button>
        // }},
    ]

    const questionItemsColDefs: TableCol[]= [
        {headerName: 'id', field: 'question_item_id', type: 'id', editable: false,},
        {headerName: '질문', field: 'question_item_content', type: 'text', editable: true, flex: 1, required: true},
        {headerName: 'D 점수', field: 'question_item_d_score', type: 'number', editable: true, required: true},
        {headerName: 'I 점수', field: 'question_item_i_score', type: 'number', editable: true, required: true},
        {headerName: 'S 점수', field: 'question_item_s_score', type: 'number', editable: true, required: true},
        {headerName: 'C 점수', field: 'question_item_c_score', type: 'number', editable: true, required: true},
        {headerName: '사용여부', field: 'question_item_useyn', type: 'boolean', editable: true},
    ]

    const addQuestion = () => {
        if(!selectedTestId){
            toast('검사를 선택해주세요')
            return
        }
        const newId = - Random.number(0,99999)        
        const newQuestion = {
            test_id: selectedTestId,
            question_id: newId,
            question_type: 'QST-T-SEL',
            question_required: true,
            _id: newId,
            _status: 'create'
        } as unknown as question;
        setQuestionsData(prev => [...prev, newQuestion] as any)
    }

    const saveQuestionUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        questionsData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result  = await API.POST('/admin-api/test/changeQuestions', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })

        if(result.ok){
            toast('저장되었습니다.')
            mutateQuestions()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }

    }

    const addQuestionItem = () => {
        if(!selectedQuestionId){
            toast('문항을 선택해주세요')
            return
        }
        const newId = - Random.number(0,99999)
        const newQuestionItem = {
            question_id: selectedQuestionId,
            question_item_id: newId,
            question_item_content: '',
            question_item_d_score: 0,
            question_item_i_score: 0,
            question_item_s_score: 0,
            question_item_c_score: 0,
            question_item_useyn: true,
            _id: newId,
            _status: 'create'
        } as unknown as question_item
        setQuestionItemsData(prev => [...prev, newQuestionItem] as any)
    }

    const saveQuestionItemUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        questionItemsData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result = await API.POST('/admin-api/test/changeQuestionItems', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateQuestionItems()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    return <>
        <div className="p-4 grid grid-cols-1 grid-rows-[auto_auto_5fr_3fr] gap-3 w-full h-full">
            <LnbHeader title="문항 관리">
                <p className="text-sm text-theme text-right">준비 상태인 검사만 조회와 수정이 가능합니다</p>
            </LnbHeader>
            <div className="bg-black-50 rounded-xl p-4 grid grid-cols-[repeat(4,minmax(240px,1fr))] gap-3"> 
                <Select label="대분류" value={selectedTestCateId} setValue={setSelectedTestCateId} options={testCates?.map(cate => ({label: cate.test_cate_name, value: cate.test_cate_id})) || []}/>
                <Select label="소분류" value={selectedTestClassify} setValue={setSelectedTestClassify} options={testClassifies?.map(classify => ({label: classify.etccd_value_1, value: classify.etccd_id})) || []}/>
                <Select label="검사" value={selectedTestId} setValue={setSelectedTestId} options={tests?.map(test => ({label: `${test.test_title} v.${test.test_version}.${test.test_revision}`, value: test.test_id})) || []}/>
                    <Button className="w-fit self-end bg-blueTone text-white place-self-end" onClick={handleSearch}>조회</Button>
            </div>
            <Table
                keyColumn="question_id"
                label="문항"
                colDefs={questionsColDefs}
                deletable={true}
                data={questionsData}
                setData={setQuestionsData}
                originalData={questions || []}
                ref={questionsRef}
                onCellClicked={handleQuestionCellClicked}
            >
                  <Button onClick={addQuestion} className="bg-blueTone-100 text-blueTone">추가</Button>
                  <Button onClick={saveQuestionUpdates}>저장</Button>
            </Table>
            <Table
                keyColumn="question_item_id"
                label="선택지"
                colDefs={questionItemsColDefs}
                deletable={true}
                data={questionItemsData}
                setData={setQuestionItemsData}
                originalData={questionItems || []}
                ref={questionItemsRef}
            >
                <Button onClick={addQuestionItem} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveQuestionItemUpdates}>저장</Button>
            </Table>
            
        </div>
    </>
}