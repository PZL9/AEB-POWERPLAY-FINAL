export interface TransformerConfig {
  type: "dry" | "oil" | "";
  power: number | "others" | "";
  function: "step-down" | "step-up" | "";
  oilType: "vegetal" | "mineral" | "";
  material: "copper" | "aluminum" | "";
  factorK: "K1" | "K4" | "others" | "";
  inputVoltage: "15kV" | "24kV" | "36kV" | "";
  outputVoltage: "440/220" | "220/127" | "380/220" | "800/462" | "690" | "others" | "";
  customName: string;
  color: string;
}

export interface CartItem {
  id: string;
  config: TransformerConfig;
  quantity: number;
  basePrice: number;
  finalPrice: number;
}

export interface PricingTables {
  dry: Record<number, number>;
  oil: Record<number, number>;
}