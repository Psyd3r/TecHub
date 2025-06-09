
import { useState } from 'react';
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductActionsProps {
  productId: number;
  productName: string;
  price: number;
  isInStock: boolean;
  availableStock: number;
  inCartQuantity: number;
  onAddToCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const ProductActions = ({ 
  productId,
  productName,
  price,
  isInStock, 
  availableStock,
  inCartQuantity,
  onAddToCart,
  onUpdateQuantity
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, availableStock));
    setQuantity(newQuantity);
  };

  const canAddToCart = isInStock && availableStock > 0;

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800 sticky top-4">
      <div className="space-y-4">
        {/* Quantity Selector */}
        {canAddToCart && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Quantidade:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 rounded-lg border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 bg-gray-800 rounded-lg text-white font-medium min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= availableStock}
                className="p-2 rounded-lg border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Subtotal */}
        {canAddToCart && (
          <div className="flex justify-between items-center py-2 border-t border-gray-700">
            <span className="text-gray-300">Subtotal:</span>
            <span className="text-xl font-bold text-[#4ADE80]">
              R$ {(price * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button 
          className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
            canAddToCart
              ? 'bg-[#4ADE80] text-black hover:bg-[#22C55E] hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!canAddToCart}
          onClick={() => {
            for (let i = 0; i < quantity; i++) {
              onAddToCart();
            }
          }}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          {canAddToCart ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>

        {/* Cart Info */}
        {inCartQuantity > 0 && (
          <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              Você já tem {inCartQuantity} unidade{inCartQuantity > 1 ? 's' : ''} no carrinho
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
