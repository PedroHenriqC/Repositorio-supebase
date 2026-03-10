import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Users, Plus, Trash2 } from "lucide-react";

export function Clients() {
  const [clients, setClients] = useState([]);
  const { isAdmin } = useAuth();

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("name");
    setClients(data || []);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Apenas administradores podem excluir!");
    if (confirm("Deseja realmente excluir este cliente?")) {
      await supabase.from("clients").delete().eq("id", id);
      loadClients();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users /> Clientes
        </h1>
        {isAdmin && (
          <button className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 shadow-sm transition">
            <Plus size={20} /> Novo Cliente
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-bold border-b text-sm">
            <tr>
              <th className="p-4 uppercase">Nome</th>
              <th className="p-4 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-700">{client.name}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(client.id)}
                    className={`${isAdmin ? "text-red-500 hover:text-red-700" : "text-gray-300 cursor-not-allowed"}`}
                    disabled={!isAdmin}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
