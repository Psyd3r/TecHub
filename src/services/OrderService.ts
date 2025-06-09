
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface OrderData {
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt?: string;
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  paymentData: {
    paymentType: string;
    [key: string]: any;
  };
}

export class OrderService {
  static async createOrder(data: CreateOrderData): Promise<string> {
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const { error } = await supabase
      .from('orders')
      .insert({
        user_id: data.userId,
        order_number: orderNumber,
        items: data.items as any, // Cast to any to match Json type
        total_amount: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        payment_method: data.paymentData.paymentType,
        payment_status: 'completed'
      });

    if (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error('Erro ao processar pedido');
    }

    return orderNumber;
  }

  static async getUserOrders(userId: string): Promise<OrderData[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw new Error('Erro ao carregar pedidos');
    }

    return (data || []).map(order => ({
      orderNumber: order.order_number,
      items: Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : [],
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      createdAt: order.created_at
    }));
  }

  static async getOrderByNumber(orderNumber: string): Promise<OrderData | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Erro ao buscar pedido:', error);
      return null;
    }

    if (!data) return null;

    return {
      orderNumber: data.order_number,
      items: Array.isArray(data.items) ? (data.items as unknown as OrderItem[]) : [],
      totalAmount: data.total_amount,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      createdAt: data.created_at
    };
  }
}
