import jsPDF from 'jspdf';
import { ChecklistData } from '../types';
import { getPhoto } from './storage';

export const generatePDF = async (checklist: ChecklistData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Cabeçalho com logo
  doc.setFillColor(255, 204, 0); // Amarelo
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Tentar adicionar a logo
  try {
    const logoResponse = await fetch('/logo.png');
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
    
    // Adicionar logo no PDF (canto esquerdo)
    doc.addImage(logoBase64, 'PNG', margin, 8, 24, 24);
    
    // Textos ao lado da logo
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Terraplanagem Guimarães', margin + 30, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Checklist de Máquinas Pesadas', margin + 30, 28);
  } catch (error) {
    // Fallback se a logo não carregar
    console.warn('Logo não carregada, usando texto apenas', error);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Terraplanagem Guimarães', margin, 18);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Checklist de Máquinas Pesadas', margin, 28);
  }

  yPos = 50;

  // Informações principais
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const infoLines = [
    `Data/Hora: ${new Date(checklist.date).toLocaleString('pt-BR')}`,
    `Inspecionado por: ${checklist.operator}`,
    `TAG: ${checklist.tag || '-'}`,
    `Máquina: ${checklist.machine}`,
    `Local: ${checklist.location}`,
    `Horímetro: ${checklist.horimeter}`,
    ...(checklist.mileage ? [`Quilometragem: ${checklist.mileage}`] : []),
  ];

  infoLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Tabela de checklist
  doc.setFillColor(40, 40, 40);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', margin + 2, yPos + 5.5);
  doc.text('STATUS', margin + 90, yPos + 5.5);
  doc.text('OBSERVAÇÃO', margin + 115, yPos + 5.5);

  yPos += 10;

  // Itens do checklist
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  for (const item of checklist.items) {
    addNewPageIfNeeded(20);

    // Linha do item
    doc.setFillColor(item.status === 'N.C' ? 255 : 245, 245, 245);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');

    doc.setFontSize(9);
    doc.text(item.name, margin + 2, yPos + 5.5);
    
    // Status com cor
    const statusText = item.status || '-';
    if (item.status === 'C') {
      doc.setTextColor(0, 150, 0);
    } else if (item.status === 'N.C') {
      doc.setTextColor(200, 0, 0);
    } else if (item.status === 'N.A') {
      doc.setTextColor(100, 100, 100);
    }
    doc.text(statusText, margin + 90, yPos + 5.5);
    doc.setTextColor(0, 0, 0);

    const obs = item.observation || '-';
    const obsWrapped = doc.splitTextToSize(obs, 65);
    doc.text(obsWrapped, margin + 115, yPos + 5.5);

    yPos += 10;

    // Fotos do item
    if (item.photos.length > 0) {
      addNewPageIfNeeded(60);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fotos (${item.photos.length}):`, margin + 5, yPos);
      yPos += 5;

      const photosPerRow = 3;
      const photoWidth = 50;
      const photoHeight = 40;
      const photoSpacing = 5;

      for (let i = 0; i < item.photos.length; i++) {
        const photo = await getPhoto(item.photos[i]);
        if (!photo) continue;

        const col = i % photosPerRow;
        const row = Math.floor(i / photosPerRow);

        if (col === 0 && row > 0) {
          addNewPageIfNeeded(photoHeight + photoSpacing);
          if (yPos === margin) {
            // Nova página, reajustar
          }
        }

        const xPos = margin + 10 + col * (photoWidth + photoSpacing);
        const currentYPos = yPos + row * (photoHeight + photoSpacing);

        try {
          doc.addImage(photo.data, 'JPEG', xPos, currentYPos, photoWidth, photoHeight);
        } catch (error) {
          console.error('Erro ao adicionar foto:', error);
        }
      }

      const totalRows = Math.ceil(item.photos.length / photosPerRow);
      yPos += totalRows * (photoHeight + photoSpacing) + 5;
    }

    yPos += 2;
  }

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${totalPages} - Gerado em ${new Date().toLocaleString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Salvar PDF
  const fileName = `Checklist_${checklist.machine}_${new Date(checklist.date).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
