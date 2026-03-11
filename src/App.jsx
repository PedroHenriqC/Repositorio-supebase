import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { Products } from "./pages/Products";
import { Sales } from "./pages/Sales";

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* rota pública */}
          <Route path="/login" element={<Login />} />

          {/* rotas protegidas */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/vendas" element={<Sales />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
