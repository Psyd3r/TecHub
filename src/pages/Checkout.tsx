
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, FileText, Smartphone } from "lucide-react";
import { PaymentForm } from "@/components/PaymentForm";
import { OrderSummary } from "@/components/OrderSummary";

const Checkout = () => {
  const { items, getTotalPrice, clearCart, processOrder } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = getTotalPrice();

  const handlePayment = async (paymentData: any) => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      // Processar o pedido (atualizar estoque)
      processOrder();
      clearCart();
      navigate("/order-success", { 
        state: { 
          orderData: { items, total: totalPrice, paymentMethod, ...paymentData } 
        } 
      });
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Carrinho Vazio</h1>
          <p className="text-gray-400 mb-6">Adicione produtos ao carrinho para continuar</p>
          <Button onClick={() => navigate("/")} className="button-gradient">
            Voltar às Compras
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div>
            <OrderSummary items={items} total={totalPrice} />
          </div>

          {/* Formulário de Pagamento */}
          <div>
            <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-xl">Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="credit" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão
                    </TabsTrigger>
                    <TabsTrigger value="boleto" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Boleto
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      PIX
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit">
                    <PaymentForm 
                      type="credit" 
                      onSubmit={handlePayment} 
                      isProcessing={isProcessing}
                      total={totalPrice}
                    />
                  </TabsContent>

                  <TabsContent value="boleto">
                    <PaymentForm 
                      type="boleto" 
                      onSubmit={handlePayment} 
                      isProcessing={isProcessing}
                      total={totalPrice}
                    />
                  </TabsContent>

                  <TabsContent value="pix">
                    <PaymentForm 
                      type="pix" 
                      onSubmit={handlePayment} 
                      isProcessing={isProcessing}
                      total={totalPrice}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
