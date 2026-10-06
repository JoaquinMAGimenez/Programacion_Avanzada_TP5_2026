import { useState, useEffect } from 'react';

function App() {
  const [tareas, setTareas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombreProyecto: '',
    tipoActividad: '',
    estado: 'Abierta',
    resumen: '',
    descripcion: '',
    prioridad: 'Media',
    informador: '',
    personaAsignada: '',
    precondicion: '',
    fechaCreacion: '',
    fechaCierre: '',
    sprint: ''
  });

  const API_URL = 'http://localhost:3000/api/tareas';

  const cargarTareas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const tareasFormateadas = data.map(t => ({
        id: t.id,
        nombreProyecto: t.nombre_proyecto || '',
        tipoActividad: t.tipo_actividad || '',
        estado: t.estado || 'Abierta',
        resumen: t.resumen || '',
        descripcion: t.descripcion || '',
        prioridad: t.prioridad || 'Media',
        informador: t.informador || '',
        personaAsignada: t.persona_asignada || '',
        precondicion: t.precondicion || '',
        fechaCreacion: t.fecha_creacion ? t.fecha_creacion.split('T')[0] : '',
        fechaCierre: t.fecha_cierre ? t.fecha_cierre.split('T')[0] : '',
        sprint: t.sprint || ''
      }));
      setTareas(tareasFormateadas);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setEditandoId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      resetFormulario();
      cargarTareas();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const iniciarEdicion = (tarea) => {
    setFormData(tarea);
    setEditandoId(tarea.id);
  };

  const eliminarTarea = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta tarea?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (editandoId === id) setEditandoId(null);
        cargarTareas();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  const finalizarTarea = async (tarea) => {
    const tFinalizada = { ...tarea, estado: 'Finalizada' };
    try {
      await fetch(`${API_URL}/${tarea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tFinalizada)
      });
      cargarTareas();
    } catch (err) {
      console.error("Error al finalizar:", err);
    }
  };

  const resetFormulario = () => {
    setFormData({
      nombreProyecto: '',
      tipoActividad: '',
      estado: 'Abierta',
      resumen: '',
      descripcion: '',
      prioridad: 'Media',
      informador: '',
      personaAsignada: '',
      precondicion: '',
      fechaCreacion: '',
      fechaCierre: '',
      sprint: ''
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Manejador de Tareas (FCyT - Docker)</h1>
      
      <div style={{ background: '#f4f4f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>{editandoId ? '📝 Editar Tarea' : '➕ Crear Nueva Tarea'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          
          <div>
            <label><b>Nombre del Proyecto:</b></label><br />
            <input type="text" name="nombreProyecto" value={formData.nombreProyecto} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div>
            <label><b>Tipo de Actividad:</b></label><br />
            <input type="text" name="tipoActividad" value={formData.tipoActividad} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div>
            <label><b>Estado:</b></label><br />
            <select name="estado" value={formData.estado} onChange={handleChange} style={{ width: '100%' }}>
              <option value="Abierta">Abierta</option>
              <option value="En Desarrollo">En Desarrollo</option>
              <option value="En QA">En QA</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>

          <div>
            <label><b>Prioridad:</b></label><br />
            <select name="prioridad" value={formData.prioridad} onChange={handleChange} style={{ width: '100%' }}>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label><b>Resumen:</b></label><br />
            <input type="text" name="resumen" value={formData.resumen} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label><b>Descripción:</b></label><br />
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" style={{ width: '100%' }}></textarea>
          </div>

          <div>
            <label><b>Informador:</b></label><br />
            <input type="text" name="informador" value={formData.informador} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div>
            <label><b>Persona Asignada:</b></label><br />
            <input type="text" name="personaAsignada" value={formData.personaAsignada} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label><b>Precondición:</b></label><br />
            <input type="text" name="precondicion" value={formData.precondicion} onChange={handleChange} style={{ width: '100%' }} />
          </div>

          <div>
            <label><b>Fecha de Creación:</b></label><br />
            <input type="date" name="fechaCreacion" value={formData.fechaCreacion} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div>
            <label><b>Fecha de Cierre:</b></label><br />
            <input type="date" name="fechaCierre" value={formData.fechaCierre} onChange={handleChange} style={{ width: '100%' }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label><b>Sprint:</b></label><br />
            <input type="text" name="sprint" value={formData.sprint} onChange={handleChange} style={{ width: '100%' }} />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <button type="submit">
              {editandoId ? 'Guardar Cambios' : 'Registrar Tarea'}
            </button>
            {editandoId && (
              <button type="button" onClick={() => { setEditandoId(null); resetFormulario(); }} style={{ marginLeft: '10px' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2>📋 Listado de Tareas Guardadas</h2>
        {tareas.length === 0 ? (
          <p style={{ color: '#777', fontStyle: 'italic' }}>No hay tareas registradas en la base de datos de Postgres.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tareas.map((tarea) => (
              <div key={tarea.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
                <div>
                  <h3>[{tarea.nombreProyecto}] - {tarea.resumen}</h3>
                  <span>{tarea.estado}</span>
                </div>
                
                <p><b>Descripción:</b> {tarea.descripcion || 'Sin descripción'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', fontSize: '14px', color: '#555' }}>
                  <div><b>Tipo:</b> {tarea.tipoActividad}</div>
                  <div><b>Prioridad:</b> {tarea.prioridad}</div>
                  <div><b>Sprint:</b> {tarea.sprint || '-'}</div>
                  <div><b>Informador:</b> {tarea.informador}</div>
                  <div><b>Asignado:</b> {tarea.personaAsignada}</div>
                  <div><b>Precondición:</b> {tarea.precondicion || '-'}</div>
                  <div><b>Creada:</b> {tarea.fechaCreacion}</div>
                  <div><b>Cierre:</b> {tarea.fechaCierre || '-'}</div>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => iniciarEdicion(tarea)}>Editar</button>
                  <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
                  {tarea.estado !== 'Finalizada' && (
                    <button onClick={() => finalizarTarea(tarea)}>Finalizar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
