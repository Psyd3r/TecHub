
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, FileText, Smartphone, AlertTriangle } from "lucide-react";
import { PaymentForm } from "@/components/PaymentForm";
import { OrderSummary } from "@/components/OrderSummary";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Checkout = () => {
  const { items, getTotalPrice, clearCart, processOrder, products } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  const totalPrice = getTotalPrice();

  // Validar estoque antes do checkout
  const validateStock = () => {
    const errors: string[] = [];
    
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        errors.push(`Produto "${item.name}" não encontrado`);
        return;
      }
      
      if (product.stockQuantity < item.quantity) {
        if (product.stockQuantity === 0) {
          errors.push(`"${item.name}" está fora de estoque`);
        } else {
          errors.push(`"${item.name}": apenas ${product.stockQuantity} unidades disponíveis (você tem ${item.quantity} no carrinho)`);
        }
      }
    });
    
    setStockErrors(errors);
    return errors.length === 0;
  };

  const handlePayment = async (paymentData: any) => {
    // Validar estoque antes de processar
    if (!validateStock()) {
      toast({
        title: "Estoque insuficiente",
        description: "Alguns itens do seu carrinho não têm estoque suficiente.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Processar o pedido (salvar no banco e reduzir estoque)
      const orderNumber = await processOrder(paymentData);
      
      // Limpar carrinho
      clearCart();
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Pedido #${orderNumber} foi processado.`,
      });
      
      // Navegar para página de sucesso
      navigate("/order-success", { 
        state: { 
          orderData: { 
            items, 
            total: totalPrice, 
            paymentMethod, 
            orderNumber,
            ...paymentData 
          } 
        } 
      });
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

        {/* Alertas de estoque */}
        {stockErrors.length > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <div className="font-semibold mb-2">Problemas de estoque encontrados:</div>
              <ul className="list-disc list-inside space-y-1">
                {stockErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
                      disabled={stockErrors.length > 0}
                    />
                  </TabsContent>

                  <TabsContent value="boleto">
                    <PaymentForm 
                      type="boleto" 
                      onSubmit={handlePayment} 
                      isProcessing={isProcessing}
                      total={totalPrice}
                      disabled={stockErrors.length > 0}
                    />
                  </TabsContent>

                  <TabsContent value="pix">
                    <PaymentForm 
                      type="pix" 
                      onSubmit={handlePayment} 
                      isProcessing={isProcessing}
                      total={totalPrice}
                      disabled={stockErrors.length > 0}
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
