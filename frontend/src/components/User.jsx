import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roleName: ''
  });

  const roleTypes = ['admin', 'super_admin', 'user'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
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

      alert('Usuario registrado exitosamente');
      setFormData({
        username: '',
        email: '',
        password: '',
        roleName: ''
      });
      fetchUsers(); 
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Registro de Usuarios</h2>

      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={formData.roleName}
              onChange={(e) => setFormData({...formData, roleName: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Seleccione un rol</option>
              {roleTypes.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Registrar Usuario
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Usuarios Registrados</h3>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      user.role === 'super_admin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">Nota Importante</h3>
        <p className="mt-2 text-blue-600">
          Los usuarios registrados pueden iniciar sesión usando su email y contraseña.
          Cada rol tiene diferentes niveles de acceso y permisos en el sistema.
        </p>
      </div>
    </div>
  );
};

export default Users;