'use client'

import { admin_menu_cate } from "@/types/menu"
import Fetcher from "@/util/Fetcher"
import Link from "next/link"
import { useEffect, useState } from "react"
import useSWR, { mutate, SWRResponse } from "swr"
import Icon from "../etc/Icon"
import token from "@/types/token"
import { useRouter } from "next/navigation"
import API from "@/util/API"
import toast from "@/util/toast"

export default function Menu(){

    const router = useRouter()
    const [hide, setHide] = useState(false)
    const {data: token, mutate: mutateToken}: SWRResponse<token> = useSWR('/admin-api/auth/token', Fetcher, {refreshInterval: 5 * 60 * 1000})
    const [restTime, setRestTime] = useState(0)

    useEffect(() => {
        if(token){
            const updateRestTime = () => {
                const restTime = token.exp - Date.now() / 1000
                setRestTime(Math.max(0, restTime))
            }
            
            updateRestTime() // 초기 실행
            const interval = setInterval(updateRestTime, 1000)
            return () => clearInterval(interval)
        }
    }, [token])

    const logout = async () => {
        const result = await API.GET('/admin-api/auth/logout')
        if(result.ok){
            router.push('/login')
        }
    }

    const refreshToken = async () => {
        const result = await API.GET('/admin-api/auth/refreshToken')
        if(result.ok){
            mutateToken()
        }
    }


    const {data:menus, isLoading}:SWRResponse<admin_menu_cate[]> = useSWR('/admin-api/core/menu', Fetcher)

    return <>
        <div className={`overflow-auto transition-all duration-150 bg-slate-50 ${hide ? 'w-0' : 'w-[300px] border-r border-black-200'}`}>
        
            <div className="flex flex-col gap-4 px-3 py-6 min-h-screen">
                {
                    menus?.map(cate => {
                        return (
                            <div key={cate.menu_cate_id} className="flex flex-col gap-1">
                                <p className="text-sm text-slate-500 px-2">{cate.menu_cate_name}</p>
                                {
                                    cate.admin_menu?.map(menu => {
                                        return (
                                            <Link key={menu.menu_id} href={menu.menu_url} className="flex justify-between items-center gap-2 hover:bg-slate-200 rounded-lg px-2 py-2">
                                                <p className="text-black">{menu.menu_name}</p>
                                                <Icon name="caret-right-bold" className="text-black-600 w-4 h-4"/>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className="bg-black-200 p-5 w-full sticky bottom-0">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-black-600">{Math.floor(restTime / 60)}분 {Math.floor(restTime % 60)}초</p>
                    <div className="flex gap-4 items-center">
                        <button title="토큰 갱신" className="opacity-30 hover:opacity-100" onClick={refreshToken}><Icon name="sync-filled" className="text-black w-5 h-5"/></button>
                        <button title="로그아웃" className="opacity-30 hover:opacity-100" onClick={logout}><Icon name="exit-bold" className="text-black w-5 h-5"/></button>
                    </div>
                </div>
            </div>

        </div>
    </>
}