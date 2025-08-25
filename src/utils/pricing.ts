import { TransformerConfig, PricingTables } from '@/types/transformer';

export const pricingTables: PricingTables = {
  // Os preços base permanecem os mesmos
  dry: {
    45: 16650,
    75: 25110,
    112.5: 26640,
    150: 28305,
    225: 37080,
    300: 42120,
    500: 54000,
    750: 78000,
    1000: 95000,
    1250: 122000,
    1500: 144000,
    1750: 157000,
    2000: 183000,
    2500: 234000,
    2750: 253000,
    3000: 272000
  },
  oil: {
    45: 12900,
    75: 22900,
    112.5: 19900,
    150: 22900,
    225: 30900,
    300: 37600,
    500: 54500,
    750: 68500,
    1000: 89900,
    1250: 117000,
    1500: 135000,
    1750: 140000,
    2000: 180000,
    2500: 220000,
    2750: 242000,
    3000: 265000
  }
};

export const calculateTransformerPrice = (config: TransformerConfig, applySurcharges: boolean = true): number => {
  if (!config || typeof config.power !== 'number') return 0;

  const baseTable = config.type === "dry" ? pricingTables.dry : pricingTables.oil;
  let basePrice = baseTable[config.power] || 0;

  // NOVO: Aplica o acréscimo de 10% para transformadores a seco
  // Esta é a primeira operação, garantindo que incida sobre o valor da tabela.
  if (config.type === "dry") {
    basePrice *= 1.10; // +10% para todos os transformadores a seco
  }

  if (!applySurcharges) return Math.round(basePrice);

  // Aplica os outros acréscimos opcionais sobre o novo valor base
  if (config.factorK === "K4") {
    basePrice *= 1.08; // +8%
  }

  if (config.material === "copper") {
    basePrice *= 1.35; // +35%
  }

  if (config.type === "oil" && config.oilType === "vegetal") {
    basePrice *= 1.15; // +15%
  }

  return Math.round(basePrice);
};

export const generateCompetitorPrices = (aebPrice: number, configSeed: string) => {
  // Use config as seed for consistent pricing
  const seed = configSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random1 = Math.sin(seed) * 10000;
  const random2 = Math.sin(seed * 2) * 10000;
  
  const factor1 = (random1 - Math.floor(random1)) * 0.15 + 0.15; // 15% to 30%
  const factor2 = (random2 - Math.floor(random2)) * 0.20 + 0.05; // 5% to 25%
  
  const competitorA = Math.round(aebPrice * (1 + factor1));
  const competitorB = Math.round(aebPrice * (1 + factor2));
  
  return {
    competitorA,
    competitorB,
    savings: (competitorA + competitorB) / 2 - aebPrice
  };
};