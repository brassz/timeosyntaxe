import jsPDF from 'jspdf';
import { ServiceOrder } from '../types';

export const generateServiceOrderPDF = async (order: ServiceOrder) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Header with border
  pdf.setLineWidth(0.5);
  pdf.rect(10, 10, pageWidth - 20, 35);

  // Logo placeholder (you can add actual logo if available)
  pdf.setFontSize(8);
  pdf.text('[LOGO]', 15, 20);

  // Company info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TERRAPLENAGEM GUIMARÃES SERRA LTDA', 40, 18);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Endereço: Rod Celso Mello Azevedo nº24 321', 40, 23);
  pdf.text('Dom Silverio - BH/MG CEP: 31.985-203', 40, 27);
  pdf.text('CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', 40, 31);

  // Order number box
  pdf.rect(pageWidth - 50, 10, 40, 35);
  pdf.setFontSize(7);
  pdf.text('ORDEM DE SERVIÇO', pageWidth - 48, 18);
  pdf.text('INTERNA', pageWidth - 43, 22);
  pdf.setFontSize(10);
  pdf.text('Nº', pageWidth - 35, 30);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(order.order_number || '---'), pageWidth - 30, 40, { align: 'center' });

  yPos = 50;

  // Date and Time
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.rect(10, yPos, pageWidth - 20, 10);
  pdf.text(`DATA: ${order.date}`, 15, yPos + 6);
  pdf.text(`HORA: ${order.time}`, pageWidth / 2, yPos + 6);

  yPos += 15;

  // Equipment data
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text('DADOS DO EQUIPAMENTO', pageWidth / 2, yPos + 5, { align: 'center' });
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  // Vehicle and Equipment
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text(`VEÍCULO: ${order.vehicle}`, 15, yPos + 5);
  pdf.text(`EQUIPAMENTO: ${order.equipment}`, pageWidth / 2 + 5, yPos + 5);
  yPos += 8;

  // KM Initial and TAG
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text(`KM INICIAL: ${order.km_initial}`, 15, yPos + 5);
  pdf.text(`TAG: ${order.tag}`, pageWidth / 2 + 5, yPos + 5);
  yPos += 8;

  // KM Final and Horimeter
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text(`KM FINAL: ${order.km_final}`, 15, yPos + 5);
  pdf.text(`HORÍMETRO: ${order.horimeter}`, pageWidth / 2 + 5, yPos + 5);
  yPos += 13;

  // Maintenance Type
  pdf.setFont('helvetica', 'bold');
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text('TIPO DE MANUTENÇÃO', pageWidth / 2, yPos + 5, { align: 'center' });
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  const maintenanceTypes = ['PREDITIVA', 'PREVENTIVA', 'CORRETIVA', 'AVARIA', 'OPORTUNIDADE', 'OUTROS'];
  let xOffset = 15;
  
  maintenanceTypes.forEach((type, index) => {
    if (index === 3) {
      yPos += 8;
      xOffset = 15;
    }
    
    const isChecked = order.maintenance_type.includes(type);
    pdf.rect(xOffset, yPos, 4, 4);
    if (isChecked) {
      pdf.text('X', xOffset + 1, yPos + 3);
    }
    pdf.text(type, xOffset + 6, yPos + 3);
    xOffset += (pageWidth - 20) / 3;
  });
  yPos += 13;

  // Service Description
  pdf.setFont('helvetica', 'bold');
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text('DESCRIÇÃO DOS SERVIÇOS', pageWidth / 2, yPos + 5, { align: 'center' });
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const descLines = pdf.splitTextToSize(order.service_description || '', pageWidth - 30);
  const descHeight = Math.max(descLines.length * 5, 30);
  pdf.rect(10, yPos, pageWidth - 20, descHeight);
  pdf.text(descLines, 15, yPos + 5);
  yPos += descHeight + 5;

  // Parts Applied
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text('PEÇAS APLICADAS', pageWidth / 2, yPos + 5, { align: 'center' });
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const partsLines = pdf.splitTextToSize(order.parts_applied || '', pageWidth - 30);
  const partsHeight = Math.max(partsLines.length * 5, 20);
  pdf.rect(10, yPos, pageWidth - 20, partsHeight);
  pdf.text(partsLines, 15, yPos + 5);
  yPos += partsHeight + 5;

  // Observations
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.rect(10, yPos, pageWidth - 20, 8);
  pdf.text('OBSERVAÇÕES', pageWidth / 2, yPos + 5, { align: 'center' });
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const obsLines = pdf.splitTextToSize(order.observations || '', pageWidth - 30);
  const obsHeight = Math.max(obsLines.length * 5, 25);
  pdf.rect(10, yPos, pageWidth - 20, obsHeight);
  pdf.text(obsLines, 15, yPos + 5);
  yPos += obsHeight + 10;

  // Signatures
  const sigWidth = (pageWidth - 30) / 2;
  pdf.rect(10, yPos, sigWidth, 30);
  pdf.rect(10 + sigWidth + 10, yPos, sigWidth, 30);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('MECÂNICO', 10 + sigWidth / 2, yPos + 5, { align: 'center' });
  pdf.text('RESPONSÁVEL OBRA', 10 + sigWidth + 10 + sigWidth / 2, yPos + 5, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(order.mechanic || '', 10 + sigWidth / 2, yPos + 12, { align: 'center' });
  pdf.text(order.responsible || '', 10 + sigWidth + 10 + sigWidth / 2, yPos + 12, { align: 'center' });

  // Signature lines
  pdf.line(15, yPos + 25, 10 + sigWidth - 5, yPos + 25);
  pdf.line(15 + sigWidth + 10, yPos + 25, 10 + sigWidth + 10 + sigWidth - 5, yPos + 25);

  // Generate filename
  const filename = `OSI_${order.order_number}_${order.date.replace(/-/g, '')}.pdf`;

  // Save PDF
  pdf.save(filename);
};
