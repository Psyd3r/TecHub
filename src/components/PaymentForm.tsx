
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, CreditCard, Calendar, Shield } from "lucide-react";

interface PaymentFormProps {
  type: "credit" | "boleto" | "pix";
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  total: number;
  disabled?: boolean;
}

export const PaymentForm = ({ type, onSubmit, isProcessing, total, disabled = false }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    installments: "1",
    cpf: "",
    email: "",
    phone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit({ ...formData, paymentType: type });
  };

  const handleInputChange = (field: string, value: string) => {
    if (disabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (type === "pix") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <QrCode className="h-32 w-32 text-black" />
          </div>
          <p className="text-white text-lg font-semibold mb-2">PIX Simulado</p>
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <code className="text-green-400 text-sm break-all">
              SIMULACAO-PIX-PROJETO-ACADEMICO-{total.toFixed(2)}-TECHHUB
            </code>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Código PIX simulado para fins acadêmicos
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cpf" className="text-white">CPF (Opcional)</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleInputChange("cpf", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="000.000.000-00"
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">E-mail (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="seu@email.com"
              disabled={disabled}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing || disabled}
          className="w-full button-gradient text-white font-semibold py-3"
        >
          {isProcessing ? "Processando..." : "Simular Pagamento PIX"}
        </Button>
      </form>
    );
  }

  if (type === "boleto") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-[#4ADE80]" />
            <span className="text-white font-semibold">Boleto Simulado</span>
          </div>
          <p className="text-gray-400 text-sm">
            Simulação de boleto para projeto acadêmico. 
            Em um ambiente real, seria gerado um boleto bancário.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cpf" className="text-white">CPF (Opcional)</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleInputChange("cpf", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="000.000.000-00"
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">E-mail (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="seu@email.com"
              disabled={disabled}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing || disabled}
          className="w-full button-gradient text-white font-semibold py-3"
        >
          {isProcessing ? "Processando..." : "Simular Boleto"}
        </Button>
      </form>
    );
  }

  // Cartão de Crédito
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber" className="text-white">Número do Cartão (Opcional)</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white pl-10"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              disabled={disabled}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="cardName" className="text-white">Nome no Cartão (Opcional)</Label>
          <Input
            id="cardName"
            value={formData.cardName}
            onChange={(e) => handleInputChange("cardName", e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            placeholder="Nome como está no cartão"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate" className="text-white">Validade (Opcional)</Label>
            <Input
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="MM/AA"
              maxLength={5}
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="cvv" className="text-white">CVV (Opcional)</Label>
            <div className="relative">
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white pr-10"
                placeholder="123"
                maxLength={4}
                disabled={disabled}
              />
              <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="installments" className="text-white">Parcelamento</Label>
          <Select 
            value={formData.installments} 
            onValueChange={(value) => handleInputChange("installments", value)}
            disabled={disabled}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x de R$ {total.toLocaleString('pt-BR')} sem juros</SelectItem>
              <SelectItem value="2">2x de R$ {(total / 2).toLocaleString('pt-BR')} sem juros</SelectItem>
              <SelectItem value="3">3x de R$ {(total / 3).toLocaleString('pt-BR')} sem juros</SelectItem>
              <SelectItem value="6">6x de R$ {(total / 6).toLocaleString('pt-BR')} sem juros</SelectItem>
              <SelectItem value="12">12x de R$ {(total / 12).toLocaleString('pt-BR')} sem juros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || disabled}
        className="w-full button-gradient text-white font-semibold py-3"
      >
        {isProcessing ? "Processando..." : `Simular Compra - R$ ${total.toLocaleString('pt-BR')}`}
      </Button>
    </form>
  );
};
