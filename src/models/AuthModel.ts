
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

export interface PaymentMethod {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  personal: User & { password: string; confirmPassword: string };
  address: Address;
  payment: PaymentMethod;
}
