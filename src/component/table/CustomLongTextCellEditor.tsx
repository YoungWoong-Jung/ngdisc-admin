import React, { useEffect, useRef } from 'react';

export default function CustomLongTextCellEditor({
    value,
    onValueChange
}: {
    value: any,
    onValueChange?: (value: any) => void;
}){
    const inputRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [])
    return (
        <textarea
            ref={inputRef}
            className="absolote p-1 shadow-lg outline-1 outline outline-blueTone w-full"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            rows={10}
            cols={75}
        />
    )
}