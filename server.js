// server.js - Express backend with Supabase auth
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Supabase clients
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Auth middleware: verify Supabase access token
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Image upload endpoint
app.post('/api/upload', authenticateUser, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl: imageUrl,
    filename: req.file.filename 
  });
});

// Hidden admin access routes
app.get('/admin-secret', (req, res) => {
  res.redirect('/admin.html');
});

app.get('/beheer', (req, res) => {
  res.redirect('/admin.html');
});

// Animals
app.get('/api/animals', async (req, res) => {
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/animals', authenticateUser, async (req, res) => {
  const { type, name, desc, image_url } = req.body;
  const { data, error } = await supabaseAdmin
    .from('animals')
    .insert([{ type, name, desc, image_url }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/animals/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { type, name, desc, image_url } = req.body;
  const { data, error } = await supabaseAdmin
    .from('animals')
    .update({ type, name, desc, image_url })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/animals/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('animals').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

// Posts
app.get('/api/posts', async (req, res) => {
  const showAll = req.query.all === 'true';
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!showAll) {
    query = query.eq('visible', true);
  }
  
  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/posts', authenticateUser, async (req, res) => {
  const { title, date, story, image, visible = true } = req.body;
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert([{ title, date, story, image, visible }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/posts/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title, date, story, image, visible } = req.body;
  const { data, error } = await supabaseAdmin
    .from('posts')
    .update({ title, date, story, image, visible })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/posts/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML pages
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/dieren.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dieren.html'));
});

app.get('/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/activiteiten.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'activiteiten.html'));
});

app.get('/Bedankt.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Bedankt.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


