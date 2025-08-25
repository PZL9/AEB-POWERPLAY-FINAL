// api/health.cjs
module.exports = (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`API /api/health FOI ACESSADA COM SUCESSO! Horário: ${timestamp}`);
    
    res.status(200).json({ 
      status: 'ok', 
      message: 'A API está funcionando corretamente.',
      timestamp: timestamp 
    });
  };