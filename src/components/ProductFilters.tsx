
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Search, Filter } from "lucide-react";
import { PRODUCT_CATEGORIES, getCategoryNames } from "@/constants/categories";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
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
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showInStock,
  setShowInStock
}: ProductFiltersProps) => {
  const categories = getCategoryNames();

  return (
    <Card className="bg-gray-900/50 border-gray-800 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#4ADE80]" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Busca */}
        <div>
          <Label className="text-gray-300 mb-2 block">Buscar Produtos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#4ADE80]"
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <Label className="text-gray-300 mb-2 block">Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {PRODUCT_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <SelectItem 
                    key={category.id} 
                    value={category.name}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-[#4ADE80]" />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <Label className="text-gray-300 mb-3 block">
            Faixa de Preço: R$ {priceRange[0].toLocaleString()} - R$ {priceRange[1].toLocaleString()}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={20000}
            min={0}
            step={100}
            className="w-full"
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
              <SelectItem value="relevance" className="text-white hover:bg-gray-700">Relevância</SelectItem>
              <SelectItem value="price-asc" className="text-white hover:bg-gray-700">Menor Preço</SelectItem>
              <SelectItem value="price-desc" className="text-white hover:bg-gray-700">Maior Preço</SelectItem>
              <SelectItem value="name" className="text-white hover:bg-gray-700">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mostrar apenas em estoque */}
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Apenas em estoque</Label>
          <Switch
            checked={showInStock}
            onCheckedChange={setShowInStock}
            className="data-[state=checked]:bg-[#4ADE80]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
