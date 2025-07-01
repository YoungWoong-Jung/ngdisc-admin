export default interface user {
    public_id: string;
    id: number;
    email: string;
    name: string;
    password?: string;
    status: '01' | '02' | '03'
    tel: string;
    nickname?: string;
    blood_type?: string;
    mbti?: string;
    birth?: string;
    gender?: string;
    point?: number;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    policy_user?: Policy_user[];
}