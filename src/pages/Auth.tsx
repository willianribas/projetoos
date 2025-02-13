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
  const {
    toast
  } = useToast();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
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
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl border border-white/20">
        <motion.div initial={{
        scale: 0.8
      }} animate={{
        scale: 1
      }} transition={{
        delay: 0.2,
        type: "spring",
        stiffness: 200
      }} className="flex flex-col items-center gap-2">
          <img src="/lovable-uploads/3bfab654-e541-4930-a97d-6447b525b0b4.png" alt="Daily.Flow Logo" className="h-13 object-contain" />
          <p className="text-foreground/60 text-sm">
            Sistema de Gerenciamento de Ordens de Serviço
          </p>
        </motion.div>

        <motion.form initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4
      }} onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Digite seu email" className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-white/5 border-white/10" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Digite sua senha" className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-white/5 border-white/10" />
          </div>

          <Button type="submit" disabled={loading} className="w-full animate-gradient bg-gradient-to-r from-white-500 via-purple-600 to-pink-600 py-[7px] px-0 mx-0 my-0 text-white bg-slate-50 rounded-2xl">
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </motion.form>
      </motion.div>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.6
    }} className="mt-8 text-sm text-foreground/60">
        &copy; 2025 Daily.Flow. Todos os direitos reservados.
      </motion.div>
    </div>;
};
export default Auth;