import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Plus, Minus, Trash2, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/transformer";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();
  
  // Check if coming from visualization with a new item
  const newItem = location.state?.cartItem as CartItem;
  
  React.useEffect(() => {
    if (newItem) {
      // This would be handled by the cart hook if we had a proper context
      // For now, we'll just navigate to the cart
    }
  }, [newItem]);

  const handleBack = () => {
    navigate("/configurator");
  };

  const handleContinue = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    navigate("/quotation", { state: { cartItems: items } });
  };

  const formatTransformerName = (item: CartItem) => {
    return `Transformador ${item.config.type === "dry" ? "Seco" : "a Óleo"} - ${item.config.power} kVA`;
  };

  const getSpecsText = (item: CartItem) => {
    const specs = [
      `${item.config.material === "copper" ? "Cobre" : "Alumínio"}`,
      `${item.config.factorK}`,
      `${item.config.inputVoltage} → ${item.config.outputVoltage}V`
    ];
    
    if (item.config.oilType) {
      specs.push(`Óleo ${item.config.oilType === "vegetal" ? "Vegetal" : "Mineral"}`);
    }
    
    return specs.join(" • ");
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <ShoppingCart className="h-10 w-10 text-primary" />
            Carrinho de Compras
          </h1>
          <p className="text-xl text-muted-foreground">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"} • Total: R$ {getTotalPrice().toLocaleString()}
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="industrial-card text-center p-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl mb-4">
                  <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-muted-foreground mb-2">Carrinho Vazio</h2>
                <p className="text-muted-foreground mb-6">Adicione transformadores ao seu carrinho para continuar.</p>
                <Button 
                  onClick={handleBack} 
                  className="gradient-primary text-lg px-8 py-4"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Adicionar Produtos
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <Card key={item.id} className="industrial-card">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      
                      {/* Product Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4">
                          {/* Visual Preview */}
                          <div 
                            className="w-16 h-12 rounded-lg border-2 border-primary/30 flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: item.config.color }}
                          >
                            {item.config.customName ? item.config.customName.substring(0, 4) : "AEB"}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1">
                              {formatTransformerName(item)}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {getSpecsText(item)}
                            </p>
                            {item.config.customName && (
                              <Badge variant="outline" className="text-xs">
                                Nome: {item.config.customName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="text-xl font-bold min-w-[3rem] text-center">
                          {item.quantity}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          R$ {item.finalPrice.toLocaleString()} / unidade
                        </div>
                        <div className="text-xl font-bold text-primary mb-3">
                          R$ {(item.finalPrice * item.quantity).toLocaleString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="industrial-card mb-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {formatTransformerName(item)} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        R$ {(item.finalPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground text-center mt-4">
                    Preços já incluem todas as configurações selecionadas
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleBack}
            className="text-lg px-8 py-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Adicionar Mais Itens
          </Button>
          
          <Button 
            size="lg" 
            onClick={handleContinue}
            className="text-lg px-8 py-4 gradient-primary"
            disabled={items.length === 0}
          >
            Finalizar Orçamento
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;