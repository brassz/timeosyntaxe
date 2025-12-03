import jsPDF from 'jspdf';
import { OSIData } from '../types';

export const generateOSIPDF = async (osi: OSIData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);

  // Logo e Cabeçalho
  doc.setFillColor(255, 165, 0); // Laranja
  doc.circle(30, 20, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TERRAPLANAGEM GUIMARÃES SERRA LTDA', 45, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Endereço: Rod Celso Mello Azevedo nº24 321', 45, 20);
  doc.text('Dom Silverio - BH/MG  CEP: 31.985-203', 45, 24);
  doc.text('CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', 45, 28);

  // Título e Número da OS
  doc.setFillColor(240, 240, 240);
  doc.rect(pageWidth - 60, 10, 50, 20, 'F');
  doc.setDrawColor(0);
  doc.rect(pageWidth - 60, 10, 50, 20, 'S');
  
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

  // Dados do Equipamento
  yPos += 10;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  doc.setDrawColor(0);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'S');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO EQUIPAMENTO', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Linha 1: Veículo e Equipamento
  const col1Width = contentWidth * 0.5;
  const col2Width = contentWidth * 0.5;
  
  doc.rect(margin, yPos, col1Width, 8, 'S');
  doc.text('VEÍCULO:', margin + 2, yPos + 5);
  doc.text(osi.vehicle || '', margin + 25, yPos + 5);
  
  doc.rect(margin + col1Width, yPos, col2Width, 8, 'S');
  doc.text('EQUIPAMENTO:', margin + col1Width + 2, yPos + 5);
  doc.text(osi.equipment || '', margin + col1Width + 35, yPos + 5);

  // Linha 2: KM Inicial e TAG
  yPos += 8;
  doc.rect(margin, yPos, col1Width, 8, 'S');
  doc.text('KM INICIAL:', margin + 2, yPos + 5);
  doc.text(osi.km_inicial || '', margin + 25, yPos + 5);
  
  doc.rect(margin + col1Width, yPos, col2Width, 8, 'S');
  doc.text('TAG:', margin + col1Width + 2, yPos + 5);
  doc.text(osi.tag || '', margin + col1Width + 15, yPos + 5);

  // Linha 3: KM Final e Horímetro
  yPos += 8;
  doc.rect(margin, yPos, col1Width, 8, 'S');
  doc.text('KM FINAL:', margin + 2, yPos + 5);
  doc.text(osi.km_final || '', margin + 25, yPos + 5);
  
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
      doc.setFontSize(10);
      doc.text('✓', xPos + 1.5, yPos + 4);
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

  // Assinaturas
  yPos += obsHeight + 15;
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

  // Salvar PDF
  doc.save(`OSI_${osi.order_number}_${new Date().toISOString().split('T')[0]}.pdf`);
};
