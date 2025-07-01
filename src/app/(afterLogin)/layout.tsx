import Token from "@/util/token";
import { redirect } from "next/navigation";
import MenuRoleChecker from "./MenuRoleChecker";
import Menu from "@/component/gnb/Menu";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const token = Token.get();
    if(!token){
        redirect('/login')
    } 
  
  return (
    <div className="w-screen h-screen max-w-screen max-h-screen overflow-y-scroll grid grid-cols-[auto_1fr]">
        <Menu/>
        <div className="h-screen max-h-screen overflow-y-scroll w-full">
          {children}
        </div>
        <MenuRoleChecker/>
    </div>
  );
}
