import { Link, useNavigate } from "react-router-dom";
import { Send, LogOut, Database, Podcast } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí podrías agregar lógica adicional de logout si es necesario
    navigate("/login");
    window.location.reload(); // Esto recargará la página y reiniciará el estado
  };

  return (
    <nav className="bg-emerald-700 text-white p-2 shadow-lg">
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex space-x-4">
          <Link 
            to="/publish" 
            className="flex items-center gap-2 hover:bg-yellow-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Send size={20} />
            Publicar
          </Link>
          <Link 
            to="/suscribe" 
            className="flex items-center gap-2 hover:bg-yellow-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Podcast size={20} />
            Suscribirse
          </Link>
          <Link 
            to="/datos" 
            className="flex items-center gap-2 hover:bg-yellow-700 px-3 py-2 rounded-lg transition-colors"
          >
            <Database size={20} />
            Datos
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-purple-800 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 