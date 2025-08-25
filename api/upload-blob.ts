// api/upload-blob.ts
import { handleUpload } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[upload-blob] start', {
    method: req.method,
    url: req.url,
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body as any,
      request: req as any,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['application/pdf'],
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('[upload-blob] completed', { url: blob.url, pathname: blob.pathname, size: blob.size });
      },
    });

    console.log('[upload-blob] response ok');
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('[upload-blob] error:', error);
    const message = error instanceof Error ? error.message : 'unknown error';
    // Padroniza para facilitar a visualização nos logs da Vercel
    return res.status(500).json({ error: 'Falha ao processar o upload.', details: message });
  }
}

// Em alguns runtimes, desabilitar o body parser é necessário para receber o stream bruto
export const config = {
  api: {
    bodyParser: false,
  },
};


