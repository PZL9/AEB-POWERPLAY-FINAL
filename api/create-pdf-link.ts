import { put } from '@vercel/blob';

// Usamos os tipos globais `Request` e `Response` que são padrão da Vercel.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'orcamento-aeb.pdf';
  
  // O corpo do request (o arquivo) é acessado diretamente.
  if (!request.body) {
    return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Faz o upload para o Vercel Blob
    const blobResult = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf', // Garante que o arquivo seja tratado como PDF
    });

    // Retorna a resposta com sucesso
    return new Response(JSON.stringify(blobResult), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ERRO DETALHADO NO UPLOAD:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    // Retorna uma mensagem de erro clara
    return new Response(JSON.stringify({ error: 'Ocorreu um erro ao salvar o PDF.', details: errorMessage }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Configuração para a Vercel executar esta função em seu ambiente mais moderno.
export const runtime = 'edge';