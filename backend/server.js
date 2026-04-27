const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http'); // 1. Import HTTP module
const { Server } = require('socket.io'); // 2. Import Socket.io
const jwt = require('jsonwebtoken'); // 3. Import JWT for Socket Auth
const path = require('path');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Force dotenv to look in the exact folder where server.js lives
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// ==========================================
// SOCKET.IO SETUP & AUTHENTICATION
// ==========================================

// 4. Create HTTP server using Express app
const httpServer = createServer(app);

// 5. Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }
});

// 6. Socket.io JWT Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error: Token missing'));

  try {
    // ADD THE EXACT SAME FALLBACK STRING HERE:
const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// 7. Handle Connections
io.on('connection', (socket) => {
  // Log authenticated user data (assuming your JWT payload contains an 'email')
  console.log(`🟢 User Connected: ${socket.id} | Email: ${socket.user.email || socket.user.id}`);

  socket.on('disconnect', () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// 8. Inject Socket.io into all Express routes
// This allows you to use req.io.emit() inside your external route controllers!
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ==========================================
// REST API ROUTES
// ==========================================

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Mock Post Route to trigger the Socket Event (Required by Assignment)
// You can move this to a separate postRoutes.js file later and use req.io.emit
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = req.body; 
    // Simulate saving to database...
    
    // Emit real-time event to all connected authenticated clients
    req.io.emit('newPost', newPost); 

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/test-token', (req, res) => {
  const mockUser = { id: 'test-123', email: 'creator@example.com' };
  
  // ADD THE FALLBACK STRING HERE:
 const token = jwt.sign(mockUser, process.env.JWT_SECRET);
  
  res.json({ token });
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server and WebSockets are running!',
    timestamp: new Date()
  });
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

// 9. Replace app.listen with httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});