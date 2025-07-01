import { defaultArgs } from "puppeteer";
import Random from "./random";
import { MouseEvent, ReactNode } from "react";
import { mutate } from "swr";

export default function toast(content: string | ReactNode, props: {
    duration?: number;
    onClick?: (e?: MouseEvent) => void;
    className?: string;
} = {
    duration: 4000,
    onClick: () => {},
    className: ''
}){
    const newToast = {
        id: Random.code(3),
        content: content,
        ...props,
    }

    mutate('/store/toast', newToast, false)
}