"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import ExamCard from './components/ExamCard';

export default function Homepage() {
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

  const setPublicExamsFilter = (index: number) => {
    setPublicExam(prevItems =>
      prevItems.map((item, i) => ({
        ...item,
        active: i === index
      }))
    );
  }

  const mockExams = [
    { id: 0, title: 'Concurso Fazenda', vacancies: 10, salary: 'R$ 5.000' },
    { id: 1, title: 'Concurso Justiça', vacancies: 5, salary: 'R$ 6.000' },
    { id: 2, title: 'Concurso Controle', vacancies: 8, salary: 'R$ 4.500' },
    { id: 3, title: 'Concurso Fazenda II', vacancies: 12, salary: 'R$ 5.500' },
    { id: 4, title: 'Concurso Justiça II', vacancies: 7, salary: 'R$ 6.500' }
  ]

  const mockOpenedExams = [
    { id: 0, title: 'Concurso Fazenda', vacancies: 10, salary: 'R$ 5.000', isOpenForApplications: true, period: '10/06 a 13/06' },
    { id: 1, title: 'Concurso Justiça', vacancies: 5, salary: 'R$ 6.000', isOpenForApplications: true, period: '15/06 a 20/06' },
    { id: 2, title: 'Concurso Controle', vacancies: 8, salary: 'R$ 4.500', isOpenForApplications: true, period: '01/07 a 10/07' },
    { id: 3, title: 'Concurso Fazenda II', vacancies: 12, salary: 'R$ 5.500', isOpenForApplications: true, period: '05/08 a 10/08' },
    { id: 4, title: 'Concurso Justiça II', vacancies: 7, salary: 'R$ 6.500', isOpenForApplications: true, period: '15/08 a 20/08' }
  ]

  return (
    <div className="max-w-screen-2xl mx-auto px-6">
      <div className="w-full flex flex-col items-center py-11 gap-5">
        <h1 className="text-4xl font-bold">Oportunidades em Destaque</h1>
        <p className="text-zinc-500 text-lg">Confira os concursos mais recentes e com inscrições abertas. Prepare-se para o seu futuro!</p>
      </div>
      <div className="flex justify-center">
        {
          publicExam.map((item, index) => (
            <Button
              key={item.value}
              className={`m-2  ${!item.active ? 'bg-transparent text-slate-500 border border-zinc-200 hover:bg-slate-50' : ''}`}
              onClick={() => setPublicExamsFilter(index)}
            >
              {item.label}
            </Button>
          ))
        }
      </div>
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-primary-light"></div>
          <span className="text-2xl font-bold">Novos Concursos</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-6">
          {mockExams.map(exam => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              title={exam.title}
              vacancies={exam.vacancies}
              salary={exam.salary}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-secondary-light"></div>
          <span className="text-2xl font-bold">Inscrições Abertas</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-6">
          {mockOpenedExams.map(exam => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              title={exam.title}
              vacancies={exam.vacancies}
              period={exam.period}
              salary={exam.salary}
              isOpenForApplications={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}