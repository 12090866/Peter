export const boxPaperConfig = {
  name: '350p灰銅',
  baseReamPrice: 3361,
  baseLength: 787,
  baseWidth: 1092,
};

export const boxPlateUnitPrice = 350;

export const boxCoatingOptions = {
  none: { label: '無上光', unitPrice: 0 },
  glossP: { label: '亮P', unitPrice: 0.2 },
  matteP: { label: '霧P', unitPrice: 0.2 },
  waterGloss: { label: '水光', unitPrice: 0.2 },
  waterMatte: { label: '水消', unitPrice: 0.2 },
};

export const corrugatedOptions = {
  none: { label: '無裱浪', paperUnitPrice: 0 },
  b: { label: 'B浪', paperUnitPrice: 5.15 },
  e: { label: 'E浪', paperUnitPrice: 5.15 },
  f: { label: 'F浪', paperUnitPrice: 5.15 },
};

export const defaultBoxInput = {
  quantity: 40000,
  sheetLength: 697,
  sheetWidth: 878,
  modelLength: 348,
  modelWidth: 439,
  impositionCount: 4,
  colorCount: 4,
  printingUnitPrice: 1000,
  selectedCoatings: ['glossP'],
  coatingUnitPrice: 0.2,
  selectedCorrugated: [],
  corrugatedPaperUnitPrice: 5.15,
  mountingUnitPrice: 1.31,
  dieCutEnabled: true,
  dieCutUnitPrice: 0.8,
  gluingEnabled: true,
  gluingUnitPrice: 0.25,
};

export const boxSheetLimits = {
  minLength: 393,
  minWidth: 546,
  maxLength: 720,
  maxWidth: 1020,
};
