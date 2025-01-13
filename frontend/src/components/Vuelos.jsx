import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Vuelos = () => {
  const { token } = useAuth();
  const [vuelos, setVuelos] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [formData, setFormData] = useState({
    numero_vuelo: '',
    origen: '',
    destino: '',
    fecha_y_hora_de_salida: '',
    fecha_y_hora_de_llegada: '',
    estado_del_vuelo: '',
    id_avion: ''
  });

  const estadosVuelo = ['En espera', 'En curso', 'Finalizado', 'Cancelado'];
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVuelos();
    fetchAeropuertos();
    fetchAviones();
  }, []);

  const fetchVuelos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vuelos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVuelos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAeropuertos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/aeropuertos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAeropuertos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAviones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/aviones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAviones(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/vuelos/${currentId}`
        : 'http://localhost:5000/api/vuelos';

      const aeropuertoOrigen = aeropuertos.find(a => a._id === formData.origen);
      const aeropuertoDestino = aeropuertos.find(a => a._id === formData.destino);
      const avionSeleccionado = aviones.find(a => a._id === formData.id_avion);

      if (!aeropuertoOrigen?.Codigo_IATA) {
        alert('Error: No se pudo obtener el código IATA del aeropuerto de origen');
        return;
      }
      if (!aeropuertoDestino?.Codigo_IATA) {
        alert('Error: No se pudo obtener el código IATA del aeropuerto de destino');
        return;
      }
      if (!avionSeleccionado?.codigo_avion) {
        alert('Error: No se pudo obtener el código del avión');
        return;
      }

      // Datos que deben de esperar el backend
      const dataToSend = {
        numero_vuelo: formData.numero_vuelo,
        origen: aeropuertoOrigen?.Codigo_IATA,         // Enviamos solo el código IATA
        destino: aeropuertoDestino?.Codigo_IATA,       // Enviamos solo el código IATA
        fecha_y_hora_de_salida: new Date(formData.fecha_y_hora_de_salida).toISOString(),
        fecha_y_hora_de_llegada: new Date(formData.fecha_y_hora_de_llegada).toISOString(),
        estado_del_vuelo: formData.estado_del_vuelo,
        id_avion: avionSeleccionado?.codigo_avion      // Enviamos el código del avión
      };

      console.log('Datos a enviar:', dataToSend);
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la operación');
      }

      fetchVuelos();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la operación');
    }
};

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este vuelo?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/vuelos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchVuelos();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar el vuelo');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (vuelo) => {
    setFormData({
      numero_vuelo: vuelo.numero_vuelo,
      origen: vuelo.origen.Codigo_IATA,
      destino: vuelo.destino.Codigo_IATA,
      fecha_y_hora_de_salida: new Date(vuelo.fecha_y_hora_de_salida).toISOString().slice(0, 16),
      fecha_y_hora_de_llegada: new Date(vuelo.fecha_y_hora_de_llegada).toISOString().slice(0, 16),
      estado_del_vuelo: vuelo.estado_del_vuelo,
      id_avion: vuelo.id_avion._id
    });
    setCurrentId(vuelo.numero_vuelo);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      numero_vuelo: '',
      origen: '',
      destino: '',
      fecha_y_hora_de_salida: '',
      fecha_y_hora_de_llegada: '',
      estado_del_vuelo: '',
      id_avion: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredVuelos = vuelos.filter(vuelo => 
    vuelo.numero_vuelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuelo.origen?.Codigo_IATA.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuelo.destino?.Codigo_IATA.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuelo.estado_del_vuelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Vuelos</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar vuelo..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Número de Vuelo</label>
            <input
              type="text"
              value={formData.numero_vuelo}
              onChange={(e) => setFormData({...formData, numero_vuelo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Origen</label>
            <select
              value={formData.origen}
              onChange={(e) => setFormData({...formData, origen: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione aeropuerto de origen</option>
              {aeropuertos.map((aeropuerto) => (
                <option key={aeropuerto._id} value={aeropuerto._id}>
                  {aeropuerto.Codigo_IATA} - {aeropuerto.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Destino</label>
            <select
              value={formData.destino}
              onChange={(e) => setFormData({...formData, destino: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione aeropuerto de destino</option>
              {aeropuertos.map((aeropuerto) => (
                <option key={aeropuerto._id} value={aeropuerto._id}>
                  {aeropuerto.Codigo_IATA} - {aeropuerto.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Fecha y Hora de Salida</label>
            <input
              type="datetime-local"
              value={formData.fecha_y_hora_de_salida}
              onChange={(e) => setFormData({...formData, fecha_y_hora_de_salida: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Fecha y Hora de Llegada</label>
            <input
              type="datetime-local"
              value={formData.fecha_y_hora_de_llegada}
              onChange={(e) => setFormData({...formData, fecha_y_hora_de_llegada: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Estado del Vuelo</label>
            <select
              value={formData.estado_del_vuelo}
              onChange={(e) => setFormData({...formData, estado_del_vuelo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione estado</option>
              {estadosVuelo.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Avión</label>
            <select
              value={formData.id_avion}
              onChange={(e) => setFormData({...formData, id_avion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione avión</option>
              {aviones.map((avion) => (
                <option key={avion._id} value={avion._id}>
                  {avion.matricula} - {avion.modelo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Origen</th>
              <th className="p-3 text-left">Destino</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-left">Llegada</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Avión</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVuelos.map((vuelo) => (
              <tr key={vuelo._id} className="border-t">
                <td className="p-3">{vuelo.numero_vuelo}</td>
                <td className="p-3">{vuelo.origen?.Codigo_IATA}</td>
                <td className="p-3">{vuelo.destino?.Codigo_IATA}</td>
                <td className="p-3">{new Date(vuelo.fecha_y_hora_de_salida).toLocaleString()}</td>
                <td className="p-3">{new Date(vuelo.fecha_y_hora_de_llegada).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    vuelo.estado_del_vuelo === 'En curso' ? 'bg-green-100 text-green-800' :
                    vuelo.estado_del_vuelo === 'En espera' ? 'bg-yellow-100 text-yellow-800' :
                    vuelo.estado_del_vuelo === 'Finalizado' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vuelo.estado_del_vuelo}
                  </span>
                </td>
                <td className="p-3">{vuelo.id_avion?.codigo_avion}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(vuelo)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vuelo.numero_vuelo)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vuelos;