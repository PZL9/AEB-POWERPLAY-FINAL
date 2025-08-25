// api/create-pdf-link.cjs (Versão de Diagnóstico)

// Função para ler o corpo da requisição como um Buffer
function getRawBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('error', reject);
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
  
  module.exports = async (req, res) => {
    console.log('--- INICIANDO FUNÇÃO DE DIAGNÓSTICO ---');
    console.log(`MÉTODO: ${req.method}`);
    console.log('QUERY PARAMS:', req.query);
    console.log('HEADERS RECEBIDOS:', JSON.stringify(req.headers, null, 2));
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    try {
      const bodyBuffer = await getRawBody(req);
      console.log(`TAMANHO DO CORPO RECEBIDO: ${bodyBuffer.length} bytes`);
  
      if (bodyBuffer.length === 0) {
          console.error('ERRO: O corpo da requisição está vazio.');
          return res.status(500).json({ 
              error: 'Diagnóstico: Corpo da requisição chegou vazio no servidor.' 
          });
      }
  
      // Se chegarmos até aqui, significa que o corpo foi recebido.
      // Vamos retornar um erro controlado para o front-end, pois não estamos fazendo o upload real.
      console.log('Diagnóstico concluído: O corpo do PDF foi recebido com sucesso.');
      return res.status(500).json({ 
          error: 'Teste de diagnóstico bem-sucedido!', 
          details: `O servidor recebeu um corpo de ${bodyBuffer.length} bytes.` 
      });
  
    } catch (error) {
      console.error('ERRO NO DIAGNÓSTICO:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
      return res.status(500).json({ 
        error: 'Ocorreu um erro durante o diagnóstico do servidor.', 
        details: errorMessage 
      });
    }
  };