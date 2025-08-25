import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { CartItem } from '@/types/transformer';
import aebLogo from '@/assets/aeb-logo.png'; // Importando o logo

export const generateQuotationPDF = async (
  items: CartItem[],
  customerPhone: string,
  prize: string,
  competitorPrices: { competitorA: number; competitorB: number; savings: number }
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let yPos = 0;
  let pageCount = 1;

  // --- CORES DA MARCA ---
  const primaryColor = '#FF6B35'; // AEB Orange
  const darkGrayColor = '#333333';
  const lightGrayColor = '#F3F4F6';
  const textColor = '#1F2937';
  const mutedTextColor = '#6B7280';

  const addHeader = () => {
    // Fundo do cabeçalho
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Logo
    doc.addImage(aebLogo, 'PNG', margin, 5, 25, 25);

    // Título
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text('Orçamento Personalizado', pageWidth - margin, 22, { align: 'right' });
    yPos = 45;
  };
  
  const addFooter = (pageNumber: number) => {
    doc.setFontSize(9);
    doc.setTextColor(mutedTextColor);
    const footerText = 'AEB - A Elétrica do Brasil | www.aeb.com.br | (11) 91234-5678';
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Página ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (yPos + neededHeight > pageHeight - 25) { // Margem inferior maior
      addFooter(pageCount);
      doc.addPage();
      pageCount++;
      addHeader();
      addFooter(pageCount);
    }
  };

  addHeader();

  // Seção de Detalhes do Cliente
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setTextColor(textColor);
  doc.text(`Data do Orçamento:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date().toLocaleDateString('pt-BR')}`, margin + 45, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Contato do Cliente (WhatsApp):`, margin, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(customerPhone, margin + 62, yPos + 7);
  yPos += 20;

  // Seção de Itens
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGrayColor);
  doc.text('Itens do Orçamento', margin, yPos);
  yPos += 5;
  doc.setDrawColor(lightGrayColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  let totalValue = 0;
  
  items.forEach((item, index) => {
    const itemHeight = 70 + (item.config.oilType ? 8 : 0);
    checkPageBreak(itemHeight);
    yPos += 12;

    doc.setFillColor(lightGrayColor);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), itemHeight - 15, 3, 3, 'F');

    let itemY = yPos + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text(`${item.quantity}x Transformador ${item.config.type === 'dry' ? 'Seco' : 'a Óleo'}`, margin + 5, itemY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    const subtotalText = `R$ ${(item.finalPrice * item.quantity).toLocaleString('pt-BR')}`;
    doc.text(subtotalText, pageWidth - margin - 5, itemY, { align: 'right' });

    itemY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedTextColor);
    doc.text(`Potência: ${item.config.power} kVA | Material: ${item.config.material === 'copper' ? 'Cobre' : 'Alumínio'} | Fator K: ${item.config.factorK}`, margin + 5, itemY);
    if(item.config.customName) {
      itemY += 6;
      doc.text(`Nome Personalizado: ${item.config.customName}`, margin + 5, itemY);
    }

    yPos += itemHeight - 10;
    totalValue += item.finalPrice * item.quantity;
  });
  
  // Seção de Resumo e Análise de Preços
  checkPageBreak(120);
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGrayColor);
  doc.text('Análise de Preços', margin, yPos);
  yPos += 5;
  doc.setDrawColor(lightGrayColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Box de comparação
  doc.setFillColor(lightGrayColor);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 48, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(mutedTextColor);
  doc.text('Concorrente A:', margin + 5, yPos + 10);
  doc.text(`R$ ${competitorPrices.competitorA.toLocaleString('pt-BR')}`, pageWidth - margin - 5, yPos + 10, { align: 'right' });
  
  doc.text('Concorrente B:', margin + 5, yPos + 18);
  doc.text(`R$ ${competitorPrices.competitorB.toLocaleString('pt-BR')}`, pageWidth - margin - 5, yPos + 18, { align: 'right' });

  doc.setDrawColor(darkGrayColor);
  doc.line(margin + 5, yPos + 25, pageWidth - margin - 5, yPos + 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor);
  doc.text('Sua Economia na AEB:', margin + 5, yPos + 35);
  doc.setTextColor('#16A34A'); // Verde Economia
  doc.text(`R$ ${Math.round(competitorPrices.savings).toLocaleString('pt-BR')}`, pageWidth - margin - 5, yPos + 35, { align: 'right' });

  yPos += 58;

  // Box de Total e Prêmio
  doc.setFillColor(darkGrayColor);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#FFFFFF');
  doc.text('VALOR TOTAL:', margin + 5, yPos + 10);
  doc.text(`R$ ${totalValue.toLocaleString('pt-BR')}`, pageWidth - margin - 5, yPos + 10, { align: 'right' });
  
  doc.setFontSize(11);
  doc.text(`Prêmio Conquistado: ${prize}`, margin + 5, yPos + 18);

  yPos += 35;
  
  // Seção Final com QR Code
  checkPageBreak(50);
  const representativePhone = "5511912345678";
  const orderSummary = items.map(item => `${item.quantity}x Trafo ${item.config.type} ${item.config.power}kVA`).join(', ');
  const message = `Olá! Tenho interesse no orçamento que gerei no totem.\n\nResumo: ${orderSummary}\nValor Total: R$ ${totalValue.toLocaleString('pt-BR')}\nPrêmio: ${prize}\nContato: ${customerPhone}`;
  const whatsappUrl = `https://wa.me/${representativePhone}?text=${encodeURIComponent(message)}`;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(whatsappUrl, { width: 200, margin: 1 });
    doc.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - 45, yPos, 45, 45);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGrayColor);
    doc.text('Próximo Passo:', margin, yPos + 15);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedTextColor);
    doc.text('Aponte a câmera do seu celular no QR Code\npara falar com um de nossos representantes\ne finalizar seu pedido!', margin, yPos + 22);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  addFooter(pageCount);
  
  return doc.output('blob');
};