
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProductDetails } from "@/hooks/useProductDetails";
import { ProductImageGallery } from "@/components/ProductDetails/ProductImageGallery";
import { ProductInfo } from "@/components/ProductDetails/ProductInfo";
import { ProductActions } from "@/components/ProductDetails/ProductActions";
import { ProductTabs } from "@/components/ProductDetails/ProductTabs";
import { ProductCartHandler } from "@/components/ProductDetails/ProductCartHandler";
import { ProductDetailsLoading } from "@/components/ProductDetails/ProductDetailsLoading";
import { ProductNotFound } from "@/components/ProductDetails/ProductNotFound";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items } = useCart();
  const { product, loading } = useProductDetails(id);

  if (loading) {
    return <ProductDetailsLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const inCartQuantity = items.find(item => item.id === parseInt(product.id))?.quantity || 0;
  const availableStock = product.stock_quantity - inCartQuantity;
  
  // Criar array de imagens (por enquanto usando a mesma imagem)
  const images = [
    product.image || 'photo-1581091226825-a6a2a5aee158',
    // Adicionar mais imagens quando disponível
  ];

  return (
    <ProductCartHandler product={product}>
      {({ handleAddToCart, handleUpdateQuantity }) => (
        <div className="min-h-screen bg-black">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="mb-6 text-white hover:text-[#4ADE80] hover:bg-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Catálogo
            </Button>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Gallery */}
              <div className="lg:col-span-2">
                <ProductImageGallery
                  images={images}
                  productName={product.name}
                  isOutOfStock={product.stock_quantity === 0 || availableStock === 0}
                />
              </div>

              {/* Product Info and Actions */}
              <div className="space-y-6">
                <ProductInfo
                  name={product.name}
                  brand={product.brand}
                  category={product.category}
                  price={product.price}
                  originalPrice={product.original_price}
                  stockQuantity={product.stock_quantity}
                  availableStock={availableStock}
                  inCartQuantity={inCartQuantity}
                />

                <ProductActions
                  productId={parseInt(product.id)}
                  productName={product.name}
                  price={product.price}
                  isInStock={product.stock_quantity > 0}
                  availableStock={availableStock}
                  inCartQuantity={inCartQuantity}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-12">
              <ProductTabs
                description={product.description}
                category={product.category}
                brand={product.brand}
              />
            </div>
          </div>
        </div>
      )}
    </ProductCartHandler>
  );
};

export default ProductDetails;
