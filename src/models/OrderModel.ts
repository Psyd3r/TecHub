
export interface OrderItem {
  id: string;
  uuid?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  paymentMethod: string;
  totalAmount: number;
}

export interface OrderModel {
  id?: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export class OrderModelValidator {
  static validateCreateData(data: CreateOrderData): string[] {
    const errors: string[] = [];

    if (!data.userId) {
      errors.push('User ID is required');
    }

    if (!data.items || data.items.length === 0) {
      errors.push('Order items are required');
    }

    if (!data.paymentMethod) {
      errors.push('Payment method is required');
    }

    if (!data.totalAmount || data.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0');
    }

    // Validate each item
    data.items?.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1}: ID is required`);
      }
      if (!item.name) {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Item ${index + 1}: Price must be greater than 0`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return errors;
  }
}
