export const appMode = {
  showFormulaDebug: true,
};

export const sizeConfig = {
  G8K: {
    paperSystem: 'G',
    sheetSize: '25 x 35 in',
    series: '16',
    seriesLabel: '16開系列',
    pagesPerUnit: 16,
    coverModulo: 4,
  },
  A4: {
    paperSystem: 'G',
    sheetSize: '25 x 35 in',
    series: '16',
    seriesLabel: '16開系列',
    pagesPerUnit: 16,
    coverModulo: 4,
  },
  G16K: {
    paperSystem: 'G',
    sheetSize: '25 x 35 in',
    series: '32',
    seriesLabel: '32開系列',
    pagesPerUnit: 32,
    coverModulo: 8,
  },
  G25K: {
    paperSystem: 'G',
    sheetSize: '25 x 35 in',
    series: '32',
    seriesLabel: '32開系列',
    pagesPerUnit: 32,
    coverModulo: 8,
  },
  A5: {
    paperSystem: 'G',
    sheetSize: '25 x 35 in',
    series: '32',
    seriesLabel: '32開系列',
    pagesPerUnit: 32,
    coverModulo: 8,
  },
  '16K': {
    paperSystem: 'K',
    sheetSize: '31 x 43 in',
    series: '16',
    seriesLabel: '16開系列',
    pagesPerUnit: 16,
    coverModulo: 4,
  },
  B5: {
    paperSystem: 'K',
    sheetSize: '31 x 43 in',
    series: '16',
    seriesLabel: '16開系列',
    pagesPerUnit: 16,
    coverModulo: 4,
  },
  '32K': {
    paperSystem: 'K',
    sheetSize: '31 x 43 in',
    series: '32',
    seriesLabel: '32開系列',
    pagesPerUnit: 32,
    coverModulo: 8,
  },
  B6: {
    paperSystem: 'K',
    sheetSize: '31 x 43 in',
    series: '32',
    seriesLabel: '32開系列',
    pagesPerUnit: 32,
    coverModulo: 8,
  },
};

export const sizeGroups = [
  {
    label: '16開系列',
    options: ['G8K', 'A4', '16K', 'B5'],
  },
  {
    label: '32開系列',
    options: ['G16K', 'G25K', 'A5', '32K', 'B6'],
  },
];

export const paperPrices = {
  '銅西卡250p': {
    K: { sheetSize: '31 x 43 in', reamPrice: 4148 },
    G: { sheetSize: '25 x 35 in', reamPrice: 2722 },
  },
  '高級道林120p': {
    K: { sheetSize: '31 x 43 in', reamPrice: 1627 },
    G: { sheetSize: '25 x 35 in', reamPrice: 1068 },
  },
  '雪銅120p': {
    K: { sheetSize: '31 x 43 in', reamPrice: 1650 },
    G: { sheetSize: '25 x 35 in', reamPrice: 1083 },
  },
};

export const paperOptions = Object.keys(paperPrices);

export const plateUnitPrice = 150;
export const coverPrintingUnitPrice = 1000;
export const innerPrintingUnitPrice = 1000;

export const finishingPrices = {
  上亮膜: { type: 'perRun', unitPrice: 10 },
  上霧膜: { type: 'perRun', unitPrice: 15 },
  局部上光: { type: 'basePlusPerRun', basePrice: 1500, unitPrice: 5 },
  燙金: { type: 'basePlusPerRun', basePrice: 2000, unitPrice: 8 },
};

export const finishingOptions = Object.keys(finishingPrices);

export const bindingPrices = {
  騎馬釘: 8,
  膠裝: 25,
  線裝: 45,
};

export const bindingOptions = Object.keys(bindingPrices);

export const defaultCoverPaper = '銅西卡250p';
export const defaultCoverPrintSides = 1;
export const defaultCoverColorCount = 4;
