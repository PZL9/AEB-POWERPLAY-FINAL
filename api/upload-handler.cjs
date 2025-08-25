// api/upload-handler.cjs

// Função para ler o corpo da requisição como um Buffer
function getRawBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('error', reject);
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
  
  // O handler principal
  async function handler(req, res) {
    console.log('--- EXECUTANDO O NOVO ENDPOINT DE TESTE: /api/upload-handler ---');
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    try {
      const bodyBuffer = await getRawBody(req);
      const bodySize = bodyBuffer.length;
  
      console.log(`Tamanho do corpo recebido: ${bodySize} bytes`);
  
      if (bodySize > 0) {
        // Teste bem-sucedido, o corpo foi recebido!
        return res.status(500).json({ 
          message: 'TESTE BEM-SUCEDIDO: O corpo da requisição foi recebido pelo servidor.',
          bytesReceived: bodySize
        });
      } else {
        // Teste falhou, o corpo está vazio.
        return res.status(500).json({ 
          message: 'TESTE FALHOU: O corpo da requisição chegou vazio.'
        });
      }
    } catch (error) {
      console.error('ERRO NO HANDLER DE TESTE:', error);
      return res.status(500).json({ message: 'Erro interno no endpoint de teste.' });
    }
  }
  
  // Exporta o handler e a configuração para desabilitar o bodyParser
  module.exports = handler;
  module.exports.config = {
    api: {
      bodyParser: false,
    },
  };