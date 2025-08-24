import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { CartItem } from '@/types/transformer';

export const generateQuotationPDF = async (
  items: CartItem[],
  customerPhone: string,
  prize: string,
  competitorPrices: { competitorA: number; competitorB: number; savings: number }
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(255, 107, 53); // AEB Orange
  doc.text('AEB - A ELÉTRICA DO BRASIL', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('ORÇAMENTO PERSONALIZADO', pageWidth / 2, 35, { align: 'center' });
  
  // Customer info
  doc.setFontSize(12);
  doc.text(`WhatsApp: ${customerPhone}`, 20, 55);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 65);
  
  // Items
  let yPos = 85;
  doc.setFontSize(14);
  doc.text('ITENS DO ORÇAMENTO:', 20, yPos);
  
  let totalValue = 0;
  
  items.forEach((item, index) => {
    yPos += 15;
    doc.setFontSize(12);
    doc.text(`${index + 1}. Transformador ${item.config.type === 'dry' ? 'Seco' : 'a Óleo'}`, 20, yPos);
    
    yPos += 10;
    doc.text(`   Potência: ${item.config.power} kVA`, 20, yPos);
    doc.text(`   Material: ${item.config.material === 'copper' ? 'Cobre' : 'Alumínio'}`, 20, yPos + 8);
    doc.text(`   Fator K: ${item.config.factorK}`, 20, yPos + 16);
    if (item.config.oilType) {
      doc.text(`   Tipo de Óleo: ${item.config.oilType === 'vegetal' ? 'Vegetal' : 'Mineral'}`, 20, yPos + 24);
      yPos += 8;
    }
    
    yPos += 24;
    doc.text(`   Quantidade: ${item.quantity}`, 20, yPos);
    doc.text(`   Preço Unitário: R$ ${item.finalPrice.toLocaleString()}`, 20, yPos + 8);
    doc.text(`   Subtotal: R$ ${(item.finalPrice * item.quantity).toLocaleString()}`, 20, yPos + 16);
    
    totalValue += item.finalPrice * item.quantity;
    yPos += 25;
  });
  
  // Competitor comparison
  yPos += 10;
  doc.setFontSize(14);
  doc.text('COMPARAÇÃO COM CONCORRENTES:', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(12);
  doc.text(`AEB: R$ ${totalValue.toLocaleString()}`, 20, yPos);
  doc.text(`Concorrente A: R$ ${competitorPrices.competitorA.toLocaleString()}`, 20, yPos + 10);
  doc.text(`Concorrente B: R$ ${competitorPrices.competitorB.toLocaleString()}`, 20, yPos + 20);
  
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(`SUA ECONOMIA: R$ ${Math.round(competitorPrices.savings).toLocaleString()}`, 20, yPos + 35);
  
  // Prize
  doc.setFontSize(16);
  doc.setTextColor(255, 107, 53);
  doc.text(`PRÊMIO SORTEADO: ${prize}`, pageWidth / 2, yPos + 55, { align: 'center' });
  
  // QR Code for contact
  try {
    const qrCodeDataURL = await QRCode.toDataURL(`https://wa.me/5511999999999?text=Olá! Recebi meu orçamento da AEB. Gostaria de falar sobre minha cotação.`);
    doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, yPos + 65, 40, 40);
    doc.text('Escaneie para entrar em contato', pageWidth - 60, yPos + 110, { align: 'left' });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('AEB - A Elétrica do Brasil | www.aeb.com.br', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  
  // Download
  doc.save(`orcamento-aeb-${Date.now()}.pdf`);
  
  // Save lead data
  const leadData = {
    timestamp: new Date().toISOString(),
    phone: customerPhone,
    items: items.map(item => ({
      type: item.config.type,
      power: item.config.power,
      quantity: item.quantity,
      price: item.finalPrice
    })),
    totalValue,
    prize
  };
  
  // Store in localStorage for later extraction
  const existingLeads = JSON.parse(localStorage.getItem('aeb-leads') || '[]');
  existingLeads.push(leadData);
  localStorage.setItem('aeb-leads', JSON.stringify(existingLeads));
};