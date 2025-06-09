
import { Badge } from "@/components/ui/badge";

interface ProductInfoProps {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  availableStock: number;
  inCartQuantity: number;
}

export const ProductInfo = ({ 
  name, 
  brand, 
  category, 
  price, 
  originalPrice,
  stockQuantity,
  availableStock,
  inCartQuantity
}: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Brand and Category */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
          {brand}
        </Badge>
        <Badge variant="outline" className="border-gray-700 text-gray-400">
          {category}
        </Badge>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        {name}
      </h1>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-3xl lg:text-4xl font-bold text-[#4ADE80]">
            R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {originalPrice && (
            <div className="flex flex-col">
              <span className="text-lg text-gray-500 line-through">
                R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-red-400 font-medium">
                Economia de R$ {(originalPrice - price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stock Information */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stockQuantity > 0 && availableStock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className={`font-medium ${stockQuantity > 0 && availableStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stockQuantity > 0 && availableStock > 0 ? 'Em estoque' : 'Fora de estoque'}
          </span>
        </div>
        
        <div className="text-sm text-gray-400">
          {stockQuantity > 0 ? (
            availableStock > 0 ? (
              <>
                {availableStock <= 5 ? (
                  <span className="text-yellow-400">
                    Apenas {availableStock} unidades restantes
                  </span>
                ) : (
                  <span className="text-green-400">
                    {stockQuantity} unidades disponíveis
                  </span>
                )}
                {inCartQuantity > 0 && (
                  <div className="text-yellow-400 mt-1">
                    {inCartQuantity} unidade{inCartQuantity > 1 ? 's' : ''} no seu carrinho
                  </div>
                )}
              </>
            ) : (
              <span className="text-yellow-400">Todas as unidades estão no seu carrinho</span>
            )
          ) : (
            <span className="text-red-400">Produto indisponível</span>
          )}
        </div>
      </div>
    </div>
  );
};
