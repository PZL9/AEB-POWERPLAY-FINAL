// api/create-pdf-link.cjs
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  // Log para confirmar que a versão .cjs está rodando
  console.log('EXECUTANDO A VERSÃO CORRETA DA API (create-pdf-link.cjs)');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = req.query.filename || `orcamento-aeb-${Date.now()}.pdf`;

  try {
    if (!req.body) {
      console.error('Corpo da requisição está vazio.');
      return res.status(400).json({ error: 'Corpo da requisição (PDF) não encontrado.' });
    }

    const blobResult = await put(filename, req.body, {
      access: 'public',
      contentType: 'application/pdf',
    });

    return res.status(200).json(blobResult);

  } catch (error) {
    console.error('ERRO DETALHADO NO UPLOAD:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no servidor.';
    return res.status(500).json({
      error: 'Ocorreu um erro ao salvar o PDF.',
      details: errorMessage
    });
  }
};