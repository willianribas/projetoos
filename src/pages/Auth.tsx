
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: "Entre em contato com o administrador do sistema"
        });
        return;
      }
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na autenticação",
        description: "Entre em contato com o administrador do sistema"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 glass-panel p-8 rounded-xl shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-2"
        >
          <img 
            src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" 
            alt="Daily.Flow Logo" 
            className="h-16 object-contain drop-shadow-lg"
          />
          <p className="text-blue-100/70 text-sm mt-2">
            Sistema de Gerenciamento de Ordens de Serviço
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleAuth} 
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-100">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Digite seu email" 
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-100">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Digite sua senha" 
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 transition-all duration-300"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </motion.form>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-sm text-blue-100/60"
      >
        &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
      </motion.div>
    </div>
  );
};

export default Auth;
