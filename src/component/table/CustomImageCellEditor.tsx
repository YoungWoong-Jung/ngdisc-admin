import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function CustomImageCellEditor({
    value,
    onValueChange
}: {
    value: any,
    onValueChange?: (value: any) => void;
}){
    const inputRef = useRef<HTMLInputElement>(null)
    const [imageUrl, setImageUrl] = useState(value);
    const [translateUp, setTranslateUp] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            // 하단 여백이 100px 미만이면 translateY 적용
            if (window.innerHeight - rect.bottom < 360) {
                setTranslateUp(true);
            } else {
                setTranslateUp(false);
            }
        }
        if(inputRef.current){
            inputRef.current.focus()
        }
    }, []);

    return (
        <div
            ref={ref}
            className={`fixed min-w-[240px] max-w-[240px] bg-white p-3 outline outline-1 outline-blueTone flex flex-col gap-2 items-center `}
            style={{
                transform: translateUp ? "translateY(-100%)" : "none"
            }}
        >
            {
                value ? (
                    <Image src={value} alt="image" width={240} height={240} className="w-full aspect-auto "/>
                ) : (
                    <div className="w-full aspect-square bg-black-200"></div>
                )
            }
            <div className="flex items-center gap-2 w-full">
                <input type="text" ref={inputRef} className="w-full outline outline-1 outline-black-400 p-1" placeholder="이미지 주소를 입력해주세요." value={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                <button className="bg-blueTone text-white px-2 py-1 h-full break-keep" onClick={() => onValueChange?.(imageUrl)}>확인</button>
            </div>
        </div>
    )
}