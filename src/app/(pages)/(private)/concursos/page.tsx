"use client";
import { useState } from "react";
import ExamCard from "@/app/(pages)/(public)/(home)/components/ExamCard";


export default function ConcursoDisponiveisPage() {
      const [publicExam, setPublicExam] = useState([
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
      ])

      const concursos = [
        {
          id: 1,
          title: "Receita Federal",
          vacancies: 230,
          salary: "R$ 15.000",
          period: "15/08 - 30/09",
          isOpenForApplications: true,
          category: "fazenda"
        },
        {
          id: 2,
          title: "Tribunal de Justiça",
          vacancies: 150,
          salary: "R$ 12.000",
          period: "01/09 - 15/10",
          isOpenForApplications: true,
          category: "justica"
        },
        {
          id: 3,
          title: "Controladoria Geral",
          vacancies: 80,
          salary: "R$ 18.000",
          period: "10/08 - 25/09",
          isOpenForApplications: true,
          category: "controle"
        },
        {
          id: 4,
          title: "Secretaria da Fazenda",
          vacancies: 120,
          salary: "R$ 8.500",
          period: "10/08 - 25/09",
          isOpenForApplications: true,
          category: "fazenda"
        }
      ]

      const filteredConcursos = publicExam.find(exam => exam.active)?.value === 'todos' 
        ? concursos 
        : concursos.filter(concurso => concurso.category === publicExam.find(exam => exam.active)?.value)
    
      const setPublicExamsFilter = (index: number) => {
        setPublicExam(prevItems =>
          prevItems.map((item, i) => ({
            ...item,
            active: i === index
          }))
        );
      }

    return (
        <div className="flex flex-col items-center mt-20 mx-8 min-h-screen mb-10">
            <h1 className="text-4xl font-bold">Inscrição para Eventos</h1>
            <span className="text-lg mt-4 mb-14">Selecione os concursos de seu interesse e realize sua inscrição</span>
            <div className="w-full max-w-[843px] bg-white shadow-md rounded-lg p-6 border border-gray-300 flex items-center gap-4">
               <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                 JG
               </div>
               <div className="flex flex-col">
                <h1 className="text-base font-semibold sm:text-xl">José Genilton Da Silva filho</h1>
                <p className="text-green-600 text-xs sm:text-base">✓ Seus dados pessoais estão cadastrados com sucesso.</p>
               </div>
            </div>
        
            <div className="flex gap-2 mt-6">
                {publicExam.map((exam, index) => (
                    <button 
                        key={exam.value}
                        className={`px-4 h-10 border rounded-lg flex justify-center items-center transition-colors ${
                            exam.active 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setPublicExamsFilter(index)}
                    >
                        <span className="text-sm font-medium">{exam.label}</span>
                    </button>
                ))}
            </div>            <h1 className="text-2xl font-bold border-l-4 border-blue-500 pl-2 mb-6 w-full max-w-[843px] mt-6">
              Eventos Disponíveis
            </h1>

            <div className="flex flex-wrap gap-6 w-full max-w-[843px] justify-center">
                {filteredConcursos.map((concurso) => (
                    <ExamCard
                        key={concurso.id}
                        id={concurso.id}
                        title={concurso.title}
                        vacancies={concurso.vacancies}
                        salary={concurso.salary}
                        period={concurso.period}
                        isOpenForApplications={concurso.isOpenForApplications}
                    />
                ))}
            </div>
            {filteredConcursos.length === 0 && (
                <div className="text-center text-gray-500 mt-8 ">
                    <p>Nenhum concurso encontrado para o filtro selecionado.</p>
                </div>
            )}
            </div>
        
    );
}