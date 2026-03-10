import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Package, Plus } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  // 1. Declaramos a função ANTES do useEffect para que ele a reconheça ao ser lido
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Agora o useEffect chama a função que já foi definida acima
  useEffect(() => {
    loadProducts();
  }, []);

  // Tela de carregamento para melhor UX
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-medium text-gray-500">
        Carregando catálogo de produtos...
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Cabeçalho com controle de permissão */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Package className="text-blue-600" /> Produtos
        </h1>

        {/* O botão de "Novo" só renderiza se o perfil logado for ADMIN */}
        {isAdmin && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={20} /> Novo Produto
          </button>
        )}
      </div>

      {/* Grid de listagem */}
      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
          Nenhum produto encontrado no estoque.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">
                  {product.name}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock > 0 ? "Em estoque" : "Esgotado"}
                </span>
              </div>

              <p className="text-2xl font-bold text-blue-600 my-3">
                R$ {Number(product.price).toFixed(2)}
              </p>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50 text-sm">
                <span className="text-gray-500 italic">
                  Qtd: {product.stock} unidades
                </span>

                {/* Ações restritas ao Admin */}
                {isAdmin && (
                  <div className="space-x-3">
                    <button className="text-blue-600 hover:underline font-medium">
                      Editar
                    </button>
                    <button className="text-red-500 hover:underline font-medium">
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
