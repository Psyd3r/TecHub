import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, X, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock_quantity: number;
  image?: string;
}

export const StockTable = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditStart = (productId: string, currentStock: number) => {
    setEditingId(productId);
    setEditValue(currentStock.toString());
  };

  const handleEditSave = async (productId: string) => {
    const newStock = parseInt(editValue);
    if (isNaN(newStock) || newStock < 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser um número válido maior ou igual a 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Atualizando estoque do produto ${productId} para ${newStock}`);
      
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId);

      if (error) {
        console.error('Erro ao atualizar estoque:', error);
        throw error;
      }

      // Atualizar o estado local
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, stock_quantity: newStock }
            : product
        )
      );

      setEditingId(null);
      setEditValue("");
      
      toast({
        title: "Estoque atualizado!",
        description: `Estoque do produto foi atualizado para ${newStock} unidades.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar estoque.",
        variant: "destructive",
      });
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sem Estoque", variant: "destructive" as const };
    if (stock <= 3) return { label: "Baixo Estoque", variant: "outline" as const };
    return { label: "Em Estoque", variant: "default" as const };
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Carregando produtos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto para gerenciar</h3>
        <p className="text-gray-400">
          Crie produtos primeiro na aba "Produtos" para gerenciar o estoque.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Produto</TableHead>
            <TableHead className="text-gray-300">Categoria</TableHead>
            <TableHead className="text-gray-300">Marca</TableHead>
            <TableHead className="text-gray-300">Preço</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Estoque</TableHead>
            <TableHead className="text-gray-300">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock_quantity);
            const isEditing = editingId === product.id;

            return (
              <TableRow key={product.id} className="border-gray-700">
                <TableCell className="text-white">
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img
                        src={product.image.startsWith('http') ? product.image : `https://images.unsplash.com/${product.image}?w=50&h=50&fit=crop`}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{product.category}</TableCell>
                <TableCell className="text-gray-300">{product.brand}</TableCell>
                <TableCell className="text-green-400 font-medium">
                  R$ {product.price.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={stockStatus.variant}>
                    {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 bg-gray-800 border-gray-600 text-white"
                      min="0"
                    />
                  ) : (
                    <span className="font-medium">{product.stock_quantity}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditSave(product.id)}
                        className="text-green-400 hover:bg-green-400/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEditCancel}
                        className="text-red-400 hover:bg-red-400/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStart(product.id, product.stock_quantity)}
                      className="text-blue-400 hover:bg-blue-400/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
