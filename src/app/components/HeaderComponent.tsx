import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeaderComponent = () => {
  return (
    <div className="bg-white shadow-lg">
      <header className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-5">
        <Link href={"/"}>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-lg">
              <span className="uppercase font-bold text-xl">e</span>
            </div>
            <span className="font-bold">Edital 360</span>
          </div>
        </Link>
        <div>
          <Link href={"/login"}>
            <Button>Área do Candidato</Button>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default HeaderComponent;