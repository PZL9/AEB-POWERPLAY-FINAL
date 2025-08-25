import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Gift, Zap, ShoppingCart, QrCode } from "lucide-react";
import { TransformerConfig, CartItem } from "@/types/transformer";
import { useToast } from "@/hooks/use-toast";
import { useQuotationCounter } from "@/hooks/useQuotationCounter";
import { calculateTransformerPrice, generateCompetitorPrices } from "@/utils/pricing";
import { generateQuotationPDF } from "@/utils/pdfGenerator";
import InteractivePrizeWheel from "@/components/InteractivePrizeWheel";
import { PDFQRCodeDialog } from "@/components/PDFQRCodeDialog";

const Quotation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { incrementRealQuotation } = useQuotationCounter();
  
  const config = location.state?.config as TransformerConfig;
  const cartItems = location.state?.cartItems as CartItem[];
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showWheel, setShowWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [competitorPrices, setCompetitorPrices] = useState<{
    competitorA: number;
    competitorB: number;
    savings: number;
  } | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  const quotationItems: CartItem[] = cartItems || (config ? [{
    id: "single-item",
    config,
    quantity: 1,
    basePrice: calculateTransformerPrice(config, false),
    finalPrice: calculateTransformerPrice(config, true)
  }] : []);

  const totalPrice = quotationItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

  useEffect(() => {
    if (totalPrice > 0) {
      const configSeed = quotationItems.map(item => 
        `${item.config.type}-${item.config.power}-${item.config.material}-${item.config.factorK}`
      ).join('-');
      
      const prices = generateCompetitorPrices(totalPrice, configSeed);
      setCompetitorPrices(prices);
    }
  }, [totalPrice]);

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, digite um número de WhatsApp válido.",
        variant: "destructive"
      });
      return;
    }
    setShowWheel(true);
  };

  const handleWheelResult = (prize: string) => {
    setWheelResult(prize);
    setShowWheel(false);
    incrementRealQuotation();
    
    toast({
      title: "Parabéns!",
      description: `Você ganhou: ${prize}`,
    });
  };

  const handleGenerateAndShowQR = async () => {
    if (!wheelResult || !competitorPrices) return;
    
    setIsGeneratingPDF(true);
    try {
      const blob = await generateQuotationPDF(quotationItems, phoneNumber, wheelResult, competitorPrices);
      setPdfBlob(blob);
      setIsQrCodeModalOpen(true);
      toast({
        title: "Orçamento Gerado!",
        description: "Escaneie o QR Code para baixar em seu celular.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleBack = () => {
    navigate("/configurator");
  };

  const handleNewQuotation = () => {
    navigate("/");
  };

  if (quotationItems.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <>
      <PDFQRCodeDialog
        pdfBlob={pdfBlob}
        open={isQrCodeModalOpen}
        onOpenChange={setIsQrCodeModalOpen}
      />
      <div className="min-h-screen bg-gradient-dark p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Orçamento Final</h1>
            <p className="text-xl text-muted-foreground">Seu transformador personalizado está pronto!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="industrial-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  {quotationItems.length === 1 ? "Seu Transformador" : `Seus Transformadores (${quotationItems.length})`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {quotationItems.map((item) => (
                  <div key={item.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-8 rounded border-2 border-primary/30 flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: item.config.color }}
                      >
                        {item.config.customName ? item.config.customName.substring(0, 3) : "AEB"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          Transformador {item.config.type === "dry" ? "Seco" : "a Óleo"}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.config.power} kVA</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Material: {item.config.material === "copper" ? "Cobre" : "Alumínio"}</div>
                      <div>Fator K: {item.config.factorK}</div>
                      {item.config.oilType && (
                        <div className="col-span-2">Óleo: {item.config.oilType === "vegetal" ? "Vegetal" : "Mineral"}</div>
                      )}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm">Qtd: {item.quantity}</span>
                      <span className="font-bold text-primary">R$ {(item.finalPrice * item.quantity).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">R$ {totalPrice.toLocaleString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="industrial-card">
              <CardHeader>
                <CardTitle className="text-center text-primary">Comparação de Preços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-primary rounded-lg">
                  <div className="text-sm font-medium mb-1 text-primary-foreground">AEB - A Elétrica do Brasil</div>
                  <div className="text-3xl font-bold text-primary-foreground drop-shadow-md">R$ {totalPrice.toLocaleString('pt-BR')}</div>
                </div>
                {competitorPrices && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <span className="font-medium">Concorrente A</span>
                        <span className="text-lg font-bold text-red-500">R$ {competitorPrices.competitorA.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <span className="font-medium">Concorrente B</span>
                        <span className="text-lg font-bold text-red-500">R$ {competitorPrices.competitorB.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-center p-4 bg-success/10 border border-success/30 rounded-lg">
                      <div className="text-sm text-success-foreground mb-1">Sua Economia</div>
                      <div className="text-2xl font-bold text-success">
                        R$ {Math.round(competitorPrices.savings).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="industrial-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-center">
                  <Gift className="h-5 w-5 text-primary" />
                  Roleta de Premiação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showWheel && !wheelResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        Informe seu WhatsApp para participar da nossa roleta de prêmios exclusiva!
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="text-lg"
                      />
                    </div>
                    <Button 
                      onClick={handlePhoneSubmit} 
                      className="w-full gradient-primary text-lg py-4"
                      disabled={!phoneNumber}
                    >
                      <Gift className="mr-2 h-5 w-5" />
                      GIRAR ROLETA E GANHAR PRÊMIO
                    </Button>
                  </div>
                ) : showWheel ? (
                  <div className="h-[420px] flex items-center justify-center">
                    <InteractivePrizeWheel 
                      onResult={handleWheelResult}
                      orderValue={totalPrice}
                    />
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="text-center">
                      <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-2">Parabéns!</h3>
                      <p className="text-lg">Você ganhou:</p>
                      <Badge className="text-lg px-4 py-2 mt-2 bg-primary">{wheelResult}</Badge>
                    </div>
                    <Button 
                      onClick={handleGenerateAndShowQR}
                      disabled={isGeneratingPDF}
                      className="w-full gradient-primary text-lg py-6 h-auto"
                    >
                      <QrCode className="mr-2 h-5 w-5" />
                      {isGeneratingPDF ? "GERANDO..." : "VER QR CODE DO ORÇAMENTO"}
                    </Button>
                    <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                      <p className="text-sm text-foreground font-medium">
                        <Zap className="inline h-4 w-4 mr-1 text-primary" />
                        O PDF inclui um QR Code para falar com nosso representante!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-between items-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleBack}
              className="text-lg px-8 py-4"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar e Editar
            </Button>
            <Button 
              size="lg" 
              onClick={handleNewQuotation}
              variant="outline"
              className="text-lg px-8 py-4"
            >
              Novo Orçamento
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quotation;