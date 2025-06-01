
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id?: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  image?: string;
  category: string;
  brand: string;
  rating?: number;
  stock_quantity: number;
}

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = ["Smartphones", "Notebooks", "Tablets", "Acessórios", "Smartwatches"];
const brands = ["Apple", "Samsung", "Xiaomi", "Dell", "HP", "Lenovo", "Asus"];

export const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    price: product?.price || 0,
    original_price: product?.original_price || undefined,
    description: product?.description || "",
    image: product?.image || "",
    category: product?.category || "",
    brand: product?.brand || "",
    rating: product?.rating || 0,
    stock_quantity: product?.stock_quantity || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: "Produto atualizado!",
          description: "O produto foi atualizado com sucesso.",
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Produto criado!",
          description: "O produto foi criado com sucesso.",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white">Nome do Produto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="brand" className="text-white">Marca</Label>
          <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Selecione uma marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category" className="text-white">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="price" className="text-white">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="original_price" className="text-white">Preço Original (R$)</Label>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            value={formData.original_price || ""}
            onChange={(e) => handleInputChange('original_price', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="stock_quantity" className="text-white">Quantidade em Estoque</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="rating" className="text-white">Avaliação (0-5)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating || ""}
            onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : 0)}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="image" className="text-white">URL da Imagem</Label>
          <Input
            id="image"
            value={formData.image || ""}
            onChange={(e) => handleInputChange('image', e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="ID da imagem do Unsplash"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description" className="text-white">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="bg-gray-800 border-gray-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="bg-[#4ADE80] text-black hover:bg-[#22C55E]">
          {loading ? "Salvando..." : product?.id ? "Atualizar" : "Criar"} Produto
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
