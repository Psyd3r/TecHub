
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Usando os mesmos dados mockados do ProductCatalog
const mockProducts = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Pro",
    price: 15999,
    originalPrice: 17999,
    image: "photo-1486312338219-ce68d2c6f44d",
    category: "Laptops",
    brand: "Apple",
    rating: 5,
    inStock: true,
    description: "O MacBook Pro mais poderoso já criado, com o chip M3 Pro revolucionário que oferece desempenho excepcional para profissionais criativos.",
    specs: {
      "Processador": "Apple M3 Pro",
      "Memória": "18GB RAM unificada",
      "Armazenamento": "512GB SSD",
      "Tela": "16 polegadas Liquid Retina XDR",
      "Bateria": "Até 22 horas de reprodução de vídeo",
      "Peso": "2,16 kg"
    }
  },
  {
    id: 2,
    name: "Dell XPS 13 Plus",
    price: 8999,
    originalPrice: 9999,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Laptops",
    brand: "Dell",
    rating: 4,
    inStock: true,
    description: "Ultrabook premium com design moderno e desempenho excepcional para produtividade e entretenimento.",
    specs: {
      "Processador": "Intel Core i7-1360P",
      "Memória": "16GB LPDDR5",
      "Armazenamento": "512GB SSD",
      "Tela": "13.4 polegadas OLED 3.5K",
      "Bateria": "Até 12 horas",
      "Peso": "1,26 kg"
    }
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    price: 6999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Samsung",
    rating: 5,
    inStock: false,
    description: "O smartphone mais avançado da Samsung com S Pen integrada e recursos de IA inovadores.",
    specs: {
      "Processador": "Snapdragon 8 Gen 3",
      "Memória": "12GB RAM",
      "Armazenamento": "256GB",
      "Tela": "6.8 polegadas Dynamic AMOLED 2X",
      "Câmera": "200MP principal + 3 lentes",
      "Bateria": "5000mAh"
    }
  },
  {
    id: 4,
    name: "iPad Pro 12.9\" M2",
    price: 9999,
    originalPrice: 11999,
    image: "photo-1649972904349-6e44c42644a7",
    category: "Tablets",
    brand: "Apple",
    rating: 5,
    inStock: true,
    description: "O iPad mais avançado com chip M2, perfeito para criação profissional e produtividade.",
    specs: {
      "Processador": "Apple M2",
      "Memória": "8GB RAM",
      "Armazenamento": "128GB",
      "Tela": "12.9 polegadas Liquid Retina XDR",
      "Conectividade": "Wi-Fi 6E + 5G",
      "Peso": "682g"
    }
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1 Carbon",
    price: 12999,
    image: "photo-1518770660439-4636190af475",
    category: "Laptops",
    brand: "Lenovo",
    rating: 4,
    inStock: true,
    description: "Notebook empresarial premium com durabilidade militar e desempenho excepcional.",
    specs: {
      "Processador": "Intel Core i7-1355U",
      "Memória": "16GB LPDDR5",
      "Armazenamento": "512GB SSD",
      "Tela": "14 polegadas WUXGA IPS",
      "Bateria": "Até 15 horas",
      "Peso": "1,12 kg"
    }
  },
  {
    id: 6,
    name: "HP Spectre x360",
    price: 7999,
    originalPrice: 8999,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Laptops",
    brand: "HP",
    rating: 4,
    inStock: true,
    description: "Notebook conversível elegante com tela touchscreen e versatilidade 2 em 1.",
    specs: {
      "Processador": "Intel Core i7-1355U",
      "Memória": "16GB LPDDR4x",
      "Armazenamento": "512GB SSD",
      "Tela": "13.5 polegadas OLED Touch",
      "Bateria": "Até 13 horas",
      "Peso": "1,36 kg"
    }
  },
  {
    id: 7,
    name: "iPhone 15 Pro Max",
    price: 8999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Apple",
    rating: 5,
    inStock: true,
    description: "O iPhone mais avançado com titânio, câmera Pro e chip A17 Pro revolucionário.",
    specs: {
      "Processador": "A17 Pro",
      "Memória": "8GB RAM",
      "Armazenamento": "256GB",
      "Tela": "6.7 polegadas Super Retina XDR",
      "Câmera": "48MP principal + 3 lentes",
      "Bateria": "Até 29 horas de vídeo"
    }
  },
  {
    id: 8,
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 5999,
    originalPrice: 6499,
    image: "photo-1649972904349-6e44c42644a7",
    category: "Tablets",
    brand: "Samsung",
    rating: 4,
    inStock: false,
    description: "Tablet premium com tela AMOLED gigante e S Pen incluída para máxima produtividade.",
    specs: {
      "Processador": "Snapdragon 8 Gen 2",
      "Memória": "12GB RAM",
      "Armazenamento": "256GB",
      "Tela": "14.6 polegadas Dynamic AMOLED 2X",
      "S Pen": "Incluída",
      "Bateria": "11200mAh"
    }
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = mockProducts.find(p => p.id === parseInt(id || '0'));

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
            {!product.inStock && (
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
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-900/50 text-green-400 border border-green-400/50'
                    : 'bg-red-900/50 text-red-400 border border-red-400/50'
                }`}>
                  {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                </span>
              </div>

              {/* Botão de Compra */}
              <Button 
                className={`w-full py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
                  product.inStock 
                    ? 'bg-[#4ADE80] text-black hover:bg-[#22C55E] hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
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
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Especificações Técnicas */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Especificações Técnicas</h3>
              <div className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
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
