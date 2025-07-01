'use client'

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function Input({
    value,
    setValue,
    className,
    label,
    type = 'text',
    inputClassName,
    ...props
}: {
    value: string;
    type?: 'number' | 'text' | 'tel' | 'password' | 'email';
    setValue: Dispatch<SetStateAction<string>>;
    className?: string;
    label?: string;
    inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>){


    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocus, setIsFocus] = useState(false);


    return <div className={`flex items-center gap-2 text-sm ${className}`}>
        {
            label && <>
                <p className="text-sm text-black-700 break-keep whitespace-nowrap ">{label}</p>
                <span className="w-[2px] h-1/2 bg-black-200 rounded-full"></span>
            </>
        }
        <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} type={type} className={`w-full h-full bg-white outline outline-1 outline-black-400 focus:outline-black rounded-md px-2 py-1 placeholder:text-black-400 ${inputClassName}`} {...props}/>
    </div>
}