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
    // Mantemos esta tabela apenas por compatibilidade (não é usada para "óleo" a partir daqui)
    45: 12900,
    75: 16000,
    112.5: 19900,
    150: 22900,
    225: 30900,
    300: 37600,
    500: 54500,
    750: 68500,
    1000: 89900,
    1250: 117000,
    1500: 135000,
    2000: 180000,
    2500: 220000,
    2750: 242000,
    3000: 265000
  }
};

// TABELAS EXATAS PARA TRANSFORMADORES A SECO, por classe de tensão
const dryTablesByVoltage: Record<'15kV' | '24kV' | '36kV', Record<number, number>> = {
  '15kV': {
    15: 16650,
    30: 19710,
    45: 20655,
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
    3000: 272000,
    3500: 349000,
    4000: 440000,
    5000: 530000
  },
  '24kV': {
    15: 23400,
    30: 25380,
    45: 28080,
    75: 35190,
    112.5: 38025,
    150: 40590,
    225: 52090,
    300: 55800,
    500: 70000,
    750: 100000,
    1000: 120000,
    1250: 159000,
    1500: 194000,
    1750: 210000,
    2000: 237000,
    2500: 314000,
    2750: 315000,
    3000: 343000,
    3500: 429000,
    4000: 540000,
    5000: 680000
  },
  '36kV': {
    15: 27900,
    30: 29700,
    45: 36900,
    75: 41400,
    112.5: 46800,
    150: 48600,
    225: 61380,
    300: 67590,
    500: 90000,
    750: 121000,
    1000: 150000,
    1250: 193000,
    1500: 217000,
    1750: 263000,
    2000: 289000,
    2500: 366000,
    2750: 400000,
    3000: 414000,
    3500: 529000,
    4000: 619000,
    5000: 891000
  }
};

// TABELAS EXATAS PARA TRANSFORMADORES A ÓLEO, por classe de tensão
const oilTablesByVoltage: Record<'15kV' | '24kV' | '36kV', Record<number, number>> = {
  '15kV': {
    45: 12900,
    75: 16000,
    112.5: 19900,
    150: 22900,
    225: 30900,
    300: 37600,
    500: 54500,
    750: 68500,
    1000: 89900,
    1250: 117000,
    1500: 135000,
    2000: 180000,
    2500: 220000,
    3000: 265000
  },
  '24kV': {
    45: 14190,
    75: 17600,
    112.5: 21890,
    150: 25190,
    225: 33990,
    300: 39520,
    500: 59950,
    750: 75350,
    1000: 98890,
    1250: 128700,
    1500: 148500,
    2000: 198000,
    2500: 242000,
    3000: 291500
  },
  '36kV': {
    45: 15609,
    75: 19360,
    112.5: 24080,
    150: 27700,
    225: 37391,
    300: 43800,
    500: 65900,
    750: 82900,
    1000: 108700,
    1250: 141570,
    1500: 163350,
    2000: 217800,
    2500: 266200,
    3000: 320650
  }
};

export const calculateTransformerPrice = (config: TransformerConfig, applySurcharges: boolean = true): number => {
  if (!config || typeof config.power !== 'number') return 0;

  // Base: escolhe tabela conforme tipo
  let basePrice = 0;
  if (config.type === "dry") {
    const voltageKey = (config.inputVoltage === '36kV') ? '36kV' : (config.inputVoltage === '24kV' ? '24kV' : '15kV');
    const table = dryTablesByVoltage[voltageKey];
    basePrice = table[config.power] || 0;
  } else {
    // Para óleo, usa tabelas exatas por classe de tensão
    const voltageKey = (config.inputVoltage === '36kV') ? '36kV' : (config.inputVoltage === '24kV' ? '24kV' : '15kV');
    const table = oilTablesByVoltage[voltageKey];
    basePrice = table[config.power] || 0;
  }

  // REMOVIDO: acréscimo de +10% para "seco". Os valores da tabela já são finais.
  // REMOVIDO: multiplicadores por tensão para óleo. Os valores da tabela já são finais.

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