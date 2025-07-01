export default interface token {
    id: number;
    status: string |'01' | '02' | '03';
    iat: number;
    exp: number;
    rawToken?: string;
}