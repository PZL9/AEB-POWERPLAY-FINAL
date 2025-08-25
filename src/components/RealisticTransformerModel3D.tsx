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

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const getDimensions = () => {
    const power = typeof config.power === 'number' ? config.power : 0;
    
    if (config.type === "dry") {
      return { baseWidth: 2.2, baseHeight: 2.5, baseDepth: 1.2, type: "dry" };
    } else {
      if (power <= 300) {
        return { baseWidth: 1.6, baseHeight: 1.8, baseDepth: 1.0, type: "oil-small" };
      } else {
        return { baseWidth: 2.2, baseHeight: 2.4, baseDepth: 1.4, type: "oil-large" };
      }
    }
  };

  const dimensions = getDimensions();

  const renderDryTransformer = () => (
    <group>
      {/* Base and Top I-Beams */}
      <Box args={[dimensions.baseWidth, 0.1, 0.2]} position={[0, -dimensions.baseHeight / 2, 0.5]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
      </Box>
      <Box args={[dimensions.baseWidth, 0.1, 0.2]} position={[0, -dimensions.baseHeight / 2, -0.5]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
      </Box>
      <Box args={[dimensions.baseWidth, 0.1, dimensions.baseDepth]} position={[0, dimensions.baseHeight/2, 0]}>
         <meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} />
      </Box>

      {/* 3 Coils */}
      {[-0.65, 0, 0.65].map(xPos => (
        <group key={xPos} position={[xPos, -0.2, 0]}>
          <RoundedBox args={[0.5, 2, 0.8]} radius={0.05}>
            <meshStandardMaterial color={color} roughness={0.6} />
          </RoundedBox>
        </group>
      ))}

       {/* Nameplate */}
       <Box args={[0.6, 0.3, 0.02]} position={[0, 0, 0.42]}>
        <meshStandardMaterial color="#E5E5E5" metalness={0.1} roughness={0.2} />
      </Box>

      {/* Insulators */}
      {[ -0.8, -0.4, 0, 0.4, 0.8].map(xPos => (
         <Cylinder key={xPos} args={[0.08, 0.1, 0.6]} position={[xPos, dimensions.baseHeight / 2 + 0.3, 0]}>
           <meshStandardMaterial color="#B0B0B0" roughness={0.3} />
         </Cylinder>
      ))}
    </group>
  );

  const renderOilTransformer = (type: 'oil-small' | 'oil-large') => {
    const isLarge = type === 'oil-large';
    return (
    <group>
      {/* Main Tank */}
      <RoundedBox args={[dimensions.baseWidth, dimensions.baseHeight, dimensions.baseDepth]} radius={0.1}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </RoundedBox>

      {/* Radiators */}
      <group position={[isLarge ? -1.3 : -1, 0, 0]}>
        {Array.from({ length: isLarge ? 12 : 8 }).map((_, i) => (
          <Box key={i} args={[0.1, dimensions.baseHeight * 0.9, 0.3]} position={[0, 0, (i - (isLarge ? 5.5 : 3.5)) * 0.15]}>
             <meshStandardMaterial color={color} metalness={0.4} roughness={0.5}/>
          </Box>
        ))}
      </group>
      <group position={[isLarge ? 1.3 : 1, 0, 0]}>
        {Array.from({ length: isLarge ? 12 : 8 }).map((_, i) => (
          <Box key={i} args={[0.1, dimensions.baseHeight * 0.9, 0.3]} position={[0, 0, (i - (isLarge ? 5.5 : 3.5)) * 0.15]}>
             <meshStandardMaterial color={color} metalness={0.4} roughness={0.5}/>
          </Box>
        ))}
      </group>
      
      {/* Top Bushings (Insulators) */}
      {[ -0.5, 0, 0.5].map(xPos => (
        <Cylinder key={xPos} args={[0.1, 0.12, 0.7]} position={[xPos, dimensions.baseHeight / 2 + 0.35, -0.3]}>
           <meshStandardMaterial color="#B0B0B0" roughness={0.3} />
        </Cylinder>
      ))}

      {/* Expansion Tank for large model */}
      {isLarge && (
        <Cylinder args={[0.3, 0.3, 1.5]} position={[0, dimensions.baseHeight / 2 + 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
        </Cylinder>
      )}

      {/* Nameplate */}
      <Box args={[0.4, 0.3, 0.02]} position={[0, 0.2, dimensions.baseDepth / 2 + 0.01]}>
        <meshStandardMaterial color="#E5E5E5" metalness={0.1} roughness={0.2} />
      </Box>
    </group>
  )};

  const renderModel = () => {
    switch (dimensions.type) {
      case 'dry':
        return renderDryTransformer();
      case 'oil-small':
        return renderOilTransformer('oil-small');
      case 'oil-large':
        return renderOilTransformer('oil-large');
      default:
        return null;
    }
  }

  return (
    <group ref={groupRef}>
      {renderModel()}
      {customText && (
        <Text
          position={[0, 0.2, dimensions.baseDepth / 2 + 0.02]}
          rotation={[0, 0, 0]}
          fontSize={0.08}
          color="#1A1A1A"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.35}
        >
          {customText.toUpperCase()}
        </Text>
      )}
    </group>
  );
};

export default RealisticTransformerModel3D;