import {
  bindingPrices,
  coverPrintingUnitPrice,
  defaultCoverColorCount,
  defaultCoverPaper,
  defaultCoverPrintSides,
  finishingPrices,
  coverPlateUnitPrice,
  innerPlateUnitPrice,
  innerPrintingUnitPrice,
  paperPrices,
  sizeConfig,
} from './priceConfig';
import { getBillingKiloRuns } from './utils/math';

export function calculateSizeRule(size) {
  const rule = sizeConfig[size];
  if (!rule) throw new Error(`未知尺寸：${size}`);
  return { ...rule, size };
}

export function calculateUnits(pages, pagesPerUnit) {
  const theoreticalUnits = Number(pages) / pagesPerUnit;
  const billingUnits = Math.max(1, Math.ceil(theoreticalUnits));
  return { theoreticalUnits, billingUnits };
}

export function calculatePaper({
  quantity,
  theoreticalUnits,
  coverModulo,
  paperSystem,
  selectedPaper,
  selectedCoverPaper = defaultCoverPaper,
}) {
  const paper = paperPrices[selectedPaper];
  const coverPaper = selectedCoverPaper || defaultCoverPaper;

  if (!paper?.[paperSystem]) {
    throw new Error(`紙張價格尚未設定：${selectedPaper} / ${paperSystem}`);
  }
  if (!paperPrices[coverPaper]?.[paperSystem]) {
    throw new Error(`封面紙張價格尚未設定：${coverPaper} / ${paperSystem}`);
  }

  const innerSheets = quantity * theoreticalUnits;
  const innerReams = innerSheets / 500;
  const innerReamPrice = paper[paperSystem].reamPrice;
  const innerPaperCost = innerReams * innerReamPrice;

  const coverSheets = quantity / coverModulo;
  const coverReams = coverSheets / 500;
  const coverReamPrice = paperPrices[coverPaper][paperSystem].reamPrice;
  const coverPaperCost = coverReams * coverReamPrice;

  return {
    selectedPaper,
    innerSheets,
    innerReams,
    innerReamPrice,
    innerPaperCost,
    coverPaper,
    coverSheets,
    coverReams,
    coverReamPrice,
    coverPaperCost,
    coverModulo,
  };
}

export function calculatePlates({
  coverPrintSides,
  coverColorCount,
  innerPrintSides,
  innerColorCount,
  billingUnits,
}) {
  const coverPlates = coverPrintSides * coverColorCount;
  const innerPlates = innerPrintSides * innerColorCount * billingUnits;
  const totalPlates = coverPlates + innerPlates;
  const coverPlateCost = coverPlates * coverPlateUnitPrice;
  const innerPlateCost = innerPlates * innerPlateUnitPrice;
  const plateCost = coverPlateCost + innerPlateCost;

  return {
    coverPlates,
    innerPlates,
    totalPlates,
    coverPlateUnitPrice,
    innerPlateUnitPrice,
    coverPlateCost,
    innerPlateCost,
    plateCost,
  };
}

export function getPrintingBillingColorCount(colorCount) {
  const colors = Number(colorCount) || 0;
  return colors > 4 ? colors + 2 : colors;
}

export function calculatePrinting({
  coverSheets,
  coverColorCount,
  quantity,
  innerColorCount,
  billingUnits,
}) {
  const coverRuns = coverSheets;
  const coverKiloRuns = getBillingKiloRuns(coverRuns);
  const coverBillingColorCount = getPrintingBillingColorCount(coverColorCount);
  const coverPrintingCost =
    coverKiloRuns * coverBillingColorCount * coverPrintingUnitPrice;

  const innerRuns = quantity;
  const innerKiloRuns = getBillingKiloRuns(innerRuns);
  const innerBillingColorCount = getPrintingBillingColorCount(innerColorCount);
  const innerPrintingCost =
    innerKiloRuns * innerBillingColorCount * innerPrintingUnitPrice * billingUnits;

  return {
    coverRuns,
    coverKiloRuns,
    coverBillingColorCount,
    coverPrintingUnitPrice,
    coverPrintingCost,
    innerRuns,
    innerKiloRuns,
    innerBillingColorCount,
    innerPrintingUnitPrice,
    innerPrintingCost,
  };
}

export function calculateFinishing(
  selectedFinishing = [],
  { coverRuns, innerRuns, billingUnits },
) {
  const breakdown = {};
  const coverCountedRuns = Math.max(Number(coverRuns) || 0, 1000);
  const innerCountedRuns = Math.max(Number(innerRuns) || 0, 1000);

  const finishingCost = selectedFinishing.reduce((total, item) => {
    const config = finishingPrices[item];
    if (!config) {
      breakdown[item] = 0;
      return total;
    }

    let cost = 0;
    if (config.type === 'coverCoating') {
      cost = coverCountedRuns * config.unitPrice;
    } else if (config.type === 'innerCoating') {
      cost = innerCountedRuns * config.unitPrice * billingUnits;
    } else if (config.type === 'localUv') {
      cost = coverCountedRuns * config.unitPrice;
    } else if (config.type === 'flat') {
      cost = config.amount;
    }

    breakdown[item] = cost;
    return total + cost;
  }, 0);

  return {
    selectedFinishing,
    breakdown,
    coverCountedRuns,
    innerCountedRuns,
    finishingCost,
  };
}

export function calculateBinding(bindingType, quantity, billingUnits) {
  const bindingUnitPrice = bindingPrices[bindingType] || 0;
  const bindingQuantity = Math.max(quantity, 1000);
  const bindingCost = bindingUnitPrice * bindingQuantity * billingUnits;

  return {
    bindingType,
    bindingUnitPrice,
    bindingQuantity,
    bindingCost,
    isMinimumApplied: quantity < 1000,
  };
}

export function calculateWarnings(input, theoreticalUnits) {
  const warnings = [];

  if (input.pages % 4 !== 0) {
    warnings.push({ type: 'error', message: '頁數必須是 4 的倍數。' });
  }

  if (input.bindingType === '騎馬釘' && input.pages > 64) {
    warnings.push({
      type: 'warning',
      message: '頁數偏多，騎馬釘可能不適合，建議改用膠裝或線裝。',
    });
  }

  if (input.bindingType === '精裝' && input.pages < 48) {
    warnings.push({
      type: 'warning',
      message: '頁數較少時使用精裝，單本成本可能偏高。',
    });
  }

  if (theoreticalUnits && !Number.isInteger(theoreticalUnits)) {
    warnings.push({
      type: 'info',
      message:
        '內頁用紙依理論台數計算，印刷、製版與裝訂依進位後台數估算。',
    });
  }

  warnings.push({
    type: 'notice',
    message: '本工具為內部快速估價，正式報價仍需依紙價、加工條件與業務確認為準。',
  });

  return warnings;
}

export function calculateTotal({
  innerPaperCost,
  coverPaperCost,
  coverPrintingCost,
  innerPrintingCost,
  finishingCost,
  bindingCost,
  plateCost,
  quantity,
}) {
  const totalPrice =
    innerPaperCost +
    coverPaperCost +
    coverPrintingCost +
    innerPrintingCost +
    finishingCost +
    bindingCost +
    plateCost;
  const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

  return { totalPrice, unitPrice };
}

export function generateAiSummary(result) {
  const { input, sizeRule, units, paper, total, binding, finishing } = result;
  const finishingText = finishing.selectedFinishing.length
    ? finishing.selectedFinishing.join('、')
    : '無後加工';

  return [
    `${input.size} 採 ${sizeRule.seriesLabel}，每台 ${sizeRule.pagesPerUnit} 頁；${input.pages} 頁折算 ${units.theoreticalUnits.toFixed(2)} 台，報價以 ${units.billingUnits} 台估算。`,
    `內頁紙張為 ${paper.selectedPaper}，封面紙張為 ${paper.coverPaper}。`,
    `裝訂為 ${binding.bindingType}，後加工：${finishingText}。`,
    `目前估算總價約 NT$ ${Math.round(total.totalPrice).toLocaleString('zh-TW')}，單本約 NT$ ${Math.round(total.unitPrice).toLocaleString('zh-TW')}。`,
  ].join(' ');
}

export function calculateQuote(input) {
  const quantity = Number(input.quantity);
  const pages = Number(input.pages);
  const normalizedInput = { ...input, quantity, pages };
  const sizeRule = calculateSizeRule(normalizedInput.size);
  const units = calculateUnits(normalizedInput.pages, sizeRule.pagesPerUnit);
  const warnings = calculateWarnings(normalizedInput, units.theoreticalUnits);
  const hasBlockingError = warnings.some((warning) => warning.type === 'error');

  if (hasBlockingError) {
    return { input: normalizedInput, sizeRule, units, warnings, hasBlockingError };
  }

  const coverPrintSides = defaultCoverPrintSides;
  const coverColorCount = Number(
    normalizedInput.coverColorCount || defaultCoverColorCount,
  );
  const paper = calculatePaper({
    quantity,
    theoreticalUnits: units.theoreticalUnits,
    coverModulo: sizeRule.coverModulo,
    paperSystem: sizeRule.paperSystem,
    selectedPaper: normalizedInput.paperType,
    selectedCoverPaper: normalizedInput.coverPaperType,
  });

  const plates = calculatePlates({
    coverPrintSides,
    coverColorCount,
    innerPrintSides: normalizedInput.innerPrintSides,
    innerColorCount: normalizedInput.innerColorCount,
    billingUnits: units.billingUnits,
  });

  const printing = calculatePrinting({
    coverSheets: paper.coverSheets,
    coverColorCount,
    quantity,
    innerColorCount: normalizedInput.innerColorCount,
    billingUnits: units.billingUnits,
  });

  const finishing = calculateFinishing(
    normalizedInput.selectedFinishing || [],
    {
      coverRuns: paper.coverSheets,
      innerRuns: quantity,
      billingUnits: units.billingUnits,
    },
  );
  const binding = calculateBinding(
    normalizedInput.bindingType,
    quantity,
    units.billingUnits,
  );

  const total = calculateTotal({
    innerPaperCost: paper.innerPaperCost,
    coverPaperCost: paper.coverPaperCost,
    coverPrintingCost: printing.coverPrintingCost,
    innerPrintingCost: printing.innerPrintingCost,
    finishingCost: finishing.finishingCost,
    bindingCost: binding.bindingCost,
    plateCost: plates.plateCost,
    quantity,
  });

  const result = {
    input: normalizedInput,
    sizeRule,
    units,
    paper,
    plates,
    printing,
    finishing,
    binding,
    total,
    warnings,
    hasBlockingError: false,
    printSettings: {
      coverPrintSides,
      coverColorCount,
      innerPrintSides: normalizedInput.innerPrintSides,
      innerColorCount: normalizedInput.innerColorCount,
    },
  };

  result.aiSummary = generateAiSummary(result);
  return result;
}
