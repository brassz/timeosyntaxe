import * as XLSX from 'xlsx';
import { OSIData } from '../types';

export const generateOSIExcel = (osi: OSIData): void => {
  // Criar estrutura similar ao formulário PDF
  const data = [
    ['TERRAPLANAGEM GUIMARÃES SERRA LTDA'],
    ['Endereço: Rod Celso Mello Azevedo nº24 321'],
    ['Dom Silverio - BH/MG  CEP: 31.985-203'],
    ['CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108'],
    [],
    ['ORDEM DE SERVIÇO INTERNA', '', '', '', `Nº ${osi.order_number}`],
    [],
    ['DATA:', osi.date, '', 'HORA:', osi.time],
    [],
    ['DADOS DO EQUIPAMENTO'],
    ['VEÍCULO:', osi.vehicle || '', 'EQUIPAMENTO:', osi.equipment || ''],
    ['KM INICIAL:', osi.km_inicial || '', 'TAG:', osi.tag || ''],
    ['KM FINAL:', osi.km_final || '', 'HORÍMETRO:', osi.horimeter || ''],
    [],
    ['TIPO DE MANUTENÇÃO'],
    [
      osi.maintenance_type.preditiva ? '☑' : '☐', 'PREDITIVA',
      osi.maintenance_type.preventiva ? '☑' : '☐', 'PREVENTIVA',
      osi.maintenance_type.corretiva ? '☑' : '☐', 'CORRETIVA'
    ],
    [
      osi.maintenance_type.avaria ? '☑' : '☐', 'AVARIA',
      osi.maintenance_type.oportunidade ? '☑' : '☐', 'OPORTUNIDADE',
      osi.maintenance_type.outros ? '☑' : '☐', 'OUTROS'
    ],
    [],
    ['DESCRIÇÃO DOS SERVIÇOS'],
    [osi.services_description || ''],
    [''],
    [''],
    [''],
    [''],
    ['PEÇAS APLICADAS'],
    [osi.parts_applied || ''],
    [''],
    [''],
    ['OBSERVAÇÕES'],
    [osi.observations || ''],
    [''],
    [''],
    [''],
    ['MECÂNICO', '', '', 'RESPONSÁVEL OBRA'],
    ['_____________________', '', '', '_____________________'],
    [osi.mechanic || '', '', '', osi.responsible || '']
  ];

  // Criar workbook e worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Definir larguras das colunas
  ws['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 }
  ];

  // Mesclar células para o cabeçalho
  if (!ws['!merges']) ws['!merges'] = [];
  
  ws['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Título empresa
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Endereço
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, // Cidade
    { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }, // CNPJ
    { s: { r: 9, c: 0 }, e: { r: 9, c: 4 } }, // DADOS DO EQUIPAMENTO
    { s: { r: 14, c: 0 }, e: { r: 14, c: 4 } }, // TIPO DE MANUTENÇÃO
    { s: { r: 18, c: 0 }, e: { r: 18, c: 4 } }, // DESCRIÇÃO DOS SERVIÇOS
    { s: { r: 19, c: 0 }, e: { r: 23, c: 4 } }, // Área de descrição
    { s: { r: 24, c: 0 }, e: { r: 24, c: 4 } }, // PEÇAS APLICADAS
    { s: { r: 25, c: 0 }, e: { r: 27, c: 4 } }, // Área de peças
    { s: { r: 28, c: 0 }, e: { r: 28, c: 4 } }, // OBSERVAÇÕES
    { s: { r: 29, c: 0 }, e: { r: 32, c: 4 } }  // Área de observações
  );

  // Criar workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'OSI');

  // Salvar arquivo
  XLSX.writeFile(wb, `OSI_${osi.order_number}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
