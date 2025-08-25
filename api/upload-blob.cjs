// api/upload-blob.cjs
const { handleUpload } = require('@vercel/blob/client');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Esta função segura da Vercel gera o link de upload
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({ filename: pathname }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload do blob concluído', blob);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('ERRO AO GERAR TOKEN DE UPLOAD:', error);
    return res.status(500).json({ error: 'Falha ao gerar o link de upload.' });
  }
};