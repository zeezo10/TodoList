const express = require("express")
const app = express()
const router = express.Router()
const port = 80
const cors = require("cors")

const { Pool } = require('pg');
const { json } = require("sequelize");

const pool = new Pool({
    connectionString:"postgres://default:nDAZb9HB2Rpz@ep-twilight-wave-a198q2dz-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
  });

app.use(cors())
app.use(express.json())


app.get('/', async (req, res) => {

    try {
    const result = (await pool.query('SELECT * FROM todos')).rows;
    res.json(result)
      
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    }
  });

  app.get('/todos/status/:status', async (req, res) => {
    const status = req.params.status;

    try {
        const result = await pool.query(
            'SELECT * FROM todos WHERE status = $1',
            [status]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  app.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully', todo: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ------ del all history 


app.delete('/todos/history', async (req, res) => {
    const status = 'history';  // You can change this to the status you consider as "history"

    try {
        const result = await pool.query(
            'DELETE FROM todos WHERE status = $1 RETURNING *',
            [status]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No history tasks found' });
        }

        res.json({ message: 'History tasks deleted successfully', deleted: result.rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/', async (req, res) => {
    const { title, description, status, due_date, category_id } = req.body; 

    try {
        const result = await pool.query(
            'INSERT INTO todos (title, description, status, due_date, created_at, updated_at, category_id) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5) RETURNING *',
            [title, description, status || 'pending', due_date, category_id] 
        );

        res.status(201).json({ message: 'Todo created successfully', todo: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// --- status cahange ----
app.put('/todos/:id/status', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    if (!['in-progress', 'done', 'pending', 'history'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be "in progress" or "done".' });
    }

    try {
        const result = await pool.query(
            'UPDATE todos SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo status updated successfully', todo: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// edit the task

app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, status, due_date } = req.body;
    try {
       
        const result = await pool.query(
            'UPDATE todos SET title = $1, description = $2, status = $3, due_date = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [title, description, status, due_date, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo updated successfully', todo: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/categories', async (req, res) => {
    const { name } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );

        res.status(201).json({ message: 'Category created successfully', category: result.rows[0] });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/categories', async (req, res) => {
    try {
      const result = (await pool.query('SELECT * FROM categories')).rows;
      res.json(result);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/todos/category/:id', async (req, res) => {
    const categoryId = req.params.id; 
  
    try {
      const result = await pool.query(`
        SELECT 
          todos.id,
          todos.title,
          todos.description,
          todos.status,
          todos.due_date,
          todos.created_at,
          categories.name AS category_name
        FROM 
          todos
        JOIN 
          categories ON todos.category_id = categories.id
        WHERE 
          todos.category_id = $1
        ORDER BY 
          todos.id;
      `, [categoryId]); 
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  app.listen(port, ()=>{
    console.log(port, "runnning");
    
})