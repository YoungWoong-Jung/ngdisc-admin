'use client'

export default function Button({
    className = 'bg-blueTone text-white',
    children,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>){
    return <button className={`px-2 py-1 text-sm rounded-lg hover:brightness-95 active:scale-90 transition-all duration-150 active:brightness-90 ${className}`} {...props}>{children}</button>
}