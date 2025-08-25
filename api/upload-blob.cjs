// api/upload-blob.cjs
const { handleUpload } = require('@vercel/blob/client');

// O handler principal da função
async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ['application/pdf'],
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload do blob concluído', blob);
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('ERRO NO HANDLE UPLOAD:', error);
    return res.status(500).json({ error: 'Falha ao processar o upload.' });
  }
}

// Exporta o handler e a configuração para desabilitar o bodyParser
module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};