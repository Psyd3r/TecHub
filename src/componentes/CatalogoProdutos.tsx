
import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { useCartStore } from "@/stores/CartStore";
import { Package } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

export const CatalogoProdutos = () => {
  const { products: produtos, loadProducts: carregarProdutos } = useCartStore();
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [faixaPreco, setFaixaPreco] = useState<[number, number]>([0, 20000]);
  const [ordenarPor, setOrdenarPor] = useState("relevance");
  const [mostrarEmEstoque, setMostrarEmEstoque] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos.filter(produto => {
      const correspondeaBusca = produto.name.toLowerCase().includes(termoBusca.toLowerCase());
      const correspondeCategoria = categoriaSelecionada === "Todos" || produto.category === categoriaSelecionada;
      const correspondePreco = produto.price >= faixaPreco[0] && produto.price <= faixaPreco[1];
      const correspondeEstoque = !mostrarEmEstoque || produto.inStock;

      return correspondeaBusca && correspondeCategoria && correspondePreco && correspondeEstoque;
    });

    // Ordenação
    switch (ordenarPor) {
      case "price-asc":
        filtrados.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtrados.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtrados.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // relevance - manter ordem original
        break;
    }

    return filtrados;
  }, [produtos, termoBusca, categoriaSelecionada, faixaPreco, ordenarPor, mostrarEmEstoque]);

  const obterEstatisticasCategoria = () => {
    const estatisticas = PRODUCT_CATEGORIES.map(categoria => {
      const produtosCategoria = categoria.id === "todos" 
        ? produtos 
        : produtos.filter(p => p.category === categoria.name);
      
      return {
        ...categoria,
        count: produtosCategoria.length,
        inStockCount: produtosCategoria.filter(p => p.inStock).length
      };
    });
    return estatisticas;
  };

  const estatisticasCategoria = obterEstatisticasCategoria();
  const dadosCategoriaSelecionada = PRODUCT_CATEGORIES.find(cat => cat.name === categoriaSelecionada);

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

        {produtos.length === 0 ? (
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
            <div className="lg:col-span-1">
              <ProductFilters
                searchTerm={termoBusca}
                setSearchTerm={setTermoBusca}
                selectedCategory={categoriaSelecionada}
                setSelectedCategory={setCategoriaSelecionada}
                priceRange={faixaPreco}
                setPriceRange={setFaixaPreco}
                sortBy={ordenarPor}
                setSortBy={setOrdenarPor}
                showInStock={mostrarEmEstoque}
                setShowInStock={setMostrarEmEstoque}
              />
            </div>

            <div className="lg:col-span-3">
              {dadosCategoriaSelecionada && categoriaSelecionada !== "Todos" && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <dadosCategoriaSelecionada.icon className="h-6 w-6 text-[#4ADE80]" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{dadosCategoriaSelecionada.name}</h3>
                      <p className="text-gray-400 text-sm">{dadosCategoriaSelecionada.description}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-300">
                  Mostrando {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
                  {categoriaSelecionada !== "Todos" && ` em ${categoriaSelecionada}`}
                </p>
              </div>

              {produtosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-400 text-lg mb-4">
                    {categoriaSelecionada !== "Todos" 
                      ? `Nenhum produto encontrado na categoria "${categoriaSelecionada}" com os filtros selecionados.`
                      : "Nenhum produto encontrado com os filtros selecionados."
                    }
                  </p>
                  <p className="text-gray-500 text-sm">
                    Tente ajustar os filtros ou escolher uma categoria diferente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {produtosFiltrados.map((produto) => (
                    <ProductCard key={produto.id} product={produto} />
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
