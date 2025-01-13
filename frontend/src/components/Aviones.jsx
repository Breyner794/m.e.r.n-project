import React, {useState, useEffect}from "react";
import { useAuth } from "../context/AuthContext";

const Aviones = () =>{

    const { token } = useAuth();
    const [aviones, setAviones] = useState([]);
    const [formData, setFormData] = useState({
        codigo_avion:'',
        modelo:'',
        capacidad: '',
        year_fabricacion: '',
        estado_avion: '',
    });

    const estadoavion = [
      'activo',
       'inactivo',
        'mantenimiento',
         'en_reparacion'
    ];

    const [isEditing, setIsEditing] = useState(false);
    const [currentavion, setCurrentavion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        fetchAviones();
    },[]);

    const fetchAviones = async () =>{

        try{

            const response =await fetch('http://localhost:5000/api/aviones',{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Datos recibidos:', data);
            setAviones(data.data || []);
        }catch (error) {
            console.error('Error fetching Aviones:', error);
            setAviones([]);
          }
    };

    const handleSubmit = async (e) =>{
    e.preventDefault();
        try{

            const url = isEditing
            ? `http://localhost:5000/api/aviones/${currentavion}`
            : 'http://localhost:5000/api/aviones';

            const response = await fetch(url,{
                method: isEditing ? 'PUT' : 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if(response.ok){
                await fetchAviones();
                resetForm();
            }else{
                const error =await response.json();
                console.log('Error en la operacion:', error);
                alert(error.message || 'Error al procesar la operacion');
            }
        }catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la operación');
        }
    };

    const handleDelete = async (codigo) => {
    if (window.confirm('¿Estás seguro de eliminar este avion?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/aviones/${codigo}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchAviones();
        } else {
          const error = await response.json();
          alert(error.message || 'Error al eliminar el avion');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el avion');
      }
    }
  };

  const handleEdit = (aviones) => {
    setFormData({
        codigo_avion: aviones.codigo_avion,
        modelo: aviones.modelo,
        capacidad: aviones.capacidad,
        year_fabricacion: aviones.year_fabricacion,
        estado_avion: aviones.estado_avion
    });
    setCurrentavion(aviones.codigo_avion);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      codigo_avion: '',
      modelo: '',
      capacidad: '',
      year_fabricacion: '',
      estado_avion: '',
    });
    setIsEditing(false);
    setCurrentavion(null);
  };

  const filteredAviones = aviones.filter(aviones => 

    aviones.codigo_avion?.toLowerCase().includes(searchTerm.toLocaleLowerCase())||
    aviones.modelo?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    //aviones.capacidad?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||  //Si se desconenta se daña al buscar
    aviones.year_fabricacion?.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    aviones.estado_avion?.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Aviones</h2>
      
      {/* Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar avion..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Codigo de Avion</label>
            <input
              type="text"
              value={formData.codigo_avion}
              onChange={(e) => setFormData({...formData, codigo_avion: e.target.value})}
              className="w-full p-2 border rounded"
              required
              disabled={isEditing}
            />
          </div>
          <div>
            <label className="block mb-1">Modelo</label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Capacidad</label>
            <input
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Año de Fabricacion</label>
            <input
              type="date"
              value={formData.year_fabricacion}
              onChange={(e) => setFormData({...formData, year_fabricacion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
          <label className="block mb-1">Estado del Avion</label>
          <select
              value={formData.estado_avion}
              onChange={(e) => setFormData({...formData, estado_avion: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un tipo de estado</option>
              {estadoavion.map((estado_avion) => (
                <option key={estado_avion} value={estado_avion}>
                  {estado_avion}
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Codigo de Avion</th>
              <th className="p-3 text-left">Modelo</th>
              <th className="p-3 text-left">Capacidad Soportada</th>
              <th className="p-3 text-left">Año de Fabricacion</th>
              <th className="p-3 text-left">Estado de Avion</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAviones.map((aviones) => (
              <tr key={aviones.codigo_avion} className="border-t">
                <td className="p-3">{aviones.codigo_avion}</td>
                <td className="p-3">{aviones.modelo}</td>
                <td className="p-3">{aviones.capacidad}</td>
                <td className="p-3">{aviones.year_fabricacion}</td>
                <td className="p-3">{aviones.estado_avion}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(aviones)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(aviones.codigo_avion)}
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

export default Aviones;