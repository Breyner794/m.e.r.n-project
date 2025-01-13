import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Equipajes = () => {
  const { token } = useAuth();
  const [equipajes, setEquipajes] = useState([]);
  const [formData, setFormData] = useState({
    id_reserva: '',
    peso: '',
    tipo: '',
    longitud: '',
    ancho: '',
    altura: ''
  });

  // Definir las opciones válidas para el tipo de equipaje
  const tiposEquipaje = [
    'Equipaje de mano',
    'Bolso de mano',
    'Equipaje Facturado',
    'Equipaje de prueba'
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para búsqueda segura
  const safeSearch = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().toLowerCase();
  };

  useEffect(() => {
    fetchEquipajes();
  }, []);

  const fetchEquipajes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/equipaje', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEquipajes(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/equipaje/${currentId}`
        : 'http://localhost:5000/api/equipaje';
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchEquipajes();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este equipaje?')) {
      try {
        await fetch(`http://localhost:5000/api/equipaje/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchEquipajes();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (equipaje) => {
    setFormData({
      id_reserva: equipaje.id_reserva,
      peso: equipaje.peso,
      tipo: equipaje.tipo,
      longitud: equipaje.longitud,
      ancho: equipaje.ancho,
      altura: equipaje.altura
    });
    setCurrentId(equipaje._id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      id_reserva: '',
      peso: '',
      tipo: '',
      longitud: '',
      ancho: '',
      altura: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredEquipajes = equipajes.filter(equipaje => 
    safeSearch(equipaje.id_reserva).includes(searchTerm.toLowerCase()) ||
    safeSearch(equipaje.peso).includes(searchTerm.toLowerCase()) ||
    safeSearch(equipaje.tipo).includes(searchTerm.toLowerCase()) ||
    safeSearch(equipaje.ancho).includes(searchTerm.toLowerCase()) ||
    safeSearch(equipaje.altura).includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Equipajes</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar equipaje..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">ID Reserva</label>
            <input
              type="text"
              value={formData.id_reserva}
              onChange={(e) => setFormData({...formData, id_reserva: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Peso (kg)</label>
            <input
              type="number"
              value={formData.peso}
              onChange={(e) => setFormData({...formData, peso: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Tipo de Equipaje</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un tipo</option>
              {tiposEquipaje.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Longitud (cm)</label>
            <input
              type="number"
              value={formData.longitud}
              onChange={(e) => setFormData({...formData, longitud: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Ancho (cm)</label>
            <input
              type="number"
              value={formData.ancho}
              onChange={(e) => setFormData({...formData, ancho: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Altura (cm)</label>
            <input
              type="number"
              value={formData.altura}
              onChange={(e) => setFormData({...formData, altura: e.target.value})}
              className="w-full p-2 border rounded"
              required
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID Reserva</th>
              <th className="p-3 text-left">Peso</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Dimensiones (cm)</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipajes.map((equipaje) => (
              <tr key={equipaje._id} className="border-t">
                <td className="p-3">{equipaje.id_reserva}</td>
                <td className="p-3">{equipaje.peso} kg</td>
                <td className="p-3">{equipaje.tipo}</td>
                <td className="p-3">
                  {equipaje.longitud} x {equipaje.ancho} x {equipaje.altura}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(equipaje)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(equipaje._id)}
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

export default Equipajes;