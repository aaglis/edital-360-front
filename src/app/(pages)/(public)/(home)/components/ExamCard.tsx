import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ExamCardProps = {
  id: string;
  title: string;
  vacancies: number;
  remuneration: number;
  period?: string;
  isOpenForApplications?: boolean;
};

// eslint-disable-next-line
const ExamCard = ({ id, title, remuneration, vacancies,period, isOpenForApplications = false}: ExamCardProps) => {
  const router = useRouter();

  const handleVerEdital = () => {
    router.push(`/edital/${id}`);
    console.log(`Navegando para o edital com ID: ${id}`);
  };

  return (
    <div className={`border border-zinc-200 bg-white rounded-lg w-96 flex flex-col shadow-md`}>
      <div className="p-6 pb-0 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className={`${isOpenForApplications ? 'bg-secondary' : 'bg-primary'} text-white font-bold w-12 h-12 flex items-center justify-center rounded-md`}>
            A
          </div>
          <span className="font-bold uppercase text-lg">{title}</span>
        </div>
        { isOpenForApplications && (
          <div className="text-sm bg-secondary-light text-white px-2 py-1 w-fit rounded-2xl">
            Inscrições Abertas
          </div>
        )}
        <div className="flex flex-col gap-2 w-1/2 pb-4">
          { period && (
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="font-semibold text-sm">Período:</span>
                <span className="text-sm">{period}</span>
              </div>
            )
          }
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="font-semibold text-sm">Vagas:</span>
            <span className="text-sm">{vacancies}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="font-semibold text-sm">Salário:</span>
            <span className="text-sm">{remuneration}</span>
          </div>
        </div>
      </div>
      <Button 
        onClick={handleVerEdital}
        className={`flex h-10 bg-zinc-100 text-primary hover:bg-primary hover:text-white ${isOpenForApplications ? 'bg-secondary hover:bg-secondary-light text-white' : ''} rounded-t-none`}
      >
        Ver Edital
      </Button>
    </div>
  )
}

export default ExamCard;