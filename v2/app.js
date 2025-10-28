// app.js - Express backend with Supabase auth
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
// Serve static files from the current directory (document root/httpdocs)
app.use(express.static(__dirname));

// Create uploads directory if it doesn't exist (in httpdocs)
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

// Auth middleware: verify Supabase access token using Supabase client
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    // Use Supabase client to verify the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.log('Token verification failed:', error?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Image upload endpoint - Upload to Supabase Storage
app.post('/api/upload', authenticateUser, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  try {
    // Upload to Supabase Storage
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = req.file.filename;
    
    const { data: uploadData, error } = await supabaseAdmin
      .storage
      .from('images')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false
      });
    
    // Delete local temp file after upload
    fs.unlinkSync(req.file.path);
    
    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image to storage' });
    }
    
    // Get public URL from Supabase (not async)
    const { data: urlData } = supabaseAdmin
      .storage
      .from('images')
      .getPublicUrl(fileName);
    
    res.json({ 
      success: true, 
      imageUrl: urlData.publicUrl,
      filename: fileName 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


