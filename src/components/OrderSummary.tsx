
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItemModel } from "@/models/CartModel";

interface OrderSummaryProps {
  items: CartItemModel[];
  total: number;
}

export const OrderSummary = ({ items, total }: OrderSummaryProps) => {
  const subtotal = total;
  const shipping = total > 200 ? 0 : 29.90;
  const finalTotal = subtotal + shipping;

  const getImageUrl = (image: string) => {
    // Se a imagem já é uma URL completa, usar diretamente
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    // Caso contrário, usar o padrão Unsplash
    return `https://images.unsplash.com/${image}?w=60&h=60&fit=crop`;
  };

  return (
    <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-xl">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Itens */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-b-0">
              <img 
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  // Fallback para uma imagem padrão em caso de erro
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=60&h=60&fit=crop';
                }}
              />
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium">{item.name}</h4>
                <p className="text-gray-400 text-xs">{item.brand}</p>
                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-[#4ADE80] font-semibold">
                  R$ {(item.price * item.quantity).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totais */}
        <div className="space-y-2 pt-4 border-t border-gray-800">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal:</span>
            <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Frete:</span>
            <span className={shipping === 0 ? "text-green-400" : ""}>
              {shipping === 0 ? "Grátis" : `R$ ${shipping.toLocaleString('pt-BR')}`}
            </span>
          </div>
          {shipping === 0 && (
            <p className="text-xs text-green-400">✓ Frete grátis para compras acima de R$ 200</p>
          )}
          <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
            <span>Total:</span>
            <span className="text-[#4ADE80]">R$ {finalTotal.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
