'use client'

import Button from "@/component/button/Button"
import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import { etccd } from "@/types/Etccd"
import { test, test_cate } from "@/types/test"
import { ticket, ticket_dtl } from "@/types/ticket"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random"
import toast from "@/util/toast"
import { useState } from "react"
import useSWR, { SWRResponse } from "swr"

export default function Page () {

    const {data: testCates, mutate: mutateTestCates}: SWRResponse<test_cate[]> = useSWR('/admin-api/test/testCates', Fetcher)
    const {data:testClassifies, mutate: mutateTestClassifies}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_type=test&etccd_subcate=classify', Fetcher)
    const {data:tests, mutate: mutateTests}: SWRResponse<test[]> = useSWR('/admin-api/test/tests', Fetcher)
    

    const {data: tickets, mutate: mutateTickets}: SWRResponse<ticket[]> = useSWR('/admin-api/ticket/tickets', Fetcher)
    const [ticketsData, setTicketsData] = useTableData<ticket>(tickets || [], 'ticket_id')
    const [selectedTicket, setSelectedTicket] = useState<ticket | null>(null)

    const {data: ticketDtls, mutate: mutateTicketDtls}: SWRResponse<ticket_dtl[]> = useSWR(`/admin-api/ticket/ticketDtls?ticket_id=${selectedTicket?.ticket_id ?? ''}`, Fetcher)
    const [ticketDtlsData, setTicketDtlsData] = useTableData<ticket_dtl>(ticketDtls || [], 'ticket_dtl_id')

    const ticketsColDef: TableCol[] = [
        {headerName: 'id', field: 'ticket_id', type: 'id', editable: false},
        {headerName: '이용권 이름', flex: 1, field: 'ticket_name', type: 'text', editable: true, required: true},
        {headerName: '이용권 가격', field: 'ticket_price', type: 'number', editable: true, required: true},
        {headerName: '이용권 사용기간 (일)', field: 'ticket_due', type: 'number', editable: true, required: true},
        {headerName: '이용권 섬네일', field: 'ticket_thumbnail', type: 'image', editable: true, required: true},
        {headerName: '이용권 사용여부', field: 'ticket_useyn', type: 'boolean', editable: true, required: true},
    ]

    const ticketDtlsColDef: TableCol[] = [
        {headerName: 'id', field: 'ticket_dtl_id', type: 'id', editable: false},
        {headerName: '사용가능한 검사 대분류', flex: 1, field: 'test_cate_id', type: 'select', editable: true, cellEditorParams: {options: testCates?.map(cate => ({value: cate.test_cate_id, label: cate.test_cate_name}) )}, cellRenderer: (params: any) => {
            const cate = testCates?.find(cate => cate.test_cate_id === params.value)
            return cate?.test_cate_name
        }},
        {headerName: '사용가능한 검사', flex: 1, field: 'test_classify', type: 'select', editable: true, cellEditorParams: {options: testClassifies?.map(cl => ({value: cl.etccd_id, label: cl.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const cl = testClassifies?.find(cl => cl.etccd_id === params.value)
            return cl?.etccd_value_1
        }},
        {headerName: '사용가능한 특정 검사', flex: 1, field: 'test_id', type: 'select', editable: true, cellEditorParams: {options: tests?.map(test => ({value: test.test_id, label: `${test.test_title} (${test.test_version}.${test.test_revision})`}) )}, cellRenderer: (params: any) => {
            const test = tests?.find(test => test.test_id === params.value)
            return test ? test?.test_title + ' (' + test?.test_version + '.' + test?.test_revision + ')' : ''
        }},
        {headerName: '사용여부', field: 'ticket_dtl_useyn', type: 'boolean', editable: true, required: true},
    ]

    const handleTicketCellClicked = (params: any) => {
        setSelectedTicket(params.data)
        mutateTicketDtls()
    }

    const addTicket = () => {
        const newId = - Random.number(0,99999)
        const newTicket = {
            ticket_id: newId,
            _id: newId,
            _status: 'create'
        } as unknown as ticket

        setTicketsData(prev => [...prev, newTicket] as any)
    }

    const addTicketDtl = () => {
        if(!selectedTicket || !selectedTicket?.ticket_id){
            toast('이용권을 선택해주세요')
            return
        }
        const newId = - Random.number(0,99999)
        const newTicketDtl = {
            ticket_dtl_id: newId,
            ticket_id: selectedTicket?.ticket_id,
            ticket_dtl_useyn: true,
            _id: newId,
            _status: 'create'
        } as unknown as ticket_dtl
        setTicketDtlsData(prev => [...prev, newTicketDtl] as any)
    }
    
    const saveTicketUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        ticketsData.forEach(d => {
            if(d._status === 'create'){
                createRows.push(d)
            } else if(d._status === 'update'){
                updateRows.push(d)
            } else if(d._status === 'delete'){
                deleteRows.push(d)
            }
        })

        const result = await API.POST('/admin-api/ticket/changeTickets', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateTickets()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    const saveTicketDtlUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        ticketDtlsData.forEach(d => {
            if(d._status === 'create'){
                createRows.push(d)
            } else if(d._status === 'update'){
                updateRows.push(d)
            } else if(d._status === 'delete'){
                deleteRows.push(d)
            }
        })

        const result = await API.POST('/admin-api/ticket/changeTicketDtls', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        
        if(result.ok){
            toast('저장되었습니다.')
            mutateTicketDtls()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    return <>
        <div className="w-full h-full p-4 grid grid-rows-[auto_1fr_1fr] grid-cols-1 gap-3">
            <LnbHeader title="이용권 관리"/>

            <Table
                colDefs={ticketsColDef}
                data={ticketsData}
                setData={setTicketsData}
                keyColumn="ticket_id"
                label="이용권 목록"
                deletable={true}
                editable={true}
                onCellClicked={handleTicketCellClicked}
                originalData={tickets}
            >
                <Button onClick={addTicket} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveTicketUpdates}>저장</Button>
            </Table>
            <Table
                colDefs={ticketDtlsColDef}
                data={ticketDtlsData}
                setData={setTicketDtlsData}
                keyColumn="ticket_dtl_id"
                label={`이용권 세부정보 목록 ${selectedTicket ? `(${selectedTicket.ticket_name})` : ''}`}
                deletable={true}
                editable={true}
                originalData={ticketDtls}
            >
                <Button onClick={addTicketDtl} className="bg-blueTone-100 text-blueTone">추가</Button>
                <Button onClick={saveTicketDtlUpdates}>저장</Button>
            </Table>
        </div>
    </>
}