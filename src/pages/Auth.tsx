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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    console.log("Iniciando tentativa de login com email:", email);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Resposta do login:", { data, error });

      if (error) {
        throw error;
      }

      if (data?.user) {
        console.log("Login bem-sucedido, redirecionando...");
        toast({
          title: "Login realizado com sucesso!",
          duration: 2000,
        });
        navigate("/");
      } else {
        console.log("Login falhou - sem dados do usuário");
        throw new Error("Falha no login - dados do usuário não encontrados");
      }
    } catch (error: any) {
      console.error("Erro detalhado do login:", error);
      
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou senha incorretos. Por favor, verifique suas credenciais.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Por favor, verifique sua caixa de entrada.";
      }

      toast({
        variant: "destructive",
        title: "Erro no login",
        description: errorMessage,
        duration: 4000,
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

        <form onSubmit={handleLogin} className="mt-8 space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                disabled={loading}
                className="w-full"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;