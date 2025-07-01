'use client'

import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import Portal from "../etc/Portal";
import Icon from "../etc/Icon";


export type ContextMenuProps = {
    menus: ContextMenuItem[];
    position: {x: number, y: number};
    isOpen?: boolean;
}

export type ContextMenuItem = {
    label: string;
    hint?: string
    onClick?: (event?: any) => void;
    className?: string;
    hintClassName?: string;
    isOpen?: boolean;
    hide?: boolean;
    disabled?: boolean;
    subMenus?: ContextMenuItem[];
} | '-'

export function useContextMenu(initialState: (ContextMenuItem | '-')[] | null): [ContextMenuProps, Dispatch<SetStateAction<ContextMenuProps>>] {
    const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
        menus: initialState ?? [],
        position: {x: 0, y: 0},
        isOpen: false
    });

    return [
        contextMenu,
        setContextMenu
    ]
}

export default function ContextMenu({
    value,
    setValue,
}: {
    value: ContextMenuProps;
    setValue: Dispatch<SetStateAction<ContextMenuProps>>;
}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [hoverItem, setHoverItem] = useState<HTMLElement | null>(null);
    
    const close = () => {
        setValue({
            ...value,
            isOpen: false
        })
        setSubMenuOpen(false)
        setHoverItem(null)
    }

    useEffect(() => {
            // 마우스를 클릭한 곳이 ref내부가 아닐 때   
            const handleClick = (e: globalThis.MouseEvent) => {
                if (!menuRef.current?.contains(e.target as Node)) {
                    close();
                }
            }
    
            const handleScroll = () => {
                close();
            }
    
            if (value.isOpen) {
                window.addEventListener('click', handleClick);
                window.addEventListener('scroll', handleScroll);
            }
    
            return () => {
                window.removeEventListener('click', handleClick);
                window.removeEventListener('scroll', handleScroll);
            }
    }, [value.isOpen])

    useEffect(() => {
        if (!value.isOpen) return;
        
        const MARGIN = 24;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 초기 x 위치 계산
        let x = value.position.x;
        if (x + 160 > windowWidth - MARGIN) { // 160은 min-w-[160px]의 값
            x = windowWidth - 160 - MARGIN;
        }
        if (x < MARGIN) {
            x = MARGIN;
        }
        
        // 초기 y 위치 계산
        let y = value.position.y;
        if (y < MARGIN) {
            y = MARGIN;
        }
        
        setInitialPosition({ x, y });
    }, [value.isOpen, value.position]);

    useEffect(() => {
        if (!menuRef.current || !value.isOpen) return;

        const rect = menuRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const MARGIN = 24;

        let x = 0;
        let y = 0;

        // 오른쪽 경계 체크
        if (initialPosition.x + rect.width > windowWidth - MARGIN) {
            x = windowWidth - initialPosition.x - rect.width - MARGIN;
        }

        // 왼쪽 경계 체크
        if (initialPosition.x + x < MARGIN) {
            x = MARGIN - initialPosition.x;
        }

        // 아래쪽 경계 체크
        if (initialPosition.y + rect.height > windowHeight - MARGIN) {
            y = windowHeight - initialPosition.y - rect.height - MARGIN;
        }

        // 위쪽 경계 체크
        if (initialPosition.y + y < MARGIN) {
            y = MARGIN - initialPosition.y;
        }

        setTransform({ x, y });
    }, [value.position, value.isOpen, initialPosition]);

    // value나 setValue가 없으면 렌더링하지 않음
    if (!value || !setValue) return null;
    
    const handleClick = (menu: ContextMenuItem) => {
        if(typeof menu === 'string') return;
        if(menu.onClick) menu.onClick();
        close();
    }

    const handleMouseEnter = (e: MouseEvent, menu: ContextMenuItem) => {
        setHoverItem(e.target as HTMLElement)
        if(menu !== '-' && menu.subMenus && menu.subMenus.length > 0) {
            setSubMenuOpen(true);
            setHoverItem(e.target as HTMLElement)
        } else {
            setSubMenuOpen(false)
            setHoverItem(null)
        }
    }

    if(!value.isOpen) return null;
    return <>
    <Portal id="body">
        <div
            ref={menuRef}
            className="fixed z-[9999] p-4"
            style={{
                left: initialPosition.x,
                top: initialPosition.y,
                transform: `translate(${transform.x}px, ${transform.y}px)`,
            }}
            onMouseLeave={() => {
                setSubMenuOpen(false)
                setHoverItem(null)
            }}

        >
            <div className="min-w-[160px] py-2 px-2 bg-black-900 bg-opacity-80 backdrop-blur-sm rounded-xl isolate border border-white border-opacity-20 shadow-xl">
                {
                    value.menus.map((menu, index) => {      
                        if(menu === '-') return <div key={index} className="h-[1px] w-full bg-white opacity-30 my-2"/>
                        if(menu.hide) return null;
                        return (
                            <div key={menu.label} className="relative">
                                <button
                                    key={menu.label}
                                    className={`px-3 py-1 hover:bg-white-500 cursor-pointer flex items-center whitespace-nowrap justify-between gap-8 active:bg-blueTone hover:bg-blueTone w-full rounded-md text-white text-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed ${menu.className}`}
                                    onClick={(e) => {handleClick(menu); handleMouseEnter(e, menu)}}
                                    onMouseEnter={(e) => handleMouseEnter(e, menu)}
                                    disabled={menu.disabled}
                                >
                                    {menu.label}
                                    {
                                        menu.hint 
                                        ? <p className={`text-xs text-white opacity-50 text-right ${menu.hintClassName}`}>{menu.hint}</p>
                                        : ( menu.subMenus && menu.subMenus.length > 0 ) && <Icon name="caret-triangle-right-filled" className="w-3 h-3 text-white"/>
                                    }
                                </button>
                                {
                                    subMenuOpen && menu.subMenus && menu.subMenus.length > 0 && (
                                        <ContextMenu
                                            value={{
                                                menus: menu.subMenus,
                                                position: { 
                                                    x: initialPosition.x + (menuRef.current?.offsetWidth ? menuRef.current?.offsetWidth - 28: -28),
                                                    y: hoverItem?.getBoundingClientRect().top ? hoverItem.getBoundingClientRect().top - 24 : -24
                                                },
                                                isOpen: true
                                            }}
                                            setValue={() => {}}
                                        />
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </Portal>
    </>
}
