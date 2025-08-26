import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface Prize {
  name: string;
  probability: number;
  color: string;
  textColor: string;
}

interface InteractivePrizeWheelProps {
  onResult: (prize: string) => void;
  orderValue: number;
}

const InteractivePrizeWheel = ({ onResult, orderValue }: InteractivePrizeWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  // Define prizes with different probabilities
  const basePrizes: Prize[] = [
    { name: "2% de Desconto", probability: 25, color: "#3B82F6", textColor: "#FFFFFF" },
    { name: "Power Bank", probability: 20, color: "#EF4444", textColor: "#FFFFFF" },
    { name: "4% de Desconto", probability: 20, color: "#10B981", textColor: "#FFFFFF" },
    { name: "Squeeze", probability: 15, color: "#F59E0B", textColor: "#000000" },
    { name: "6% de Desconto", probability: 12, color: "#8B5CF6", textColor: "#FFFFFF" },
    { name: "Copo AEB", probability: 10, color: "#06B6D4", textColor: "#FFFFFF" },
    { name: "Bag de TNT", probability: 8, color: "#84CC16", textColor: "#000000" },
    { name: "Caderno", probability: 5, color: "#F97316", textColor: "#FFFFFF" },
  ];

  // Add 10% discount only if order value is less than R$150,000
  const prizes = orderValue < 150000 
    ? [...basePrizes, { name: "10% de Desconto", probability: 3, color: "#DC2626", textColor: "#FFFFFF" }]
    : basePrizes.map(prize => ({ ...prize, probability: prize.probability + 0.4 })); // Redistribute probability

  const selectPrize = (): Prize => {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const prize of prizes) {
      random -= prize.probability;
      if (random <= 0) {
        return prize;
      }
    }
    
    return prizes[0]; // Fallback
  };

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;
    
    setIsSpinning(true);
    const selectedPrize = selectPrize();
    
    // Calculate rotation to land on selected prize
    const prizeIndex = prizes.findIndex(p => p.name === selectedPrize.name);
    const segmentAngle = 360 / prizes.length;
    // The target is the middle of the segment
    const prizeAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2);
    
    // Add multiple full rotations for dramatic effect, plus a random offset within the segment
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const fullRotations = 5 * 360;
    
    // We want the final angle to align the prize with the top pointer (0/360 degrees)
    // The rotation is clockwise, so we rotate by (360 - angle)
    const finalRotation = fullRotations + (360 - prizeAngle) + randomOffset;
    
    setRotation(rotation + finalRotation);
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      onResult(selectedPrize.name);
    }, 4000);
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Prize Wheel */}
      <div className="relative w-80 h-80">
        {/* Pointer */}
        <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px] border-t-primary drop-shadow-lg"></div>
        </div>

        {/* Wheel SVG */}
        <div 
          className="w-full h-full"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
        >
          <svg 
            width="320" 
            height="320" 
            className="drop-shadow-2xl"
          >
            {prizes.map((prize, index) => {
              const startAngle = index * segmentAngle - 90; // Start from top
              const endAngle = startAngle + segmentAngle;
              
              const x1 = 160 + 140 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 160 + 140 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 160 + 140 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 160 + 140 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              
              const pathData = [
                `M 160 160`,
                `L ${x1} ${y1}`,
                `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const textAngle = startAngle + segmentAngle / 2;
              const textX = 160 + 90 * Math.cos((textAngle * Math.PI) / 180);
              const textY = 160 + 90 * Math.sin((textAngle * Math.PI) / 180);
              
              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill={prize.textColor}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                  >
                    {prize.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
          <Gift className="h-8 w-8 text-white" />
        </div>
        
        {/* Spinning overlay effect */}
        {isSpinning && (
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
        )}
      </div>
      
      {/* Spin Button */}
      {!hasSpun && (
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          size="lg"
          className="gradient-primary text-xl px-12 py-6 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-primary/25"
        >
          <Gift className="mr-3 h-6 w-6" />
          {isSpinning ? "GIRANDO..." : "GIRAR ROLETA"}
        </Button>
      )}
    </div>
  );
};

export default InteractivePrizeWheel;