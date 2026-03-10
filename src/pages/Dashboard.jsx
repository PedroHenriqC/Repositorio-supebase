import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, DollarSign, Users, Package } from "lucide-react";

export function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ sales: 0, clients: 0, products: 0 });

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
      setStats({ sales: total, clients: cCount || 0, products: pCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <LayoutDashboard className="text-blue-600" /> Painel de Controle
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm font-bold text-gray-500 uppercase">
            Faturamento Total
          </p>
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-2xl font-bold">
              {isAdmin ? `R$ ${stats.sales.toFixed(2)}` : "R$ *****"}
            </h2>
            <DollarSign className="text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-bold text-gray-500 uppercase">Clientes</p>
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-2xl font-bold">{stats.clients}</h2>
            <Users className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm font-bold text-gray-500 uppercase">Produtos</p>
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-2xl font-bold">{stats.products}</h2>
            <Package className="text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
