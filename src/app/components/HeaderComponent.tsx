import { Button } from "@/components/ui/button";

const HeaderComponent = () => {
  return (
    <div className="bg-white">
      <header className="w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-700 flex items-center justify-center rounded-lg">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold">Edital 360</span>
        </div>
        <div>
          <Button className="bg-blue-700 hover:bg-blue-600 text-white">Área do Candidato</Button>
        </div>
      </header>
    </div>
  )
}

export default HeaderComponent;