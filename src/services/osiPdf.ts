import jsPDF from 'jspdf';
import { OSIData } from '../types';
import { photoRefToBase64 } from './photoUtils';

// Função para carregar a logo
const loadLogo = async (): Promise<string | null> => {
  try {
    const response = await fetch('/logo.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
    return null;
  }
};

export const generateOSIPDF = async (osi: OSIData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);

  // Carregar e adicionar logo
  const logoData = await loadLogo();
  if (logoData) {
    try {
      // Logo no canto superior esquerdo (20x20mm)
      doc.addImage(logoData, 'PNG', margin, 10, 20, 20);
    } catch (error) {
      console.error('Erro ao adicionar logo ao PDF:', error);
      // Fallback: círculo laranja
      doc.setFillColor(255, 165, 0);
      doc.circle(20, 20, 10, 'F');
    }
  } else {
    // Fallback: círculo laranja se não conseguir carregar a logo
    doc.setFillColor(255, 165, 0);
    doc.circle(20, 20, 10, 'F');
  }
  
  // Cabeçalho da empresa (ao lado da logo)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TERRAPLANAGEM GUIMARÃES SERRA LTDA', 35, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Endereço: Rod Celso Mello Azevedo nº24 321', 35, 20);
  doc.text('Dom Silverio - BH/MG  CEP: 31.985-203', 35, 24);
  doc.text('CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', 35, 28);

  // Título e Número da OS (sem quadrado)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEM DE SERVIÇO INTERNA', pageWidth - 55, 17);
  doc.setFontSize(16);
  doc.text(`Nº ${osi.order_number}`, pageWidth - 35, 27, { align: 'center' });

  // Data e Hora
  let yPos = 40;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`DATA:    ${osi.date}`, margin, yPos);
  doc.text(`HORA:`, pageWidth - 60, yPos);
  doc.text(osi.time, pageWidth - 30, yPos);

  // Dados do Veículo
  yPos += 10;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.setDrawColor(0);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO VEÍCULO', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Linha 1: Veículo
  doc.rect(margin, yPos, contentWidth, 8, 'S');
  doc.text('VEÍCULO:', margin + 2, yPos + 5);
  doc.text(osi.vehicle || '', margin + 25, yPos + 5);

  // Linha 2: KM Inicial e KM Final
  yPos += 8;
  const col1Width = contentWidth * 0.5;
  const col2Width = contentWidth * 0.5;
  
  doc.rect(margin, yPos, col1Width, 8, 'S');
  doc.text('KM INICIAL:', margin + 2, yPos + 5);
  doc.text(osi.km_inicial || '', margin + 25, yPos + 5);
  
  doc.rect(margin + col1Width, yPos, col2Width, 8, 'S');
  doc.text('KM FINAL:', margin + col1Width + 2, yPos + 5);
  doc.text(osi.km_final || '', margin + col1Width + 25, yPos + 5);

  // Dados do Equipamento
  yPos += 12;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO EQUIPAMENTO', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  
  // Linha 1: Equipamento
  doc.rect(margin, yPos, contentWidth, 8, 'S');
  doc.text('EQUIPAMENTO:', margin + 2, yPos + 5);
  doc.text(osi.equipment || '', margin + 35, yPos + 5);

  // Linha 2: TAG e Horímetro
  yPos += 8;
  doc.rect(margin, yPos, col1Width, 8, 'S');
  doc.text('TAG:', margin + 2, yPos + 5);
  doc.text(osi.tag || '', margin + 15, yPos + 5);
  
  doc.rect(margin + col1Width, yPos, col2Width, 8, 'S');
  doc.text('HORÍMETRO:', margin + col1Width + 2, yPos + 5);
  doc.text(osi.horimeter || '', margin + col1Width + 30, yPos + 5);

  // Tipo de Manutenção
  yPos += 12;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.setFont('helvetica', 'bold');
  doc.text('TIPO DE MANUTENÇÃO', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  const checkboxSize = 5;
  const checkboxSpacing = contentWidth / 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  const maintenanceTypes = [
    { label: 'PREDITIVA', value: osi.maintenance_type.preditiva },
    { label: 'PREVENTIVA', value: osi.maintenance_type.preventiva },
    { label: 'CORRETIVA', value: osi.maintenance_type.corretiva },
    { label: 'AVARIA', value: osi.maintenance_type.avaria },
    { label: 'OPORTUNIDADE', value: osi.maintenance_type.oportunidade },
    { label: 'OUTROS', value: osi.maintenance_type.outros }
  ];

  maintenanceTypes.forEach((type, index) => {
    const xPos = margin + (index * checkboxSpacing);
    doc.rect(xPos, yPos, checkboxSize, checkboxSize, 'S');
    if (type.value) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('O', xPos + 1.2, yPos + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }
    doc.text(type.label, xPos + checkboxSize + 2, yPos + 4);
  });

  // Descrição dos Serviços
  yPos += 12;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.text('DESCRIÇÃO DOS SERVIÇOS', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  const servicesHeight = 40;
  doc.rect(margin, yPos, contentWidth, servicesHeight, 'S');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  const servicesLines = doc.splitTextToSize(osi.services_description || '', contentWidth - 4);
  doc.text(servicesLines, margin + 2, yPos + 5);

  // Peças Aplicadas
  yPos += servicesHeight + 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.text('PEÇAS APLICADAS', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  const partsHeight = 20;
  doc.rect(margin, yPos, contentWidth, partsHeight, 'S');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  const partsLines = doc.splitTextToSize(osi.parts_applied || '', contentWidth - 4);
  doc.text(partsLines, margin + 2, yPos + 5);

  // Observações
  yPos += partsHeight + 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.text('OBSERVAÇÕES', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  const obsHeight = 30;
  doc.rect(margin, yPos, contentWidth, obsHeight, 'S');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  const obsLines = doc.splitTextToSize(osi.observations || '', contentWidth - 4);
  doc.text(obsLines, margin + 2, yPos + 5);

  // Fotos (se existirem) - converter URLs do bucket para base64
  if (osi.photos && osi.photos.length > 0) {
    const photosBase64 = await Promise.all(
      osi.photos.map(async (photo) => (await photoRefToBase64(photo)) || photo)
    );

    // Configuração das fotos: 2 colunas, 3 linhas por página = 6 fotos por página
    const photosPerPage = 6;
    const photosPerRow = 2; // 2 colunas
    const rowsPerPage = 3; // 3 linhas por página
    const photoMargin = 5;
    const photoSpacing = 5;
    const photoWidth = (contentWidth - photoMargin) / photosPerRow;
    const photoHeight = 60;
    const rowHeight = photoHeight + photoSpacing;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Processar fotos página por página
    for (let pageIndex = 0; pageIndex < Math.ceil(photosBase64.length / photosPerPage); pageIndex++) {
      // Criar nova página para fotos (exceto a primeira, se couber na página atual)
      if (pageIndex === 0) {
        yPos += obsHeight + 10;
        
        // Verificar se precisa de uma nova página
        if (yPos + (rowsPerPage * rowHeight) + 20 > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
      } else {
        doc.addPage();
        yPos = margin;
      }
      
      // Título da seção de fotos (apenas na primeira página de fotos)
      if (pageIndex === 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
        doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
        doc.text('FOTOS', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
      }
      
      // Calcular quais fotos vão nesta página
      const startIndex = pageIndex * photosPerPage;
      const endIndex = Math.min(startIndex + photosPerPage, photosBase64.length);
      const photosInThisPage = endIndex - startIndex;
      const rowsInThisPage = Math.ceil(photosInThisPage / photosPerRow);
      
      // Adicionar fotos desta página
      for (let i = startIndex; i < endIndex; i++) {
        const photoIndex = i - startIndex; // Índice dentro da página (0-5)
        const col = photoIndex % photosPerRow; // Coluna (0 ou 1)
        const row = Math.floor(photoIndex / photosPerRow); // Linha (0, 1 ou 2)
        
        const xPos = margin + (col * (photoWidth + photoMargin));
        const currentYPos = yPos + (row * rowHeight);
        
        try {
          const imgData = photosBase64[i];
          const format = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(imgData, format, xPos, currentYPos, photoWidth, photoHeight);
          
          // Adicionar número da foto
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.text(`Foto ${i + 1}`, xPos + photoWidth / 2, currentYPos + photoHeight + 3, { align: 'center' });
        } catch (error) {
          console.error(`Erro ao adicionar foto ${i + 1}:`, error);
        }
      }
      
      // Atualizar yPos para a próxima seção (apenas na última página de fotos)
      if (pageIndex === Math.ceil(photosBase64.length / photosPerPage) - 1) {
        yPos += rowsInThisPage * rowHeight + 5;
      }
    }
  }

  // Assinaturas
  yPos += obsHeight + 15;
  
  // Verificar se precisa de uma nova página para as assinaturas
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  const signatureWidth = (contentWidth - 10) / 2;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MECÂNICO', margin + signatureWidth / 2, yPos, { align: 'center' });
  doc.text('RESPONSÁVEL OBRA', margin + signatureWidth + 10 + signatureWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.line(margin, yPos, margin + signatureWidth, yPos);
  doc.line(margin + signatureWidth + 10, yPos, margin + signatureWidth + 10 + signatureWidth, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(osi.mechanic || '', margin + signatureWidth / 2, yPos, { align: 'center' });
  doc.text(osi.responsible || '', margin + signatureWidth + 10 + signatureWidth / 2, yPos, { align: 'center' });

  // Salvar PDF (apenas download local)
  const fileName = `OSI_${osi.order_number}_${new Date().toISOString().split('T')[0]}.pdf`;

  try {
    doc.save(fileName);
  } catch (error) {
    console.error('Erro ao salvar PDF:', error);
    try {
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (fallbackError) {
      console.error('Erro no método alternativo de download:', fallbackError);
      throw new Error('Não foi possível gerar o PDF. Tente novamente.');
    }
  }
};
