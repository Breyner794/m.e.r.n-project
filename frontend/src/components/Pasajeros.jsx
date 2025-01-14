import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Pasajeros = () => {
  const { token } = useAuth();
  const [pasajeros, setPasajeros] = useState([]);
  const [formData, setFormData] = useState({
    codigo_pasajero: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    nacionalidad: '',
    pasaporte: '',
    fecha_expiracion: '',
    direccion: '',
    telefono: '',
    email: '',
    genero: '',
    tipo: '',
    estado: ''
  });

  // Opciones para campos select
  const tiposPasajero = ['adulto', 'niño', 'bebé', 'VIP', 'frecuente'];
  const opcionesGenero = ['masculino', 'femenino', 'otro'];
  const opcionesEstado = ['activo', 'inactivo'];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para búsqueda segura
  const safeSearch = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().toLowerCase();
  };

  useEffect(() => {
    fetchPasajeros();
  }, []);

  const fetchPasajeros = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pasajeros`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setPasajeros(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/pasajeros/${currentId}`
        : `${process.env.REACT_APP_API_URL}/api/pasajeros`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPasajeros();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la operación');
    }
  };

  const handleDelete = async (codigo_pasajero) => {
    if (window.confirm('¿Estás seguro de eliminar este pasajero?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pasajeros/${codigo_pasajero}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchPasajeros();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar el pasajero');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el pasajero');
      }
    }
  };

  const handleEdit = (pasajero) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

  setFormData({
    codigo_pasajero: pasajero?.codigo_pasajero ?? '',
    nombre: pasajero?.nombre ?? '',
    apellido: pasajero?.apellido ?? '',
    fecha_nacimiento: formatDate(pasajero?.fecha_nacimiento),
    nacionalidad: pasajero?.nacionalidad ?? '',
    pasaporte: pasajero?.pasaporte ?? '',
    fecha_expiracion: formatDate(pasajero?.fecha_expiracion),
    direccion: pasajero?.direccion ?? '',
    telefono: pasajero?.telefono ?? '',
    email: pasajero?.email ?? '',
    genero: pasajero?.genero ?? '',
    tipo: pasajero?.tipo ?? '',
    estado: pasajero?.estado ?? ''
  });
  setCurrentId(pasajero?.codigo_pasajero);
  setIsEditing(true);
};

  const resetForm = () => {
    setFormData({
      codigo_pasajero: '',
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      nacionalidad: '',
      pasaporte: '',
      fecha_expiracion: '',
      direccion: '',
      telefono: '',
      email: '',
      genero: '',
      tipo: '',
      estado: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const filteredPasajeros = pasajeros.filter(pasajero => 
    safeSearch(pasajero.codigo_pasajero).includes(searchTerm.toLowerCase()) ||
    safeSearch(pasajero.nombre).includes(searchTerm.toLowerCase()) ||
    safeSearch(pasajero.apellido).includes(searchTerm.toLowerCase()) ||
    safeSearch(pasajero.pasaporte).includes(searchTerm.toLowerCase()) ||
    safeSearch(pasajero.email).includes(searchTerm.toLowerCase()) ||
    safeSearch(pasajero.tipo).includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Pasajeros</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar pasajero..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Código Pasajero</label>
            <input
              type="number"
              value={formData.codigo_pasajero}
              onChange={(e) => setFormData({...formData, codigo_pasajero: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Apellido</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Nacimiento</label>
            <input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Pasaporte</label>
            <input
              type="text"
              value={formData.pasaporte}
              onChange={(e) => setFormData({...formData, pasaporte: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fecha de Expiración</label>
            <input
              type="date"
              value={formData.fecha_expiracion}
              onChange={(e) => setFormData({...formData, fecha_expiracion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Género</label>
            <select
              value={formData.genero}
              onChange={(e) => setFormData({...formData, genero: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione género</option>
              {opcionesGenero.map((genero) => (
                <option key={genero} value={genero}>
                  {genero.charAt(0).toUpperCase() + genero.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione tipo</option>
              {tiposPasajero.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione estado</option>
              {opcionesEstado.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
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
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Apellido</th>
              <th className="p-3 text-left">Pasaporte</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasajeros.map((pasajero) => (
              <tr key={pasajero._id} className="border-t">
                <td className="p-3">{pasajero.codigo_pasajero}</td>
                <td className="p-3">{pasajero.nombre}</td>
                <td className="p-3">{pasajero.apellido}</td>
                <td className="p-3">{pasajero.pasaporte}</td>
                <td className="p-3">{pasajero.email}</td>
                <td className="p-3">{pasajero.tipo}</td>
                <td className="p-3">{pasajero.estado}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(pasajero)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pasajero.codigo_pasajero)}
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

export default Pasajeros;