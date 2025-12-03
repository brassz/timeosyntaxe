import ExcelJS from 'exceljs';
import { OSIOrdem } from '../types';
import { uploadFile } from './osi';

export const generateExcel = async (ordem: OSIOrdem): Promise<string> => {
  try {
    // Criar workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ordem de Serviço');

    // Configurar largura das colunas
    worksheet.columns = [
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 }
    ];

    // Estilo do cabeçalho principal
    const headerStyle = {
      font: { bold: true, size: 16, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF667EEA' } },
      alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      border: {
        top: { style: 'thin' as const },
        left: { style: 'thin' as const },
        bottom: { style: 'thin' as const },
        right: { style: 'thin' as const }
      }
    };

    // Estilo de labels
    const labelStyle = {
      font: { bold: true, size: 11, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF667EEA' } },
      alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      border: {
        top: { style: 'thin' as const },
        left: { style: 'thin' as const },
        bottom: { style: 'thin' as const },
        right: { style: 'thin' as const }
      }
    };

    // Estilo de valores
    const valueStyle = {
      font: { size: 10 },
      alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
      border: {
        top: { style: 'thin' as const },
        left: { style: 'thin' as const },
        bottom: { style: 'thin' as const },
        right: { style: 'thin' as const }
      }
    };

    // Linha 1: Logo/Título
    let currentRow = 1;
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = 'TERRAPLANAGEM GUIMARÃES';
    titleCell.style = headerStyle;
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    worksheet.getRow(currentRow).height = 30;

    // Linha 2: Subtítulo
    currentRow++;
    const subtitleCell = worksheet.getCell(`A${currentRow}`);
    subtitleCell.value = 'ORDEM DE SERVIÇO INTERNA - OSI';
    subtitleCell.style = {
      ...headerStyle,
      font: { bold: true, size: 14, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDF2F7' } }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    worksheet.getRow(currentRow).height = 25;

    // Linha 3: Número da OS
    currentRow++;
    const osCell = worksheet.getCell(`A${currentRow}`);
    osCell.value = `Nº OS: ${ordem.numero_os || 'N/A'}`;
    osCell.style = {
      ...valueStyle,
      alignment: { horizontal: 'right', vertical: 'middle' },
      font: { bold: true, size: 11 }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    // Espaço
    currentRow++;

    // Informações básicas - Labels
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Data';
    worksheet.getCell(`B${currentRow}`).value = 'Hora';
    worksheet.getCell(`C${currentRow}`).value = 'TAG';
    worksheet.getCell(`D${currentRow}`).value = 'Horímetro';
    for (let col = 1; col <= 4; col++) {
      worksheet.getCell(currentRow, col).style = labelStyle;
    }

    // Informações básicas - Valores
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.data || '';
    worksheet.getCell(`B${currentRow}`).value = ordem.hora || '';
    worksheet.getCell(`C${currentRow}`).value = ordem.tag || '';
    worksheet.getCell(`D${currentRow}`).value = ordem.horimetro || '';
    for (let col = 1; col <= 4; col++) {
      worksheet.getCell(currentRow, col).style = valueStyle;
    }

    // Veículo e Equipamento - Labels
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Veículo';
    worksheet.getCell(`C${currentRow}`).value = 'Equipamento';
    worksheet.getCell(`A${currentRow}`).style = labelStyle;
    worksheet.getCell(`C${currentRow}`).style = labelStyle;
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    // Veículo e Equipamento - Valores
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.veiculo || '';
    worksheet.getCell(`C${currentRow}`).value = ordem.equipamento || '';
    worksheet.getCell(`A${currentRow}`).style = valueStyle;
    worksheet.getCell(`C${currentRow}`).style = valueStyle;
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    // KM - Labels
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'KM Inicial';
    worksheet.getCell(`C${currentRow}`).value = 'KM Final';
    worksheet.getCell(`A${currentRow}`).style = labelStyle;
    worksheet.getCell(`C${currentRow}`).style = labelStyle;
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    // KM - Valores
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.km_inicial || '';
    worksheet.getCell(`C${currentRow}`).value = ordem.km_final || '';
    worksheet.getCell(`A${currentRow}`).style = valueStyle;
    worksheet.getCell(`C${currentRow}`).style = valueStyle;
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    // Espaço
    currentRow++;

    // Tipo de Manutenção
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'TIPO DE MANUTENÇÃO';
    worksheet.getCell(`A${currentRow}`).style = {
      ...labelStyle,
      alignment: { horizontal: 'left', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    currentRow++;
    const manutencoes = [
      `☐ Preditiva ${ordem.manut_preditiva ? '✓' : ''}`,
      `☐ Preventiva ${ordem.manut_preventiva ? '✓' : ''}`,
      `☐ Corretiva ${ordem.manut_corretiva ? '✓' : ''}`,
      `☐ Avaria ${ordem.manut_avaria ? '✓' : ''}`,
      `☐ Oportunidade ${ordem.manut_oportunidade ? '✓' : ''}`,
      `☐ Outros ${ordem.manut_outros ? '✓' : ''}`
    ];
    worksheet.getCell(`A${currentRow}`).value = manutencoes.join('  |  ');
    worksheet.getCell(`A${currentRow}`).style = {
      ...valueStyle,
      alignment: { horizontal: 'left', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    // Espaço
    currentRow++;

    // Descrição dos Serviços
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'DESCRIÇÃO DOS SERVIÇOS';
    worksheet.getCell(`A${currentRow}`).style = {
      ...labelStyle,
      alignment: { horizontal: 'left', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.descricao_servicos || '';
    worksheet.getCell(`A${currentRow}`).style = {
      ...valueStyle,
      alignment: { horizontal: 'left', vertical: 'top', wrapText: true }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    worksheet.getRow(currentRow).height = 60;

    // Espaço
    currentRow++;

    // Peças Aplicadas
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'PEÇAS APLICADAS';
    worksheet.getCell(`A${currentRow}`).style = {
      ...labelStyle,
      alignment: { horizontal: 'left', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.pecas_aplicadas || 'Nenhuma peça aplicada';
    worksheet.getCell(`A${currentRow}`).style = {
      ...valueStyle,
      alignment: { horizontal: 'left', vertical: 'top', wrapText: true }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    worksheet.getRow(currentRow).height = 60;

    // Espaço
    currentRow++;

    // Observações
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'OBSERVAÇÕES';
    worksheet.getCell(`A${currentRow}`).style = {
      ...labelStyle,
      alignment: { horizontal: 'left', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.observacoes || 'Sem observações';
    worksheet.getCell(`A${currentRow}`).style = {
      ...valueStyle,
      alignment: { horizontal: 'left', vertical: 'top', wrapText: true }
    };
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    worksheet.getRow(currentRow).height = 40;

    // Espaço
    currentRow += 2;

    // Assinaturas
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = '___________________________';
    worksheet.getCell(`C${currentRow}`).value = '___________________________';
    worksheet.getCell(`A${currentRow}`).style = { alignment: { horizontal: 'center', vertical: 'middle' } };
    worksheet.getCell(`C${currentRow}`).style = { alignment: { horizontal: 'center', vertical: 'middle' } };
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Mecânico';
    worksheet.getCell(`C${currentRow}`).value = 'Responsável Obra';
    worksheet.getCell(`A${currentRow}`).style = { 
      font: { bold: true, size: 10 },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    worksheet.getCell(`C${currentRow}`).style = { 
      font: { bold: true, size: 10 },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = ordem.mecanico || '';
    worksheet.getCell(`C${currentRow}`).value = ordem.responsavel || '';
    worksheet.getCell(`A${currentRow}`).style = { alignment: { horizontal: 'center', vertical: 'middle' } };
    worksheet.getCell(`C${currentRow}`).style = { alignment: { horizontal: 'center', vertical: 'middle' } };
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.mergeCells(`C${currentRow}:D${currentRow}`);

    // Gerar buffer do Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    // Upload para Supabase
    const fileName = `osi-${ordem.id || Date.now()}.xlsx`;
    const url = await uploadFile(blob, fileName);

    return url;
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    throw new Error('Erro ao gerar Excel');
  }
};
