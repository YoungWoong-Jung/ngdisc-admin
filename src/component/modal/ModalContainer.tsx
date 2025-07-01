'use client'

import { PanInfo, useDragControls, motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction } from "react"

export default function ModalContainer({
    children,
    setDisplay,
    className = '',
    offset = 160,
    handlePosition = 'top'
}: {
    children?: ReactNode;
    setDisplay?: Dispatch<SetStateAction<boolean>>;
    className?: string;
    handlePosition?: 'top' | 'bottom'
    offset?: number
}){
    const dragControls = useDragControls();

    const handleDragEnd = (e: any, info: PanInfo) => {
        const threshold = offset / 2;
        if(handlePosition === 'top') {
            if(info.offset.y > threshold) {
                setDisplay && setDisplay(false);
            }
        } else {
            if(info.offset.y < -threshold) {
                setDisplay && setDisplay(false);
            }
        }
    }

    const dragOffset = (setDisplay &&  handlePosition === 'top') ? {top: 0.01, bottom: 0.5}
                        : (setDisplay && handlePosition === 'bottom') ? {top: 0.5, bottom: 0.01}
                        : {top: 0.01, bottom: 0.01}

    return (
        <motion.div
            drag='y'
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{top: 0, bottom: 0}}
            dragElastic={dragOffset}
            onDragEnd={handleDragEnd}
            className=""
        >
            <div className="w-full">
                <div className={`relative mx-auto max-w-screen-sm ${className}`}>
                    {/* handle */}
                    {
                        setDisplay &&
                        <div
                            onPointerDown={(e) => {
                                dragControls.start(e)
                            }}
                            className={`w-24 h-7 absolute left-1/2 flex items-center -translate-x-1/2 select-none cursor-pointer ${handlePosition === 'top' ? '-top-7 '  : '-bottom-7'}`}>
                                <div className="block w-24 h-[0.33rem] bg-black-300 rounded-2xl "></div>
                            </div>

                    }
                    {/* content */}
                    {children && children}
                </div>
            </div>

        </motion.div>
    )
}