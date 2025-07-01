'use client'

export default function LnbHeader({
    title,
    children,
    className
}: {
    title: string;
    children?: React.ReactNode;
    className?: string;
}){

    return <>
        <div className={`flex items-center gap-6 justify-between ${className}`}>
            <p className="text-xl font-semibold">{title}</p>
            {
                children ? children : <span></span>
            }
        </div>
    </>
}