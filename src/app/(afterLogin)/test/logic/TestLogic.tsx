'use client'

import Button from "@/component/button/Button"
import Input from "@/component/input/Input"
import Select from "@/component/input/select"
import LnbHeader from "@/component/lnb/LnbHeader"
import disc_type from "@/types/disc_type"
import DiscTypePayload from "@/types/DiscTypePayload"
import { etccd } from "@/types/Etccd"
import API from "@/util/API"
import Fetcher from "@/util/Fetcher"
import toast from "@/util/toast"
import { useEffect, useState } from "react"
import useSWR, { SWRResponse } from "swr"

export default function TestLogic () {

    const {data: logics}: SWRResponse<etccd[]> = useSWR('/admin-api/core/code?etccd_cate=test&etccd_subcate=logic', Fetcher)
    const [selectedLogic, setSelectedLogic] = useState<string>('')

    const {data: discTypes}: SWRResponse<disc_type[]> = useSWR('/admin-api/core/discTypes', Fetcher)

    const [scoreD, setScoreD] = useState<string>('0')
    const [scoreI, setScoreI] = useState<string>('0')
    const [scoreS, setScoreS] = useState<string>('0')
    const [scoreC, setScoreC] = useState<string>('0')

    const [logicResult, setLogicResult] = useState<DiscTypePayload>()

    const sendRequest = async () => {
        if(!selectedLogic){
            toast('로직을 선택해주세요')
            return
        }
        const result = await API.GET<DiscTypePayload>(`/api/test/logicTest?logic=${selectedLogic}&d=${scoreD || 0}&i=${scoreI || 0}&s=${scoreS || 0}&c=${scoreC || 0}`)
        if(result.ok){
            console.log(result.data)
            setLogicResult(result.data)
        } else {
            toast(result.message)
        }
    }


    return <>
        <div className="w-full h-full p-4 grid grid-cols-1 grid-rows-[auto_1fr]">
            <LnbHeader title="로직 테스트"/>
            <div className="flex flex-col items-center justify-center w-full gap-16">
                <div className="grid grid-cols-8 gap-x-2 gap-y-6">
                    <p className="text-black-600">결과 유형 코드</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.rep_type || '-'}</p>
                    <p className="text-black-600">결과 유형</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.rep_type ? discTypes?.find(discType => discType.disc_type === logicResult?.rep_type)?.disc_type_letter : '-'}</p>
                    <p className="text-black-600">세부 유형 코드</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.disc_type}</p>
                    <p className="text-black-600">세부 유형</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.disc_type ? discTypes?.find(discType => discType.disc_type === logicResult?.disc_type)?.disc_type_letter : '-'}</p>
                    <p className="text-black-600">D 원점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.score_d}</p>
                    <p className="text-black-600">I 원점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.score_i}</p>
                    <p className="text-black-600">S 원점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.score_s}</p>
                    <p className="text-black-600">C 원점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.score_c}</p>
                    <p className="text-black-600">D 변환점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.convert_d}</p>
                    <p className="text-black-600">I 변환점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.convert_i}</p>
                    <p className="text-black-600">S 변환점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.convert_s}</p>
                    <p className="text-black-600">C 변환점수</p>
                    <p className="font-semibold text-right mr-8">{logicResult?.convert_c}</p>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <Select label="로직" value={selectedLogic} setValue={setSelectedLogic} options={logics?.map(logic => ({
                        label: logic.etccd_value_1,
                        value: logic.etccd_id
                    })) || []}/>
                    <Input label="D 원점수" value={scoreD} setValue={setScoreD} type="number"/>
                    <Input label="I 원점수" value={scoreI} setValue={setScoreI} type="number"/>
                    <Input label="S 원점수" value={scoreS} setValue={setScoreS} type="number"/>
                    <Input label="C 원점수" value={scoreC} setValue={setScoreC} type="number"/>
                    <Button onClick={sendRequest}>점수계산</Button>
                </div>
            </div>
        </div>
    </>
}