// api/create-pdf-link.cjs
const { put } = require('@vercel/blob');

// Função para ler o corpo da requisição como um Buffer
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// O código principal da função
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = req.query.filename || `orcamento-aeb-${Date.now()}.pdf`;

  try {
    const bodyBuffer = await getRawBody(req);

    if (bodyBuffer.length === 0) {
      console.error('ERRO: O corpo da requisição está vazio.');
      return res.status(400).json({ error: 'O corpo da requisição (PDF) não foi recebido pelo servidor.' });
    }
    
    const blobResult = await put(filename, bodyBuffer, {
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
}

// CONFIGURAÇÃO CRUCIAL PARA A VERCEL
// Isso desabilita o bodyParser padrão para que possamos receber o PDF
module.exports = (req, res) => {
  handler(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};