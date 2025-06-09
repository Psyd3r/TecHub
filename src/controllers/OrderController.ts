
import { OrderService, OrderData } from "@/services/OrderService";
import { ProductService } from "@/services/ProductService";

export class OrderController {
  static async processOrder(
    userId: string, 
    items: Array<{
      id: number;
      uuid?: string;
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
      console.log('Simulação acadêmica - validações de estoque mantidas para realismo do sistema');

      // Verificar estoque disponível para cada item
      for (const item of items) {
        // Usar UUID se disponível, senão usar ID convertido para string
        const productId = item.uuid || item.id.toString();
        const product = await ProductService.getProductById(productId);
        
        if (!product) {
          throw new Error(`Produto ${item.name} não encontrado`);
        }
        
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Estoque insuficiente para ${item.name}. Disponível: ${product.stockQuantity}, Solicitado: ${item.quantity}`);
        }
      }

      // Criar pedido
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

      // Atualizar estoque após criar o pedido - CORREÇÃO DO BUG
      for (const item of items) {
        const productId = item.uuid || item.id.toString();
        
        // Buscar o produto atual para obter o estoque atualizado
        const product = await ProductService.getProductById(productId);
        
        if (product) {
          // Calcular o novo estoque: estoque atual - quantidade comprada
          const newStockQuantity = product.stockQuantity - item.quantity;
          console.log(`Atualizando estoque do produto ${item.name}: ${product.stockQuantity} - ${item.quantity} = ${newStockQuantity}`);
          
          // Garantir que o estoque não fique negativo
          const finalStock = Math.max(0, newStockQuantity);
          
          await ProductService.updateStock(productId, finalStock);
        }
      }

      console.log(`Pedido criado com sucesso: ${orderNumber}`);
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
