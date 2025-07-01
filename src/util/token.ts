import { cookies } from "next/headers";
import * as jwt from 'jsonwebtoken'
import token from "@/types/token";

export default class Token {
    constructor(){}

    static get(){
        const token = cookies().get('adminAccessToken')?.value
        if(token){
            const decoded = jwt.decode(token);
            return decoded as token
        }
        return undefined
    }
}