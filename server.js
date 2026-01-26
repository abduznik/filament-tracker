import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8082;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists for volume mounting
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const db = new Database(path.join(DATA_DIR, 'filament.db'));

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS filaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT,
    color TEXT,
    material TEXT,
    weight REAL,
    initialWeight REAL,
    cost REAL,
    purchaseDate TEXT,
    photo BLOB
  );
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filamentId INTEGER,
    changeAmount REAL,
    date TEXT,
    note TEXT,
    FOREIGN KEY(filamentId) REFERENCES filaments(id)
  );
`);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/filaments', (req, res) => {
  const rows = db.prepare('SELECT * FROM filaments').all();
  res.json(rows);
});

app.post('/api/filaments', (req, res) => {
  const { brand, color, material, weight, initialWeight, cost, purchaseDate, photo } = req.body;
  const info = db.prepare(`
    INSERT INTO filaments (brand, color, material, weight, initialWeight, cost, purchaseDate, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(brand, color, material, weight, initialWeight, cost, purchaseDate, photo);
  res.json({ id: info.lastInsertRowid });
});

app.get('/api/logs/:filamentId', (req, res) => {
  const rows = db.prepare('SELECT * FROM logs WHERE filamentId = ? ORDER BY date DESC').all(req.params.filamentId);
  res.json(rows);
});

app.post('/api/logs', (req, res) => {
  const { filamentId, changeAmount, date, note } = req.body;
  db.prepare(`
    INSERT INTO logs (filamentId, changeAmount, date, note)
    VALUES (?, ?, ?, ?)
  `).run(filamentId, changeAmount, date, note);
  
  // Also update filament weight
  db.prepare('UPDATE filaments SET weight = weight + ? WHERE id = ?').run(changeAmount, filamentId);
  
  res.json({ success: true });
});

app.delete('/api/filaments/:id', (req, res) => {
  db.prepare('DELETE FROM logs WHERE filamentId = ?').run(req.params.id);
  db.prepare('DELETE FROM filaments WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Fallback to index.html for SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database stored at ${path.join(DATA_DIR, 'filament.db')}`);
});
