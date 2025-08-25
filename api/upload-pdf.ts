import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'orcamento-aeb.pdf';
  
  if (!request.body) {
    return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return new Response(JSON.stringify(blob), { status: 200 });

  } catch (error) {
    console.error('Erro ao fazer upload para o Vercel Blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: 'Erro Interno do Servidor', details: errorMessage }), { status: 500 });
  }
}

export const runtime = 'edge';