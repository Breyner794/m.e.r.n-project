import React from 'react';

const Sidebar = ({ onModuleChange, activeModule }) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'aeropuertos', name: 'Aeropuertos', icon: '✈️' },
    { id: 'aviones', name: 'Aviones', icon: '🛩️' },
    { id: 'empleados', name: 'Empleados', icon: '👥' },
    { id: 'equipajes', name: 'Equipajes', icon: '🧳' },
    { id: 'pasajeros', name: 'Pasajeros', icon: '🧑‍✈️' },
    { id: 'reservas', name: 'Reservas', icon: '📝' },
    { id: 'usuarios', name: 'Usuarios', icon: '👤' },
    { id: 'tripulacion', name: 'Tripulación', icon: '👨‍✈️' },
    { id: 'vuelos', name: 'Vuelos', icon: '🛫' }
  ];

  const handleModuleClick = (moduleId) => {
    onModuleChange(moduleId);
  };

  //w-64 bg-gray-800 min-h-screen text-white

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Sistema Aéreo</h2>
        <nav>
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id)}
              className={`w-full text-left p-3 rounded mb-2 flex items-center ${
                activeModule === module.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{module.icon}</span>
              {module.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;