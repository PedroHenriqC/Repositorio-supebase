import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {LayoutDashboard,DollarSign,Users,Package,LogOut,} from "lucide-react";
import "../CSS/dashboard.css";

export function Dashboard() {
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState({
    sales: 0,
    clients: 0,
    products: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: cCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      const { count: pCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { data: sData } = await supabase
        .from("sales")
        .select("total_amount");

      const total =
        sData?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

      setStats({
        sales: total,
        clients: cCount || 0,
        products: pCount || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">TechSystem</h2>

        <nav>
          <a className="active">
            <LayoutDashboard size={18} /> Dashboard
          </a>

          <a>
            <Users size={18} /> Clientes
          </a>

          <a>
            <Package size={18} /> Produtos
          </a>
        </nav>

        <button className="logout">
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="header">
          <h1>Painel de Controle</h1>
        </header>

        <section className="cards">
          <div className="card green">
            <div>
              <p>Faturamento</p>
              <h2>{isAdmin ? `R$ ${stats.sales.toFixed(2)}` : "R$ *****"}</h2>
            </div>
            <DollarSign size={28} />
          </div>

          <div className="card blue">
            <div>
              <p>Clientes</p>
              <h2>{stats.clients}</h2>
            </div>
            <Users size={28} />
          </div>

          <div className="card purple">
            <div>
              <p>Produtos</p>
              <h2>{stats.products}</h2>
            </div>
            <Package size={28} />
          </div>
        </section>
      </main>
    </div>
  );
}
