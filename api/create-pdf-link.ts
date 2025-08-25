// api/create-pdf-link.ts
import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log para confirmar que a função correta está sendo executada
  console.log('EXECUTANDO A VERSÃO CORRETA DA API (create-pdf-link.ts)');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = (req.query.filename as string) || `orcamento-aeb-${Date.now()}.pdf`;

  try {
    if (!req.body) {
      console.error('Corpo da requisição está vazio.');
      return res.status(400).json({ error: 'Corpo da requisição (PDF) não encontrado.' });
    }
    
    console.log('Iniciando upload para o Vercel Blob...');
    const blobResult = await put(filename, req.body, {
      access: 'public',
      contentType: 'application/pdf',
    });
    console.log('Upload concluído com sucesso.');

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