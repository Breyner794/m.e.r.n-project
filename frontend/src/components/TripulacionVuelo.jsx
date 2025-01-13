import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Tripulacion = () => {
  const { token } = useAuth();
  const [tripulaciones, setTripulaciones] = useState([]);
  const [vuelos, setVuelos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    id_vuelo: '',
    id_empleado: '',
    rol: ''
  });

  const roles = [
    'Piloto',
    'Copiloto',
    'Ingeniero de Vuelo',
    'Jefe de Cabina',
    'Azafatas',
    'Personal de Seguridad'
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTripulaciones();
    fetchVuelos();
    fetchEmpleados();
  }, []);

  const fetchTripulaciones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tripulacion', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTripulaciones(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchVuelos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vuelos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVuelos(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/empleados', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmpleados(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/tripulacion/${currentId}`
        : 'http://localhost:5000/api/tripulacion';

      // Encontrar el vuelo y empleado seleccionados para obtener sus códigos
      const vueloSeleccionado = vuelos.find(v => v._id === formData.id_vuelo);
      const empleadoSeleccionado = empleados.find(e => e._id === formData.id_empleado);

      // Preparar los datos como los espera el backend
      const dataToSend = {
        id_vuelo: vueloSeleccionado?.numero_vuelo,    // Enviamos número de vuelo
        id_empleado: empleadoSeleccionado?.codigo_empleado,  // Enviamos código de empleado
        rol: formData.rol
      };

      console.log('Datos a enviar:', dataToSend);  // Para debug

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      fetchTripulaciones();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la operación');
    }
};

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este miembro de la tripulación?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/tripulacion/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchTripulaciones();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (tripulacion) => {
    setFormData({
      id_vuelo: tripulacion.id_vuelo._id,
      id_empleado: tripulacion.id_empleado._id,
      rol: tripulacion.rol
    });
    setCurrentId(tripulacion._id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      id_vuelo: '',
      id_empleado: '',
      rol: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredTripulaciones = tripulaciones.filter(tripulacion => {
    const searchTermLower = searchTerm.toLowerCase();
    const vuelo = vuelos.find(v => v._id === tripulacion.id_vuelo?._id);
    const empleado = empleados.find(e => e._id === tripulacion.id_empleado?._id);

    return (
      vuelo?.numero_vuelo?.toLowerCase().includes(searchTermLower) ||
      empleado?.nombre?.toLowerCase().includes(searchTermLower) ||
      empleado?.apellido?.toLowerCase().includes(searchTermLower) ||
      tripulacion.rol?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Tripulación</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar tripulación..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Vuelo</label>
            <select
              value={formData.id_vuelo}
              onChange={(e) => setFormData({...formData, id_vuelo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un vuelo</option>
              {vuelos.map((vuelo) => (
                <option key={vuelo._id} value={vuelo._id}>
                  {vuelo.numero_vuelo} - {vuelo.origen?.Codigo_IATA} a {vuelo.destino?.Codigo_IATA}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Empleado</label>
            <select
              value={formData.id_empleado}
              onChange={(e) => setFormData({...formData, id_empleado: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado._id} value={empleado._id}>
                  {empleado.nombre} {empleado.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Rol</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Actualizar' : 'Asignar'}
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
              <th className="p-3 text-left">Vuelo</th>
              <th className="p-3 text-left">Empleado</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTripulaciones.map((tripulacion) => {
              const vuelo = vuelos.find(v => v._id === tripulacion.id_vuelo?._id);
              const empleado = empleados.find(e => e._id === tripulacion.id_empleado?._id);
              
              return (
                <tr key={tripulacion._id} className="border-t">
                  <td className="p-3">
                    {vuelo ? (
                      <>
                        <div className="font-medium">{vuelo.numero_vuelo}</div>
                        <div className="text-sm text-gray-500">
                          {vuelo.origen?.Codigo_IATA} → {vuelo.destino?.Codigo_IATA}
                        </div>
                      </>
                    ) : 'No disponible'}
                  </td>
                  <td className="p-3">
                    {empleado ? `${empleado.nombre} ${empleado.apellido}` : 'No disponible'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      tripulacion.rol === 'Piloto' || tripulacion.rol === 'Copiloto' 
                        ? 'bg-blue-100 text-blue-800'
                        : tripulacion.rol === 'Ingeniero de Vuelo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tripulacion.rol}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(tripulacion)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tripulacion._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tripulacion;