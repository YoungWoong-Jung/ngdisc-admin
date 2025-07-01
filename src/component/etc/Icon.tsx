/**
 * color 상속을 위해 색상변경을 할 때는 tailwind의 text-color className을 사용 (ex. text-black)
 */
export default function Icon({
    width = 32,
    height = 32,
    className = 'fill-current ',
    name,
    inline = false,
    style = {}
}: {
    width?: number;
    height?: number
    className?: string
    name: string;
    inline?: boolean;
    style?: {[key: string] : string}
}) {

    const url = `icons/${name}.svg#${name}`

    const handleError = (e: any) => {
        console.error(`Failed to load SVG: ${url}`, e);
    }

    return <>
        <svg
            viewBox="0 0 120 120"
            width={width}
            height={height}
            className={`${inline ? 'inline -translate-y-[10%]' : ''} ${className}`}
            style={style}
            onError={handleError}
            >
            <use href={url} />
        </svg>
    </>
}

