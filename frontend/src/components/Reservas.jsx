import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Reservas = () => {
  const { token } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [formData, setFormData] = useState({
    id_pasajero: '',
    id_vuelo: '',
    fecha_reserva: '',
    clase: '',
    estado_reserva: ''
  });

  // Opciones para campos select
  const opcionesClase = ["Economica", "Premium", "Empresarial"];
  const opcionesEstado = ['Reservado', 'Comprado', 'Cancelado'];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para búsqueda segura
  const safeSearch = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().toLowerCase();
  };

  useEffect(() => {
    fetchReservas();
    fetchPasajeros();
    fetchVuelos();
  }, []);

  const fetchPasajeros = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pasajeros`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPasajeros(data.data || []);
    } catch (error) {
      console.error('Error al cargar pasajeros:', error);
    }
  };

  const fetchVuelos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vuelos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVuelos(data.data || []);
    } catch (error) {
      console.error('Error al cargar vuelos:', error);
    }
  };

  const fetchReservas = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setReservas(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/reservas/${currentId}`
        : `${process.env.REACT_APP_API_URL}/api/reservas`;

      // Buscar el pasajero y vuelo seleccionados para obtener sus códigos
      const pasajeroSeleccionado = pasajeros.find(p => p._id === formData.id_pasajero);
      const vueloSeleccionado = vuelos.find(v => v._id === formData.id_vuelo);

      const dataToSend = {
        id_pasajero: pasajeroSeleccionado?.codigo_pasajero, // Enviamos el código en lugar del ID
        id_vuelo: vueloSeleccionado?.numero_vuelo,          // Enviamos el número en lugar del ID
        fecha_reserva: new Date(formData.fecha_reserva).toISOString(),
        clase: formData.clase,
        estado_reserva: formData.estado_reserva
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
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error en la operación');
      }

      const data = await response.json();
      console.log('Respuesta exitosa:', data);

      fetchReservas();
      resetForm();
    } catch (error) {
      console.error('Error completo:', error);
      alert('Error al procesar la operación: ' + error.message);
    }
};

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservas/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchReservas();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar la reserva');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la reserva');
      }
    }
  };

  const handleEdit = (reserva) => {
    setFormData({
      id_pasajero: reserva.id_pasajero || '',
      id_vuelo: reserva.id_vuelo || '',
      fecha_reserva: reserva.fecha_reserva ? new Date(reserva.fecha_reserva).toISOString().split('T')[0] : '',
      clase: reserva.clase || '',
      estado_reserva: reserva.estado_reserva || ''
    });
    setCurrentId(reserva._id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      id_pasajero: '',
      id_vuelo: '',
      fecha_reserva: '',
      clase: '',
      estado_reserva: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  

  const filteredReservas = reservas.filter(reserva => {
    
    const pasajero = pasajeros.find(p => p._id === reserva.id_pasajero);
    const vuelo = vuelos.find(v => v._id === reserva.id_vuelo);
    
    const searchTermLower = searchTerm.toLowerCase();
  
    return (
      safeSearch(pasajero?.codigo_pasajero).includes(searchTermLower) ||
      safeSearch(vuelo?.numero_vuelo).includes(searchTermLower) ||
      safeSearch(reserva.clase).includes(searchTermLower) ||
      safeSearch(reserva.estado_reserva).includes(searchTermLower) ||
      safeSearch(vuelo?.origen?.Codigo_IATA).includes(searchTermLower) ||
      safeSearch(vuelo?.destino?.Codigo_IATA).includes(searchTermLower)
    );
  });

   const getNumeroVuelo = (idVuelo) => {
    const vuelo = vuelos.find(v => v._id === idVuelo);
    if (!vuelo) return 'No disponible';
  
    return `${vuelo.numero_vuelo} - ${vuelo.origen?.Codigo_IATA} a ${vuelo.destino?.Codigo_IATA}`;
  };

  const getCodigoPasajero = (idPasajero) => {
    const pasajero = pasajeros.find(p => p._id === idPasajero);
    return pasajero ? pasajero.codigo_pasajero : 'No disponible';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Reservas</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar reserva..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block mb-1">Pasajero</label>
            <select
              value={formData.id_pasajero}
              onChange={(e) => setFormData({...formData, id_pasajero: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione pasajero</option>
              {pasajeros.map((pasajero) => (
                <option key={pasajero._id} value={pasajero._id}>
                  {pasajero.codigo_pasajero} - {pasajero.nombre} {pasajero.apellido}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Vuelo</label>
            <select
                value={formData.id_vuelo}
                onChange={(e) => setFormData({...formData, id_vuelo: e.target.value})}
                className="w-full p-2 border rounded"
                required
>
                <option value="">Seleccione vuelo</option>
                {vuelos.map((vuelo) => (
                    <option key={vuelo._id} value={vuelo._id}>
                    {vuelo.numero_vuelo} - {vuelo.origen?.Codigo_IATA} a {vuelo.destino?.Codigo_IATA}
                    ({new Date(vuelo.fecha_y_hora_de_salida).toLocaleString()})
                    </option>
                ))}
                </select>
          </div>
          <div>
            <label className="block mb-1">Fecha de Reserva</label>
            <input
              type="date"
              value={formData.fecha_reserva}
              onChange={(e) => setFormData({...formData, fecha_reserva: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Clase</label>
            <select
              value={formData.clase}
              onChange={(e) => setFormData({...formData, clase: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione clase</option>
              {opcionesClase.map((clase) => (
                <option key={clase} value={clase}>
                  {clase}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Estado de Reserva</label>
            <select
              value={formData.estado_reserva}
              onChange={(e) => setFormData({...formData, estado_reserva: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione estado</option>
              {opcionesEstado.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
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
      <th className="p-3 text-left">ID MongoDB</th> {/* Nueva columna */}
      <th className="p-3 text-left">ID Pasajero</th>
      <th className="p-3 text-left">ID Vuelo</th>
      <th className="p-3 text-left">Fecha Reserva</th>
      <th className="p-3 text-left">Clase</th>
      <th className="p-3 text-left">Estado</th>
      <th className="p-3 text-left">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {filteredReservas.map((reserva) => (
      <tr key={reserva._id} className="border-t">
        <td className="p-3">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {reserva._id}
          </span>
          <button
              onClick={() => {
                navigator.clipboard.writeText(reserva._id);
                alert('ID copiado al portapapeles');
              }}
              className="ml-2 text-blue-500 hover:text-blue-700">
                📋</button>
        </td>
        <td className="p-3">{getCodigoPasajero(reserva.id_pasajero)}</td>
        <td className="p-3">{getNumeroVuelo(reserva.id_vuelo)}</td>
        <td className="p-3">{new Date(reserva.fecha_reserva).toLocaleDateString()}</td>
        <td className="p-3">{reserva.clase}</td>
        <td className="p-3">{reserva.estado_reserva}</td>
        <td className="p-3">
          <button
            onClick={() => handleEdit(reserva)}
            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(reserva._id)}
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

export default Reservas;