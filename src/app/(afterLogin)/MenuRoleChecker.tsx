'use client'
import API from '@/util/API';
import toast from '@/util/toast';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function MenuRoleChecker(){

    const path = usePathname()
    const router = useRouter()

    const roleCheck = async () => {
        const result = await API.POST('/admin-api/core/menuRoleCheck', {url: path})
        if(result.ok){
            if(result.data){
            } else {
                toast('접근 권한이 없습니다.')
                router.push('/')
            }
        } else {
            toast('접근 권한이 없습니다.')
            router.push('/')
        }
    }

    useEffect(() => {
        roleCheck()
    }, [path])

    return <></>
}