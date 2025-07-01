'use client'

import token from "@/types/token"
import API from "@/util/API"
import toast from "@/util/toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login(){
    const router = useRouter()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        const result = await API.POST<token>('/admin-api/auth/login', {id: id, password: password})
        if(result.ok){
            router.push('/home')            
        } else {
            toast(result.message)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            login()
        }
    }

    return <>
        <div className=" flex flex-col gap-2 w-full max-w-xs">
            <p className="text-xl font-semibold text-black text-center py-10">관리자 로그인</p>
            <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder="아이디" className="border border-black-200 px-4 py-3 rounded-md"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="비밀번호" className="border border-black-200 px-4 py-3 rounded-md"/>
            <button className="bg-black text-white px-4 py-3 rounded-md" onClick={login}>로그인</button>
        </div>
    </>
}