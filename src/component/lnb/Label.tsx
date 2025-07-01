export default function Label({
    className,
    children
}: {
    className?: string;
    children: React.ReactNode;
}){
    if(!children) return null;
    return <p className={`text-sm text-black-500 break-keep whitespace-nowrap ${className}`}>{children}</p>
}