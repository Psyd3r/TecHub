
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Link, Image as ImageIcon } from "lucide-react";

interface Product {
  id?: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  image?: string;
  category: string;
  brand: string;
  stock_quantity: number;
}

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = ["Smartphones", "Notebooks", "Tablets", "Acessórios", "Smartwatches"];

export const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageMethod, setImageMethod] = useState<"upload" | "url">("upload");
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    price: product?.price || 0,
    original_price: product?.original_price || undefined,
    description: product?.description || "",
    image: product?.image || "",
    category: product?.category || "",
    brand: product?.brand || "",
    stock_quantity: product?.stock_quantity || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.image;

      // Upload da imagem se uma nova foi selecionada
      if (imageMethod === "upload" && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } else if (imageMethod === "url" && imageUrl) {
        finalImageUrl = imageUrl;
      }

      const productData = {
        ...formData,
        image: finalImageUrl,
        in_stock: formData.stock_quantity > 0
      };

      if (product?.id) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
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
          .insert([productData]);
        
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#4ADE80]" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand" className="text-white">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  placeholder="Digite a marca do produto"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="text-white">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]">
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
                <Label htmlFor="stock_quantity" className="text-white">Quantidade em Estoque *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                placeholder="Descreva o produto..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preços */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Preços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">Preço de Venda (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  placeholder="0,00"
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
                  className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  placeholder="0,00"
                />
                <p className="text-xs text-gray-400 mt-1">Opcional - para mostrar desconto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagem do Produto */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#4ADE80]" />
              Imagem do Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={imageMethod} onValueChange={(value) => setImageMethod(value as "upload" | "url")}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="upload" className="data-[state=active]:bg-[#4ADE80] data-[state=active]:text-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload de Arquivo
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-[#4ADE80] data-[state=active]:text-black">
                  <Link className="h-4 w-4 mr-2" />
                  Link da Imagem
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <div>
                  <Label htmlFor="image-file" className="text-white">Selecionar Arquivo</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                  />
                  <p className="text-xs text-gray-400 mt-1">Formatos aceitos: JPG, PNG, WEBP</p>
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="mt-4">
                <div>
                  <Label htmlFor="image-url" className="text-white">URL da Imagem</Label>
                  <Input
                    id="image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:border-[#4ADE80]"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-gray-400 mt-1">Cole o link direto da imagem</p>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Preview da imagem */}
            {((imageMethod === "upload" && imageFile) || (imageMethod === "url" && imageUrl) || formData.image) && (
              <div className="mt-4">
                <Label className="text-white">Preview</Label>
                <div className="mt-2 border border-gray-600 rounded-lg p-2 bg-gray-700">
                  <img
                    src={
                      imageMethod === "upload" && imageFile 
                        ? URL.createObjectURL(imageFile)
                        : imageMethod === "url" && imageUrl
                        ? imageUrl
                        : formData.image
                    }
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mx-auto"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-[#4ADE80] text-black hover:bg-[#22C55E] flex-1"
          >
            {loading ? "Salvando..." : product?.id ? "Atualizar Produto" : "Criar Produto"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
