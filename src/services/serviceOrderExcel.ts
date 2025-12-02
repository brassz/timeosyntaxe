import * as XLSX from 'xlsx';
import { ServiceOrder } from '../types';

export const generateServiceOrderExcel = async (order: ServiceOrder) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare data
  const data = [
    ['TERRAPLENAGEM GUIMARÃES SERRA LTDA'],
    ['Endereço: Rod Celso Mello Azevedo nº24 321'],
    ['Dom Silverio - BH/MG CEP: 31.985-203'],
    ['CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108'],
    [''],
    ['ORDEM DE SERVIÇO INTERNA', `Nº ${order.order_number}`],
    [''],
    ['DATA:', order.date, 'HORA:', order.time],
    [''],
    ['DADOS DO EQUIPAMENTO'],
    ['VEÍCULO:', order.vehicle, 'EQUIPAMENTO:', order.equipment],
    ['KM INICIAL:', order.km_initial, 'TAG:', order.tag],
    ['KM FINAL:', order.km_final, 'HORÍMETRO:', order.horimeter],
    [''],
    ['TIPO DE MANUTENÇÃO'],
    [order.maintenance_type.join(', ')],
    [''],
    ['DESCRIÇÃO DOS SERVIÇOS'],
    [order.service_description],
    [''],
    ['PEÇAS APLICADAS'],
    [order.parts_applied],
    [''],
    ['OBSERVAÇÕES'],
    [order.observations],
    [''],
    ['MECÂNICO:', order.mechanic],
    ['RESPONSÁVEL OBRA:', order.responsible],
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 20 },
    { wch: 30 },
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Ordem de Serviço');

  // Generate filename
  const filename = `OSI_${order.order_number}_${order.date.replace(/-/g, '')}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};
