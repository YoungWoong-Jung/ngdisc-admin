import { format } from "date-fns";
import { useEffect, useRef } from "react";

export default function CustomDateCellEditor({
    value,
    onValueChange
}:{
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
            type="date"
            // className="w-full h-full"
            className="absolute w-full p-1 shadow-lg outline-1 outline outline-blueTone"
            // style={{ width: "100%", height: "100%" }}
            value={value ? format(value, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
                onValueChange?.(e.target.value ? new Date(e.target.value) : null)
            }}
        />
    )
}