
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, MapPin, CreditCard, LogIn, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Estados para login
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Estados para recuperação de senha
  const [resetEmail, setResetEmail] = useState("");

  // Estados para cadastro
  const [signUpData, setSignUpData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cpf: "",
      birthDate: "",
      password: "",
      confirmPassword: ""
    },
    address: {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil"
    },
    payment: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: ""
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!"
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (signUpData.personal.password !== signUpData.personal.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não conferem",
        variant: "destructive"
      });
      return;
    }

    console.log("Dados de cadastro:", signUpData);

    setIsLoading(true);
    
    try {
      const { error } = await signUp(
        signUpData.personal.email,
        signUpData.personal.password,
        {
          first_name: signUpData.personal.firstName,
          last_name: signUpData.personal.lastName,
          phone: signUpData.personal.phone,
          cpf: signUpData.personal.cpf,
          birth_date: signUpData.personal.birthDate
        }
      );
      
      if (error) {
        console.error("Erro no cadastro:", error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta."
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro no cadastro",
        description: "Erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          title: "Erro na recuperação",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique seu email para redefinir a senha."
        });
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error) {
      toast({
        title: "Erro na recuperação",
        description: "Erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalData = (field: string, value: string) => {
    setSignUpData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateAddressData = (field: string, value: string) => {
    setSignUpData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const updatePaymentData = (field: string, value: string) => {
    setSignUpData(prev => ({
      ...prev,
      payment: { ...prev.payment, [field]: value }
    }));
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForgotPassword(false)}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
          </div>

          <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Mail className="h-6 w-6" />
                Redefinir Senha
              </CardTitle>
              <CardDescription className="text-gray-400">
                Digite seu email para receber o link de recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-white">E-mail</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="button-gradient w-full"
                >
                  {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white">Entrar / Criar Conta</h1>
        </div>

        <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Acesse sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Faça login ou crie uma nova conta na TechHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail" className="text-white">E-mail</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword" className="text-white">Senha</Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-800/50 border-gray-700 text-white"
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#4ADE80] hover:text-[#4ADE80]/80 p-0"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="button-gradient w-full"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-6">
                <Tabs defaultValue="personal" className="space-y-6">
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

                  {/* Dados Pessoais */}
                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">Nome</Label>
                        <Input
                          id="firstName"
                          value={signUpData.personal.firstName}
                          onChange={(e) => updatePersonalData("firstName", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
                        <Input
                          id="lastName"
                          value={signUpData.personal.lastName}
                          onChange={(e) => updatePersonalData("lastName", e.target.value)}
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
                        value={signUpData.personal.email}
                        onChange={(e) => updatePersonalData("email", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Telefone</Label>
                        <Input
                          id="phone"
                          value={signUpData.personal.phone}
                          onChange={(e) => updatePersonalData("phone", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-white">CPF</Label>
                        <Input
                          id="cpf"
                          value={signUpData.personal.cpf}
                          onChange={(e) => updatePersonalData("cpf", e.target.value)}
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
                        value={signUpData.personal.birthDate}
                        onChange={(e) => updatePersonalData("birthDate", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={signUpData.personal.password}
                          onChange={(e) => updatePersonalData("password", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="Sua senha"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={signUpData.personal.confirmPassword}
                          onChange={(e) => updatePersonalData("confirmPassword", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="Confirme sua senha"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Endereço */}
                  <TabsContent value="address" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cep" className="text-white">CEP</Label>
                        <Input
                          id="cep"
                          value={signUpData.address.cep}
                          onChange={(e) => updateAddressData("cep", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="street" className="text-white">Rua</Label>
                        <Input
                          id="street"
                          value={signUpData.address.street}
                          onChange={(e) => updateAddressData("street", e.target.value)}
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
                          value={signUpData.address.number}
                          onChange={(e) => updateAddressData("number", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement" className="text-white">Complemento</Label>
                        <Input
                          id="complement"
                          value={signUpData.address.complement}
                          onChange={(e) => updateAddressData("complement", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="Apto, bloco, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="text-white">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={signUpData.address.neighborhood}
                        onChange={(e) => updateAddressData("neighborhood", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">Cidade</Label>
                        <Input
                          id="city"
                          value={signUpData.address.city}
                          onChange={(e) => updateAddressData("city", e.target.value)}
                          className="bg-gray-800/50 border-gray-700 text-white"
                          placeholder="Nome da cidade"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">Estado</Label>
                        <Select value={signUpData.address.state} onValueChange={(value) => updateAddressData("state", value)}>
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
                  </TabsContent>

                  {/* Pagamento */}
                  <TabsContent value="payment" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Método de Pagamento</Label>
                      <Select value={signUpData.payment.paymentMethod} onValueChange={(value) => updatePaymentData("paymentMethod", value)}>
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

                    {(signUpData.payment.paymentMethod === "credit" || signUpData.payment.paymentMethod === "debit") && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-white">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            value={signUpData.payment.cardNumber}
                            onChange={(e) => updatePaymentData("cardNumber", e.target.value)}
                            className="bg-gray-800/50 border-gray-700 text-white"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-white">Nome no Cartão</Label>
                          <Input
                            id="cardName"
                            value={signUpData.payment.cardName}
                            onChange={(e) => updatePaymentData("cardName", e.target.value)}
                            className="bg-gray-800/50 border-gray-700 text-white"
                            placeholder="Nome como está no cartão"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate" className="text-white">Data de Validade</Label>
                            <Input
                              id="expiryDate"
                              value={signUpData.payment.expiryDate}
                              onChange={(e) => updatePaymentData("expiryDate", e.target.value)}
                              className="bg-gray-800/50 border-gray-700 text-white"
                              placeholder="MM/AA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv" className="text-white">CVV</Label>
                            <Input
                              id="cvv"
                              value={signUpData.payment.cvv}
                              onChange={(e) => updatePaymentData("cvv", e.target.value)}
                              className="bg-gray-800/50 border-gray-700 text-white"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Button
                      onClick={handleSignUp}
                      disabled={isLoading}
                      className="button-gradient w-full"
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
