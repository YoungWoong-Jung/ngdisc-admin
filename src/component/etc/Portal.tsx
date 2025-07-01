'use client'

import { ReactNode, useEffect, useState } from "react"
import ReactDOM from "react-dom";

export default function Portal({
    id,
    children
}: {
    id: string
    children?: ReactNode;
}) {

    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if(document){
            const root = document.getElementById(id) as HTMLElement;
            if(root){
                setPortalRoot(root)
            }
        }
    }, [])

    // 포탈 루트가 없을 경우 children을 그냥 렌더링
    if(!portalRoot){
        return <>{children}</>
    }
    // 
    return ReactDOM.createPortal(
        <>
            {children ? children : <></>}
        </>,
        portalRoot
    );
}