import { useState, useEffect } from "react";
import { Loader2, Radio, MessageSquareDashed, History } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from 'react-toastify';

function SubscribeTopic({ credentials }) {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/mqtt/suscribirse", {
        username: credentials.username,
        password: credentials.password,
        topic,
      });

      if (response.status === 200) {
        toast.success(response.data.message, { autoClose: 2000, closeOnClick: true, hideProgressBar: true });
      } else {
        toast.error(response.data.error, { autoClose: 2000, closeOnClick: true, hideProgressBar: true });
      }
    } catch (err) {
      toast.error('Error al suscribirse al topic', { autoClose: 2000, closeOnClick: true, hideProgressBar: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Conectar al WebSocket para recibir mensajes
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:4000");
    socket.onopen = () => {
      console.log("Conexión WebSocket establecida");
    };
    socket.onmessage = (event) => {
      const { topic: receivedTopic, message } = JSON.parse(event.data);
      if (receivedTopic === topic) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
    setWs(socket);

    return () => {
      socket.close();
    };
  }, [topic]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquareDashed className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Suscripción
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tópico
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Ingresa el tópico..."
                />
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Suscribiendo...</span>
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5" />
                  <span>Suscribirse</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Historial de Mensajes
            </h3>
          </div>
          
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay mensajes recibidos
              </p>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
                >
                  {msg}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscribeTopic;