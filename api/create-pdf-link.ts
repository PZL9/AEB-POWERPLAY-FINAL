// api/create-pdf-link.ts
import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Função /api/create-pdf-link iniciada.');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = (req.query.filename as string) || `orcamento-aeb-${Date.now()}.pdf`;
  console.log(`Filename a ser usado: ${filename}`);

  try {
    // CORREÇÃO: Usar req.body em vez de req
    if (!req.body) {
      console.error('Corpo da requisição está vazio.');
      return res.status(400).json({ error: 'Corpo da requisição (PDF) não encontrado.' });
    }
    
    console.log('Iniciando upload para o Vercel Blob com o corpo da requisição...');
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