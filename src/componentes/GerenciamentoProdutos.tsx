
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "../components/ProductForm";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Produto {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  image?: string;
  category: string;
  brand: string;
  stock_quantity: number;
  in_stock: boolean;
}

export const GerenciamentoProdutos = () => {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | undefined>();

  const buscarProdutos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const manipularCriarProduto = () => {
    setProdutoEditando(undefined);
    setFormularioAberto(true);
  };

  const manipularEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setFormularioAberto(true);
  };

  const manipularExcluirProduto = async (idProduto: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', idProduto);
      
      if (error) throw error;
      
      toast({
        title: "Produto excluído!",
        description: "O produto foi excluído com sucesso.",
      });
      
      buscarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto.",
        variant: "destructive",
      });
    }
  };

  const manipularSucessoFormulario = () => {
    setFormularioAberto(false);
    setProdutoEditando(undefined);
    buscarProdutos();
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-2xl flex items-center gap-2">
            <Package className="h-6 w-6 text-[#4ADE80]" />
            Gerenciar Produtos
          </CardTitle>
          <Button 
            onClick={manipularCriarProduto}
            className="bg-[#4ADE80] text-black hover:bg-[#22C55E]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-400 mb-4">
              Comece criando seu primeiro produto para o catálogo.
            </p>
            <Button 
              onClick={manipularCriarProduto}
              className="bg-[#4ADE80] text-black hover:bg-[#22C55E]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Produto
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Produto</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Preço</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div className="flex items-center gap-3">
                        {produto.image && (
                          <img
                            src={produto.image.startsWith('http') ? produto.image : `https://images.unsplash.com/${produto.image}?w=50&h=50&fit=crop`}
                            alt={produto.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{produto.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{produto.category}</TableCell>
                    <TableCell className="text-green-400 font-medium">
                      R$ {produto.price.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => manipularEditarProduto(produto)}
                          className="text-blue-400 hover:bg-blue-400/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => manipularExcluirProduto(produto.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={formularioAberto} onOpenChange={setFormularioAberto}>
          <DialogContent className="bg-[#1B1B1B] border-gray-700 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {produtoEditando ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={produtoEditando}
              onSuccess={manipularSucessoFormulario}
              onCancel={() => setFormularioAberto(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
