export default interface admin {
    id: number;
    admin_id: string;
    password: string;
    status: '01' | '02' | '03';
    role: 'sys' | 'cnt' | 'tst';
    name: string;
    tel: string;
}