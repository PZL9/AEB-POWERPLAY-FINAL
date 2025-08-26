import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface Prize {
  name: string;
  probability: number;
  color: string;
  textColor: string;
}

interface PrizeWheelProps {
  onResult: (prize: string) => void;
  orderValue: number;
}

const PrizeWheel = ({ onResult, orderValue }: PrizeWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Define prizes with different probabilities
  const basePrizes: Prize[] = [
    { name: "2% de desconto", probability: 20, color: "#FF6B35", textColor: "#FFFFFF" },
    { name: "Power Bank", probability: 15, color: "#22C55E", textColor: "#FFFFFF" },
    { name: "4% de desconto", probability: 20, color: "#3B82F6", textColor: "#FFFFFF" },
    { name: "Squeeze", probability: 15, color: "#F59E0B", textColor: "#FFFFFF" },
    { name: "6% de desconto", probability: 15, color: "#8B5CF6", textColor: "#FFFFFF" },
    { name: "Copo AEB", probability: 10, color: "#EF4444", textColor: "#FFFFFF" },
    { name: "Bag de TNT", probability: 3, color: "#06B6D4", textColor: "#FFFFFF" },
    { name: "Caderno", probability: 2, color: "#84CC16", textColor: "#FFFFFF" }
  ];

  // Adjust prizes based on order value
  const prizes = orderValue > 150000 
    ? basePrizes.filter(p => p.name !== "10% de desconto")
    : [
        ...basePrizes,
        { name: "10% de desconto", probability: 0.5, color: "#DC2626", textColor: "#FFFFFF" }
      ];

  const selectPrize = (): string => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize.name;
      }
    }
    
    return prizes[0].name; // Fallback
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    const selectedPrize = selectPrize();
    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = prizeIndex * segmentAngle + (segmentAngle / 2);
    
    // Add multiple rotations for dramatic effect
    const finalRotation = rotation + 1440 + (360 - targetAngle); // 4 full rotations + target
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      onResult(selectedPrize);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Wheel */}
        <div className="relative">
          <svg width="300" height="300" className="drop-shadow-2xl">
            {prizes.map((prize, index) => {
              const segmentAngle = 360 / prizes.length;
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              
              // Convert angles to radians
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              // Calculate path for segment
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              const x1 = 150 + 140 * Math.cos(startRad);
              const y1 = 150 + 140 * Math.sin(startRad);
              const x2 = 150 + 140 * Math.cos(endRad);
              const y2 = 150 + 140 * Math.sin(endRad);
              
              const pathData = [
                `M 150 150`,
                `L ${x1} ${y1}`,
                `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              // Text position
              const textAngle = startAngle + segmentAngle / 2;
              const textRad = (textAngle * Math.PI) / 180;
              const textX = 150 + 90 * Math.cos(textRad);
              const textY = 150 + 90 * Math.sin(textRad);

              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={prize.textColor}
                    fontSize="10"
                    fontWeight="bold"
                    transform={`rotate(${textAngle} ${textX} ${textY})`}
                  >
                    <tspan x={textX} dy="0">{prize.name.split(' ')[0]}</tspan>
                    <tspan x={textX} dy="12">{prize.name.split(' ').slice(1).join(' ')}</tspan>
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Spinning wheel overlay */}
          <div
            ref={wheelRef}
            className="absolute inset-0 transition-transform duration-[4000ms] ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center"
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-primary/30" />
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div 
            className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-primary drop-shadow-lg"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* Center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
            <Gift className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        size="lg"
        className="gradient-primary text-xl px-12 py-6 h-auto font-bold shadow-2xl hover:scale-105 transition-all duration-300"
      >
        {isSpinning ? (
          <>
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mr-3" />
            GIRANDO...
          </>
        ) : (
          <>
            <Gift className="mr-3 h-6 w-6" />
            GIRAR ROLETA
          </>
        )}
      </Button>

      {/* Prize List */}
      <div className="text-xs text-muted-foreground text-center max-w-md">
        <strong>Prêmios disponíveis:</strong> Descontos de 2%, 4%, 6%{orderValue <= 150000 && ", 10%"}, 
        Power Bank, Squeeze, Copo ABMT, Bag de TNT, Caderno
      </div>
    </div>
  );
};

export default PrizeWheel;