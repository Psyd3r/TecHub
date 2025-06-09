
import { OrderService, OrderData } from "@/services/OrderService";
import { ProductService } from "@/services/ProductService";

export class OrderController {
  static async processOrder(
    userId: string, 
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
      brand: string;
      stockQuantity: number;
    }>,
    paymentData: { paymentType: string }
  ): Promise<string> {
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Validar estoque novamente antes de processar
      const products = await ProductService.getAllProducts();
      
      for (const item of items) {
        const product = products.find(p => parseInt(p.id) === item.id);
        if (!product) {
          throw new Error(`Produto "${item.name}" não encontrado`);
        }
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Estoque insuficiente para "${item.name}"`);
        }
      }

      // Criar pedido usando a nova interface
      const orderNumber = await OrderService.createOrder({
        userId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        paymentData
      });

      // Reduzir estoque dos produtos
      for (const item of items) {
        const newStock = item.stockQuantity - item.quantity;
        await ProductService.updateStock(item.id.toString(), newStock);
      }

      return orderNumber;
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      throw error;
    }
  }

  static async getUserOrders(userId: string): Promise<OrderData[]> {
    try {
      return await OrderService.getUserOrders(userId);
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      throw error;
    }
  }

  static async getOrderByNumber(orderNumber: string): Promise<OrderData | null> {
    try {
      return await OrderService.getOrderByNumber(orderNumber);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  }
}
