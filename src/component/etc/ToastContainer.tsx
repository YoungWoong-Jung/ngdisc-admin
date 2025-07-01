'use client'

import {AnimatePresence, motion} from 'framer-motion'
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr'

export interface Toast {
    id: string;
    content: string | ReactNode;
    duration?: number;
    onClick?: (e?: MouseEvent) => void;
    className?: string;
}

export default function ToastContainer () {

    const {data, mutate} = useSWR<Toast | null>('/store/toast', {fallbackData: null});

    const [toastList, setToastList] = useState<Toast[]>([]);
    const [isRender, setIsRender] = useState(false);

    // data가 변경될 때마다 taostList에 업데이트
    useEffect(() => {
        if(data){
            data && setToastList(prev => [...prev, data]);
            setTimeout(() => {
                deleteToast(data.id)
            }, data.duration)
        }
    }, [data])

    // 삭제 애니메이션을 위해 isRender 사용용
    useEffect(() => {
        if(toastList.length > 0) {
            setIsRender(true)
        }else if(!toastList || toastList.length < 1){
            setTimeout(() => {
                setIsRender(false)
            }, 500)
        }
    }, [toastList])

    const deleteToast = (id: string) => {
        setToastList(prev => prev.filter(item => item.id !== id));
    }

    const handleClick = (id: string) => {
        deleteToast(id)
    }

    return (
        <div className="fixed top-0 right-0 max-w-md w-full px-4 py-3 h-auto gap-2 flex flex-col-reverse justify-end z-[999999]">
            <AnimatePresence mode='popLayout'>
                {
                    toastList.map(toast => 
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{opacity: 0, y: -100}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -100}}
                            transition={{duration: 0.3}}
                            onClick={(e) => handleClick(toast.id)}
                        >
                            {
                                typeof toast.content === 'string'
                                ? <ToastContent id={toast.id} content={toast.content} onClick={toast.onClick} className={toast.className} />
                                : <div>{toast.content}</div>
                            }
                        </motion.div>
                    )
                }

            </AnimatePresence>
        </div>
    )
}

function ToastContent ({
    id,
    content,
    onClick,
    className = '',
}: {
    id: string;
    content: string;
    onClick?: (param: any) => void;
    className?: string
}) {

    const handleClick = (e: MouseEvent) => {
        onClick && onClick(e)
    }

    return (
        <div className={`rounded-2xl px-4 py-4 bg-black bg-opacity-70 cursor-pointer backdrop-blur-sm shadow-lg transition-all ${className}`} onClick={handleClick}>
            <p className='text-white text-sm cursor-pointer'>{content}</p>
        </div>
    )
}