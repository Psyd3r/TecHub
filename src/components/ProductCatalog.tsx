import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";

// Dados mockados de produtos
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
    inStock: true
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
    inStock: true
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    price: 6999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Samsung",
    rating: 5,
    inStock: false
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
    inStock: true
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1 Carbon",
    price: 12999,
    image: "photo-1518770660439-4636190af475",
    category: "Laptops",
    brand: "Lenovo",
    rating: 4,
    inStock: true
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
    inStock: true
  },
  {
    id: 7,
    name: "iPhone 15 Pro Max",
    price: 8999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Apple",
    rating: 5,
    inStock: true
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
    inStock: false
  }
];

export const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showInStock, setShowInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesBrand = selectedBrand === "Todas" || product.brand === selectedBrand;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !showInStock || product.inStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    // Ordenação
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // relevance - manter ordem original
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy, showInStock]);

  return (
    <section id="produtos" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Catálogo de <span className="text-[#4ADE80]">Produtos</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore nossa seleção completa de produtos tecnológicos com filtros avançados para encontrar exatamente o que você precisa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
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
                <p className="text-gray-400 text-lg">
                  Nenhum produto encontrado com os filtros selecionados.
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
      </div>
    </section>
  );
};
