
import { OrderModel, CreateOrderData, OrderModelValidator } from "@/models/OrderModel";
import { OrderService } from "@/services/OrderService";

interface OrderItem {
  id: string;
  uuid?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  stockQuantity: number;
}

export class OrderController {
  static async processOrder(
    userId: string,
    items: OrderItem[],
    paymentData: any
  ): Promise<string> {
    try {
      // Validar dados do pedido
      const orderData: CreateOrderData = {
        userId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        paymentMethod: paymentData.method,
        totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      const validationErrors = OrderModelValidator.validateCreateData(orderData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Processar pedido através do serviço
      const orderNumber = await OrderService.createOrder({
        userId: orderData.userId,
        items: orderData.items.map(item => ({
          id: parseInt(item.id) || 0, // Convert string to number for service compatibility
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        paymentData: { paymentType: orderData.paymentMethod }
      });
      
      return orderNumber;
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      throw new Error('Erro ao processar pedido');
    }
  }

  static async getUserOrders(userId: string): Promise<OrderModel[]> {
    try {
      const orderData = await OrderService.getUserOrders(userId);
      return orderData.map(order => ({
        orderNumber: order.orderNumber,
        userId,
        items: order.items.map(item => ({
          id: item.id.toString(), // Convert number to string for model compatibility
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw new Error('Erro ao buscar pedidos do usuário');
    }
  }

  static async getOrderByNumber(orderNumber: string): Promise<OrderModel | null> {
    try {
      const orderData = await OrderService.getOrderByNumber(orderNumber);
      if (!orderData) return null;

      return {
        orderNumber: orderData.orderNumber,
        userId: '', // Will be filled by the service if needed
        items: orderData.items.map(item => ({
          id: item.id.toString(), // Convert number to string for model compatibility
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        createdAt: orderData.createdAt
      };
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw new Error('Erro ao buscar pedido');
    }
  }

  static formatOrderNumber(orderNumber: string): string {
    return orderNumber.toUpperCase();
  }

  static formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static formatOrderTotal(total: number): string {
    return `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}
