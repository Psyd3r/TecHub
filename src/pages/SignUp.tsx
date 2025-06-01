
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("personal");

  // Estados para informações pessoais
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    password: "",
    confirmPassword: ""
  });

  // Estados para endereço
  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil"
  });

  // Estados para pagamento
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: ""
  });

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Aqui você implementaria a lógica de cadastro
    console.log("Dados pessoais:", personalData);
    console.log("Endereço:", addressData);
    console.log("Pagamento:", paymentData);
    alert("Conta criada com sucesso!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
        </div>

        <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Complete seu cadastro</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha suas informações para criar sua conta na TechHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pessoais
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pagamento
                </TabsTrigger>
              </TabsList>

              {/* Informações Pessoais */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">Nome</Label>
                    <Input
                      id="firstName"
                      value={personalData.firstName}
                      onChange={(e) => handlePersonalChange("firstName", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={personalData.lastName}
                      onChange={(e) => handlePersonalChange("lastName", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalData.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Telefone</Label>
                    <Input
                      id="phone"
                      value={personalData.phone}
                      onChange={(e) => handlePersonalChange("phone", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-white">CPF</Label>
                    <Input
                      id="cpf"
                      value={personalData.cpf}
                      onChange={(e) => handlePersonalChange("cpf", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-white">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={personalData.birthDate}
                    onChange={(e) => handlePersonalChange("birthDate", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={personalData.password}
                      onChange={(e) => handlePersonalChange("password", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Sua senha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={personalData.confirmPassword}
                      onChange={(e) => handlePersonalChange("confirmPassword", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Confirme sua senha"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep("address")}
                  className="button-gradient w-full"
                >
                  Próximo: Endereço
                </Button>
              </TabsContent>

              {/* Endereço de Entrega */}
              <TabsContent value="address" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-white">CEP</Label>
                    <Input
                      id="cep"
                      value={addressData.cep}
                      onChange={(e) => handleAddressChange("cep", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-white">Rua</Label>
                    <Input
                      id="street"
                      value={addressData.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Nome da rua"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-white">Número</Label>
                    <Input
                      id="number"
                      value={addressData.number}
                      onChange={(e) => handleAddressChange("number", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="text-white">Complemento</Label>
                    <Input
                      id="complement"
                      value={addressData.complement}
                      onChange={(e) => handleAddressChange("complement", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Apto, bloco, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-white">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={addressData.neighborhood}
                    onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Nome do bairro"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">Cidade</Label>
                    <Input
                      id="city"
                      value={addressData.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white">Estado</Label>
                    <Select value={addressData.state} onValueChange={(value) => handleAddressChange("state", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("personal")}
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("payment")}
                    className="button-gradient flex-1"
                  >
                    Próximo: Pagamento
                  </Button>
                </div>
              </TabsContent>

              {/* Forma de Pagamento */}
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Método de Pagamento</Label>
                  <Select value={paymentData.paymentMethod} onValueChange={(value) => handlePaymentChange("paymentMethod", value)}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto Bancário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(paymentData.paymentMethod === "credit" || paymentData.paymentMethod === "debit") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-white">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName" className="text-white">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        value={paymentData.cardName}
                        onChange={(e) => handlePaymentChange("cardName", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="Nome como está no cartão"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-white">Data de Validade</Label>
                        <Input
                          id="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("address")}
                    className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="button-gradient flex-1"
                  >
                    Criar Conta
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
