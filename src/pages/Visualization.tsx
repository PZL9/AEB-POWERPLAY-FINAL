import { useState, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ShoppingCart, Palette, Target, MousePointer, ZoomIn, Zap } from "lucide-react";
import { TransformerConfig } from "@/types/transformer";
import RealisticTransformerModel3D from "@/components/RealisticTransformerModel3D";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const Visualization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();
  const config = location.state?.config as TransformerConfig;
  
  const [customName, setCustomName] = useState(config?.customName || "");
  const [selectedColor, setSelectedColor] = useState(config?.color || "#FF6B35");

  // Color palette for transformer customization
  const colorOptions = [
    { name: "Branco", value: "#FFFFFF" },
    { name: "Preto", value: "#000000" },
    { name: "Azul Claro", value: "#60A5FA" },
    { name: "Azul Escuro", value: "#1E3A8A" },
    { name: "Verde", value: "#22C55E" },
    { name: "Vermelho", value: "#EF4444" },
    { name: "Vinho", value: "#7C2D12" },
    { name: "Amarelo", value: "#FACC15" },
    { name: "Laranja AEB", value: "#FF6B35" },
    { name: "Cinza", value: "#6B7280" },
    { name: "Lilás", value: "#A855F7" },
    { name: "Rosa", value: "#EC4899" }
  ];

  const handleBack = () => {
    navigate("/configurator");
  };

  const handleAddToCart = () => {
    const updatedConfig = {
      ...config,
      customName,
      color: selectedColor
    };
    addToCart(updatedConfig);
    
    toast({
      title: "Adicionado ao carrinho!",
      description: `Transformador ${config.type === "dry" ? "Seco" : "a Óleo"} - ${config.power} kVA`,
    });

    // Navigate to cart after adding item
    navigate("/cart");
  };

  const handleContinue = () => {
    const updatedConfig = {
      ...config,
      customName,
      color: selectedColor
    };
    navigate("/quotation", { state: { config: updatedConfig } });
  };

  if (!config) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-dark p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* 3D Visualization Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">Visualização 3D</h1>
            <p className="text-muted-foreground">Interaja com seu transformador personalizado</p>
          </div>

          <Card className="industrial-card h-[600px] relative overflow-hidden">
            <CardContent className="p-0 h-full">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-2xl text-primary">Carregando modelo 3D...</div>
                </div>
              }>
                <Canvas
                  camera={{ position: [5, 5, 5], fov: 45 }}
                  style={{ background: "transparent" }}
                >
                  <ambientLight intensity={0.4} />
                  <spotLight 
                    position={[10, 10, 10]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1}
                    castShadow 
                  />
                  <pointLight position={[-10, -10, -10]} intensity={0.3} />
                  
                  <RealisticTransformerModel3D 
                    config={config}
                    color={selectedColor}
                    customText={customName}
                  />
                  
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={15}
                    autoRotate={false}
                  />
                  
                  <ContactShadows 
                    position={[0, -2, 0]} 
                    opacity={0.4} 
                    scale={10} 
                    blur={1.5} 
                    far={4} 
                  />
                  
                  <Environment preset="warehouse" />
                </Canvas>
              </Suspense>
            </CardContent>

            {/* 3D Controls Overlay */}
            <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <MousePointer className="h-3 w-3" /> Arraste para girar
                </div>
                <div className="flex items-center gap-1">
                  <ZoomIn className="h-3 w-3" /> Scroll para zoom
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" /> Toque para interagir
                </div>
              </div>
            </div>
          </Card>

          {/* Configuration Summary */}
          <Card className="industrial-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">Configuração Selecionada</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Tipo:</strong> {config.type === "dry" ? "Seco" : "Óleo"}</div>
                <div><strong>Potência:</strong> {config.power} kVA</div>
                <div><strong>Função:</strong> {config.function === "step-down" ? "Rebaixador" : "Elevador"}</div>
                {config.oilType && <div><strong>Óleo:</strong> {config.oilType === "vegetal" ? "Vegetal" : "Mineral"}</div>}
                <div><strong>Material:</strong> {config.material === "copper" ? "Cobre" : "Alumínio"}</div>
                <div><strong>Fator K:</strong> {config.factorK}</div>
                <div><strong>Entrada:</strong> {config.inputVoltage}</div>
                <div><strong>Saída:</strong> {config.outputVoltage}V</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalization Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Personalização</h2>
            <p className="text-muted-foreground">Customize a aparência do seu transformador</p>
          </div>

          {/* Color Selection */}
          <Card className="industrial-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Escolha a Cor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`
                      relative w-16 h-16 rounded-lg border-2 transition-all hover:scale-110
                      ${selectedColor === color.value 
                        ? "border-primary shadow-lg ring-2 ring-primary/30" 
                        : "border-border hover:border-primary/50"
                      }
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Cor selecionada: <span className="font-medium">
                  {colorOptions.find(c => c.value === selectedColor)?.name || "Personalizada"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Custom Name/Text */}
          <Card className="industrial-card mb-6">
            <CardHeader>
              <CardTitle>Nome Personalizado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="customName">
                  Adicione um nome ou frase (máx. 30 caracteres)
                </Label>
                <Input
                  id="customName"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value.slice(0, 30))}
                  placeholder="Ex: TRANSFORMADOR ALMOXARIFADO 01"
                  className="text-lg"
                />
                <div className="text-xs text-muted-foreground">
                  {customName.length}/30 caracteres
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Info */}
          <Card className="industrial-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-lg">
                <div className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-primary mb-2">Visualização Interativa</div>
                  <div className="text-sm text-muted-foreground">
                    Seu transformador está sendo renderizado em tempo real com as personalizações aplicadas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart and Navigation */}
          <div className="space-y-4">
            {/* Add to Cart */}
            <Button 
              onClick={handleAddToCart}
              className="w-full text-lg px-8 py-4 bg-success hover:bg-success/90"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho {getTotalItems() > 0 && `(${getTotalItems()})`}
            </Button>
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleBack}
                className="text-lg px-8 py-4"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar
              </Button>
              
              <Button 
                size="lg" 
                onClick={handleContinue}
                className="text-lg px-8 py-4 gradient-primary"
              >
                Orçamento Direto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;