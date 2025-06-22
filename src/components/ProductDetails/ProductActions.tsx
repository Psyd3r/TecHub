
import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/CartStore";

interface ProductActionsProps {
  productId: string; // Mudança: string em vez de number
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
  onUpdateQuantity,
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart();
    setQuantity(1);
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= availableStock) {
      onUpdateQuantity(newQuantity);
    }
  };

  if (!isInStock || availableStock === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-center font-medium">
            Produto fora de estoque
          </p>
        </div>
        <Button 
          disabled 
          className="w-full bg-gray-700 text-gray-400 cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Indisponível
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantidade no Carrinho */}
      {inCartQuantity > 0 && (
        <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-lg p-4">
          <p className="text-[#4ADE80] text-sm mb-3">
            {inCartQuantity} unidade{inCartQuantity > 1 ? 's' : ''} no carrinho
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleUpdateCartQuantity(inCartQuantity - 1)}
              className="bg-gray-800 hover:bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-white font-medium w-8 text-center">
              {inCartQuantity}
            </span>
            <button
              onClick={() => handleUpdateCartQuantity(inCartQuantity + 1)}
              disabled={inCartQuantity >= availableStock}
              className={`w-8 h-8 rounded flex items-center justify-center ${
                inCartQuantity >= availableStock
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Seletor de Quantidade */}
      <div className="space-y-3">
        <label className="text-white font-medium">Quantidade:</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              quantity <= 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-white font-semibold text-lg w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= availableStock}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              quantity >= availableStock
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          {availableStock} unidade{availableStock > 1 ? 's' : ''} disponível{availableStock > 1 ? 'eis' : ''}
        </p>
      </div>

      {/* Preço Total */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total:</span>
          <span className="text-2xl font-bold text-[#4ADE80]">
            R$ {(price * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Botão Adicionar ao Carrinho */}
      <Button 
        onClick={handleAddToCart}
        className="w-full bg-[#4ADE80] text-black hover:bg-[#22C55E] font-semibold text-lg py-6"
        disabled={!isInStock || availableStock === 0}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Adicionar ao Carrinho
      </Button>
    </div>
  );
};
