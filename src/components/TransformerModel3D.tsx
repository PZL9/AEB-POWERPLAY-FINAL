import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder } from "@react-three/drei";
import { Mesh } from "three";
import { TransformerConfig } from "@/types/transformer";

interface TransformerModel3DProps {
  config: TransformerConfig;
  color: string;
  customText?: string;
}

const TransformerModel3D = ({ config, color, customText }: TransformerModel3DProps) => {
  const groupRef = useRef<any>();

  // Gentle rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Determine transformer dimensions based on type and power
  const getDimensions = () => {
    if (config.type === "dry") {
      // Dry transformer - rectangular with cooling fins
      return {
        width: 2,
        height: 2.5,
        depth: 1.5,
        type: "dry"
      };
    } else {
      // Oil transformer - cylindrical/oval shape
      const power = typeof config.power === 'number' ? config.power : 0;
      if (power <= 300) {
        return { width: 1.8, height: 2.2, depth: 1.8, type: "oil-small" };
      } else {
        return { width: 2.5, height: 3, depth: 2.5, type: "oil-large" };
      }
    }
  };

  const dimensions = getDimensions();

  const renderDryTransformer = () => (
    <group>
      {/* Main body */}
      <Box args={[dimensions.width, dimensions.height, dimensions.depth]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      
      {/* Cooling fins */}
      {[-0.8, 0, 0.8].map((pos, i) => (
        <Box key={i} args={[0.1, dimensions.height * 0.8, dimensions.depth * 0.8]} position={[pos, 0, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
      ))}
      
      {/* Terminal connections */}
      {[-0.6, 0.6].map((pos, i) => (
        <Cylinder key={i} args={[0.1, 0.1, 0.5]} position={[pos, dimensions.height/2 + 0.25, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#888888" />
        </Cylinder>
      ))}
      
      {/* Warning labels */}
      <Box args={[0.3, 0.3, 0.01]} position={[0, 0, dimensions.depth/2 + 0.01]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
    </group>
  );

  const renderOilTransformer = () => (
    <group>
      {/* Main tank */}
      <Cylinder 
        args={[dimensions.width/2, dimensions.width/2, dimensions.height]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color={color} />
      </Cylinder>
      
      {/* Cooling radiators */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * (dimensions.width/2 + 0.2);
        const z = Math.sin(angle) * (dimensions.width/2 + 0.2);
        return (
          <Box key={i} args={[0.1, dimensions.height * 0.8, 0.3]} position={[x, 0, z]}>
            <meshStandardMaterial color={color} />
          </Box>
        );
      })}
      
      {/* Top connections */}
      <Cylinder args={[0.15, 0.15, 0.4]} position={[0, dimensions.height/2 + 0.2, 0]}>
        <meshStandardMaterial color="#888888" />
      </Cylinder>
      
      {/* Oil level indicator */}
      <Cylinder args={[0.05, 0.05, 0.3]} position={[dimensions.width/2 * 0.7, dimensions.height/3, 0]}>
        <meshStandardMaterial color="#333333" />
      </Cylinder>
    </group>
  );

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <Box args={[dimensions.width * 1.2, 0.1, dimensions.depth * 1.2]} position={[0, -dimensions.height/2 - 0.1, 0]}>
        <meshStandardMaterial color="#666666" />
      </Box>
      
      {/* Main transformer body */}
      {config.type === "dry" ? renderDryTransformer() : renderOilTransformer()}
      
      {/* Custom text label */}
      {customText && (
        <Text
          position={[0, -dimensions.height/2 + 0.3, dimensions.depth/2 + 0.1]}
          fontSize={0.2}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={dimensions.width * 0.8}
        >
          {customText}
        </Text>
      )}
      
      {/* Power rating label */}
      <Text
        position={[0, dimensions.height/2 - 0.3, dimensions.depth/2 + 0.05]}
        fontSize={0.15}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {config.power} kVA
      </Text>
      
      {/* Material indicator */}
      <Text
        position={[0, -dimensions.height/2 + 0.6, dimensions.depth/2 + 0.05]}
        fontSize={0.1}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {config.material === "copper" ? "Cu" : "Al"} | {config.factorK}
      </Text>
    </group>
  );
};

export default TransformerModel3D;