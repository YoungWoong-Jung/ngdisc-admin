'use client'

import Button from "@/component/button/Button"
import LnbHeader from "@/component/lnb/LnbHeader"
import Table, { TableCol, useTableData } from "@/component/table/Table"
import disc_type from "@/types/disc_type"
import { etccd } from "@/types/Etccd"
import { profile_card_content, profile_card_template } from "@/types/profile"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import Random from "@/util/random"
import toast from "@/util/toast"
import { CellClickedEvent } from "ag-grid-community"
import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"

export default function Page () {

    const {data: discTypes}: SWRResponse<disc_type[]> = useSWR('/admin-api/core/discTypes', Fetcher)
    const {data: profileCardDesigns}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_cate=profileCard&etccd_subcate=design', Fetcher)

    const {data: profileCardTemplates, mutate: mutateProfileCardTemplates}: SWRResponse<profile_card_template[]> = useSWR('/admin-api/profileCard/profileCardTemplates', Fetcher)
    const [profileCardTemplatesData, setProfileCardTemplatesData] = useTableData(profileCardTemplates || [], 'profile_card_template_id')
    const [selectedProfileCardTemplate, setSelectedProfileCardTemplate] = useState<profile_card_template | null>(null)

    const {data: profileCardContents, mutate: mutateProfileCardContents}: SWRResponse<profile_card_content[]> = useSWR(`/admin-api/profileCard/profileCardContents?profile_card_template_id=${selectedProfileCardTemplate?.profile_card_template_id ?? ''}`, Fetcher)
    const [profileCardContentsData, setProfileCardContentsData] = useTableData(profileCardContents || [], 'profile_card_content_id')
    const [selectedProfileCardContent, setSelectedProfileCardContent] = useState<profile_card_content | null>(null)

    const handleTemplateSelect = (params: CellClickedEvent) => {
        setSelectedProfileCardTemplate(params.data)
    }

    const handleContentSelect = (params: CellClickedEvent) => {
        setSelectedProfileCardContent(params.data)
    }

    const colDefs: TableCol[] = [
        {headerName: 'id', field: 'profile_card_template_id', type: 'id', editable: false},
        {headerName: '탬플릿 이름', field: 'profile_card_template_name',type: 'text', editable: true, required: true},
        {headerName: '디폴트 디자인', field: 'profile_card_default_design', required: true, type: 'select', editable: true, cellEditorParams: {options: profileCardDesigns?.map(design => ({value: design.etccd_id, label: design.etccd_value_1}) )}, cellRenderer: (params: any) => {
            const design = profileCardDesigns?.find(design => design.etccd_id === params.value)
            return design?.etccd_value_1
        }},
        {headerName: '사용여부', field: 'profile_card_template_useyn', type: 'boolean', editable: true},
    ]

    const contentColDefs: TableCol[] = [
        {headerName: 'id', field: 'profile_card_content_id', type: 'id', editable: false},
        {headerName: '유형', field: 'disc_type', type: 'select', editable: true, cellEditorParams: {options: discTypes?.map(discType => ({value: discType.disc_type, label: discType.disc_type_letter}) )}, cellRenderer: (params: any) => {
            const discType = discTypes?.find(discType => discType.disc_type === params.value)
            return discType?.disc_type_letter
        }},
        {headerName: '이미지', field: 'image', type: 'text', editable: true},
        {headerName: '애니메이션', field: 'animation', type: 'text', editable: true},
        {headerName: '내용 1', field: 'content_1', type: 'text', editable: true},
        {headerName: '내용 2', field: 'content_2', type: 'text', editable: true},
        {headerName: '내용 3', field: 'content_3', type: 'text', editable: true},
        {headerName: '내용 4', field: 'content_4', type: 'text', editable: true},
        {headerName: '내용 5', field: 'content_5', type: 'text', editable: true},
        {headerName: '내용 6', field: 'content_6', type: 'text', editable: true},
        {headerName: '디자인', field: 'profile_card_design', type: 'text', editable: true},
    ]

    useEffect(() => {
        console.log(selectedProfileCardTemplate)
    }, [selectedProfileCardTemplate])


    const addProfileCardTemplate = () => {
        const newId = - Random.number(0,99999)
        const newProfileCardTemplate = {
            profile_card_template_id: newId,
            profile_card_template_name: '',
            profile_card_template_useyn: true,
            _id: newId,
            _status: 'create'
        } as unknown as profile_card_template
        setProfileCardTemplatesData(prev => [...prev, newProfileCardTemplate] as any)
    }

    const saveProfileCardTemplateUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        profileCardTemplatesData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)   
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result = await API.POST('/admin-api/profileCard/changeProfileCardTemplates', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateProfileCardTemplates()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    const addProfileCardContent = () => {
        if(!selectedProfileCardTemplate) {
            toast('프로필카드 탬플릿을 선택해주세요.')
            return ;
        }
        const newId = - Random.number(0,99999)
        const newProfileCardContent = {
            profile_card_content_id: newId,
            profile_card_template_id: selectedProfileCardTemplate.profile_card_template_id,
            profile_card_design: selectedProfileCardTemplate?.profile_card_default_design ?? null,
            disc_type: '',
            image: '',
            animation: '',
            _id: newId,
            _status: 'create'
        } as unknown as profile_card_content
        setProfileCardContentsData(prev => [...prev, newProfileCardContent] as any)
    }

    const saveProfileCardContentUpdates = async () => {
        const createRows: any[] = []
        const updateRows: any[] = []
        const deleteRows: any[] = []
        profileCardContentsData.forEach(d => {
            if(d._status === 'create') createRows.push(d)
            if(d._status === 'update') updateRows.push(d)   
            if(d._status === 'delete') deleteRows.push(d)
        })
        const result = await API.POST('/admin-api/profileCard/changeProfileCardContents', {
            create: createRows,
            update: updateRows,
            delete: deleteRows
        })
        if(result.ok){
            toast('저장되었습니다.')
            mutateProfileCardContents()
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
        }
    }

    const saveTempProfileCard = async () => {
        if(!selectedProfileCardContent) {
            toast('프로필카드 내용을 선택해주세요.')
            return false
        }
        const result = await API.POST('/admin-api/profileCard/saveTempProfileCardForPreview', selectedProfileCardContent)
        if(result.ok){
            toast('저장되었습니다.')
            return result.data
        } else {
            toast('저장에 실패했습니다. 잠시 후 다시 시도해주세요')
            return false
        }
    }

    const profileCardPreview = async () => {
        const tempProfileCardId = await saveTempProfileCard()
        if(tempProfileCardId){
            const url = `${process.env.NEXT_PUBLIC_URL}/profileCard/adminTemp?tempProfileCardId=${tempProfileCardId}`
            window.open(url, '_blank', 'width=480,height=768')
        }
    }

    return <>
        <div className="w-full h-full p-4 grid grid-rows-[auto_1fr] grid-cols-[1fr_2fr] gap-4">
            <LnbHeader title="프로필카드 관리" className="col-span-2"/>
            <Table
                keyColumn="profile_card_template_id"
                data={profileCardTemplatesData}
                setData={setProfileCardTemplatesData}
                originalData={profileCardTemplates || []}
                colDefs={colDefs}
                label="프로필카드 탬플릿"
                onCellClicked={handleTemplateSelect}
            >
                <Button className="bg-blueTone-100 text-blueTone" onClick={addProfileCardTemplate}>추가</Button>
                <Button onClick={saveProfileCardTemplateUpdates}>저장</Button>
            </Table>
            <Table
                keyColumn="profile_card_content_id"
                data={profileCardContentsData}
                setData={setProfileCardContentsData}
                originalData={profileCardContents || []}
                colDefs={contentColDefs}
                label={`프로필카드 내용 ${selectedProfileCardTemplate ? `(${selectedProfileCardTemplate.profile_card_template_name})` : ''}`}
                onCellClicked={handleContentSelect}
            >
                <Button className="bg-blueTone-100 text-blueTone" onClick={profileCardPreview}>미리보기</Button>
                <Button className="bg-blueTone-100 text-blueTone" onClick={saveTempProfileCard}>임시저장</Button>
                <Button className="bg-blueTone-100 text-blueTone" onClick={addProfileCardContent}>추가</Button>
                <Button onClick={saveProfileCardContentUpdates}>저장</Button>
            </Table>
        </div>
    </>
}