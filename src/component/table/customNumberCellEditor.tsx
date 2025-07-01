import React, { useEffect, useRef } from 'react';

export default function CustomNumberCellEditor({
    value,
    onValueChange
}: {
    value: any,
    onValueChange?: (value: any) => void;
}){

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [])
    return (
        <input
            ref={inputRef}
            type="number"
            className="absolute p-1 shadow-lg outline-1 outline outline-blueTone w-full"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value ? Number(e.target.value) : null)}
        />
    )
}