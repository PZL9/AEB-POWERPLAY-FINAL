const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = req.query.filename || `orcamento-aeb-${Date.now()}.pdf`;

  try {
    const blobResult = await put(filename, req, {
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