import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Aeropuertos = () => {
  const { token } = useAuth();
  const [aeropuertos, setAeropuertos] = useState([]);
  const [formData, setFormData] = useState({
    Nombre: '',
    Ciudad: '',
    Pais: '',
    Codigo_IATA: ''
  });

  const paises = [
    'Argentina',
    'Brasil',
    'Canadá',
    'Dinamarca',
    'España',
    'Francia',
    'Alemania',
    'India',
    'Japón',
    'México',
    'Nigeria',
    'Rusia',
    'Sudáfrica',
    'Reino Unido',
    'Estados Unidos'
];

  const [isEditing, setIsEditing] = useState(false);
  const [currentIATA, setCurrentIATA] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAeropuertos();
  }, []);

  const fetchAeropuertos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/aeropuertos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setAeropuertos(data.data || []);
    } catch (error) {
      console.error('Error fetching Aeropuertos:', error);
      setAeropuertos([]);
    }
  };

  // Actualizar aeropuerto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/aeropuertos/${currentIATA}`
        : `${process.env.REACT_APP_API_URL}/api/aeropuertos`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchAeropuertos();
        resetForm();
      } else {
        const error = await response.json();
        console.error('Error en la operación:', error);
        alert(error.message || 'Error al procesar la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la operación');
    }
  };

  // Eliminar aeropuerto
  const handleDelete = async (codigoIATA) => {
    if (window.confirm('¿Estás seguro de eliminar este aeropuerto?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/aeropuertos/${codigoIATA}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchAeropuertos();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar el aeropuerto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el aeropuerto');
      }
    }
  };

  // Editar aeropuerto
  const handleEdit = (aeropuerto) => {
    setFormData({
      Nombre: aeropuerto.Nombre,
      Ciudad: aeropuerto.Ciudad,
      Pais: aeropuerto.Pais,
      Codigo_IATA: aeropuerto.Codigo_IATA
    });
    setCurrentIATA(aeropuerto.Codigo_IATA);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      Nombre: '',
      Ciudad: '',
      Pais: '',
      Codigo_IATA: ''
    });
    setIsEditing(false);
    setCurrentIATA(null);
  };

  const filteredAeropuertos = aeropuertos.filter(aeropuerto => 
    aeropuerto.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aeropuerto.Ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aeropuerto.Pais?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aeropuerto.Codigo_IATA?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Aeropuertos</h2>
      
      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar aeropuerto..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              value={formData.Nombre}
              onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Ciudad</label>
            <input
              type="text"
              value={formData.Ciudad}
              onChange={(e) => setFormData({...formData, Ciudad: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">País</label>
            <select
              value={formData.Pais}
              onChange={(e) => setFormData({...formData, Pais: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un Pais</option>
              {paises.map((Pais) => (
                <option key={Pais} value={Pais}>
                  {Pais}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Código IATA</label>
            <input
              type="text"
              value={formData.Codigo_IATA}
              onChange={(e) => setFormData({...formData, Codigo_IATA: e.target.value})}
              className="w-full p-2 border rounded"
              required
              disabled={isEditing} // Deshabilitar edición del código IATA en modo edición
            />
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Ciudad</th>
              <th className="p-3 text-left">País</th>
              <th className="p-3 text-left">Código IATA</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAeropuertos.map((aeropuerto) => (
              <tr key={aeropuerto.Codigo_IATA} className="border-t">
                <td className="p-3">{aeropuerto.Nombre}</td>
                <td className="p-3">{aeropuerto.Ciudad}</td>
                <td className="p-3">{aeropuerto.Pais}</td>
                <td className="p-3">{aeropuerto.Codigo_IATA}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(aeropuerto)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(aeropuerto.Codigo_IATA)}
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

export default Aeropuertos;