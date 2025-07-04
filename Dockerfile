# =================================================================
# 개발 모드 전용 Dockerfile
# =================================================================
FROM node:20-alpine

# Alpine Linux의 패키지 매니저(apk)를 사용해 openssl을 설치합니다.
# Prisma 엔진이 데이터베이스와 안전하게 통신하기 위해 필수적입니다.
RUN apk add --no-cache openssl

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 이 컨테이너가 사용할 포트를 지정합니다.
EXPOSE 4600

# 개발 모드로 실행
CMD ["npm", "run", "dev"]