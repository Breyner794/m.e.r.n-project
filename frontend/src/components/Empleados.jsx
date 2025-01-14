import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Empleados = () => {
  const { token } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    codigo_empleado: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    cargo: '',
    fecha_contratacion: '',
    salario: '',
  });

  const cargosEmpleados = [
    'Capitan',
    'Primer Oficial',
    'Auxiliar',
    'Mecanico',
    'Controladores de Trafico Aereo',
    'Tester',
    'Azafata',
    'Despachador de Vuelo',
    'Asistentes de Vuelo',
    'Jefe de Cabina'
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/empleados`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setEmpleados(data.data || []);
    } catch (error) {
      console.error('Error fetching Empleados:', error);
      setEmpleados([]);
    }
  };

  // Actualizar aeropuerto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/empleados/${currentEmpleado}`
        : `${process.env.REACT_APP_API_URL}/api/empleados`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchEmpleados();
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
  const handleDelete = async (codigo_empleado) => {
    if (window.confirm('¿Estás seguro de eliminar este aeropuerto?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/empleados/${codigo_empleado}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchEmpleados();
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
  const handleEdit = (empleados) => {
    setFormData({
        codigo_empleado: empleados.codigo_empleado,
        nombre: empleados.nombre,
        apellido: empleados.apellido,
        fecha_nacimiento: empleados.fecha_nacimiento,
        cargo: empleados.cargo,
        fecha_contratacion: empleados.fecha_contratacion,
        salario: empleados.salario
    });
    setCurrentEmpleado(empleados.codigo_empleado);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
        codigo_empleado: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        cargo: '',
        fecha_contratacion: '',
        salario: ''
    });
    setIsEditing(false);
    setCurrentEmpleado(null);
  };

  const filteredEmpleado = empleados.filter(empleado => 
    
    empleado.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //empleado.fecha_nacimiento?.toLowerCase().includes(searchTerm.toLowerCase())||
    empleado.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) 
    //empleado.fecha_contratacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //empleado.salario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Empleados</h2>
      
      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar Empleados..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">ID Empleado</label>
            <input
              type="text"
              value={formData.codigo_empleado}
              onChange={(e) => setFormData({...formData, codigo_empleado: e.target.value})}
              className="w-full p-2 border rounded"
              required
              disabled={isEditing}
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
          <label className="block mb-1">Cargo</label>
            <select
              value ={formData.cargo}
              onChange={(e)=> setFormData({...formData, cargo:e.target.value})}
              className='w-full p-2 border rounded'
              required
            >
              <option value={""}>Seleccione el Cargo</option>
              {cargosEmpleados.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
          </div>
          <div>
          <label className="block mb-1">Fecha de Contratacion</label>
            <input
              type="date"
              value={formData.fecha_contratacion}
              onChange={(e) => setFormData({...formData, fecha_contratacion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
          <label className="block mb-1">Salario</label>
            <input
              type="text"
              value={formData.salario}
              onChange={(e) => setFormData({...formData, salario: e.target.value})}
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID de Empleado</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Apellido</th>
              <th className="p-3 text-left">Fecha de Nacimiento</th>
              <th className="p-3 text-left">Cargo</th>
              <th className="p-3 text-left">Fecha de Contratacion</th>
              <th className="p-3 text-left">Salario</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmpleado.map((empleados) => (
              <tr key={empleados.codigo_empleado} className="border-t">
                <td className="p-3">{empleados.codigo_empleado}</td>
                <td className="p-3">{empleados.nombre}</td>
                <td className="p-3">{empleados.apellido}</td>
                <td className="p-3">{empleados.fecha_nacimiento}</td>
                <td className="p-3">{empleados.cargo}</td>
                <td className="p-3">{empleados.fecha_contratacion}</td>
                <td className="p-3">{empleados.salario}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(empleados)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(empleados.codigo_empleado)}
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

export default Empleados;