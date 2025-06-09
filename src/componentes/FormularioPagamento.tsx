
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { QrCode, CreditCard, Calendar, Shield } from "lucide-react";

interface PropsFormularioPagamento {
  tipo: "credito" | "boleto" | "pix";
  aoEnviar: (dados: any) => void;
  processando: boolean;
  total: number;
  desabilitado?: boolean;
}

export const FormularioPagamento = ({ 
  tipo, 
  aoEnviar, 
  processando, 
  total, 
  desabilitado = false 
}: PropsFormularioPagamento) => {
  const [dadosFormulario, setDadosFormulario] = useState({
    numeroCartao: "",
    nomeCartao: "",
    dataVencimento: "",
    cvv: "",
    parcelas: "1",
    cpf: "",
    email: "",
    telefone: ""
  });

  const manipularEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (desabilitado) return;
    aoEnviar({ ...dadosFormulario, tipoPagamento: tipo });
  };

  const manipularMudancaInput = (campo: string, valor: string) => {
    if (desabilitado) return;
    setDadosFormulario(anterior => ({ ...anterior, [campo]: valor }));
  };

  if (tipo === "pix") {
    return (
      <form onSubmit={manipularEnvio} className="space-y-6">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <QrCode className="h-32 w-32 text-black" />
          </div>
          <p className="text-white text-lg font-semibold mb-2">PIX Copia e Cola</p>
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <code className="text-green-400 text-sm break-all">
              00020126580014BR.GOV.BCB.PIX01364e4b7e8f-8c4d-4c3e-9f2a-1b2c3d4e5f6g0208TechHub520400005303986540{total.toFixed(2)}5802BR5909TechHub6009SAO PAULO62070503***6304ABCD
            </code>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Escaneie o QR Code ou copie e cole o código PIX no seu banco
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cpf" className="text-white">CPF</Label>
            <Input
              id="cpf"
              value={dadosFormulario.cpf}
              onChange={(e) => manipularMudancaInput("cpf", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="000.000.000-00"
              required
              disabled={desabilitado}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={dadosFormulario.email}
              onChange={(e) => manipularMudancaInput("email", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="seu@email.com"
              required
              disabled={desabilitado}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={processando || desabilitado}
          className="w-full button-gradient text-white font-semibold py-3"
        >
          {processando ? "Processando..." : "Confirmar Pagamento PIX"}
        </Button>
      </form>
    );
  }

  if (tipo === "boleto") {
    return (
      <form onSubmit={manipularEnvio} className="space-y-6">
        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-[#4ADE80]" />
            <span className="text-white font-semibold">Informações do Boleto</span>
          </div>
          <p className="text-gray-400 text-sm">
            O boleto será gerado após a confirmação e poderá ser pago em qualquer banco, 
            lotérica ou internet banking. Vencimento: 3 dias úteis.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cpf" className="text-white">CPF</Label>
            <Input
              id="cpf"
              value={dadosFormulario.cpf}
              onChange={(e) => manipularMudancaInput("cpf", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="000.000.000-00"
              required
              disabled={desabilitado}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={dadosFormulario.email}
              onChange={(e) => manipularMudancaInput("email", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="seu@email.com"
              required
              disabled={desabilitado}
            />
          </div>
          <div>
            <Label htmlFor="telefone" className="text-white">Telefone</Label>
            <Input
              id="telefone"
              value={dadosFormulario.telefone}
              onChange={(e) => manipularMudancaInput("telefone", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="(11) 99999-9999"
              required
              disabled={desabilitado}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={processando || desabilitado}
          className="w-full button-gradient text-white font-semibold py-3"
        >
          {processando ? "Gerando Boleto..." : "Gerar Boleto"}
        </Button>
      </form>
    );
  }

  // Cartão de Crédito
  return (
    <form onSubmit={manipularEnvio} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="numeroCartao" className="text-white">Número do Cartão</Label>
          <div className="relative">
            <Input
              id="numeroCartao"
              value={dadosFormulario.numeroCartao}
              onChange={(e) => manipularMudancaInput("numeroCartao", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white pl-10"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
              disabled={desabilitado}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="nomeCartao" className="text-white">Nome no Cartão</Label>
          <Input
            id="nomeCartao"
            value={dadosFormulario.nomeCartao}
            onChange={(e) => manipularMudancaInput("nomeCartao", e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
            placeholder="Nome como está no cartão"
            required
            disabled={desabilitado}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataVencimento" className="text-white">Validade</Label>
            <Input
              id="dataVencimento"
              value={dadosFormulario.dataVencimento}
              onChange={(e) => manipularMudancaInput("dataVencimento", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="MM/AA"
              maxLength={5}
              required
              disabled={desabilitado}
            />
          </div>
          <div>
            <Label htmlFor="cvv" className="text-white">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                value={dadosFormulario.cvv}
                onChange={(e) => manipularMudancaInput("cvv", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white pr-10"
                placeholder="123"
                maxLength={4}
                required
                disabled={desabilitado}
              />
              <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="parcelas" className="text-white">Parcelamento</Label>
          <Select 
            value={dadosFormulario.parcelas} 
            onValueChange={(valor) => manipularMudancaInput("parcelas", valor)}
            disabled={desabilitado}
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
        disabled={processando || desabilitado}
        className="w-full button-gradient text-white font-semibold py-3"
      >
        {processando ? "Processando..." : `Finalizar Compra - R$ ${total.toLocaleString('pt-BR')}`}
      </Button>
    </form>
  );
};
