// api/create-pdf-link.ts
import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Função iniciada.'); // LOG 1

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = (req.query.filename as string) || `orcamento-aeb-${Date.now()}.pdf`;
  console.log(`Filename a ser usado: ${filename}`); // LOG 2

  try {
    console.log('Iniciando upload para o Vercel Blob...'); // LOG 3
    const blobResult = await put(filename, req, {
      access: 'public',
      contentType: 'application/pdf',
    });
    console.log('Upload concluído com sucesso.'); // LOG 4

    return res.status(200).json(blobResult);

  } catch (error: unknown) {
    console.error('ERRO DETALHADO NO UPLOAD:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao salvar o PDF.', 
      details: errorMessage 
    });
  }
}