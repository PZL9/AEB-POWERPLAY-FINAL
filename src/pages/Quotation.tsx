import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Gift, Zap, ShoppingCart, QrCode, Smartphone, MessageSquare } from "lucide-react";
import { TransformerConfig, CartItem } from "@/types/transformer";
import { useToast } from "@/hooks/use-toast";
import { useQuotationCounter } from "@/hooks/useQuotationCounter";
import { calculateTransformerPrice, generateCompetitorPrices } from "@/utils/pricing";
import InteractivePrizeWheel from "@/components/InteractivePrizeWheel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import QRCode from 'qrcode';

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
  
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');

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
  }, [totalPrice, quotationItems]);

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

    const representativePhone = "5511912345678"; // IMPORTANTE: Substituir pelo número real
    const orderSummary = quotationItems.map(item => 
      `${item.quantity}x Trafo ${item.config.type} ${item.config.power}kVA (${item.config.material}, ${item.config.factorK})`
    ).join('; ');
    
    const message = `Olá! Tenho interesse no seguinte orçamento gerado no totem da AEB:\n\n*ITENS:*\n${orderSummary}\n\n*VALOR TOTAL:* R$ ${totalPrice.toLocaleString('pt-BR')}\n*PRÊMIO GANHO:* ${wheelResult}\n\n*MEU CONTATO:* ${phoneNumber}`;
    const whatsappUrl = `https://wa.me/${representativePhone}?text=${encodeURIComponent(message)}`;

    try {
      const imageUrl = await QRCode.toDataURL(whatsappUrl, { width: 400, margin: 1 });
      setQrCodeImage(imageUrl);
      setIsQrCodeModalOpen(true);
    } catch (error) {
      console.error("Failed to generate WhatsApp QR Code", error);
      toast({ title: "Erro ao gerar QR Code", variant: "destructive" });
    }
  };
  
  const handleBack = () => {
    navigate(cartItems ? "/cart" : "/visualization", { state: { config } });
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
      <Dialog open={isQrCodeModalOpen} onOpenChange={setIsQrCodeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Receba seu Orçamento</DialogTitle>
            <DialogDescription className="text-center text-base">
              Aponte a câmera no QR Code para iniciar a conversa no WhatsApp e receber seu PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {qrCodeImage ? (
              <img src={qrCodeImage} alt="QR Code para WhatsApp" className="rounded-lg border-4 border-primary" />
            ) : (
              <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                Carregando QR Code...
              </div>
            )}
          </div>
          <div className="flex items-center justify-center text-muted-foreground mt-4">
              <Smartphone className="h-5 w-5 mr-2" />
              <span>Escaneie para falar com um representante.</span>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-dark p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Orçamento Final</h1>
            <p className="text-xl text-muted-foreground">Seu transformador personalizado está pronto!</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="industrial-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Resumo do Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quotationItems.map((item) => (
                  <div key={item.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-base text-primary">
                                {item.quantity}x Transformador {item.config.type === "dry" ? "Seco" : "a Óleo"}
                            </h4>
                            <p className="text-sm font-bold">{item.config.power} kVA</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {item.config.material === "copper" ? "Cobre" : "Alumínio"} • Fator {item.config.factorK} {item.config.customName ? `• Nome: ${item.config.customName}` : ''}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-lg">R$ {(item.finalPrice * item.quantity).toLocaleString('pt-BR')}</p>
                             <p className="text-xs text-muted-foreground">R$ {item.finalPrice.toLocaleString('pt-BR')} / un.</p>
                        </div>
                    </div>
                  </div>
                ))}
                <Separator className="my-4"/>
                {competitorPrices && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-muted-foreground">Média Concorrentes:</span>
                            <span className="font-semibold line-through">R$ {((competitorPrices.competitorA + competitorPrices.competitorB) / 2).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-muted-foreground">Sua Economia:</span>
                            <span className="font-semibold text-success">R$ {Math.round(competitorPrices.savings).toLocaleString('pt-BR')}</span>
                        </div>
                         <div className="flex justify-between items-center text-2xl font-bold text-primary">
                            <span>TOTAL AEB:</span>
                            <span>R$ {totalPrice.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                )}
              </CardContent>
            </Card>

            <Card className="industrial-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-center">
                  <Gift className="h-5 w-5 text-primary" />
                  Etapa Final
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showWheel && !wheelResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        Informe seu WhatsApp para ganhar um prêmio exclusivo!
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
                      className="w-full gradient-primary text-lg py-6 h-auto"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      RECEBER ORÇAMENTO NO WHATSAPP
                    </Button>
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