import { Dispatch, SetStateAction } from "react"
import Label from "../lnb/Label";

export default function Select({
    label,
    placeholder,
    value,
    setValue,
    options,
    className
}: {
    label?: string;
    placeholder?: string;
    value: any,
    className?: string;
    setValue: Dispatch<SetStateAction<any>>,
    options: {
        label?: string,
        value: any
    }[]
}){

    return <>
    <div className={`flex items-center gap-3 ${className}`}>
        {
            label && (
                <Label className="text-black-700">{label}</Label>
            )
        }
        <select className={`w-full rounded-md outline outline-1 outline-black-400 focus:outline-black p-1 text-sm ${label ? 'w-3/4' : 'w-full'}`} value={value} onChange={e => setValue(e.target.value)}>
            <option value="">{placeholder || '선택'}</option>
            {
                options.map(option => (
                    <option key={option.value} value={option.value}>{option.label || option.value}</option>
                ))
            }
        </select>
    </div>
    </>
}