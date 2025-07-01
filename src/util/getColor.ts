export default function getColor( value: string, prefix?: string, suffix?: string ){
    const colorPrefix = prefix || ''
    const colorSuffix = suffix || ''
    let color
    switch (value) {
        case 'TST-CLS-P1': 
        case 'TST-CLS-P2': 
        case 'TST-CLS-P3': color = 'pro'; break;
        case 'TST-CLS-C1': 
        case 'TST-CLS-C2': 
        case 'TST-CLS-C3': color = 'casual'; break;
    }

    return String(colorPrefix+color+colorSuffix)
}