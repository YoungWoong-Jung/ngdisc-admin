export default class Random {
    private static generatedCodes: Set<string> = new Set();

    constructor() {}
    
    static number(min: number, max: number) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random;
    }

    static code (length: number = 4, options?: {
        lowerCase?: boolean;
        upperCase?: boolean;
        number?: boolean
    }) {            
        const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
        const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const number = '0123456789'
        let pool: string = "";
        const defaultOption = {
            lowerCase : true,
            upperCase : true,
            number : true
        }
        const generateOption = {...defaultOption, ...options}
        generateOption.lowerCase ? pool += lowerCase : false;
        generateOption.upperCase ? pool += upperCase : false;
        generateOption.number ? pool += number : false;
    
        let uid: string = ""
    
        do {
            uid = ""
            for (let i = 0; i < length; i++) {
                const random = Math.floor(Math.random() * pool.length)
                uid += pool[random]
            }
        } while (this.generatedCodes.has(uid))
        this.generatedCodes.add(uid)
        
        return uid
    
    }
}
