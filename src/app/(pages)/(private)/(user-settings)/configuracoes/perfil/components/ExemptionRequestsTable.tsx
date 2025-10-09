"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Mocked data type
type IsencaoItem = {
    id: string;
    edital: string;
    criadoEm: string;
    status: "PENDENTE" | "APROVADA" | "NEGADA";
};

function StatusPill({ s }: { s: IsencaoItem["status"] }) {
    const map: Record<IsencaoItem["status"], string> = {
        PENDENTE: "bg-amber-100 text-amber-800",
        APROVADA: "bg-emerald-100 text-emerald-800",
        NEGADA: "bg-rose-100 text-rose-800",
    };
    return <span className={`px-2 py-0.5 rounded text-xs ${map[s]}`}>{s}</span>;
}

const MOCKED_ROWS: IsencaoItem[] = [
    {
        id: "2024-001",
        edital: "Edital 01/2024 - Concurso Público",
        criadoEm: "2024-05-01T10:00:00Z",
        status: "PENDENTE",
    },
    {
        id: "2024-002",
        edital: "Edital 02/2024 - Processo Seletivo",
        criadoEm: "2024-04-25T14:30:00Z",
        status: "APROVADA",
    },
    {
        id: "2024-003",
        edital: "Edital 03/2024 - Vestibular",
        criadoEm: "2024-04-20T09:15:00Z",
        status: "NEGADA",
    },
    {
        id: "2024-004",
        edital: "Edital 04/2024 - Concurso Interno",
        criadoEm: "2024-04-15T16:45:00Z",
        status: "APROVADA",
    },
    {
        id: "2024-005",
        edital: "Edital 05/2024 - Seleção de Bolsistas",
        criadoEm: "2024-04-10T11:20:00Z",
        status: "PENDENTE",
    },
];

export default function ExemptionRequestsTable() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<IsencaoItem[]>([]);

    useEffect(() => {
        // Simula carregamento de dados mockados
        const timeout = setTimeout(() => {
            setRows(MOCKED_ROWS);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Card className="w-full">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Últimas solicitações de isenção</CardTitle>
                    <CardDescription>Suas 5 solicitações mais recentes</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => location.assign("/isencoes")}>
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
                    <p className="text-sm text-muted-foreground">Você ainda não possui solicitações.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Protocolo</TableHead>
                                <TableHead>Edital</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((r) => (
                                <TableRow key={r.id} className="hover:bg-muted/50">
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell className="max-w-[320px] truncate">{r.edital}</TableCell>
                                    <TableCell>{new Date(r.criadoEm).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right"><StatusPill s={r.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
