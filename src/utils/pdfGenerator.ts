import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { CartItem } from '@/types/transformer';

export const generateQuotationPDF = async (
  items: CartItem[],
  customerPhone: string,
  prize: string,
  competitorPrices: { competitorA: number; competitorB: number; savings: number }
): Promise<string> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = 0;

  const addHeader = () => {
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 53); // AEB Orange
    doc.text('AEB - A ELÉTRICA DO BRASIL', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('ORÇAMENTO PERSONALIZADO', pageWidth / 2, 35, { align: 'center' });
    yPos = 35;
  };
  
  const addFooter = (pageNumber: number) => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('AEB - A Elétrica do Brasil | www.aeb.com.br', margin, pageHeight - 10);
  };

  let pageCount = 1;
  addHeader();
  addFooter(pageCount);

  // Customer info
  doc.setFontSize(12);
  doc.text(`WhatsApp: ${customerPhone}`, margin, 55);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, 65);
  yPos = 65;

  // Items
  yPos += 20;
  doc.setFontSize(14);
  doc.text('ITENS DO ORÇAMENTO:', margin, yPos);
  
  let totalValue = 0;
  
  items.forEach((item, index) => {
    const itemHeight = 70 + (item.config.oilType ? 8 : 0);
    if (yPos + itemHeight > pageHeight - 30) {
      doc.addPage();
      pageCount++;
      addHeader();
      addFooter(pageCount);
      yPos = 45; // Reset yPos for new page
    }

    yPos += 15;
    doc.setFontSize(12);
    doc.text(`${index + 1}. Transformador ${item.config.type === 'dry' ? 'Seco' : 'a Óleo'}`, margin, yPos);
    
    yPos += 8;
    doc.text(`   Potência: ${item.config.power} kVA`, margin, yPos);
    yPos += 8;
    doc.text(`   Material: ${item.config.material === 'copper' ? 'Cobre' : 'Alumínio'}`, margin, yPos);
    yPos += 8;
    doc.text(`   Fator K: ${item.config.factorK}`, margin, yPos);
    if (item.config.oilType) {
      yPos += 8;
      doc.text(`   Tipo de Óleo: ${item.config.oilType === 'vegetal' ? 'Vegetal' : 'Mineral'}`, margin, yPos);
    }
    
    yPos += 12;
    doc.text(`   Quantidade: ${item.quantity}`, margin, yPos);
    yPos += 8;
    doc.text(`   Preço Unitário: R$ ${item.finalPrice.toLocaleString('pt-BR')}`, margin, yPos);
    yPos += 8;
    doc.text(`   Subtotal: R$ ${(item.finalPrice * item.quantity).toLocaleString('pt-BR')}`, margin, yPos);
    
    totalValue += item.finalPrice * item.quantity;
    yPos += 10;
  });
  
  // Check for page break before summary
  if (yPos + 120 > pageHeight - 30) {
    doc.addPage();
    pageCount++;
    addHeader();
    addFooter(pageCount);
    yPos = 45;
  }

  // Competitor comparison
  yPos += 10;
  doc.setFontSize(14);
  doc.text('COMPARAÇÃO COM CONCORRENTES:', margin, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`AEB: R$ ${totalValue.toLocaleString('pt-BR')}`, margin, yPos);
  yPos += 8;
  doc.text(`Concorrente A: R$ ${competitorPrices.competitorA.toLocaleString('pt-BR')}`, margin, yPos);
  yPos += 8;
  doc.text(`Concorrente B: R$ ${competitorPrices.competitorB.toLocaleString('pt-BR')}`, margin, yPos);
  
  yPos += 12;
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(`SUA ECONOMIA: R$ ${Math.round(competitorPrices.savings).toLocaleString('pt-BR')}`, margin, yPos);
  doc.setTextColor(0, 0, 0);
  
  // Prize
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(255, 107, 53);
  doc.text(`PRÊMIO SORTEADO: ${prize}`, pageWidth / 2, yPos, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // QR Code for contact
  yPos += 15;
  const representativePhone = "5511912345678"; // IMPORTANTE: Substituir pelo número real
  const orderSummary = items.map(item => 
    `${item.quantity}x Trafo ${item.config.type} ${item.config.power}kVA`
  ).join(', ');
  const message = `Olá! Tenho interesse no orçamento que gerei no totem.\n\nResumo: ${orderSummary}\nValor Total: R$ ${totalValue.toLocaleString('pt-BR')}\nPrêmio: ${prize}\nContato: ${customerPhone}`;
  const whatsappUrl = `https://wa.me/${representativePhone}?text=${encodeURIComponent(message)}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(whatsappUrl, { width: 200 });
    doc.addImage(qrCodeDataURL, 'PNG', margin, yPos, 40, 40);
    doc.setFontSize(10);
    doc.text('Escaneie para finalizar\ncom nosso representante\nvia WhatsApp!', margin + 45, yPos + 18);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  return doc.output('datauristring');
};