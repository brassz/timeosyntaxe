# 📚 Exemplos de Uso do Sistema OSI

## 🎯 Cenários Práticos

### Cenário 1: Manutenção Preventiva de Escavadeira

**Situação:** Mecânico João precisa registrar manutenção preventiva de 500h em uma escavadeira.

**Passo a passo:**

1. **Login no sistema**
   - Usuário: `admin`
   - Senha: `admin123`

2. **Criar Ordem de Serviço**
   - Clicar em "📝 Gerar Ordem de Serviço"
   
3. **Preencher dados:**
   ```
   Data: 03/12/2025
   Hora: 14:30
   Veículo: Não aplicável
   Equipamento: Escavadeira Hidráulica CAT 320
   KM Inicial: -
   KM Final: -
   TAG: ESC-001
   Horímetro: 500h
   
   Tipo de Manutenção: ✅ Preventiva
   
   Descrição dos Serviços:
   - Troca de óleo hidráulico
   - Substituição de filtros (óleo, ar, combustível)
   - Lubrificação de pontos críticos
   - Inspeção geral de componentes
   - Verificação de níveis de fluidos
   
   Peças Aplicadas:
   - Óleo hidráulico Shell 68 - 200L - Código: HYD-68-200
   - Filtro de óleo - Código: FO-CAT-320
   - Filtro de ar - Código: FA-CAT-320
   - Filtro de combustível - Código: FC-CAT-320
   - Graxa multiuso - 5kg - Código: GRX-MULTI-5
   
   Observações:
   Equipamento apresentou bom estado geral. 
   Próxima manutenção prevista para 1000h.
   
   Mecânico: João da Silva
   Responsável Obra: Carlos Oliveira
   ```

4. **Gerar OS**
   - Clicar em "✅ Gerar OS com PDF e Excel"
   - Aguardar processamento (10-15 segundos)
   - PDF e Excel gerados automaticamente

5. **Resultado:**
   - Ordem criada com número automático (ex: #001)
   - PDF disponível para impressão
   - Excel disponível para registro
   - Arquivos salvos no Supabase Storage

---

### Cenário 2: Manutenção Corretiva de Caminhão

**Situação:** Caminhão apresentou problema no motor durante operação.

**Dados da OS:**

```
Data: 03/12/2025
Hora: 09:15
Veículo: Caminhão Mercedes-Benz Axor 2544
Equipamento: N/A
KM Inicial: 152.340
KM Final: 152.350
TAG: CAM-045
Horímetro: -

Tipo de Manutenção: ✅ Corretiva, ✅ Avaria

Descrição dos Serviços:
- Motor apresentou superaquecimento durante operação
- Identificado vazamento na mangueira superior do radiador
- Substituída mangueira danificada
- Verificado sistema de arrefecimento completo
- Testado funcionamento em diferentes condições
- Completado nível de água do radiador
- Realizado teste de estrada

Peças Aplicadas:
- Mangueira superior radiador - Mercedes OE 9425010682 - Código: MNG-RD-TOP-45
- Abraçadeira 60mm - 2 unidades - Código: ABR-60-02
- Aditivo radiador - 5L - Código: ADD-RAD-5L

Observações:
URGENTE: Mangueira apresentava desgaste crítico.
Recomendado inspeção visual periódica do sistema de arrefecimento.
Motorista orientado sobre procedimentos em caso de superaquecimento.

Mecânico: Pedro Santos
Responsável Obra: Maria Fernandes
```

---

### Cenário 3: Manutenção Preditiva - Pá Carregadeira

**Situação:** Inspeção preventiva detectou necessidade de troca de componentes.

**Dados da OS:**

```
Data: 03/12/2025
Hora: 16:00
Veículo: N/A
Equipamento: Pá Carregadeira Caterpillar 938G
KM Inicial: -
KM Final: -
TAG: PAC-012
Horímetro: 2.450h

Tipo de Manutenção: ✅ Preditiva, ✅ Oportunidade

Descrição dos Serviços:
- Análise de óleo detectou contaminação por partículas metálicas
- Inspeção visual confirmou desgaste em rolamentos
- Substituídos rolamentos do eixo dianteiro
- Troca completa de óleo de transmissão
- Limpeza do sistema de transmissão
- Ajuste de folgas e alinhamento
- Teste operacional completo

Peças Aplicadas:
- Kit rolamentos eixo dianteiro - CAT Part 123-4567 - Código: KIT-ROL-938G
- Óleo transmissão TO-4 50L - Código: TO4-50L
- Filtro transmissão - Código: FT-938G
- Retentores - Kit completo - Código: RET-KIT-938G

Observações:
Manutenção realizada devido análise preditiva.
Evitou parada não programada do equipamento.
Análise de óleo deve ser repetida em 250h.
Equipamento liberado para operação normal.

Mecânico: Ricardo Alves
Responsável Obra: Antonio Costa
```

---

### Cenário 4: Manutenção de Oportunidade

**Situação:** Durante manutenção preventiva, identificados itens para troca.

**Dados da OS:**

```
Data: 03/12/2025
Hora: 10:30
Veículo: Caminhão Scania P360
Equipamento: Caçamba Basculante
KM Inicial: 98.500
KM Final: 98.510
TAG: CAM-023
Horímetro: -

Tipo de Manutenção: ✅ Preventiva, ✅ Oportunidade

Descrição dos Serviços:
PREVENTIVA (Programada):
- Troca de óleo motor
- Substituição filtros
- Lubrificação chassis

OPORTUNIDADE (Identificada):
- Pastilhas freio dianteiro com 80% desgaste
- Substituídas pastilhas e discos dianteiros
- Fluido freio apresentava cor escurecida
- Realizada sangria completa do sistema
- Substituído fluido de freio

Peças Aplicadas:
PREVENTIVA:
- Óleo motor 15W40 - 30L - Código: OM-15W40-30
- Filtro óleo - Código: FO-SCAN-P360
- Filtro ar - Código: FA-SCAN-P360
- Filtro combustível - Código: FC-SCAN-P360

OPORTUNIDADE:
- Pastilhas freio dianteiro (jogo) - Código: PFD-SCAN-P360
- Discos freio dianteiro (par) - Código: DFD-SCAN-P360
- Fluido freio DOT-4 - 2L - Código: FF-DOT4-2L

Observações:
Aproveitada oportunidade da manutenção preventiva para realizar troca do sistema de freio.
Evitou necessidade de parada futura específica para freios.
Sistema de freios testado e aprovado.
Veículo liberado para operação.

Mecânico: Fernando Lima
Responsável Obra: José Roberto
```

---

## 🔍 Consultando o Histórico

### Exemplo 1: Buscar OS de um veículo específico

1. Acessar "📊 Histórico de Ordens"
2. Preencher filtro:
   - **Veículo:** `Mercedes-Benz`
3. Clicar em "🔍 Filtrar"
4. Resultado: Todas OSs do caminhão Mercedes

### Exemplo 2: Buscar manutenções em um período

1. Acessar "📊 Histórico de Ordens"
2. Preencher filtros:
   - **Data Inicial:** `01/12/2025`
   - **Data Final:** `31/12/2025`
3. Clicar em "🔍 Filtrar"
4. Resultado: Todas OSs de dezembro/2025

### Exemplo 3: Buscar OS específica

1. Acessar "📊 Histórico de Ordens"
2. Preencher filtro:
   - **Nº OS:** `15`
3. Clicar em "🔍 Filtrar"
4. Resultado: Ordem de Serviço #15

### Exemplo 4: Buscar por equipamento

1. Acessar "📊 Histórico de Ordens"
2. Preencher filtro:
   - **Equipamento:** `Escavadeira`
3. Clicar em "🔍 Filtrar"
4. Resultado: Todas OSs de escavadeiras

---

## 📄 Gerando Relatórios

### Relatório Mensal de Manutenções

**Objetivo:** Exportar todas manutenções do mês

1. Filtrar por período (ex: 01/12/2025 a 31/12/2025)
2. Para cada OS, clicar em "📊 Excel"
3. Consolidar dados dos arquivos Excel
4. Gerar relatório consolidado

### Histórico de um Equipamento

**Objetivo:** Ver todas manutenções de um equipamento específico

1. Filtrar por equipamento (ex: "Escavadeira CAT 320")
2. Visualizar todas OSs listadas
3. Analisar frequência e tipos de manutenção
4. Exportar PDFs para arquivo físico

---

## 💡 Dicas e Boas Práticas

### ✅ Preenchimento de Dados

1. **Seja específico:**
   - ❌ Ruim: "Equipamento: Caminhão"
   - ✅ Bom: "Equipamento: Caminhão Mercedes-Benz Axor 2544"

2. **Use códigos de peças:**
   - Facilita rastreamento
   - Evita erros de identificação
   - Auxilia no controle de estoque

3. **Descreva detalhadamente:**
   - O que foi feito
   - Por que foi feito
   - Como foi feito
   - Resultado obtido

4. **Registre observações importantes:**
   - Recomendações futuras
   - Problemas encontrados
   - Pendências

### 🎯 Organização

1. **TAGs padronizadas:**
   ```
   CAM-001, CAM-002  → Caminhões
   ESC-001, ESC-002  → Escavadeiras
   PAC-001, PAC-002  → Pás Carregadeiras
   TRA-001, TRA-002  → Tratores
   ```

2. **Nomeação consistente:**
   - Use sempre os mesmos nomes para equipamentos
   - Facilita filtros e buscas

3. **Registro imediato:**
   - Registre a OS assim que terminar o serviço
   - Informações frescas na memória
   - Maior precisão nos dados

---

## 🚨 Casos Especiais

### Manutenção Emergencial

Para registrar manutenções urgentes:

1. Selecione: ✅ Corretiva + ✅ Avaria
2. Descreva em OBSERVAÇÕES o caráter emergencial
3. Indique impacto na operação
4. Registre tempo de parada

### Manutenção Externa

Para serviços feitos por terceiros:

1. Preencha normalmente a OS
2. Em "Mecânico", coloque: `[EXTERNO] Nome da Empresa`
3. Em observações, adicione:
   - Nome do técnico externo
   - Nota fiscal
   - Garantia (se aplicável)

### Aguardando Peças

Para serviços incompletos:

1. Crie a OS normalmente
2. Em "Descrição dos Serviços", indique o que foi feito
3. Em "Observações", registre:
   ```
   ATENÇÃO: Serviço parcial
   Aguardando chegada de: [Nome da peça]
   Previsão: [Data]
   Equipamento: [Status - parado/operando]
   ```

---

## 📊 Indicadores de Desempenho (KPIs)

### Dados para Análise

Com o histórico de OSs, você pode analisar:

1. **Frequência de Manutenção por Equipamento**
   - Identificar equipamentos problemáticos
   
2. **Custos de Manutenção**
   - Somar valores de peças aplicadas
   
3. **Tipos de Manutenção Mais Comuns**
   - Preventiva vs. Corretiva
   
4. **Tempo de Execução**
   - Comparar hora inicial vs. hora final
   
5. **Produtividade da Equipe**
   - Quantidade de OSs por mecânico

---

**Sistema pronto para uso! 🎉**

Desenvolvido para Terraplanagem Guimarães - 2025
