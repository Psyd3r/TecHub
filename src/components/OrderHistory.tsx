import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/AuthStore";
import { supabase } from "@/integrations/supabase/client";
import { Package, Calendar, CreditCard } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

type DatabaseOrder = Tables<'orders'>;

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

export const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert database orders to frontend format with proper type handling
      const formattedOrders: Order[] = (data || []).map((dbOrder: DatabaseOrder) => ({
        id: dbOrder.id,
        order_number: dbOrder.order_number,
        items: Array.isArray(dbOrder.items) ? (dbOrder.items as unknown as OrderItem[]) : [],
        total_amount: Number(dbOrder.total_amount),
        payment_method: dbOrder.payment_method,
        payment_status: dbOrder.payment_status,
        created_at: dbOrder.created_at,
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit': return 'Cartão de Crédito';
      case 'boleto': return 'Boleto Bancário';
      case 'pix': return 'PIX';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Carregando histórico...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
        <CardContent className="py-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-400">
              Você ainda não fez nenhum pedido.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Package className="h-6 w-6 text-[#4ADE80]" />
        Histórico de Pedidos
      </h2>
      
      {orders.map((order) => (
        <Card key={order.id} className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white text-lg">
                  Pedido #{order.order_number}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    {getPaymentMethodLabel(order.payment_method)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <OrderStatusBadge status={order.payment_status} showIcon />
                <p className="text-[#4ADE80] font-bold text-lg mt-2">
                  R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-white font-medium">Itens do Pedido:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-b-0">
                  <img 
                    src={item.image.startsWith('http') ? item.image : `https://images.unsplash.com/${item.image}?w=50&h=50&fit=crop`}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">Qtd: {item.quantity}</p>
                    <p className="text-[#4ADE80] font-medium">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
