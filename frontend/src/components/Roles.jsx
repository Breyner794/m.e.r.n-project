import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Roles = () => {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    permissions: {
      create: false,
      read: false,
      update: false,
      delete: false
    },
    allowedRoutes: []
  });

  // Opciones predefinidas
  const roleTypes = ['admin', 'super_admin', 'user'];
  const routeOptions = [
    '/admin/aeropuertos',
    '/admin/vuelos',
    '/admin/pasajeros',
    '/admin/reservas',
    '/admin/equipajes'
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setRoles(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${process.env.REACT_APP_API_URL}/api/roles/${currentId}`
        : `${process.env.REACT_APP_API_URL}/api/roles`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      fetchRoles();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la operación');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchRoles();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar el rol');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      permissions: {
        create: role.permissions.create,
        read: role.permissions.read,
        update: role.permissions.update,
        delete: role.permissions.delete
      },
      allowedRoutes: role.allowedRoutes || []
    });
    setCurrentId(role._id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      permissions: {
        create: false,
        read: false,
        update: false,
        delete: false
      },
      allowedRoutes: []
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleRouteChange = (route) => {
    setFormData(prev => ({
      ...prev,
      allowedRoutes: prev.allowedRoutes.includes(route)
        ? prev.allowedRoutes.filter(r => r !== route)
        : [...prev.allowedRoutes, route]
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Roles</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar rol..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1">Nombre del Rol</label>
            <select
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un rol</option>
              {roleTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Permisos</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(formData.permissions).map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions[permission]}
                    onChange={() => handlePermissionChange(permission)}
                    className="form-checkbox"
                  />
                  <span className="capitalize">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1">Rutas Permitidas</label>
            <div className="grid grid-cols-1 gap-2">
              {routeOptions.map((route) => (
                <label key={route} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.allowedRoutes.includes(route)}
                    onChange={() => handleRouteChange(route)}
                    className="form-checkbox"
                  />
                  <span>{route}</span>
                </label>
              ))}
            </div>
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
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Permisos</th>
              <th className="p-3 text-left">Rutas Permitidas</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role._id} className="border-t">
                <td className="p-3">{role.name}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(role.permissions).map(([key, value]) => 
                      value && (
                        <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {key}
                        </span>
                      )
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {role.allowedRoutes?.map((route) => (
                      <span key={route} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {route}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(role)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(role._id)}
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

export default Roles;