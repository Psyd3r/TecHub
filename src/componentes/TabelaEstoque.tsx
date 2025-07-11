
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

interface Produto {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock_quantity: number;
  image?: string;
}

export const TabelaEstoque = () => {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [valorEdicao, setValorEdicao] = useState<string>("");

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

  const iniciarEdicao = (idProduto: string, estoqueAtual: number) => {
    setIdEditando(idProduto);
    setValorEdicao(estoqueAtual.toString());
  };

  const salvarEdicao = async (idProduto: string) => {
    const novoEstoque = parseInt(valorEdicao);
    if (isNaN(novoEstoque) || novoEstoque < 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser um número válido maior ou igual a 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Atualizando estoque do produto ${idProduto} para ${novoEstoque}`);
      
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: novoEstoque })
        .eq('id', idProduto);

      if (error) {
        console.error('Erro ao atualizar estoque:', error);
        throw error;
      }

      setProdutos(anterior => 
        anterior.map(produto => 
          produto.id === idProduto 
            ? { ...produto, stock_quantity: novoEstoque }
            : produto
        )
      );

      setIdEditando(null);
      setValorEdicao("");
      
      toast({
        title: "Estoque atualizado!",
        description: `Estoque do produto foi atualizado para ${novoEstoque} unidades.`,
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

  const cancelarEdicao = () => {
    setIdEditando(null);
    setValorEdicao("");
  };

  const obterStatusEstoque = (estoque: number) => {
    if (estoque === 0) return { rotulo: "Sem Estoque", variante: "destructive" as const };
    if (estoque <= 3) return { rotulo: "Baixo Estoque", variante: "outline" as const };
    return { rotulo: "Em Estoque", variante: "default" as const };
  };

  if (carregando) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Carregando produtos...</p>
      </div>
    );
  }

  if (produtos.length === 0) {
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
          {produtos.map((produto) => {
            const statusEstoque = obterStatusEstoque(produto.stock_quantity);
            const estaEditando = idEditando === produto.id;

            return (
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
                <TableCell className="text-gray-300">{produto.brand}</TableCell>
                <TableCell className="text-green-400 font-medium">
                  R$ {produto.price.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusEstoque.variante}>
                    {statusEstoque.rotulo}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  {estaEditando ? (
                    <Input
                      type="number"
                      value={valorEdicao}
                      onChange={(e) => setValorEdicao(e.target.value)}
                      className="w-20 bg-gray-800 border-gray-600 text-white"
                      min="0"
                    />
                  ) : (
                    <span className="font-medium">{produto.stock_quantity}</span>
                  )}
                </TableCell>
                <TableCell>
                  {estaEditando ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => salvarEdicao(produto.id)}
                        className="text-green-400 hover:bg-green-400/10"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelarEdicao}
                        className="text-red-400 hover:bg-red-400/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => iniciarEdicao(produto.id, produto.stock_quantity)}
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
