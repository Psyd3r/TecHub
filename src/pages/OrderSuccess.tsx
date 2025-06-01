
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home, Package } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const generateBoleto = () => {
    // Simulação de download do boleto
    const boletoContent = `
BOLETO BANCÁRIO - TECHHUB
Número do Pedido: ${orderNumber}
Valor: R$ ${orderData.total.toLocaleString('pt-BR')}
Vencimento: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
    `;
    
    const blob = new Blob([boletoContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleto-${orderNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-400">Seu pedido foi processado com sucesso</p>
        </div>

        {/* Order Details */}
        <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Número do Pedido:</span>
                <p className="text-white font-semibold">{orderNumber}</p>
              </div>
              <div>
                <span className="text-gray-400">Método de Pagamento:</span>
                <p className="text-white font-semibold capitalize">
                  {orderData.paymentMethod === "credit" ? "Cartão de Crédito" : 
                   orderData.paymentMethod === "boleto" ? "Boleto Bancário" : "PIX"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Total:</span>
                <p className="text-[#4ADE80] font-bold text-lg">R$ {orderData.total.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-gray-400">Previsão de Entrega:</span>
                <p className="text-white font-semibold">{estimatedDelivery.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Payment Instructions */}
            {orderData.paymentMethod === "boleto" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">Instruções de Pagamento</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Seu boleto foi gerado com sucesso. Pague até o vencimento para confirmar seu pedido.
                </p>
                <Button onClick={generateBoleto} variant="outline" size="sm" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Boleto
                </Button>
              </div>
            )}

            {orderData.paymentMethod === "pix" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">PIX Confirmado</h3>
                <p className="text-gray-300 text-sm">
                  Seu pagamento via PIX foi processado com sucesso. O pedido já está sendo preparado.
                </p>
              </div>
            )}

            {orderData.paymentMethod === "credit" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Cartão de Crédito</h3>
                <p className="text-gray-300 text-sm">
                  Seu pagamento foi aprovado com sucesso. O pedido já está sendo preparado.
                </p>
              </div>
            )}

            {/* Items */}
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-white font-semibold mb-3">Itens do Pedido</h3>
              <div className="space-y-2">
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{item.quantity}x {item.name}</span>
                    <span className="text-white">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/")} 
            className="flex-1 button-gradient"
          >
            <Home className="h-4 w-4 mr-2" />
            Voltar à Loja
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
