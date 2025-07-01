import Token from "@/util/token";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {


  const token = Token.get();

  if(!token){
    redirect('/login')
  }
  
  return (
   <div>
     <h1>Home</h1>
   </div>
  );
}
