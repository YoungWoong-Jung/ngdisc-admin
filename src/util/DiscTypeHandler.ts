import { lowerCase } from "lodash";

const DiscTypeHandler = {
    /**
     * ^ 숫자로 된 타입을 알파벳으로 변환
     */
    codeToType(t?: string){
        switch (t) {
            case '0': return '';
            case '1': return 'D';
            case '2': return 'I';
            case '3': return 'S';
            case '4': return 'C';
            case '5': return 'd';
            case '6': return 'i';
            case '7': return 's';
            case '8': return 'c';
            case '9': return 'o';
            default: return 'o'
        }
    },
    /**
     * 타입코드를 넣으면 알파벳으로 변환, 메인타입, 서브타입, 실제 타입을 구분하여 리턴
     */
    getType(t: string) {

        if(typeof t !== 'string' || t.length !==2){
            return undefined
        }

        const mainType = this.codeToType(t[0]) || '';
        const subType = this.codeToType(t[1]) || '';
        const type = mainType + subType
        if(!mainType) {return undefined}
        return {
            type: type,
            mainType: mainType,
            subType: subType
        }
    },
    // 대표 타입의 색상을 css 변수로 리턴
    getColor(t?: string, suffix?: string) {
        const mainType = lowerCase(this.codeToType( t?.[0]) ) ;
        return {
            type: `var(--type-${t || '99'})`,
            main: `var(--${mainType}${suffix ? `-${suffix}` : ''})`,
        }
    }
}

export default DiscTypeHandler