import { ChildProcess } from 'child_process';
import path from 'path';
import { register } from 'module';

const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['172.100.100.142']
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('pino-pretty', 'lokijs', 'encoding');
        }
        return config;
    },
    experimental: {
        instrumentationHook: true
    },
    assetPrefix: '/admin',               //<- asset Prefix 추가 3000포트의  disc_client와 혼동되지 않도록
    basePath: '/admin'
    // output 제거 - 기본 서버 모드 사용
};

export default nextConfig;

// pino-pretty
// 역할: pino 로깅 라이브러리의 로그 출력을 보기 좋게 (pretty) 만들어주는 포매터 (formatter) 입니다.
// pino 란? Node.js 환경에서 빠르고 효율적인 로깅을 위한 라이브러리입니다. JSON 형식으로 로그를 생성하는 것을 기본으로 하며, 다양한 기능을 제공합니다.
// pino-pretty 의 필요성: pino 는 기본적으로 JSON 형식으로 로그를 출력하기 때문에 사람이 직접 읽기에는 다소 불편할 수 있습니다. pino-pretty 는 이러한 JSON 로그를 사람이 읽기 쉽도록 색상을 입히고, 들여쓰기를 적용하며, 타임스탬프를 보기 좋은 형식으로 변환하는 등 시각적으로 보기 좋게 만들어줍니다. 개발 환경이나 로컬 환경에서 로그를 콘솔에 출력하여 확인할 때 매우 유용합니다.
// externals 에 포함되는 이유 (추정):
// 개발 환경 의존성: pino-pretty 는 주로 개발 환경에서 로그를 보기 좋게 만들기 위한 도구입니다. 프로덕션 환경에서는 로그를 파일에 저장하거나, ELK 스택과 같은 중앙 집중식 로깅 시스템으로 전송하는 경우가 많으며, 이때는 JSON 형식의 로그가 더 적합할 수 있습니다.
// 번들 크기 감소: pino-pretty 는 상대적으로 크기가 큰 모듈일 수 있습니다. 프로덕션 번들에서 제외하여 번들 크기를 줄이고, 서버 시작 시간을 단축시킬 수 있습니다.

// lokijs
// 역할: JavaScript로 작성된 가볍고 빠른 NoSQL 데이터베이스 입니다. 주로 인메모리 데이터베이스로 사용되며, 파일 시스템에 데이터를 저장할 수도 있습니다.
// 특징:
// 인메모리: 데이터를 메모리에 저장하므로 매우 빠른 읽기/쓰기 성능을 제공합니다.
// NoSQL, Document-Oriented: 스키마가 없는 JSON 형태의 문서를 저장하고 조회합니다.
// 가볍고 임베디드 가능: 작은 규모의 어플리케이션이나 클라이언트 사이드 애플리케이션에 임베디드하여 사용하기에 적합합니다.
// Node.js 및 브라우저 환경 지원: Node.js 환경뿐만 아니라 브라우저 환경에서도 동작합니다.
// externals 에 포함되는 이유 (추정):
// 서버 사이드 특정 용도: lokijs 가 서버 사이드에서만 특정 용도로 사용될 가능성이 있습니다. 예를 들어, 서버 사이드 캐싱, 임시 데이터 저장, 세션 관리 등과 같이 가벼운 데이터베이스가 필요한 경우에 사용될 수 있습니다.
// 번들 크기 감소: lokijs 역시 번들 크기에 영향을 줄 수 있는 모듈입니다. externals 에 포함시켜 번들 크기를 최적화할 수 있습니다.

// encoding
// 역할: Node.js 환경에서 다양한 문자 인코딩을 지원하는 라이브러리입니다. 특히 Node.js core 에서 기본적으로 지원하지 않는 문자 인코딩 (예: EUC-KR, GBK 등) 을 다룰 때 유용합니다.
// Node.js의 기본 인코딩 지원: Node.js는 UTF-8, ASCII, Base64, Latin-1 (binary) 등의 기본적인 문자 인코딩을 내장 모듈 (buffer) 을 통해 지원합니다.
// encoding 라이브러리의 필요성: 만약 어플리케이션이 UTF-8 외에 다른 문자 인코딩으로 된 데이터를 처리해야 하는 경우 (예: 레거시 시스템과의 연동, 특정 파일 형식 처리 등), encoding 라이브러리를 사용하여 필요한 인코딩을 추가적으로 지원할 수 있습니다.
// Node.js 환경 의존성: encoding 라이브러리는 Node.js 환경에 특화된 모듈일 가능성이 높습니다. 브라우저 환경에서는 문자 인코딩 처리가 브라우저 자체에서 지원되는 경우가 많고, encoding 라이브러리가 필요 없을 수 있습니다.
// 번들 크기 감소: encoding 라이브러리도 어느 정도 번들 크기에 영향을 줄 수 있습니다. externals 에 포함시켜 번들 크기를 줄일 수 있습니다.
// 특정 환경 의존성: encoding 이 필요한 특정 환경 (예: 레거시 시스템 연동 환경) 에서만 사용되고, 다른 환경에서는 필요하지 않을 수 있습니다. 따라서 externals 에 포함시켜 필요한 환경에서만 외부에서 제공받도록 설정했을 수 있습니다.