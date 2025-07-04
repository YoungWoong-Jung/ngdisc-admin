'use client'

import Button from "@/component/button/Button"
import Icon from "@/component/etc/Icon"
import Input from "@/component/input/Input"
import LnbHeader from "@/component/lnb/LnbHeader"
import Modal from "@/component/modal/Modal"
import ModalContainer from "@/component/modal/ModalContainer"
import { cdn_file } from "@/types/cdn_file"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import toast from "@/util/toast"
import Image from "next/image"
import Rive from "@rive-app/react-canvas"
import { useEffect, useRef, useState } from "react"
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"

export default function CDN (){

    const [keyword, setKeyword] = useState('')
    const [format, setFormat] = useState('')
    const [fileType, setFileType] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const getKey = (pageIndex: number, previousData: cdn_file[]) => {
        if (previousData && !previousData.length) return null
        return `/admin-api/cdn/fileList?skip=${pageIndex}&keyword=${keyword || ''}&format=${format || ''}&fileType=${fileType || ''}`
    }

    const {data: fileData, size, setSize, mutate}: SWRInfiniteResponse<cdn_file[]> = useSWRInfinite(getKey, Fetcher)
    const [files, setFiles] = useState<File[]>([])
    const [display ,setDisplay] = useState(false)

    const [selectedImage, setSelectedImage] = useState<cdn_file | null>(null)
    const [selectedImageType, setSelectedImageType] = useState<string | null>(null)
    const [selectedImageDesc, setSelectedImageDesc] = useState<string | null>(null)

    useEffect(() => {
        setSelectedImageType(selectedImage?.file_type || null)
        setSelectedImageDesc(selectedImage?.file_desc || null)
    }, [selectedImage])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container
            
            if (scrollTop + clientHeight >= scrollHeight - 5 && fileData?.[fileData.length - 1].length === 30) {
                setSize(size + 1)
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [size, setSize, fileData])

    useEffect(() => {
        setSize(1)
        setSelectedImage(null)
    }, [keyword, format, fileType])

    const uploadCancel = () => {
        setDisplay(false)
        setFiles([])
    }

    const saveFiles = async () => {
        if(files.length === 0) return toast('파일을 선택해주세요.')

        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })
        const result = await API.FORM(`/api/cdn/upload?fileType=${fileType}`, formData)
        if(result.ok){
            toast('업로드 완료')
            setFiles([])
            setDisplay(false)
            mutate()
        } else {
            toast(result.message)

        }
    }

    const selectImage = (file: cdn_file) => {
        if(file === selectedImage) {
            setSelectedImage(null)
        } else {
            setSelectedImage(file)
        }
    }

    const copyURL = () => {
        navigator.clipboard.writeText(selectedImage?.file_url || '')
        toast('복사 완료')
    }

    const formatFileSize = (bytes: number | undefined): string => {
        if (!bytes) return '0 MB'
        const mb = bytes / (1024 * 1024)
        return `${mb.toFixed(2)} MB`
    }

    const deleteFile = async () => {
        if(!selectedImage) return toast('파일을 선택해주세요.')
            if(!confirm('정말 삭제할까요? 돌이킬 수 없어요')) { return ;}
        const result = await API.GET(`/api/cdn/delete?fileId=${selectedImage.file_id}&fileName=${selectedImage.file_name}`)
        if(result.ok){
            toast('삭제 완료')
            mutate()
            setSelectedImage(null)
        } else {
            toast(result.message)
        }
    }

    const updateFile = async () => {
        if(!selectedImage) return toast('파일을 선택해주세요.')
        const result = await API.POST('/api/cdn/update', {
            file_id: selectedImage.file_id,
            file_name: selectedImage.file_name,
            file_type: selectedImageType,
            file_desc: selectedImageDesc
        })
        if(result.ok){
            toast('수정 완료')
            mutate()
        } else {
            toast(result.message)
        }
    }

    return <>
        <div className="w-full h-full p-4 grid grid-rows-[auto_auto_1fr] grid-cols-[1fr_auto] gap-3">
            <LnbHeader title="이미지 관리" className="col-span-2">
                <button className="gap-2 px-2 py-1 flex items-center rounded-xl bg-blueTone" onClick={() => setDisplay(true)}>
                    <Icon name='add' className="w-4 h-4 text-white"/>
                    <p className="text-white  font-semibold text-sm">업로드</p>
                </button>
            </LnbHeader>
            <div className="bg-black-50 rounded-xl p-4 w-full flex justify-between items-center gap-6">
                <div className="flex gap-4">
                    <Input label="검색어" placeholder="검색어를 입력해주세요." className="w-full" value={keyword} setValue={setKeyword}/>
                    <Input label="확장자" placeholder="확장자를 입력해주세요." className="w-full" value={format} setValue={setFormat}/>
                    <Input label="유형" placeholder="파일 타입을 입력해주세요." className="w-full" value={fileType} setValue={setFileType}/>
                </div>
                <Button className="whitespace-nowrap break-keep bg-blueTone text-white">검색</Button>

            </div>
            <div ref={containerRef} className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 col-start-1 relative max-h-full overflow-y-scroll scrollbar">
                {
                    fileData?.map(items => (
                        items.map(item => (
                            <div className={`h-fit flex flex-col gap-3 p-1 ${selectedImage?.file_id === item.file_id ? 'bg-blueTone bg-opacity-10' : ''}`} key={item.file_id} onClick={() => selectImage(item)}>
                                {item.file_format === 'riv'
                                    ? <Rive src={item.file_url} className="w-full h-auto aspect-square" stateMachines={'State Machine 1'}/>
                                    : <Image src={item.file_url} alt={item.file_name} width={100} height={100} className="aspect-square object-cover w-full h-auto"/>
                                }
                                <p className={`text-sm text-black-700 ${selectedImage?.file_id === item.file_id ? 'text-blueTone' : ''}`}>{item.file_name}</p>
                            </div>
                        ))
                    ))
                }
            </div>
            <div className="w-[390px] h-full col-start-2 row-start-2 row-end-4 flex flex-col gap-4 px-6 max-h-full overflow-y-auto scrollbar">
                {
                    selectedImage && selectedImage.file_format === 'riv' ? (
                    <div className="w-full h-auto bg-black-50 aspect-square">
                        <Rive src={selectedImage?.file_url} className="w-full h-full" stateMachines={'State Machine 1'}/>
                    </div>
                    ) : selectedImage ? (
                        <Image src={selectedImage?.file_url || ''} alt={selectedImage?.file_name || ''} width={800} height={800} className="w-full h-auto"/>
                    ) : <div className="w-full h-auto bg-black-50 aspect-square"></div>
                }
                <div className="grid grid-cols-[auto_1fr] gap-4 text-sm">
                    <p className="text-black-600 whitespace-nowrap">파일이름</p>
                    <p className="break-all">{selectedImage?.file_name}</p>
                    <p className="text-black-600 whitespace-nowrap">주소</p>
                    <p onClick={copyURL} className="text-sm cursor-pointer break-all">{selectedImage?.file_url} <span className="text-blueTone text-sm ml-2">복사</span></p>
                    <p className="text-black-600 whitespace-nowrap">크기</p>
                    <p className="">{formatFileSize(selectedImage?.file_size)}</p>
                    <p className="text-black-600 whitespace-nowrap">저장위치</p>
                    <p className="break-all">{selectedImage?.file_path}</p>
                    <p className="text-black-600 whitespace-nowrap">유형</p>
                    <input type="text" value={selectedImageType || ''} onChange={(e) => setSelectedImageType(e.target.value)} className="w-full border border-black-400 rounded-md px-2 py-1"/>
                    <p className="text-black-600 whitespace-nowrap">설명</p>
                    <textarea value={selectedImageDesc || ''} onChange={(e) => setSelectedImageDesc(e.target.value)} className="w-full border border-black-400 rounded-md px-2 py-1" rows={10}/>
                </div>
                <div className="flex gap-4 justify-end">
                    <button className="text-redTone text-sm" onClick={deleteFile}>삭제</button>
                    <button className="text-blueTone text-sm" onClick={updateFile}>저장</button>
                </div>

            </div>

        </div>

        <Modal display={display} setDisplay={setDisplay} position="center">
            <ModalContainer className="rounded-3xl bg-white p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">업로드</p>
                    <Button onClick={() => inputRef.current?.click()}>업로드</Button>
                </div>
                <div className="flex flex-col bg-black-50 rounded-xl p-4 gap-4 max-h-[80vh] overflow-y-auto scrollbar">
                    {
                        !files || files.length === 0 ? (
                            <p className="text-sm text-center text-black-600">파일이 없어요</p>
                        ) : files.map(file => (
                            <div key={file.name}>
                                <p className="text-sm text-black-700">{file.name}</p>
                            </div>
                        ))   
                    }
                </div>
                <div className="grid grid-cols-[2fr_3fr] gap-3">
                        <button onClick={uploadCancel} className="text-black-600 bg-black-50 rounded-xl p-3">취소</button>
                        <button onClick={saveFiles} className="bg-blueTone text-white rounded-xl p-3">저장</button>
                </div>
            </ModalContainer>

        </Modal>
        <input 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            multiple
            onChange={(e) => {
                const selectedFiles = e.target.files;
                if (selectedFiles && selectedFiles.length > 0) {
                    const newFiles = Array.from(selectedFiles);
                    setFiles([...files, ...newFiles]);
                }
            }}
        />
    </>
}