
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showInStock: boolean;
  setShowInStock: (show: boolean) => void;
}

export const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showInStock,
  setShowInStock
}: FiltersProps) => {
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const categories = ["Todos", "Smartphones", "Notebooks", "Tablets", "Acessórios", "Smartwatches"];
  const sortOptions = [
    { value: "relevance", label: "Relevância" },
    { value: "price-asc", label: "Menor Preço" },
    { value: "price-desc", label: "Maior Preço" },
    { value: "name", label: "Nome A-Z" }
  ];

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .not('brand', 'eq', '');

      if (error) throw error;

      const uniqueBrands = [...new Set(data.map(item => item.brand))].sort();
      setAvailableBrands(uniqueBrands);
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span>Filtros</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Busca */}
        <div>
          <Label className="text-gray-300 mb-2 block">Buscar Produtos</Label>
          <Input
            placeholder="Digite o nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Ordenação */}
        <div>
          <Label className="text-gray-300 mb-2 block">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoria */}
        <div>
          <Label className="text-gray-300 mb-2 block">Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marca */}
        <div>
          <Label className="text-gray-300 mb-2 block">Marca</Label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder={loadingBrands ? "Carregando..." : "Selecione uma marca"} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="Todas" className="text-white hover:bg-gray-700">
                Todas
              </SelectItem>
              {availableBrands.length === 0 && !loadingBrands ? (
                <SelectItem value="" disabled className="text-gray-400">
                  Não há marcas registradas no momento
                </SelectItem>
              ) : (
                availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand} className="text-white hover:bg-gray-700">
                    {brand}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <Label className="text-gray-300 mb-2 block">Faixa de Preço</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Disponibilidade */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={setShowInStock}
            className="border-gray-600 data-[state=checked]:bg-[#4ADE80] data-[state=checked]:border-[#4ADE80]"
          />
          <Label htmlFor="in-stock" className="text-gray-300">
            Apenas em estoque
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
