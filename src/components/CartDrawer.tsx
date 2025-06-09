
import { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/CartStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const CartDrawer = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    removeItem, 
    updateQuantity, 
    getProductStock 
  } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    const success = await updateQuantity(id, newQuantity);
    if (!success && newQuantity > 0) {
      toast({
        title: "Estoque insuficiente",
        description: "Não há estoque suficiente para esta quantidade.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
    toast({
      title: "Item removido",
      description: "O produto foi removido do carrinho.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-white/80 hover:text-white transition-colors duration-200">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#4ADE80] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-[#1B1B1B]/95 backdrop-blur-xl border-l border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Seu carrinho está vazio</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4">
                {items.map((item) => {
                  const currentStock = getProductStock(item.id);
                  const maxQuantity = currentStock;
                  
                  return (
                    <div key={item.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="flex gap-3">
                        <img 
                          src={item.image.startsWith('http') ? item.image : `https://images.unsplash.com/${item.image}?w=80&h=80&fit=crop`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm mb-1">{item.name}</h3>
                          <p className="text-gray-400 text-xs mb-1">{item.brand}</p>
                          <p className="text-[#4ADE80] font-semibold">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Estoque: {maxQuantity} unidades
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= maxQuantity}
                            className={`w-8 h-8 rounded flex items-center justify-center ${
                              item.quantity >= maxQuantity
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                            }`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-white font-semibold">
                          R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-800 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-white">Total:</span>
                  <span className="text-xl font-bold text-[#4ADE80]">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-[#4ADE80] text-black hover:bg-[#22C55E] font-semibold"
                >
                  Finalizar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
