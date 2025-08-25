import { put } from '@vercel/blob';

// A Vercel disponibiliza `Request` e `Response` globalmente neste ambiente.
// Nenhuma importação especial é necessária.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'orcamento-aeb.pdf';
  
  if (!request.body) {
    return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const blobResult = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return new Response(JSON.stringify(blobResult), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    return new Response(JSON.stringify({ error: 'Ocorreu um erro ao salvar o PDF.', details: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const runtime = 'edge';