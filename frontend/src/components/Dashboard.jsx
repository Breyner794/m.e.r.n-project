import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Aeropuertos from './Aeropuertos';
import Aviones from './Aviones';
import Empleados from './Empleados';
import Equipajes from './Equipajes';
import Pasajeros from './Pasajeros';
import Reservas from './Reservas';
import Users from './User';
import Vuelos from './Vuelos';
import Tripulacion from './TripulacionVuelo';


//llamar el .jsx para poder mostarlo en el dasboard

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentModule, setCurrentModule] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleModuleChange = (moduleId) => {
    setCurrentModule(moduleId);
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'aeropuertos':
        return <Aeropuertos />;
      case 'aviones':
        return <Aviones/>
      case 'empleados':
        return <Empleados/>
      case 'equipajes':
        return <Equipajes/>
      case 'pasajeros':
        return <Pasajeros/>
      case 'reservas':
        return <Reservas/>
      case 'usuarios':
        return <Users/>
      case 'tripulacion':
        return <Tripulacion/>
      case 'vuelos':
        return <Vuelos/>
      default:
        return (
          <div className="p-6 space-y-6">
            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Vuelos</p>
                    <p className="text-2xl font-semibold text-gray-900">145</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Pasajeros</p>
                    <p className="text-2xl font-semibold text-gray-900">2,890</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Reservas</p>
                    <p className="text-2xl font-semibold text-gray-900">2,100</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <span className="text-2xl">🧳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Equipajes</p>
                    <p className="text-2xl font-semibold text-gray-900">3,200</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secciones de Información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Actividad Reciente */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Nuevo vuelo programado</p>
                        <p className="text-sm text-gray-500">BOG → MED</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Hace 5 min
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Reserva completada</p>
                        <p className="text-sm text-gray-500">Vuelo AV2104</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Hace 15 min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de Vuelos */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Estado de Vuelos</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En Curso</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">8 vuelos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Programados</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">15 vuelos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completados Hoy</span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">12 vuelos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Destinos Populares</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Medellín</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bogotá</span>
                    <span className="font-semibold">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cali</span>
                    <span className="font-semibold">25%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Ocupación de Vuelos</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">85%</p>
                  <p className="text-gray-500">Promedio de ocupación</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Rendimiento</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Puntualidad</span>
                    <span className="text-green-600">↑ 94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Satisfacción</span>
                    <span className="text-blue-600">→ 88%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        onModuleChange={handleModuleChange} 
        activeModule={currentModule}
      />
      
      <div className="flex-1 ml-64">
        <nav className="bg-white shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-800">
                Sistema de Gestión Aérea
              </h1>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">
                  Bienvenido, {user?.email || 'Usuario'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;