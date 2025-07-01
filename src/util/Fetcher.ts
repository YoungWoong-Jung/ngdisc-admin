const Fetcher = async (input: RequestInfo, init?: RequestInit) => {
    // 데이터 요청
    const response = await fetch(input, init);

    // * 정상응답일 때
    if(response.ok){
        const result = await response.json();
        return result.data
    } else {
        const errorData = await response.json();
        const error = new Error(response.statusText);
        error.message = errorData.message;
        throw error;
    }
}

export default Fetcher