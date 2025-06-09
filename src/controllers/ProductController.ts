
import { ProductModel, CreateProductData, UpdateProductData, ProductFilters, ProductModelValidator } from "@/models/ProductModel";
import { ProductService } from "@/services/ProductService";

export class ProductController {
  static async getAllProducts(): Promise<ProductModel[]> {
    try {
      return await ProductService.getAllProducts();
    } catch (error) {
      console.error('Erro no controller ao buscar produtos:', error);
      throw error;
    }
  }
  
  static async getProductById(id: string): Promise<ProductModel | null> {
    if (!id) {
      throw new Error('ID do produto é obrigatório');
    }
    
    try {
      return await ProductService.getProductById(id);
    } catch (error) {
      console.error('Erro no controller ao buscar produto:', error);
      throw error;
    }
  }
  
  static async createProduct(productData: CreateProductData): Promise<ProductModel> {
    // Validar dados antes de criar
    const validationErrors = ProductModelValidator.validateCreateData(productData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    try {
      return await ProductService.createProduct(productData);
    } catch (error) {
      console.error('Erro no controller ao criar produto:', error);
      throw error;
    }
  }
  
  static async updateProduct(productData: UpdateProductData): Promise<ProductModel> {
    // Validar dados antes de atualizar
    const validationErrors = ProductModelValidator.validateUpdateData(productData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    try {
      return await ProductService.updateProduct(productData);
    } catch (error) {
      console.error('Erro no controller ao atualizar produto:', error);
      throw error;
    }
  }
  
  static async deleteProduct(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID do produto é obrigatório');
    }
    
    try {
      await ProductService.deleteProduct(id);
    } catch (error) {
      console.error('Erro no controller ao excluir produto:', error);
      throw error;
    }
  }
  
  static async updateStock(id: string, newStock: number): Promise<void> {
    if (!id) {
      throw new Error('ID do produto é obrigatório');
    }
    
    if (newStock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
    
    try {
      await ProductService.updateStock(id, newStock);
    } catch (error) {
      console.error('Erro no controller ao atualizar estoque:', error);
      throw error;
    }
  }
  
  static filterProducts(products: ProductModel[], filters: ProductFilters): ProductModel[] {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCategory = filters.category === "Todos" || product.category === filters.category;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesStock = !filters.showInStock || product.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    // Aplicar ordenação
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Manter ordem original (relevância)
        break;
    }

    return filtered;
  }
  
  static calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  
  static formatPrice(price: number): string {
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  
  static isProductAvailable(product: ProductModel): boolean {
    return product.inStock && product.stockQuantity > 0;
  }
  
  static getStockStatus(stockQuantity: number): { label: string; variant: "default" | "destructive" | "outline" } {
    if (stockQuantity === 0) return { label: "Sem Estoque", variant: "destructive" };
    if (stockQuantity <= 3) return { label: "Baixo Estoque", variant: "outline" };
    return { label: "Em Estoque", variant: "default" };
  }
}
