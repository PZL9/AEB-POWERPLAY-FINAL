// api/upload-blob.cjs
const { handleUpload } = require('@vercel/blob/client');

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
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

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error('ERRO NO HANDLER DE UPLOAD:', error);
    return response.status(500).json({ error: error.message });
  }
};