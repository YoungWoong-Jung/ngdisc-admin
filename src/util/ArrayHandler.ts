export default class ArrayHandler {

    constructor(){}

    static group(arr: any[], n: number): any[][] {
        // 주어진 배열을 n 크기의 청크로 나누는 함수
        return arr.reduce((acc, _, index) => {
            // 현재 인덱스가 n으로 나누어 떨어지는 경우
            if (index % n === 0) 
                // 배열의 해당 인덱스부터 n만큼 잘라서 acc에 추가
                acc.push(arr.slice(index, index + n));
            return acc; // 누적된 배열 반환
        }, []); // 초기값으로 빈 배열 사용
    };

    static randomSort(arr: any[]): any[] {
        return arr.sort(() => Math.random() - 0.5);
    }

}