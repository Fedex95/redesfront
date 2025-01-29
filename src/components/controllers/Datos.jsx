import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
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
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointStyle: 'circle',
        pointRadius: 5,
        fill: false,
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
          'rgba(255,99,132,0.6)',
          'rgba(54,162,235,0.6)',
          'rgba(255,206,86,0.6)',
          'rgba(75,192,192,0.6)',
          'rgba(153,102,255,0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Datos del Mercado Trading</h2>
      <div style={styles.chartContainer}>
        {data.length > 0 ? (
          <>
            <div style={styles.chart}>
              <Line data={lineChartData} />
            </div>
            <div style={styles.chart}>
              <Doughnut data={doughnutChartData} />
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '30px',
    marginBottom: '20px',
    color:'green'
  },
  chartContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  chart: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};
