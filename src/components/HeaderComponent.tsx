"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import userService from "@/core/services/userService";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(userService.isLoggedIn());
  }, []);

  return (
    <div className="bg-white shadow-lg">
      <header className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-5">
        <Link href={"/"}>
          <Logo />
        </Link>
        <div>
          <Link href={isLoggedIn ? "/configuracoes" : "/login"}>
            <Button className="text-white">
              {isLoggedIn ? "Configurações" : "Entrar"}
            </Button>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default HeaderComponent;
