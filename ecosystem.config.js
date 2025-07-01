module.exports = {
    apps : [
     {
      /* 배포 서버 */
      name: 'DISC-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1, // 단일 쓰레드
      autorestart: true,
      watch: true,
      env: {
         Server_PORT: 4000,
         NODE_ENV: 'production',
      },
   },
  ],

  };
  
//   pm2 설정파일일