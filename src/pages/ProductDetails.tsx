
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, products, getProductStock, items } = useCart();
  const { toast } = useToast();
  
  const product = products.find(p => p.id === parseInt(id || '0'));

  const handleAddToCart = () => {
    if (product && product.inStock) {
      const success = addItem(product);
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

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate('/')} className="bg-[#4ADE80] text-black hover:bg-[#22C55E]">
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const currentStock = getProductStock(product.id);
  const inCartQuantity = items.find(item => item.id === product.id)?.quantity || 0;
  const availableStock = currentStock - inCartQuantity;

  // Specs mockadas para manter compatibilidade
  const specs = {
    "Processador": "Especificação não disponível",
    "Memória": "Especificação não disponível", 
    "Armazenamento": "Especificação não disponível",
    "Tela": "Especificação não disponível",
    "Conectividade": "Especificação não disponível",
    "Peso": "Especificação não disponível"
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <Button 
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-white hover:text-[#4ADE80] hover:bg-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagem do Produto */}
          <div className="relative">
            <img 
              src={`https://images.unsplash.com/${product.image}?w=600&h=400&fit=crop`}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                -{discount}%
              </div>
            )}
            {(!product.inStock || availableStock === 0) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <span className="text-white font-semibold text-lg">Fora de Estoque</span>
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400 uppercase tracking-wide">{product.brand}</span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-400">{product.category}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              
              {/* Avaliação */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  ))}
                  <span className="text-gray-400 ml-2">({product.rating}/5)</span>
                </div>
              </div>

              {/* Preços */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#4ADE80]">
                  R$ {product.price.toLocaleString('pt-BR')}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR')}
                  </span>
                )}
              </div>

              {/* Status do Estoque */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock && availableStock > 0
                      ? 'bg-green-900/50 text-green-400 border border-green-400/50'
                      : 'bg-red-900/50 text-red-400 border border-red-400/50'
                  }`}>
                    {product.inStock && availableStock > 0 ? 'Em Estoque' : 'Fora de Estoque'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {product.inStock ? (
                    availableStock > 0 ? (
                      availableStock <= 5 ? 
                        `Apenas ${availableStock} unidades disponíveis` : 
                        `${currentStock} unidades em estoque`
                    ) : 'Sem unidades disponíveis'
                  ) : 'Produto indisponível'}
                </p>
                {inCartQuantity > 0 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    {inCartQuantity} unidade{inCartQuantity > 1 ? 's' : ''} no carrinho
                  </p>
                )}
              </div>

              {/* Botão de Compra */}
              <Button 
                className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                  product.inStock && availableStock > 0
                    ? 'bg-[#4ADE80] text-black hover:bg-[#22C55E] hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!product.inStock || availableStock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock && availableStock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </Button>
            </div>
          </div>
        </div>

        {/* Descrição e Especificações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Descrição */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Descrição</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.name} - Um produto de alta qualidade da marca {product.brand} na categoria {product.category}.
              </p>
            </CardContent>
          </Card>

          {/* Especificações Técnicas */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Especificações Técnicas</h3>
              <div className="space-y-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="text-gray-400 font-medium">{key}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
