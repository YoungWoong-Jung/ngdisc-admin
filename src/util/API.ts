
import fetch from "cross-fetch";
import { redirect } from "next/navigation";
import toast from "./toast";

// 각 URL별 마지막 요청 시간을 저장하는 객체
const lastRequestTimestamps: { [url: string]: number } = {};


const API = {
    async GET<T> (url:string, options?: any): Promise<{ok: boolean, status: number, message?: string, data?: T}>{
        return this.fetchWithRetry("GET", url, null, options);
    },
    async POST<T> (url:string, data: any, options?: any): Promise<{ok: boolean, status: number, message?: string, data?: T}> {
        return this.fetchWithRetry("POST", url, data, options);
    },
    async FORM<T> (url: string, data: FormData, options?: any): Promise<{ok: boolean, status: number, message?: string, data?: T}> {
        return this.fetchWithRetry("FORM", url, data, options);
    },
    // 요청을 보내고, 제한 시간을 초과했을 경우 재시도하는 함수
    async fetchWithRetry(method: string, url: string, data: any, options: any = {}) {
        const now = Date.now(); // 현재 시간
        const lastRequestTime = lastRequestTimestamps[url] || 0; // 해당 URL의 마지막 요청 시간
        const timeSinceLastRequest = now - lastRequestTime; // 마지막 요청 이후 경과 시간
        const waitTime = 500; // 10초 (10000 밀리초) - 대기 시간

        // 마지막 요청 후 경과 시간이 대기 시간보다 짧으면 기다림
        if (timeSinceLastRequest < waitTime) {
            const timeToWait = waitTime - timeSinceLastRequest; // 기다려야 할 시간
            console.log(`Rate limited. Waiting ${timeToWait}ms before retrying ${url}`);
            toast('요청을 처리중이에요. 잠시 후 다시 시도해주세요!')
            await new Promise(resolve => setTimeout(resolve, timeToWait)); // 지정된 시간만큼 기다림
        }

        try {
            const result = await this.makeRequest(method, url, data, options); // 실제 요청을 보냄
            lastRequestTimestamps[url] = Date.now(); // 성공적으로 요청을 보냈으면 마지막 요청 시간 업데이트
            return result; // 결과 반환
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                status: 500,
                message: '네트워크 오류가 발생했어요! 잠시 후 다시 시도해주세요'
            }
        }
    },

    // 실제 API 요청을 보내는 함수
    async makeRequest(method: string, url: string, data: any, options: any = {}) {

        const requestMethod = method === "FORM" ? "POST" : method;

        let defaultOptions: any = {
            method: requestMethod, // 요청 메서드 (GET 또는 POST)
            headers: {
                ...options.headers // 추가 헤더
            },
            ...options
        };

        // POST 요청인 경우 Content-Type 설정 및 요청 body 설정
        if (method === "POST") {
            defaultOptions = {
                ...defaultOptions,
                headers: {
                    "Content-Type": "application/json", // Content-Type 설정
                    ...options.headers // 추가 헤더
                },
                body: JSON.stringify(data) // 요청 body를 JSON 문자열로 변환
            };
        }

        if(method === "FORM") {
            defaultOptions = {
                ...defaultOptions,
                headers: {
                    ...options.headers,
                },
                body: data
            }
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}${url}`, defaultOptions); // fetch API를 사용하여 요청을 보냄

            // 응답 상태 코드가 200-299 범위에 속하지 않으면 에러 처리
            if (!response.ok) {
                if (response.status === 403) {
                    location.href = '/error/unauthorized'; // 403 에러 발생 시 권한 없음 페이지로 리다이렉트
                } else if (response.status === 404) {
                    location.href = '/error/notFound'; // 404 에러 발생 시 찾을 수 없음 페이지로 리다이렉트
                } else if (response.status === 413 && method === "POST") {
                    toast('한번에 전송할 수 있는 데이터 크기를 초과했어요'); // 413 에러 발생 시 토스트 메시지 표시 (POST 요청인 경우)
                } else {
                    try {
                        const errorData = await response.json(); // 에러 응답을 JSON으로 파싱 시도
                        toast(errorData.message)
                        return {
                            ok: false,
                            message: errorData.message,
                            status: response.status
                        }
                    } catch (jsonError) {
                        // JSON 파싱에 실패한 경우 일반적인 에러를 던짐
                        return {
                            ok: false,
                            message: '데이터를 파싱하는 과정에서 에러가 발생했어요',
                            status: 400
                        }
                    }
                }
            }

            const result = await response.json(); // 응답을 JSON으로 파싱
            return {
                ok: true,
                data: result.data,
                status: 200,
            };
        } catch (error: any) {
            return {
                ok: false,
                message: '네트워크 에러가 발생했어요! 잠시 후 다시 시도해주세요',
                status: 500
            }
        }
    }
}

export default API