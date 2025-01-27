import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login no sistema.",
        });
        
        setIsLogin(true);
      }

      if (isLogin) {
        navigate("/");
      }
    } catch (error: any) {
      let message = "Ocorreu um erro inesperado";
      
      if (error.message === "Invalid login credentials") {
        message = "Email ou senha inválidos";
      } else if (error.message.includes("Email rate limit exceeded")) {
        message = "Muitas tentativas. Tente novamente mais tarde";
      } else if (error.message.includes("User already registered")) {
        message = "Este email já está cadastrado";
      }

      toast({
        variant: "destructive",
        title: isLogin ? "Erro ao fazer login" : "Erro ao criar conta",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Boxes className="h-12 w-12 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sistema OS
            </h1>
          </div>
          <p className="text-foreground/90 text-lg">
            Sistema de Gerenciamento de Ordens de Serviço
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="Digite seu email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                placeholder="Digite sua senha"
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar Conta")}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;