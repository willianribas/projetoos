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

        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Email ou senha incorretos");
          }
          throw error;
        }

        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("already registered")) {
            throw new Error("Este email já está cadastrado");
          }
          throw error;
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
        
        // Switch to login view after successful signup
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na autenticação",
        description: error.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Boxes className="h-12 w-12 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Daily.Flow
            </h1>
          </div>
          <p className="text-foreground/90 text-lg">
            Sistema de Gerenciamento de Ordens de Serviço
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-border/50">
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

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre"}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Auth;