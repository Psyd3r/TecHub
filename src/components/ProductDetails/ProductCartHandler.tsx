
import { useCartStore } from "@/stores/CartStore";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image?: string;
  category: string;
  brand: string;
  stock_quantity: number;
  description?: string;
  rating?: number;
}

interface ProductCartHandlerProps {
  product: ProductData;
  children: (handlers: {
    handleAddToCart: () => void;
    handleUpdateQuantity: (quantity: number) => void;
  }) => React.ReactNode;
}

export const ProductCartHandler = ({ product, children }: ProductCartHandlerProps) => {
  const { addToCart, updateQuantity } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (product && product.stock_quantity > 0) {
      const productForCart = {
        id: parseInt(product.id),
        uuid: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image || 'photo-1581091226825-a6a2a5aee158',
        category: product.category,
        brand: product.brand,
        inStock: product.stock_quantity > 0,
        stockQuantity: product.stock_quantity,
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

  const handleUpdateQuantity = async (quantity: number) => {
    if (product) {
      const success = await updateQuantity(parseInt(product.id), quantity);
      if (!success) {
        toast({
          title: "Estoque insuficiente",
          description: "Não há unidades suficientes em estoque.",
          variant: "destructive",
        });
      }
    }
  };

  return <>{children({ handleAddToCart, handleUpdateQuantity })}</>;
};
