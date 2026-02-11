const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(cors());

const db = new sqlite3.Database('./people_data.db'); // Replace with your real .db file

app.get('/api/people', (req, res) => {
  db.all('SELECT * FROM people', [], (err, rows) => {
    if (err) {
      console.error('❌ DB Error:', err.message);  // ✅ Add this
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
