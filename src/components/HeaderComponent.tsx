import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const HeaderComponent = () => {
  return (
    <div className="bg-white shadow-lg">
      <header className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-5">
        <Link href={"/"}>
          <Logo />
        </Link>
        <div>
          <Link href={"/login"}>
            <Button className="text-white">Área do Candidato</Button>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default HeaderComponent;