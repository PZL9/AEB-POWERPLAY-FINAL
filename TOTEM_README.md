# 🎯 AEB POWERPLAY - SISTEMA TOTEM

## 📋 **REQUISITOS DO COMPUTADOR**
- Windows 10/11
- Google Chrome instalado
- Mínimo 4GB RAM
- Conexão com internet (para upload de PDFs)

## 🚀 **COMO USAR NO TOTEM**

### **Opção 1: Inicialização Automática (RECOMENDADO)**
1. **Insira o pen drive** no computador do totem
2. **Dê duplo clique** no arquivo `INICIAR_TOTEM.bat`
3. **Aguarde** o sistema abrir automaticamente
4. **Pronto!** O totem está funcionando

### **Opção 2: Inicialização Manual**
1. Abra o **Prompt de Comando** como administrador
2. Navegue até a pasta do pen drive: `cd /d E:\` (ou letra do seu pen drive)
3. Execute: `npx serve dist -p 3000 -s`
4. Abra o Chrome e vá para: `http://localhost:3000`

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **Modo Totem (Tela Cheia)**
- O Chrome abre automaticamente em **modo kiosk** (tela cheia)
- **ESC** ou **Alt+F4** para sair do modo totem
- **Ctrl+Shift+Esc** para abrir o Gerenciador de Tarefas

### **Porta do Servidor**
- **Porta padrão:** 3000
- Se der conflito, altere no arquivo `.bat` a linha:
  ```batch
  start /min cmd /c "npx serve dist -p 3001 -s"
  ```

## 📁 **ESTRUTURA DO PEN DRIVE**
```
📁 PEN DRIVE
├── 📁 dist/                    # Aplicação compilada
├── 📁 node_modules/            # Dependências (se necessário)
├── 📄 INICIAR_TOTEM.bat       # Script de inicialização
├── 📄 package.json            # Configurações do projeto
├── 📄 TOTEM_README.md         # Este arquivo
└── 📄 .env.local              # Variáveis de ambiente (se necessário)
```

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Chrome não abre**
- Verifique se o Chrome está instalado
- Execute o `.bat` como administrador

### **Erro de porta em uso**
- Feche outros navegadores
- Altere a porta no script `.bat`

### **Aplicação não carrega**
- Verifique se a pasta `dist/` está completa
- Confirme que o servidor está rodando na porta correta

### **Sair do modo totem**
- **ESC** ou **Alt+F4**
- **Ctrl+Shift+Esc** → Gerenciador de Tarefas → Finalizar Chrome

## 🔄 **ATUALIZAÇÕES**

Para atualizar o sistema:
1. Substitua a pasta `dist/` pela nova versão
2. Mantenha os arquivos `.bat` e `.md`
3. Execute novamente o `INICIAR_TOTEM.bat`

## 📞 **SUPORTE**

Em caso de problemas:
1. Verifique os logs no terminal
2. Confirme que todas as pastas estão presentes
3. Teste em outro computador se necessário

---
**Desenvolvido para AEB POWERPLAY** 🚀
