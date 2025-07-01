import { cookies } from "next/headers";

interface ApiResponse<T> {
    data: T;
}

interface ApiError extends Error {
    status?: number;
}

const api = {
    token (){
        const cookieStore = cookies()
        const accessToken = cookieStore.get('adminAccessToken')?.value;
        const refreshToken = cookieStore.get('adminRefreshToken')?.value;
        return {accessToken, refreshToken}
    },
    async get<T>(url: string, options: any = {}): Promise<T> {
        const {accessToken, refreshToken} = this.token();
        options.headers = {
            "Cookie" : `${accessToken ? `adminAcessToken=${accessToken};` : ''} ${refreshToken ? `adminRefreshToken=${refreshToken}` : ''}`
        }
        const defaultOptions = {
            method: "GET",
            headers: {
                ...options.headers,
            },
            ...options
        };

        try {
            const response = await fetch(`${process.env.NEXT_INTERNAL_URL}${url}`, defaultOptions);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // JSON 파싱 실패 시 일반 오류 메시지 사용
                    errorData = { message: `HTTP error! status: ${response.status}` };
                }
                const error: ApiError = new Error(errorData.message || response.statusText);
                error.status = response.status;
                throw error;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Expected JSON response, but received: " + contentType);
            }

            const result: ApiResponse<T> = await response.json();
            return result.data;
        } catch (error) {
            console.error("API GET error:", error);
            throw error; // 오류를 다시 던져서 호출자가 처리하도록 함
        }
    },
    async post<T>(url: string, body: any, options: any = {}): Promise<T> {
        const {accessToken, refreshToken} = this.token();
        options.headers = {
            "Cookie" : `${accessToken ? `adminAcessToken=${accessToken};` : ''} ${refreshToken ? `adminRefreshToken=${refreshToken}` : ''}`
        }
        const defaultOPtions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Default to JSON
                ...options.headers
            },
            body: JSON.stringify(body),
            ...options
        };

        try {
            const response = await fetch(`${process.env.NEXT_INTERNAL_URL}${url}`, defaultOPtions);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // JSON 파싱 실패 시 일반 오류 메시지 사용
                    errorData = { message: `HTTP error! status: ${response.status}` };
                }

                const error: ApiError = new Error(errorData.message || response.statusText);
                error.status = response.status;

                if (response.status === 403) {
                    throw new Error('403')
                } else if (response.status === 404) {
                    throw new Error('404')
                }

                throw error;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Expected JSON response, but received: " + contentType);
            }

            const result: ApiResponse<T> = await response.json();
            return result.data;

        } catch (error) {
            console.error("API POST error:", error);
            throw error; // 오류를 다시 던져서 호출자가 처리하도록 함
        }
    }
}

export default api