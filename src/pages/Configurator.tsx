import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Zap, Leaf, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransformerConfig } from "@/types/transformer";

const Configurator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<TransformerConfig>({
    type: "",
    power: "",
    function: "",
    oilType: "",
    material: "",
    factorK: "",
    inputVoltage: "",
    outputVoltage: "",
    customName: "",
    color: "#FF6B35"
  });

  const steps = [
    { title: "Tipo de Transformador", key: "type" },
    { title: "Potência", key: "power" },
    { title: "Função", key: "function" },
    ...(config.type === "oil" ? [{ title: "Tipo de Óleo", key: "oilType" }] : []),
    { title: "Material", key: "material" },
    { title: "Fator K", key: "factorK" },
    { title: "Tensão de Entrada", key: "inputVoltage" },
    { title: "Tensão de Saída", key: "outputVoltage" }
  ];

  const powerOptions = [45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000];

  const handleNext = () => {
    const currentStepKey = steps[currentStep].key;
    
    if (!config[currentStepKey as keyof TransformerConfig]) {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, faça uma seleção antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (String(config[currentStepKey as keyof TransformerConfig]) === "others") {
      toast({
        title: "Projeto Especial Detectado",
        description: "Para projetos customizados, procure nosso representante de vendas para um atendimento personalizado.",
        variant: "default"
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/visualization", { state: { config } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const updateConfig = (key: keyof TransformerConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderStepContent = () => {
    const stepKey = steps[currentStep].key;

    switch (stepKey) {
      case "type":
        return (
          <div className="grid grid-cols-2 gap-6">
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.type === "dry" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("type", "dry")}
            >
              <CardContent className="p-8 text-center">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Transformador a Seco</h3>
                <p className="text-muted-foreground">Ideal para ambientes internos, sem necessidade de óleo</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.type === "oil" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("type", "oil")}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 bg-primary rounded-full" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Transformador a Óleo</h3>
                <p className="text-muted-foreground">Maior capacidade de resfriamento, ideal para altas potências</p>
              </CardContent>
            </Card>
          </div>
        );

      case "power":
        return (
          <div className="grid grid-cols-4 gap-4">
            {powerOptions.map((power) => (
              <Card 
                key={power}
                className={`cursor-pointer industrial-card transition-all ${config.power === power ? "border-primary shadow-lg" : ""}`}
                onClick={() => updateConfig("power", power)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary">{power}</div>
                  <div className="text-sm text-muted-foreground">kVA</div>
                </CardContent>
              </Card>
            ))}
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.power === "others" ? "border-warning shadow-lg" : ""}`}
              onClick={() => updateConfig("power", "others")}
            >
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-lg font-bold text-warning">Outros</div>
              </CardContent>
            </Card>
          </div>
        );

      case "function":
        return (
          <div className="grid grid-cols-2 gap-6">
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.function === "step-down" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("function", "step-down")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">⬇️</div>
                <h3 className="text-2xl font-bold mb-2">Rebaixador</h3>
                <p className="text-muted-foreground">Reduz a tensão de entrada</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.function === "step-up" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("function", "step-up")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">⬆️</div>
                <h3 className="text-2xl font-bold mb-2">Elevador</h3>
                <p className="text-muted-foreground">Aumenta a tensão de entrada</p>
              </CardContent>
            </Card>
          </div>
        );

      case "oilType":
        return (
          <div className="grid grid-cols-2 gap-6">
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.oilType === "vegetal" ? "border-success shadow-lg" : ""}`}
              onClick={() => updateConfig("oilType", "vegetal")}
            >
              <CardContent className="p-8 text-center">
                <Leaf className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-success">Óleo Vegetal</h3>
                <Badge className="mb-3 bg-success">ECO-FRIENDLY</Badge>
                <p className="text-muted-foreground">Mais sustentável, biodegradável e seguro para o meio ambiente</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.oilType === "mineral" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("oilType", "mineral")}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="h-8 w-8 bg-foreground/60 rounded-full" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Óleo Mineral</h3>
                <Badge className="mb-3">PADRÃO</Badge>
                <p className="text-muted-foreground">Solução tradicional e confiável</p>
              </CardContent>
            </Card>
          </div>
        );

      case "material":
        return (
          <div className="grid grid-cols-2 gap-6">
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.material === "aluminum" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("material", "aluminum")}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl font-bold">Al</div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Alumínio</h3>
                <Badge className="mb-3">PADRÃO</Badge>
                <p className="text-muted-foreground">Leveza e resistência à corrosão</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.material === "copper" ? "border-warning shadow-lg" : ""}`}
              onClick={() => updateConfig("material", "copper")}
            >
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl font-bold text-warning">Cu</div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Cobre</h3>
                <Badge className="mb-3 bg-warning text-warning-foreground">PREMIUM</Badge>
                <p className="text-muted-foreground">Maior condutividade e durabilidade</p>
              </CardContent>
            </Card>
          </div>
        );

      case "factorK":
        return (
          <div className="grid grid-cols-3 gap-6">
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.factorK === "K1" ? "border-primary shadow-lg" : ""}`}
              onClick={() => updateConfig("factorK", "K1")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-4">K1</div>
                <h3 className="text-xl font-bold mb-2">Padrão</h3>
                <p className="text-muted-foreground">Proteção básica contra harmônicos</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.factorK === "K4" ? "border-success shadow-lg" : ""}`}
              onClick={() => updateConfig("factorK", "K4")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-success mb-4">K4</div>
                <h3 className="text-xl font-bold mb-2">Reforçado</h3>
                <p className="text-muted-foreground">Proteção avançada contra harmônicos</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.factorK === "others" ? "border-warning shadow-lg" : ""}`}
              onClick={() => updateConfig("factorK", "others")}
            >
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-xl font-bold text-warning">Outros</h3>
                <p className="text-muted-foreground">Fator K personalizado</p>
              </CardContent>
            </Card>
          </div>
        );

      case "inputVoltage":
        return (
          <div className="grid grid-cols-3 gap-6">
            {["15kV", "24kV", "36kV"].map((voltage) => (
              <Card 
                key={voltage}
                className={`cursor-pointer industrial-card transition-all ${config.inputVoltage === voltage ? "border-primary shadow-lg" : ""}`}
                onClick={() => updateConfig("inputVoltage", voltage)}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-3xl font-bold text-primary mb-4">{voltage}</div>
                  <h3 className="text-xl font-bold">Entrada</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "outputVoltage":
        return (
          <div className="grid grid-cols-3 gap-4">
            {["440/220", "220/127", "380/220", "800/462", "690"].map((voltage) => (
              <Card 
                key={voltage}
                className={`cursor-pointer industrial-card transition-all ${config.outputVoltage === voltage ? "border-primary shadow-lg" : ""}`}
                onClick={() => updateConfig("outputVoltage", voltage)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{voltage}V</div>
                  <h4 className="text-lg font-bold">Saída</h4>
                </CardContent>
              </Card>
            ))}
            <Card 
              className={`cursor-pointer industrial-card transition-all ${config.outputVoltage === "others" ? "border-warning shadow-lg" : ""}`}
              onClick={() => updateConfig("outputVoltage", "others")}
            >
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-warning mx-auto mb-2" />
                <div className="text-lg font-bold text-warning">Outros</div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-foreground">Configurador Inteligente</h1>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Etapa {currentStep + 1} de {steps.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-3 bg-muted" />
          
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-primary mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">Selecione a opção desejada para continuar</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12 animate-fade-in-up">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleBack}
            className="text-lg px-8 py-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {currentStep === 0 ? "Voltar ao Início" : "Anterior"}
          </Button>
          
          <Button 
            size="lg" 
            onClick={handleNext}
            className="text-lg px-8 py-4 gradient-primary"
          >
            {currentStep === steps.length - 1 ? "Personalizar" : "Próximo"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configurator;