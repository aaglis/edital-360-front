export type ExemptionResponse = {
  id: string,
  enviadoEm: string,
  aplicanteId: string,
  arquivos: Blob[],
  noticeId: string,
  noticeTitle: string,
  status: string
}