const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Dummy get balance route
app.get('/api/balance', (req, res) => {
  res.json({ balance: 11710 });
});

// Dummy get rounds/history
app.get('/api/history', async (req, res) => {
  const rows = await db.all("SELECT * FROM history ORDER BY period DESC LIMIT 10");
  res.json(rows);
});

// Dummy join prediction (colour/number)
app.post('/api/join', (req, res) => {
  // Payload: { color, number, amount }
  // Should save to db, update balance
  res.json({ success: true, msg: "Joined!" });
});

// TODO: Add more endpoints as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend started on port ${PORT}`));

