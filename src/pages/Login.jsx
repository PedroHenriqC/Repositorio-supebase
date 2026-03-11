import { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogIn } from "lucide-react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (error) {
  alert("Erro ao logar: " + error.message);
} else {
  navigate("/dashboard");
}

setLoading(false);
  };
 return (
   <div className="login-page">
     <div className="login-card">
       <div className="login-icon">
         <LogIn size={40} />
       </div>

       <h2>Acesso ao Sistema</h2>

       <form onSubmit={handleLogin}>
         <div className="input-group">
           <label>E-mail</label>
           <input
             type="email"
             placeholder="seu@email.com"
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>

         <div className="input-group">
           <label>Senha</label>
           <input
             type="password"
             placeholder="******"
             onChange={(e) => setPassword(e.target.value)}
             required
           />
         </div>

         <button type="submit" disabled={loading}>
           {loading ? "Entrando..." : "Entrar no Sistema"}
         </button>
       </form>
     </div>
   </div>
 );
}
