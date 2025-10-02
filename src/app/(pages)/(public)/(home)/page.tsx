"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cadastrarEditalService } from '@/core/services/editalService';
import ExamCard from './components/ExamCard';
import type { EditalRequest } from '@/core/types/editais.interface';

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
  const [editais, setEditais] = useState<EditalRequest[]>([]);

  const setPublicExamsFilter = (index: number) => {
    setPublicExam(prevItems =>
      prevItems.map((item, i) => ({
        ...item,
        active: i === index
      }))
    );
  }

  const mockOpenedExams = [
    { id: "0", title: 'Concurso Fazenda', vacancies: 10, salary: 5.000, isOpenForApplications: true, period: '10/06 a 13/06' },
    { id: "1", title: 'Concurso Justiça', vacancies: 5, salary: 6.000, isOpenForApplications: true, period: '15/06 a 20/06' },
    { id: "2", title: 'Concurso Controle', vacancies: 8, salary: 4.500, isOpenForApplications: true, period: '01/07 a 10/07' },
    { id: "3", title: 'Concurso Fazenda II', vacancies: 12, salary: 5.500, isOpenForApplications: true, period: '05/08 a 10/08' },
    { id: "4", title: 'Concurso Justiça II', vacancies: 7, salary: 6.500, isOpenForApplications: true, period: '15/08 a 20/08' }
  ]

  const fetchEditais = async () => {
    try {
      const response = await cadastrarEditalService.fetchAll();
      setEditais(response);
    } catch (error) {
      console.error('Error fetching editais:', error);
      return [];
    }
  }
  

  useEffect(() => {
    fetchEditais();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 w-full">
      <div className="w-full flex flex-col items-center py-11 gap-5">
        <h1 className="text-4xl font-bold text-center">Oportunidades em Destaque</h1>
        <p className="text-zinc-500 text-lg text-center">Confira os concursos mais recentes e com inscrições abertas. Prepare-se para o seu futuro!</p>
      </div>
      <div className="flex justify-center">
        {
          publicExam.map((item, index) => (
            <Button
              key={item.value}
              className="ml-2"
              variant={item.active ? 'default' : 'outline'}
              onClick={() => setPublicExamsFilter(index)}
            >
              {item.label}
            </Button>
          ))
        }
      </div>
      <div>
        <div className="flex items-center gap-3 w-full justify-center py-6 md:justify-items-start">
          <div className="w-1 h-7 bg-primary"></div>
          <span className="text-2xl font-bold">Novos Concursos</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-0 md:px-6">
          {editais.map(exam => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              title={exam.title}
              vacancies={exam.vacancies}
              remuneration={exam.remuneration}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 w-full justify-center py-6 md:justify-items-start">
          <div className="w-1 h-7 bg-secondary"></div>
          <span className="text-2xl font-bold">Inscrições Abertas</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-0 md:px-6">
          {mockOpenedExams.map(exam => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              title={exam.title}
              vacancies={exam.vacancies}
              period={exam.period}
              remuneration={exam.salary}
              isOpenForApplications={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}