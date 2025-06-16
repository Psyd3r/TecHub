
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/CartStore";
import { useToast } from "@/hooks/use-toast";
import { ProductController } from "@/controllers/ProductController";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  uuid?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, getProductQuantity, getAvailableStock } = useCartStore();
  const { toast } = useToast();
  
  const discount = product.originalPrice 
    ? ProductController.calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const inCartQuantity = getProductQuantity(product.id);
  const availableStock = getAvailableStock(product.id);
  const isAvailable = ProductController.isProductAvailable({
    ...product,
    id: product.uuid || product.id.toString(),
    stockQuantity: product.stockQuantity,
    inStock: product.inStock
  });

  const handleCardClick = () => {
    const productId = product.uuid || product.id;
    navigate(`/produto/${productId}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAvailable && availableStock > 0) {
      // Ensure image has a default value to match the expected type
      const productForCart = {
        ...product,
        image: product.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
      };
      
      const success = await addToCart(productForCart);
      if (success) {
        toast({
          title: "Produto adicionado!",
          description: `${product.name} foi adicionado ao carrinho.`,
        });
      } else {
        toast({
          title: "Estoque insuficiente",
          description: "Não há mais unidades disponíveis em estoque.",
          variant: "destructive",
        });
      }
    }
  };

  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `https://images.unsplash.com/${product.image || 'photo-1486312338219-ce68d2c6f44d'}?w=400&h=300&fit=crop`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-gray-900/50 border-gray-800 overflow-hidden cursor-pointer" onClick={handleCardClick}>
      <div className="relative">
        <img 
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{discount}%
          </div>
        )}
        {(!product.inStock || availableStock === 0) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Fora de Estoque</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</span>
          <span className="text-xs text-gray-500 ml-2">•</span>
          <span className="text-xs text-gray-400 ml-2">{product.category}</span>
        </div>
        
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#4ADE80] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-[#4ADE80]">
            {ProductController.formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {ProductController.formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400 mb-2">
          {product.inStock ? (
            availableStock > 0 ? (
              <span className="text-green-400">
                {availableStock <= 5 ? `Apenas ${availableStock} em estoque` : `${product.stockQuantity} em estoque`}
              </span>
            ) : (
              <span className="text-yellow-400">Esgotado no carrinho</span>
            )
          ) : (
            <span className="text-red-400">Fora de estoque</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <button 
          className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
            isAvailable && availableStock > 0
              ? 'bg-[#4ADE80] text-black hover:bg-[#22C55E] hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable || availableStock === 0}
          onClick={handleAddToCart}
        >
          {isAvailable && availableStock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </button>
      </CardFooter>
    </Card>
  );
};
