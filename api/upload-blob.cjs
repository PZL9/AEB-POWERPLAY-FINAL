// api/upload-blob.cjs
const { handleUpload } = require('@vercel/blob/client');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // Gera um token de acesso para o upload
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({
            // Você pode adicionar metadados aqui se precisar
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Chamado após o upload ser concluído
        console.log('Upload do blob concluído', blob);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('ERRO NO HANDLE UPLOAD:', error);
    return res.status(500).json({ error: 'Falha ao processar o upload.' });
  }
};