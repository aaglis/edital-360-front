import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { EditalService } from "@/core/services/editalService"
import { ExemptionResponse } from "@/core/types/exemptions"
import { useEffect, useState } from "react"

export default function Exemptions({ id }:{id: string}) {
  const [editalExempions, setEditalExempions] = useState<ExemptionResponse[]>([])

  const { fetchEditalExemptions } = EditalService

  const getEditalExemptions = async () => {
    const data = await fetchEditalExemptions(id)
    setEditalExempions(data)
  }

  useEffect(() => {
    getEditalExemptions()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solicitações de Isenção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm">Aplicante ID</th>
                  <th className="text-left p-4 font-medium text-sm w-[200px]">Enviado em</th>
                  <th className="text-center p-4 font-medium text-sm w-[140px]">Status</th>
                  <th className="text-center p-4 font-medium text-sm w-[140px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Dados mock - substituir por dados reais */}
                {editalExempions.length && editalExempions.map(exemption => (
                  <tr className="border-b hover:bg-muted/50 transition-colors" key={exemption.id}>
                    <td className="p-4">{exemption.aplicanteId}</td>
                    <td className="p-4 text-muted-foreground">   {exemption.enviadoEm? new Date(exemption.enviadoEm).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="p-4 text-muted-foreground">{exemption.status}</td>
                    <td>
                      <div className="w-full flex items-center">
                        <Button className="mx-auto">
                          Validar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}