import * as XLSX from 'xlsx';
import { ServiceOrder } from '../types';

export const generateServiceOrderExcel = async (order: ServiceOrder) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // ═══════════════════════════════════════════════════════════
  // ESTRUTURA DO LAYOUT (IDÊNTICO AO PDF)
  // ═══════════════════════════════════════════════════════════
  const data: any[][] = [
    // LINHA 1: CABEÇALHO
    ['', 'TERRAPLENAGEM GUIMARÃES SERRA LTDA', '', '', 'ORDEM DE SERVIÇO INTERNA'],
    
    // LINHA 2: ENDEREÇO E NÚMERO
    ['', 'Endereço: Rod Celso Mello Azevedo nº24 321', '', '', `Nº ${order.order_number}`],
    
    // LINHA 3: CIDADE
    ['', 'Dom Silverio - BH/MG CEP: 31.985-203', '', '', ''],
    
    // LINHA 4: CNPJ
    ['', 'CNPJ: 00.514.564/0001-42 TELEFONE: 31.3495-9108', '', '', ''],
    
    // LINHA 5: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 6: DATA E HORA
    ['DATA:', order.date, '', 'HORA:', order.time],
    
    // LINHA 7: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 8: TÍTULO - DADOS DO EQUIPAMENTO
    ['DADOS DO EQUIPAMENTO', '', '', '', ''],
    
    // LINHA 9: VEÍCULO E EQUIPAMENTO
    ['VEÍCULO:', order.vehicle, 'EQUIPAMENTO:', order.equipment, ''],
    
    // LINHA 10: KM INICIAL E TAG
    ['KM INICIAL:', order.km_initial, 'TAG:', order.tag, ''],
    
    // LINHA 11: KM FINAL E HORÍMETRO
    ['KM FINAL:', order.km_final, 'HORÍMETRO:', order.horimeter, ''],
    
    // LINHA 12: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 13: TÍTULO - TIPO DE MANUTENÇÃO
    ['TIPO DE MANUTENÇÃO', '', '', '', ''],
    
    // LINHA 14: CHECKBOXES - LINHA 1
    [
      order.maintenance_type.includes('PREDITIVA') ? '☑ PREDITIVA' : '☐ PREDITIVA',
      order.maintenance_type.includes('PREVENTIVA') ? '☑ PREVENTIVA' : '☐ PREVENTIVA',
      order.maintenance_type.includes('CORRETIVA') ? '☑ CORRETIVA' : '☐ CORRETIVA',
      '', ''
    ],
    
    // LINHA 15: CHECKBOXES - LINHA 2
    [
      order.maintenance_type.includes('AVARIA') ? '☑ AVARIA' : '☐ AVARIA',
      order.maintenance_type.includes('OPORTUNIDADE') ? '☑ OPORTUNIDADE' : '☐ OPORTUNIDADE',
      order.maintenance_type.includes('OUTROS') ? '☑ OUTROS' : '☐ OUTROS',
      '', ''
    ],
    
    // LINHA 16: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 17: TÍTULO - DESCRIÇÃO DOS SERVIÇOS
    ['DESCRIÇÃO DOS SERVIÇOS', '', '', '', ''],
    
    // LINHAS 18-21: ÁREA DE DESCRIÇÃO (4 linhas)
    [order.service_description || '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    
    // LINHA 22: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 23: TÍTULO - PEÇAS APLICADAS
    ['PEÇAS APLICADAS', '', '', '', ''],
    
    // LINHAS 24-26: ÁREA DE PEÇAS (3 linhas)
    [order.parts_applied || '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    
    // LINHA 27: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 28: TÍTULO - OBSERVAÇÕES
    ['OBSERVAÇÕES', '', '', '', ''],
    
    // LINHAS 29-31: ÁREA DE OBSERVAÇÕES (3 linhas)
    [order.observations || '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    
    // LINHA 32: ESPAÇO
    ['', '', '', '', ''],
    
    // LINHA 33: TÍTULOS DE ASSINATURA
    ['MECÂNICO', '', 'RESPONSÁVEL OBRA', '', ''],
    
    // LINHA 34: NOMES
    [order.mechanic || '', '', order.responsible || '', '', ''],
    
    // LINHA 35: ESPAÇO PARA ASSINATURA
    ['', '', '', '', ''],
    
    // LINHA 36: LINHA DE ASSINATURA
    ['_______________________', '', '________________________', '', ''],
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // ═══════════════════════════════════════════════════════════
  // CONFIGURAR LARGURAS DAS COLUNAS
  // ═══════════════════════════════════════════════════════════
  ws['!cols'] = [
    { wch: 25 },  // Coluna A - Labels e Logo
    { wch: 30 },  // Coluna B - Dados
    { wch: 25 },  // Coluna C - Labels
    { wch: 30 },  // Coluna D - Dados
    { wch: 20 },  // Coluna E - Número OSI
  ];

  // ═══════════════════════════════════════════════════════════
  // CONFIGURAR ALTURAS DAS LINHAS
  // ═══════════════════════════════════════════════════════════
  ws['!rows'] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0 || i === 1 || i === 2 || i === 3) {
      // Cabeçalho maior
      ws['!rows'][i] = { hpt: 20 };
    } else if (i === 7 || i === 12 || i === 16 || i === 22 || i === 27 || i === 32) {
      // Títulos de seção
      ws['!rows'][i] = { hpt: 18 };
    } else if (i >= 17 && i <= 20) {
      // Área de descrição
      ws['!rows'][i] = { hpt: 30 };
    } else if (i >= 23 && i <= 25) {
      // Área de peças
      ws['!rows'][i] = { hpt: 25 };
    } else if (i >= 28 && i <= 30) {
      // Área de observações
      ws['!rows'][i] = { hpt: 25 };
    } else if (i >= 33 && i <= 35) {
      // Área de assinaturas
      ws['!rows'][i] = { hpt: 22 };
    } else {
      ws['!rows'][i] = { hpt: 16 };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // APLICAR ESTILOS E BORDAS
  // ═══════════════════════════════════════════════════════════
  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };

  const boldCenter = {
    font: { bold: true },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: borderStyle,
  };

  const bold = {
    font: { bold: true },
    border: borderStyle,
  };

  const normal = {
    border: borderStyle,
    alignment: { vertical: 'top', wrapText: true },
  };

  // Aplicar estilos a células específicas
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      
      if (!ws[cell_address]) {
        ws[cell_address] = { v: '' };
      }
      
      // Cabeçalho (linhas 0-3)
      if (R <= 3) {
        if (C === 0) {
          ws[cell_address].s = bold; // Logo
        } else if (C === 4) {
          ws[cell_address].s = boldCenter; // Número OSI
        } else {
          ws[cell_address].s = bold;
        }
      }
      // Títulos de seção (centralizados e negrito)
      else if (R === 7 || R === 12 || R === 16 || R === 22 || R === 27) {
        ws[cell_address].s = boldCenter;
      }
      // Labels (negrito)
      else if (C === 0 || C === 2) {
        ws[cell_address].s = bold;
      }
      // Resto (normal com bordas)
      else {
        ws[cell_address].s = normal;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // MESCLAR CÉLULAS
  // ═══════════════════════════════════════════════════════════
  ws['!merges'] = [
    // Cabeçalho - Nome da empresa (linhas 0-3, colunas B-D)
    { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } }, // Linha 1: Nome
    { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } }, // Linha 2: Endereço
    { s: { r: 2, c: 1 }, e: { r: 2, c: 3 } }, // Linha 3: Cidade
    { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } }, // Linha 4: CNPJ
    
    // Número OSI (linhas 0-3, coluna E)
    { s: { r: 0, c: 4 }, e: { r: 3, c: 4 } },
    
    // Títulos de seção (todas as colunas)
    { s: { r: 7, c: 0 }, e: { r: 7, c: 4 } },  // DADOS DO EQUIPAMENTO
    { s: { r: 12, c: 0 }, e: { r: 12, c: 4 } }, // TIPO DE MANUTENÇÃO
    { s: { r: 16, c: 0 }, e: { r: 16, c: 4 } }, // DESCRIÇÃO DOS SERVIÇOS
    { s: { r: 22, c: 0 }, e: { r: 22, c: 4 } }, // PEÇAS APLICADAS
    { s: { r: 27, c: 0 }, e: { r: 27, c: 4 } }, // OBSERVAÇÕES
    
    // Descrição (todas as colunas, linhas 17-20)
    { s: { r: 17, c: 0 }, e: { r: 20, c: 4 } },
    
    // Peças (todas as colunas, linhas 23-25)
    { s: { r: 23, c: 0 }, e: { r: 25, c: 4 } },
    
    // Observações (todas as colunas, linhas 28-30)
    { s: { r: 28, c: 0 }, e: { r: 30, c: 4 } },
    
    // Assinaturas
    { s: { r: 33, c: 0 }, e: { r: 33, c: 1 } }, // MECÂNICO
    { s: { r: 33, c: 2 }, e: { r: 33, c: 4 } }, // RESPONSÁVEL
    { s: { r: 34, c: 0 }, e: { r: 34, c: 1 } }, // Nome mecânico
    { s: { r: 34, c: 2 }, e: { r: 34, c: 4 } }, // Nome responsável
    { s: { r: 35, c: 0 }, e: { r: 35, c: 1 } }, // Espaço assinatura
    { s: { r: 35, c: 2 }, e: { r: 35, c: 4 } }, // Espaço assinatura
    { s: { r: 36, c: 0 }, e: { r: 36, c: 1 } }, // Linha assinatura
    { s: { r: 36, c: 2 }, e: { r: 36, c: 4 } }, // Linha assinatura
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Ordem de Serviço');

  // Generate filename
  const filename = `OSI_${order.order_number}_${order.date.replace(/-/g, '')}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};
