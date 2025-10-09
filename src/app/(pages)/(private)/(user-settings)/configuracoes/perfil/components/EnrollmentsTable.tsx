"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Mocked type (replace with your actual type if needed)
type InscricaoItem = {
    id: number;
    edital: string;
    criadoEm: string;
    situacao: "INSCRITO" | "CLASSIFICADO" | "APROVADO" | "ELIMINADO";
};

function SitPill({ s }: { s: InscricaoItem["situacao"] }) {
    const map: Record<InscricaoItem["situacao"], string> = {
        INSCRITO: "bg-blue-100 text-blue-800",
        CLASSIFICADO: "bg-violet-100 text-violet-800",
        APROVADO: "bg-emerald-100 text-emerald-800",
        ELIMINADO: "bg-rose-100 text-rose-800",
    };
    return <span className={`px-2 py-0.5 rounded text-xs ${map[s]}`}>{s}</span>;
}

// Mock data
const MOCK_ROWS: InscricaoItem[] = [
    {
        id: 101,
        edital: "Edital de Bolsas 2024",
        criadoEm: "2024-05-01T10:00:00Z",
        situacao: "INSCRITO",
    },
    {
        id: 102,
        edital: "Processo Seletivo Estágio",
        criadoEm: "2024-04-20T14:30:00Z",
        situacao: "CLASSIFICADO",
    },
    {
        id: 103,
        edital: "Edital de Monitoria",
        criadoEm: "2024-04-10T09:15:00Z",
        situacao: "APROVADO",
    },
    {
        id: 104,
        edital: "Edital de Pesquisa",
        criadoEm: "2024-03-28T16:45:00Z",
        situacao: "ELIMINADO",
    },
    {
        id: 105,
        edital: "Edital de Extensão",
        criadoEm: "2024-03-15T11:20:00Z",
        situacao: "INSCRITO",
    },
];

export default function EnrollmentsTable() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<InscricaoItem[]>([]);

    useEffect(() => {
        // Simulate loading delay
        setTimeout(() => {
            setRows(MOCK_ROWS);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <Card className="w-full">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Últimos editais inscritos</CardTitle>
                    <CardDescription>Suas 5 inscrições mais recentes</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => location.assign("/inscricoes")}>
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Você ainda não possui inscrições.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inscrição</TableHead>
                                <TableHead>Edital</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Situação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((r) => (
                                <TableRow key={r.id} className="hover:bg-muted/50">
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell className="max-w-[320px] truncate">{r.edital}</TableCell>
                                    <TableCell>{new Date(r.criadoEm).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right"><SitPill s={r.situacao} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
