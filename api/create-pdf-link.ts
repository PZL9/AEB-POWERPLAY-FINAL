import { put } from '@vercel/blob';

// Esta é a configuração correta para a Vercel
export const runtime = 'edge';

// Usamos os tipos globais `Request` e `Response`, que não precisam de importação
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'orcamento-aeb.pdf';
    
    if (!request.body) {
      return new Response(JSON.stringify({ error: 'Corpo da requisição está vazio.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blobResult = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return new Response(JSON.stringify(blobResult), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ERRO DETALHADO NA API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    return new Response(JSON.stringify({ error: 'Erro interno na função da API.', details: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}