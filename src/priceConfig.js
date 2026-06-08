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

export const coverPlateUnitPrice = 150;
export const innerPlateUnitPrice = 150;
export const coverPrintingUnitPrice = 1000;
export const innerPrintingUnitPrice = 1000;

export const finishingPrices = {
  封面亮P: { type: 'coverCoating', unitPrice: 1.2 },
  封面霧P: { type: 'coverCoating', unitPrice: 1.2 },
  封面水亮: { type: 'coverCoating', unitPrice: 1.2 },
  封面水消: { type: 'coverCoating', unitPrice: 1.2 },
  內頁亮P: { type: 'innerCoating', unitPrice: 1.2 },
  內頁霧P: { type: 'innerCoating', unitPrice: 1.2 },
  內頁水亮: { type: 'innerCoating', unitPrice: 1.2 },
  內頁水消: { type: 'innerCoating', unitPrice: 1.2 },
  局部光: { type: 'localUv', unitPrice: 2.5 },
  局部光版費: { type: 'flat', amount: 800 },
};

export const finishingOptions = Object.keys(finishingPrices);

export const bindingPrices = {
  騎馬釘: { unitPrice: 0.2, basePrice: 2000 },
  膠裝: { unitPrice: 0.3, basePrice: 3000 },
  線裝: { unitPrice: 0.55, basePrice: 5500 },
};

export const bindingOptions = Object.keys(bindingPrices);

export const defaultCoverPaper = '銅西卡250p';
export const defaultCoverPrintSides = 1;
export const defaultCoverColorCount = 4;
