import { useState } from "react";
import { SendHorizontal, Loader2, MessageSquare } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';

function PublishMessage({ credentials }) {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/mqtt/publicar", {
        username: credentials.username,
        password: credentials.password,
        topic,
        message,
      });

      if (response.status === 200) {
        toast.success(response.data.message, { autoClose: 1000, closeOnClick: true, hideProgressBar: true });
      } else {
        toast.error(response.data.error, { autoClose: 1000, closeOnClick: true, hideProgressBar: true });
      }
    } catch (err) {
      toast.error('Error al publicar el mensaje', { autoClose: 1000, closeOnClick: true, hideProgressBar: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Publicar Mensaje
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none resize-none h-32"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="w-5 h-5" />
                  <span>Publicar Mensaje</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishMessage;
