import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder, RoundedBox } from "@react-three/drei";
import { Group } from "three";
import { TransformerConfig } from "@/types/transformer";

interface RealisticTransformerModel3DProps {
  config: TransformerConfig;
  color: string;
  customText?: string;
}

const RealisticTransformerModel3D = ({ config, color, customText }: RealisticTransformerModel3DProps) => {
  const groupRef = useRef<Group>(null);

  // Gentle rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Get realistic dimensions based on actual transformers
  const getDimensions = () => {
    const power = typeof config.power === 'number' ? config.power : 0;
    
    if (config.type === "dry") {
      // Dry transformer - rectangular with vertical cooling fins
      return {
        width: 1.8,
        height: 2.2,
        depth: 1.2,
        type: "dry"
      };
    } else {
      // Oil transformer - tank with radiators
      if (power <= 300) {
        return { 
          width: 1.6, 
          height: 1.8, 
          depth: 1.0, 
          type: "oil-small",
          tankColor: "#8B8B8B" // Gray for smaller
        };
      } else {
        return { 
          width: 2.2, 
          height: 2.4, 
          depth: 1.4, 
          type: "oil-large",
          tankColor: "#4A7C59" // Green for larger
        };
      }
    }
  };

  const dimensions = getDimensions();

  // Render realistic dry transformer based on orange reference image
  const renderDryTransformer = () => (
    <group>
      {/* Main rectangular body */}
      <RoundedBox 
        args={[dimensions.width, dimensions.height, dimensions.depth]} 
        position={[0, 0, 0]}
        radius={0.05}
      >
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </RoundedBox>
      
      {/* Vertical cooling radiators/fins on sides */}
      {[-0.95, 0.95].map((xPos, i) => (
        <group key={`radiator-${i}`}>
          {Array.from({ length: 8 }, (_, finIndex) => {
            const zPos = (finIndex - 3.5) * 0.12;
            return (
              <Box 
                key={finIndex}
                args={[0.08, dimensions.height * 0.9, 0.08]} 
                position={[xPos, 0, zPos]}
              >
                <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
              </Box>
            );
          })}
        </group>
      ))}
      
      {/* Terminal bushings on top - cylindrical insulators */}
      {[-0.4, -0.1, 0.1, 0.4].map((xPos, i) => (
        <Cylinder 
          key={`bushing-${i}`}
          args={[0.08, 0.06, 0.6]} 
          position={[xPos, dimensions.height/2 + 0.3, 0]}
        >
          <meshStandardMaterial color="#E8E8E8" metalness={0.1} roughness={0.3} />
        </Cylinder>
      ))}
      
      {/* Base support structure */}
      <Box args={[dimensions.width * 1.1, 0.15, dimensions.depth * 1.1]} position={[0, -dimensions.height/2 - 0.08, 0]}>
        <meshStandardMaterial color="#333333" metalness={0.3} roughness={0.8} />
      </Box>
      
      {/* Nameplate area */}
      <Box args={[0.4, 0.25, 0.02]} position={[0, 0.2, dimensions.depth/2 + 0.01]}>
        <meshStandardMaterial color="#F0F0F0" />
      </Box>
    </group>
  );

  // Render realistic oil transformer based on gray/green reference images
  const renderOilTransformer = () => {
    return (
      <group>
        {/* Main tank - rectangular body */}
        <RoundedBox 
          args={[dimensions.width, dimensions.height, dimensions.depth]} 
          position={[0, 0, 0]}
          radius={0.08}
        >
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.6} />
        </RoundedBox>
        
        {/* Side radiators - "accordion" style cooling fins */}
        {[-1, 1].map((side, sideIndex) => (
          <group key={`radiator-side-${sideIndex}`}>
            {Array.from({ length: 6 }, (_, radIndex) => {
              const zPos = (radIndex - 2.5) * 0.15;
              return (
                <Box 
                  key={radIndex}
                  args={[0.12, dimensions.height * 0.85, 0.08]} 
                  position={[side * (dimensions.width/2 + 0.06), 0, zPos]}
                >
                  <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
                </Box>
              );
            })}
          </group>
        ))}
        
        {/* Top cover with bushings */}
        <Box args={[dimensions.width * 0.9, 0.1, dimensions.depth * 0.9]} position={[0, dimensions.height/2 + 0.05, 0]}>
          <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.5} />
        </Box>
        
        {/* High voltage bushings */}
        {[-0.3, 0, 0.3].map((xPos, i) => (
          <group key={`hv-bushing-${i}`}>
            <Cylinder 
              args={[0.12, 0.08, 0.8]} 
              position={[xPos, dimensions.height/2 + 0.5, -dimensions.depth/3]}
            >
              <meshStandardMaterial color="#E8E8E8" metalness={0.1} roughness={0.3} />
            </Cylinder>
            {/* Metal terminal */}
            <Cylinder 
              args={[0.06, 0.06, 0.15]} 
              position={[xPos, dimensions.height/2 + 0.9, -dimensions.depth/3]}
            >
              <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
            </Cylinder>
          </group>
        ))}
        
        {/* Low voltage bushings */}
        {[-0.2, 0.2].map((xPos, i) => (
          <group key={`lv-bushing-${i}`}>
            <Cylinder 
              args={[0.1, 0.07, 0.6]} 
              position={[xPos, dimensions.height/2 + 0.4, dimensions.depth/3]}
            >
              <meshStandardMaterial color="#E8E8E8" metalness={0.1} roughness={0.3} />
            </Cylinder>
          </group>
        ))}
        
        {/* Oil level gauge */}
        <Cylinder 
          args={[0.04, 0.04, 0.25]} 
          position={[dimensions.width/2 - 0.1, dimensions.height/3, 0]}
        >
          <meshStandardMaterial color="#333333" />
        </Cylinder>
        
        {/* Tank base/mounting */}
        <Box args={[dimensions.width * 1.2, 0.2, dimensions.depth * 1.2]} position={[0, -dimensions.height/2 - 0.1, 0]}>
          <meshStandardMaterial color="#333333" metalness={0.3} roughness={0.8} />
        </Box>
        
        {/* Drain valve */}
        <Cylinder 
          args={[0.03, 0.03, 0.1]} 
          position={[0, -dimensions.height/2 + 0.05, dimensions.depth/2]}
          rotation={[Math.PI/2, 0, 0]}
        >
          <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.4} />
        </Cylinder>
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Concrete foundation/platform */}
      <Box 
        args={[dimensions.width * 1.4, 0.15, dimensions.depth * 1.4]} 
        position={[0, -dimensions.height/2 - 0.3, 0]}
      >
        <meshStandardMaterial color="#CCCCCC" roughness={0.9} />
      </Box>
      
      {/* Main transformer body */}
      {config.type === "dry" ? renderDryTransformer() : renderOilTransformer()}
      
      {/* Custom text label */}
      {customText && (
        <Text
          position={[0, -dimensions.height/2 + 0.1, dimensions.depth/2 + 0.15]}
          fontSize={0.12}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          maxWidth={dimensions.width * 0.9}
        >
          {customText}
        </Text>
      )}
      
      {/* Power rating label */}
      <Text
        position={[0, dimensions.height/2 - 0.2, dimensions.depth/2 + 0.08]}
        fontSize={0.18}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {config.power} kVA
      </Text>
      
      {/* Technical specs */}
      <Text
        position={[0, -dimensions.height/2 + 0.35, dimensions.depth/2 + 0.08]}
        fontSize={0.08}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {config.material === "copper" ? "COBRE" : "ALUMÍNIO"} | {config.factorK}
        {config.oilType ? ` | ${config.oilType.toUpperCase()}` : ""}
      </Text>
    </group>
  );
};

export default RealisticTransformerModel3D;