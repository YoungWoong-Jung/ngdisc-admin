import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
import { Suspense } from "react";
import ToastContainer from "@/component/etc/ToastContainer";



export const metadata: Metadata = {
  title: "DISC",
  description: "행동유형검사 NGDISC",
};

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard'
})

const cherryBombOne = localFont({
  src: '../fonts/CherryBombOne-Regular.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-cherryBomb'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="ko" className={` ${cherryBombOne.variable}`}>
      <body id="body" className={`  ${pretendard.className}`}>
        {/* state 전달위해 suspense 사용 */}
        <Suspense>
            {children}
            {/* 모달용 */}
            <div id="modal-root"></div>
            {/* 전역 toast (알림) */}
            <ToastContainer/>
            {/* <Docbar/> */}
        </Suspense>
      </body>
    </html>
  );
}
