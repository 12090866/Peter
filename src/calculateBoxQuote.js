import {
  boxCoatingOptions,
  boxPaperConfig,
  boxPlateUnitPrice,
  boxSheetLimits,
  corrugatedOptions,
} from './boxConfig';
import { getBillingKiloRuns } from './utils/math';

export function calculateSuggestedImposition({
  sheetLength,
  sheetWidth,
  modelLength,
  modelWidth,
}) {
  const length = Number(sheetLength);
  const width = Number(sheetWidth);
  const modelL = Number(modelLength);
  const modelW = Number(modelWidth);

  if ([length, width, modelL, modelW].some((value) => !value || value <= 0)) {
    return { normal: 0, rotated: 0, suggested: 0 };
  }

  const normal = Math.floor(length / modelL) * Math.floor(width / modelW);
  const rotated = Math.floor(length / modelW) * Math.floor(width / modelL);

  return {
    normal,
    rotated,
    suggested: Math.max(normal, rotated),
  };
}

export function calculateBoxQuote(input) {
  const normalizedInput = normalizeBoxInput(input);
  const warnings = calculateBoxWarnings(normalizedInput);
  const hasBlockingError = warnings.some((warning) => warning.type === 'error');

  const imposition = calculateSuggestedImposition(normalizedInput);
  if (hasBlockingError) {
    return { input: normalizedInput, imposition, warnings, hasBlockingError };
  }

  const printRuns = normalizedInput.quantity / normalizedInput.impositionCount;
  const paperReams = printRuns / 500;
  const paperReamPrice = calculateScaledSheetPrice({
    basePrice: boxPaperConfig.baseReamPrice,
    sheetLength: normalizedInput.sheetLength,
    sheetWidth: normalizedInput.sheetWidth,
  });
  const paperSheetPrice = paperReamPrice / 500;
  const paperCost = paperReamPrice * paperReams;

  const plateCount = normalizedInput.colorCount;
  const plateCost = plateCount * boxPlateUnitPrice;

  const printingKiloRuns = getBillingKiloRuns(printRuns);
  const printingCost =
    normalizedInput.colorCount *
    printingKiloRuns *
    normalizedInput.printingUnitPrice;

  const selectedCoatings = normalizedInput.selectedCoatings.filter(
    (key) => key !== 'none' && boxCoatingOptions[key],
  );
  const coatingBreakdown = selectedCoatings.map((key) => ({
    key,
    label: boxCoatingOptions[key].label,
    cost: printRuns * normalizedInput.coatingUnitPrice,
  }));
  const coatingCost = coatingBreakdown.reduce((total, item) => total + item.cost, 0);

  const selectedCorrugated = normalizedInput.selectedCorrugated.filter(
    (key) => key !== 'none' && corrugatedOptions[key],
  );
  const corrugatedPaperSheetPrice = calculateScaledSheetPrice({
    basePrice: normalizedInput.corrugatedPaperUnitPrice,
    sheetLength: normalizedInput.sheetLength,
    sheetWidth: normalizedInput.sheetWidth,
  });
  const mountingSheetPrice = calculateScaledSheetPrice({
    basePrice: normalizedInput.mountingUnitPrice,
    sheetLength: normalizedInput.sheetLength,
    sheetWidth: normalizedInput.sheetWidth,
  });
  const corrugatedBreakdown = selectedCorrugated.map((key) => {
    const corrugatedPaperCost = corrugatedPaperSheetPrice * printRuns;
    const mountingCost = mountingSheetPrice * printRuns;

    return {
      key,
      label: corrugatedOptions[key].label,
      corrugatedPaperCost,
      mountingCost,
      total: corrugatedPaperCost + mountingCost,
    };
  });
  const corrugatedPaperCost = corrugatedBreakdown.reduce(
    (total, item) => total + item.corrugatedPaperCost,
    0,
  );
  const mountingCost = corrugatedBreakdown.reduce(
    (total, item) => total + item.mountingCost,
    0,
  );
  const corrugatedCost = corrugatedPaperCost + mountingCost;

  const dieCutCost = normalizedInput.dieCutEnabled
    ? printRuns * normalizedInput.dieCutUnitPrice
    : 0;
  const gluingCost = normalizedInput.gluingEnabled
    ? normalizedInput.quantity * normalizedInput.gluingUnitPrice
    : 0;

  const totalPrice =
    paperCost +
    plateCost +
    printingCost +
    coatingCost +
    corrugatedCost +
    dieCutCost +
    gluingCost;
  const unitPrice =
    normalizedInput.quantity > 0 ? totalPrice / normalizedInput.quantity : 0;

  return {
    input: normalizedInput,
    imposition,
    paper: {
      paperName: boxPaperConfig.name,
      paperReams,
      paperReamPrice,
      paperSheetPrice,
      paperCost,
    },
    plates: {
      plateCount,
      plateUnitPrice: boxPlateUnitPrice,
      plateCost,
    },
    printing: {
      printRuns,
      printingKiloRuns,
      printingUnitPrice: normalizedInput.printingUnitPrice,
      printingCost,
    },
    finishing: {
      coatingLabels: coatingBreakdown.map((item) => item.label),
      coatingBreakdown,
      coatingCost,
      corrugatedLabels: corrugatedBreakdown.map((item) => item.label),
      corrugatedBreakdown,
      corrugatedPaperSheetPrice,
      corrugatedPaperCost,
      mountingSheetPrice,
      mountingCost,
      corrugatedCost,
      dieCutCost,
      gluingCost,
    },
    total: {
      totalPrice,
      unitPrice,
    },
    warnings,
    hasBlockingError: false,
  };
}

function normalizeBoxInput(input) {
  const selectedCoatings = Array.isArray(input.selectedCoatings)
    ? input.selectedCoatings
    : input.coatingType && input.coatingType !== 'none'
      ? [input.coatingType]
      : [];
  const selectedCorrugated = Array.isArray(input.selectedCorrugated)
    ? input.selectedCorrugated
    : input.corrugatedType && input.corrugatedType !== 'none'
      ? [input.corrugatedType]
      : [];

  return {
    ...input,
    selectedCoatings,
    selectedCorrugated,
    quantity: Number(input.quantity),
    sheetLength: Number(input.sheetLength),
    sheetWidth: Number(input.sheetWidth),
    modelLength: Number(input.modelLength),
    modelWidth: Number(input.modelWidth),
    impositionCount: Number(input.impositionCount),
    colorCount: Number(input.colorCount),
    printingUnitPrice: Number(input.printingUnitPrice),
    coatingUnitPrice: Number(input.coatingUnitPrice),
    corrugatedPaperUnitPrice: Number(input.corrugatedPaperUnitPrice),
    mountingUnitPrice: Number(input.mountingUnitPrice),
    dieCutUnitPrice: Number(input.dieCutUnitPrice),
    gluingUnitPrice: Number(input.gluingUnitPrice),
  };
}

function calculateScaledSheetPrice({ basePrice, sheetLength, sheetWidth }) {
  return (
    (Number(basePrice) / boxPaperConfig.baseLength / boxPaperConfig.baseWidth) *
    Number(sheetLength) *
    Number(sheetWidth)
  );
}

function calculateBoxWarnings(input) {
  const warnings = [];
  const requiredFields = [
    ['訂購數量', input.quantity],
    ['紙張長度', input.sheetLength],
    ['紙張寬度', input.sheetWidth],
    ['單模長度', input.modelLength],
    ['單模寬度', input.modelWidth],
    ['拼模數', input.impositionCount],
    ['色數', input.colorCount],
  ];

  requiredFields.forEach(([label, value]) => {
    if (!Number.isFinite(value) || value <= 0) {
      warnings.push({ type: 'error', message: `${label}需大於 0。` });
    }
  });

  const shortSide = Math.min(input.sheetLength, input.sheetWidth);
  const longSide = Math.max(input.sheetLength, input.sheetWidth);
  if (
    shortSide < boxSheetLimits.minLength ||
    longSide < boxSheetLimits.minWidth ||
    shortSide > boxSheetLimits.maxLength ||
    longSide > boxSheetLimits.maxWidth
  ) {
    warnings.push({
      type: 'warning',
      message: `紙張尺寸建議介於 ${boxSheetLimits.minLength} x ${boxSheetLimits.minWidth} mm 到 ${boxSheetLimits.maxLength} x ${boxSheetLimits.maxWidth} mm。`,
    });
  }

  return warnings;
}
