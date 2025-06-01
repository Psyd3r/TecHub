
import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { useCart } from "@/contexts/CartContext";
import { Package } from "lucide-react";

export const ProductCatalog = () => {
  const { products, loadProducts } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showInStock, setShowInStock] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStock || product.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    // Ordenação
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // relevance - manter ordem original
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, showInStock]);

  return (
    <section id="produtos" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Catálogo de <span className="text-[#4ADE80]">Produtos</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore nossa seleção completa de produtos tecnológicos com filtros avançados para encontrar exatamente o que você precisa.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Nenhum produto disponível
            </h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Nossa equipe está trabalhando para adicionar novos produtos incríveis ao catálogo. Volte em breve!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filtros */}
            <div className="lg:col-span-1">
              <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showInStock={showInStock}
                setShowInStock={setShowInStock}
              />
            </div>

            {/* Produtos */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-300">
                  Mostrando {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Nenhum produto encontrado com os filtros selecionados.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Tente ajustar os filtros para ver mais produtos.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
