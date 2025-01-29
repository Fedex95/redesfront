import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { ChartSquare } from 'lucide-react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
} from 'chart.js';

// Configuración de ChartJS
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ArcElement);

export default function Datos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:4000');

    socket.onopen = () => {
      console.log('Conexión WebSocket abierta');
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        // Verificamos que 'message' contiene un string JSON que podemos parsear
        const messageData = JSON.parse(parsedData.message);

        // Asegurarnos de que messageData es un array
        if (Array.isArray(messageData)) {
          setData(messageData);
        } else {
          console.error('Datos recibidos no son un array:', messageData);
        }
      } catch (error) {
        console.error('Error al parsear los datos:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.close();
    };
  }, []);

  // Configuración del gráfico Line
  const lineChartData = {
    labels: data.map((item) => item.moneda),
    datasets: [
      {
        label: 'Compradores',
        data: data.map((item) => item.compradores),
        borderColor: '#059669', // emerald-600
        backgroundColor: 'rgba(5, 150, 105, 0.2)', // emerald-600 with opacity
        pointStyle: 'circle',
        pointRadius: 5,
        fill: true,
      },
    ],
  };

  // Configuración del gráfico Doughnut
  const doughnutChartData = {
    labels: data.map((item) => item.moneda),
    datasets: [
      {
        label: 'Compradores',
        data: data.map((item) => item.compradores),
        backgroundColor: [
          'rgba(5, 150, 105, 0.6)',  // emerald-600
          'rgba(14, 165, 233, 0.6)', // sky-500
          'rgba(234, 179, 8, 0.6)',  // yellow-500
          'rgba(239, 68, 68, 0.6)',  // red-500
          'rgba(139, 92, 246, 0.6)', // violet-500
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-8">
            <ChartSquare className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Datos del Mercado Trading
            </h2>
          </div>

          {data.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Tendencia de Compradores
                </h3>
                <Line data={lineChartData} />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Distribución de Compradores
                </h3>
                <Doughnut data={doughnutChartData} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

