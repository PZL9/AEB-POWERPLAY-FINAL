import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Zap, Users, Factory } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuotationCounter } from "@/hooks/useQuotationCounter";
import aebLogo from "@/assets/aeb-logo.png"; // <-- LINHA CORRIGIDA AQUI

const Welcome = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { count: quotationCount } = useQuotationCounter();

  const handleStartQuotation = () => {
    navigate("/configurator");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 bg-card/80 backdrop-blur-sm border-primary/30"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        {/* AEB Logo */}
        <div className="mb-8 animate-fade-in-up">
          <img 
            src={aebLogo} 
            alt="AEB - A Elétrica do Brasil" 
            className="h-32 w-auto mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Hero Title */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-6xl font-bold mb-6 text-glow">
            <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-lg">
              A ENERGIA QUE TRANSFORMA
            </span>
          </h1>
          <h2 className="text-4xl font-bold text-foreground/90 mb-4">
            O SEU NEGÓCIO
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Configure seu transformador personalizado e gere um orçamento em 60 segundos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Card className="industrial-card p-6 text-center">
            <Factory className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">+25</div>
            <div className="text-sm text-muted-foreground">Anos de Experiência</div>
          </Card>
          
          <Card className="industrial-card p-6 text-center">
            <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">+10.000</div>
            <div className="text-sm text-muted-foreground">Transformadores Entregues</div>
          </Card>
          
          <Card className="industrial-card p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">{quotationCount}</div>
            <div className="text-sm text-muted-foreground">Orçamentos Realizados</div>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Button 
            onClick={handleStartQuotation}
            size="lg"
            className="industrial-button text-2xl px-16 py-8 h-auto rounded-2xl gradient-primary hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-primary/25"
          >
            <Zap className="mr-4 h-8 w-8" />
            MONTE SEU TRANSFORMADOR E
            <br />
            GERE UM ORÇAMENTO EM 60 SEGUNDOS
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <Badge variant="outline" className="text-sm px-4 py-2 border-primary/30 text-primary flex items-center gap-1">
            <Zap className="h-3 w-3" /> Qualidade Garantida
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 border-primary/30 text-primary flex items-center gap-1">
            <Factory className="h-3 w-3" /> Orçamento Seguro
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 border-primary/30 text-primary flex items-center gap-1">
            <Zap className="h-3 w-3" /> Preços Competitivos
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2 border-primary/30 text-primary flex items-center gap-1">
            <Users className="h-3 w-3" /> Líderes no Mercado
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Welcome;