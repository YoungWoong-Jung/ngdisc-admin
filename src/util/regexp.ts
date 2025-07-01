// regExps.ts 파일
export const regName = /^[가-힣\s]{2,5}$/
export const regTel = /^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70|10|11|1[6-9]))-?(\d{3,4})-?(\d{4})$/
export const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const regPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?]).{8,15}$/;

export const regNumber = /^-?\d+$/; // 모든 숫자 (마이너스 가능)
export const regText50 = /^.{1,50}$/; // 모든 텍스트 (50자 이내)
export const regText500 = /^[\s\S]{1,500}$/; // 모든 텍스트 및 줄바꿈 (500자 이내)