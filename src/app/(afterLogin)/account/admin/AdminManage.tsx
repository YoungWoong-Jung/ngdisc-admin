'use client'

import Button from "@/component/button/Button"
import { ContextMenuItem, ContextMenuProps } from "@/component/gnb/ContextMenu"
import Input from "@/component/input/Input"
import Table from "@/component/table/Table"
import Label from "@/component/lnb/Label"
import admin from "@/types/Admin"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import toast from "@/util/toast"
import { ColDef } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { useEffect, useRef, useState } from "react"
import useSWR, { SWRResponse } from "swr"
import LnbHeader from "@/component/lnb/LnbHeader"

export default function AdminManage(){

    const {data: admins, isLoading, mutate}: SWRResponse<admin[]> = useSWR('/admin-api/account/getAllAdmin', Fetcher)
    const [colDefs, setColDefs] = useState<ColDef[]>([])
    const [rowData, setRowData] = useState<(admin & {rowId: string| number})[]>([])
    const tableRef = useRef<AgGridReact<admin & {rowId: string| number}>>(null)
    const [contextMenu, setContextMenu] = useState<ContextMenuItem[]>()

    useEffect(() => {
        setRowData(admins?.map(d => ({...d, rowId: d.id})) || [])
    }, [admins, isLoading])

    const [newId, setNewId] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newName, setNewName] = useState('')
    const [newTel, setNewTel] = useState('')
    const [newRole, setNewRole] = useState('')

    useEffect(() => {
        setColDefs([
            {
                headerName: 'id',
                field: 'id',
                editable: false
            },
            {
                headerName: '아이디',
                field: 'admin_id',
                editable: true
            },
            {
                headerName: '이름',
                field: 'name',
            },
            {
                headerName: '연락처',
                field: 'tel',
            },
            {
                headerName: '권한',
                field: 'role',
            }
        ])
    }, [admins])

    const addAdmin = async () => {

        if(!newId || !newPassword || !newName || !newTel || !newRole){
            toast('모든 필드를 입력해주세요')
            return ;
        }

        const result = await API.POST('/admin-api/account/addAdmin', {
            admin_id: newId,
            password: newPassword,
            name: newName,
            tel: newTel,
            role: newRole
        })

        if(result.ok){
            mutate()
            toast('관리자 계정이 추가되었습니다.')
            setNewId('')
            setNewPassword('')
            setNewName('')
            setNewTel('')
            setNewRole('')
        } else {
            toast('관리자 계정 추가에 실패했습니다.')
        }
    }

    return <>
        <div className="p-4 grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 w-full h-full">              
                <LnbHeader title="관리자 계정"/>
                <Table ref={tableRef} keyColumn="id" data={rowData} colDefs={colDefs} label="관리자 목록" contextMenu={contextMenu} setData={setRowData}/>
                <div className="">
                    <Label>관리자 추가</Label>
                    <div className="grid grid-cols-[1fr_auto] gap-2 p-3 rounded-xl border border-black-200">
                        <div className=" grid grid-cols-3 gap-2">
                            <Input placeholder="아이디를 입력해주세요" label="아이디" value={newId} setValue={setNewId}/>
                            <Input placeholder="비밀번호를 입력해주세요" label="비밀번호" type="password" value={newPassword} setValue={setNewPassword}/>
                            <Input placeholder="이름을 입력해주세요" label="이름" value={newName} setValue={setNewName}/>
                            <Input placeholder="연락처를 입력해주세요" label="연락처" value={newTel} setValue={setNewTel}/>
                            <Input placeholder="권한을 선택해주세요" label="권한" value={newRole} setValue={setNewRole}/>
                        </div>
                        <Button className="bg-blueTone text-white p-3 text-sm rounded-lg" onClick={addAdmin}>관리자<br />계정추가</Button>
                    </div>
                </div>
        </div>
    </>


}