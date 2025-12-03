import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { OSIOrdem } from '../types';
import { uploadFile } from './osi';

// Configurar fontes
(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

export const generatePDF = async (ordem: OSIOrdem): Promise<string> => {
  try {
    // Definir documento PDF
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        margin: [40, 20, 40, 0],
        columns: [
          {
            text: 'TERRAPLANAGEM GUIMARÃES',
            style: 'header',
            alignment: 'center'
          }
        ]
      },
      content: [
        {
          text: 'ORDEM DE SERVIÇO INTERNA - OSI',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: `Nº OS: ${ordem.numero_os || 'N/A'}`,
          style: 'subtitle',
          alignment: 'right',
          margin: [0, 0, 0, 15]
        },
        
        // Tabela de Informações Básicas
        {
          style: 'table',
          table: {
            widths: ['25%', '25%', '25%', '25%'],
            body: [
              [
                { text: 'Data', style: 'tableHeader' },
                { text: 'Hora', style: 'tableHeader' },
                { text: 'TAG', style: 'tableHeader' },
                { text: 'Horímetro', style: 'tableHeader' }
              ],
              [
                { text: ordem.data || '', style: 'tableCell' },
                { text: ordem.hora || '', style: 'tableCell' },
                { text: ordem.tag || '', style: 'tableCell' },
                { text: ordem.horimetro || '', style: 'tableCell' }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 10]
        },

        // Veículo e Equipamento
        {
          style: 'table',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                { text: 'Veículo', style: 'tableHeader' },
                { text: 'Equipamento', style: 'tableHeader' }
              ],
              [
                { text: ordem.veiculo || '', style: 'tableCell' },
                { text: ordem.equipamento || '', style: 'tableCell' }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 10]
        },

        // KM
        {
          style: 'table',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                { text: 'KM Inicial', style: 'tableHeader' },
                { text: 'KM Final', style: 'tableHeader' }
              ],
              [
                { text: ordem.km_inicial || '', style: 'tableCell' },
                { text: ordem.km_final || '', style: 'tableCell' }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 15]
        },

        // Tipo de Manutenção
        {
          text: 'TIPO DE MANUTENÇÃO',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },
        {
          columns: [
            {
              width: '33%',
              stack: [
                { text: `☐ Preditiva ${ordem.manut_preditiva ? '✓' : ''}`, margin: [0, 0, 0, 5] },
                { text: `☐ Preventiva ${ordem.manut_preventiva ? '✓' : ''}`, margin: [0, 0, 0, 5] }
              ]
            },
            {
              width: '33%',
              stack: [
                { text: `☐ Corretiva ${ordem.manut_corretiva ? '✓' : ''}`, margin: [0, 0, 0, 5] },
                { text: `☐ Avaria ${ordem.manut_avaria ? '✓' : ''}`, margin: [0, 0, 0, 5] }
              ]
            },
            {
              width: '34%',
              stack: [
                { text: `☐ Oportunidade ${ordem.manut_oportunidade ? '✓' : ''}`, margin: [0, 0, 0, 5] },
                { text: `☐ Outros ${ordem.manut_outros ? '✓' : ''}`, margin: [0, 0, 0, 5] }
              ]
            }
          ],
          margin: [0, 0, 0, 15]
        },

        // Descrição dos Serviços
        {
          text: 'DESCRIÇÃO DOS SERVIÇOS',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            widths: ['100%'],
            body: [
              [{ text: ordem.descricao_servicos || '', style: 'tableCell', margin: [5, 5, 5, 5] }]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 15]
        },

        // Peças Aplicadas
        {
          text: 'PEÇAS APLICADAS',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            widths: ['100%'],
            body: [
              [{ text: ordem.pecas_aplicadas || 'Nenhuma peça aplicada', style: 'tableCell', margin: [5, 5, 5, 5] }]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 15]
        },

        // Observações
        {
          text: 'OBSERVAÇÕES',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            widths: ['100%'],
            body: [
              [{ text: ordem.observacoes || 'Sem observações', style: 'tableCell', margin: [5, 5, 5, 5] }]
            ]
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc'
          },
          margin: [0, 0, 0, 20]
        },

        // Assinaturas
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: '_'.repeat(40), alignment: 'center' },
                { text: 'Mecânico', alignment: 'center', style: 'label' },
                { text: ordem.mecanico || '', alignment: 'center', margin: [0, 5, 0, 0] }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: '_'.repeat(40), alignment: 'center' },
                { text: 'Responsável Obra', alignment: 'center', style: 'label' },
                { text: ordem.responsavel || '', alignment: 'center', margin: [0, 5, 0, 0] }
              ]
            }
          ],
          margin: [0, 30, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#333333'
        },
        title: {
          fontSize: 18,
          bold: true,
          color: '#1a202c'
        },
        subtitle: {
          fontSize: 12,
          bold: true,
          color: '#4a5568'
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: '#2d3748',
          fillColor: '#edf2f7',
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          fillColor: '#667eea',
          color: '#ffffff',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        tableCell: {
          fontSize: 10,
          color: '#2d3748',
          margin: [5, 5, 5, 5]
        },
        label: {
          fontSize: 9,
          bold: true,
          color: '#4a5568'
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#2d3748'
      }
    };

    // Gerar PDF
    return new Promise((resolve, reject) => {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob(async (blob: Blob) => {
        try {
          const fileName = `osi-${ordem.id || Date.now()}.pdf`;
          const url = await uploadFile(blob, fileName);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Erro ao gerar PDF');
  }
};
