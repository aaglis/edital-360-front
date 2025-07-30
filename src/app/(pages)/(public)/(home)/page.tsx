import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { act } from "react";

export default function Homepage() {
  const editaisItems = [
    {
      label: 'Todos',
      value: 'todos',
      active: true
    },
    {
      label: 'Fazenda',
      value: 'fazenda',
      active: false
    },
    {
      label: 'Justiça',
      value: 'justica',
      active: false
    },
    {
      label: 'Controle',
      value: 'controle',
      active: false
    }
  ]

  return (
    <div className="bg-blue-50">
      <div className="max-w-screen-2xl mx-auto ">
        <div className="w-full flex flex-col items-center py-11 gap-5">
          <h1 className="text-4xl font-bold">Oportunidades em Destaque</h1>
          <p className="text-zinc-500 text-lg">Confira os concursos mais recentes e com inscrições abertas. Prepare-se para o seu futuro!</p>
        </div>
        <div className="flex justify-center">
          {
            editaisItems.map((item) => (
              <Button
                key={item.value}
                className={`m-2 bg-transparent text-zinc-500 border border-zinc-200 hover:bg-zinc-50 ${item.active ? 'bg-blue-600 hover:bg-blue-500 text-white' : ''}`}
              >
                {item.label}
              </Button>
            ))
          }
        </div>
      </div>
    </div>
  );
}