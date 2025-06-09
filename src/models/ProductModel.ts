
export interface ProductModel {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image?: string;
  category: string;
  brand: string;
  stockQuantity: number;
  inStock: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
  sortBy: string;
  showInStock: boolean;
}

export interface CreateProductData {
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image?: string;
  category: string;
  brand: string;
  stockQuantity: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export class ProductModelValidator {
  static validateCreateData(data: CreateProductData): string[] {
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (!data.price || data.price <= 0) {
      errors.push("Preço deve ser maior que zero");
    }
    
    if (data.originalPrice && data.originalPrice <= data.price) {
      errors.push("Preço original deve ser maior que o preço atual");
    }
    
    if (!data.category || data.category.trim().length === 0) {
      errors.push("Categoria é obrigatória");
    }
    
    if (!data.brand || data.brand.trim().length === 0) {
      errors.push("Marca é obrigatória");
    }
    
    if (data.stockQuantity < 0) {
      errors.push("Quantidade em estoque não pode ser negativa");
    }
    
    return errors;
  }
  
  static validateUpdateData(data: UpdateProductData): string[] {
    const errors: string[] = [];
    
    if (!data.id) {
      errors.push("ID do produto é obrigatório");
    }
    
    if (data.name !== undefined && data.name.trim().length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (data.price !== undefined && data.price <= 0) {
      errors.push("Preço deve ser maior que zero");
    }
    
    if (data.originalPrice !== undefined && data.price !== undefined && data.originalPrice <= data.price) {
      errors.push("Preço original deve ser maior que o preço atual");
    }
    
    if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
      errors.push("Quantidade em estoque não pode ser negativa");
    }
    
    return errors;
  }
}
