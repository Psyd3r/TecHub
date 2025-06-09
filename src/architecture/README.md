
# Arquitetura MVC - Documentação

## Visão Geral

Esta aplicação implementa o padrão de arquitetura **Model-View-Controller (MVC)** de forma clara e bem estruturada, garantindo separação de responsabilidades e facilidade de manutenção.

## Estrutura da Arquitetura

### 📁 Models (`src/models/`)
**Responsabilidade**: Definir a estrutura dos dados e regras de validação

- **ProductModel.ts**: Interface e validações para produtos
- **CartModel.ts**: Interface e validações para carrinho de compras  
- **UserModel.ts**: Interface e validações para usuários
- **AuthModel.ts**: Interface para autenticação (legacy)

**Características**:
- Interfaces TypeScript bem definidas
- Classes de validação para cada model
- Regras de negócio relacionadas aos dados
- Tipagem forte e consistente

### 🎮 Controllers (`src/controllers/`)
**Responsabilidade**: Coordenar a lógica de negócio entre Models, Views e Services

- **ProductController.ts**: Gerencia operações de produtos
- **CartController.ts**: Gerencia operações do carrinho
- **AuthController.ts**: Gerencia autenticação de usuários

**Características**:
- Centraliza a lógica de negócio
- Valida dados usando Models
- Coordena chamadas para Services
- Não conhece detalhes de implementação da UI

### 🔧 Services (`src/services/`)
**Responsabilidade**: Abstrair integrações externas e operações de infraestrutura

- **ProductService.ts**: Integração com Supabase para produtos
- **LocalStorageService.ts**: Abstração para localStorage
- Futuramente: EmailService, PaymentService, etc.

**Características**:
- Abstrai APIs externas
- Mapeia dados entre formatos externos e internos
- Trata erros de integração
- Facilita testes unitários

### 🏪 Stores (`src/stores/`)
**Responsabilidade**: Gerenciar estado global da aplicação usando Zustand

- **ProductStore.ts**: Estado global de produtos
- **CartStore.ts**: Estado global do carrinho

**Características**:
- Estado reativo e performático
- Actions bem definidas
- Integração com Controllers
- Substituição dos React Contexts

### 🖼️ Views (`src/components/` e `src/pages/`)
**Responsabilidade**: Apresentar dados e capturar interações do usuário

- Componentes React puros
- Recebem dados prontos dos Stores
- Chamam actions dos Controllers
- Focam apenas na apresentação

## Fluxo de Dados

```
View → Controller → Model/Service → Store → View
  ↑                                           ↓
  ←─────────── Estado Reativo ←──────────────
```

### Exemplo Prático:

1. **View**: Usuário clica em "Adicionar ao Carrinho"
2. **Controller**: `CartController.addToCart()` valida dados
3. **Model**: `CartModelValidator` verifica regras de negócio
4. **Service**: `LocalStorageService` persiste dados
5. **Store**: `CartStore` atualiza estado global
6. **View**: Componente re-renderiza automaticamente

## Benefícios da Arquitetura

### ✅ **Separação Clara de Responsabilidades**
- Cada camada tem uma função específica
- Mudanças em uma camada não afetam outras
- Código mais organizizado e previsível

### ✅ **Facilidade de Testes**
- Controllers podem ser testados independentemente
- Services podem ser mockados facilmente
- Models têm validações isoladas

### ✅ **Manutenibilidade**
- Bugs são mais fáceis de localizar
- Novas funcionalidades seguem padrão estabelecido
- Refatorações são mais seguras

### ✅ **Escalabilidade**
- Fácil adicionar novos Models/Controllers
- Services podem ser expandidos sem afetar lógica de negócio
- Estado global bem gerenciado

### ✅ **Reutilização de Código**
- Controllers podem ser usados em diferentes Views
- Services abstraem implementações específicas
- Models garantem consistência de dados

## Migração de Context para Store

**Antes (Context)**:
```typescript
const { addToCart } = useCart();
```

**Depois (Store MVC)**:
```typescript
const addToCart = useCartStore(state => state.addToCart);
```

## Convenções de Nomenclatura

- **Models**: `*Model.ts` + `*ModelValidator`
- **Controllers**: `*Controller.ts` 
- **Services**: `*Service.ts`
- **Stores**: `*Store.ts` + hook `use*Store`

## Próximos Passos

1. ✅ **Models implementados**
2. ✅ **Controllers implementados** 
3. ✅ **Services implementados**
4. ✅ **Stores implementados**
5. 🔄 **Refatorar Views para usar nova arquitetura**
6. 🔄 **Migrar Contexts para Stores**
7. 🔄 **Implementar testes unitários**
8. 🔄 **Documentar APIs dos Controllers**

---

Esta arquitetura MVC garante que a aplicação seja **robusta**, **testável** e **fácil de manter**, seguindo as melhores práticas de desenvolvimento de software.
