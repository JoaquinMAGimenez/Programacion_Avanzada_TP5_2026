const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const pool = new Pool({
  host: 'db',
  port: 5432,
  user: 'joaquin_user',
  password: 'mi_password_secreto',
  database: 'tp5_tasks',
});

// 1. Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
  const t = req.body;
  try {
    const queryText = 'INSERT INTO tareas (nombre_proyecto, tipo_actividad, estado, resumen, descripcion, prioridad, informador, persona_asignada, precondicion, fecha_creacion, fecha_cierre, sprint) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
    const values = [t.nombreProyecto, t.tipoActividad, t.estado, t.resumen, t.descripcion, t.prioridad, t.informador, t.personaAsignada, t.precondicion, t.fechaCreacion, t.fechaCierre || null, t.sprint];
    const result = await pool.query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Editar una tarea existente
app.put('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const t = req.body;
  try {
    const queryText = 'UPDATE tareas SET nombre_proyecto=$1, tipo_actividad=$2, estado=$3, resumen=$4, descripcion=$5, prioridad=$6, informador=$7, persona_asignada=$8, precondicion=$9, fecha_creacion=$10, fecha_cierre=$11, sprint=$12 WHERE id=$13 RETURNING *';
    const values = [t.nombreProyecto, t.tipoActividad, t.estado, t.resumen, t.descripcion, t.prioridad, t.informador, t.personaAsignada, t.precondicion, t.fechaCreacion, t.fechaCierre || null, t.sprint, id];
    const result = await pool.query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Eliminar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const queryText = 'DELETE FROM tareas WHERE id = $1';
    await pool.query(queryText, [id]);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Backend corriendo en puerto 3000'));
