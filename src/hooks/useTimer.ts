import { useCallback, useRef } from "react";

/**
 * ^ 이 훅은 부모 컴포넌트에서 자식 컴포넌트로 함수를 전달하여,
 *    자식 컴포넌트가 해당 함수를 호출할 수 있도록 돕습니다.
 *    이를 통해 부모와 자식 간의 상호작용을 원활하게 하며,
 *    타이머 기능을 활용하여 특정 시간 후에 함수를 실행하거나,
 *    타이머를 시작, 중지, 재설정할 수 있는 기능을 제공합니다.
 */
export default function useTimer() {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // 타이머 시작
    const start = useCallback( (callback: () => void, delay: number = 300) => {
        if(timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            callback();
            timerRef.current = null
        }, delay)
    }, [])

    // 타이머 종료
    const stop = useCallback( () => {
        if(timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null
        }
    }, [] )

    // 타이머 재설정
    const reset = useCallback(( callback: () => void, delay: number = 300 ) => {
        stop();
        start(callback, delay);
    },[start, stop])

    // 타이머 활성 상태 확인
    const isActive = useCallback( () => {
        return timerRef.current !== null;
    }, [] )


    return {start, stop, reset, isActive}
}