const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── PostgreSQL ──────────────────────────────────────────────
const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'wearaware',
  user:     'postgres',     // ← your PostgreSQL username
  password: '123123', // ← your PostgreSQL password
});

pool.connect((err) => {
  if (err) console.error('❌ PostgreSQL connection failed:', err.message);
  else     console.log('✅ Connected to PostgreSQL');
});

// ── JWT Secret (move to .env in production) ─────────────────
const JWT_SECRET = 'wearaware_secret_change_me';

// ── Auth Middleware ─────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided.' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
}

// ══════════════════════════════════════════════════════════════
//  POST /api/auth/login
//  Body: { email, password }
//  Returns: { token, user: { id, full_name, email, role } }
// ══════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, u.is_active,
              r.name AS role
       FROM   users u
       JOIN   roles r ON u.role_id = r.id
       WHERE  u.email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' });

    if (!user.is_active)
      return res.status(403).json({ error: 'Account is deactivated.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id:        user.id,
        full_name: user.full_name,
        email:     user.email,
        role:      user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ══════════════════════════════════════════════════════════════
//  GET /api/auth/me  — verify token & return current user
// ══════════════════════════════════════════════════════════════
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ══════════════════════════════════════════════════════════════
//  GET /api/users  — admin only
// ══════════════════════════════════════════════════════════════
app.get('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, r.name AS role, u.is_active, u.created_at
       FROM   users u
       JOIN   roles r ON u.role_id = r.id
       ORDER  BY u.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ══════════════════════════════════════════════════════════════
//  POST /api/users  — admin only — create a new user
//  Body: { full_name, email, password, role }
// ══════════════════════════════════════════════════════════════
app.post('/api/users', requireAuth, requireRole('admin'), async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (!roleResult.rows[0])
      return res.status(400).json({ error: 'Invalid role.' });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (role_id, full_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, created_at`,
      [roleResult.rows[0].id, full_name, email, hash]
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email already exists.' });
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// ══════════════════════════════════════════════════════════════
//  PATCH /api/users/:id/deactivate  — admin only
// ══════════════════════════════════════════════════════════════
app.patch('/api/users/:id/deactivate', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active = FALSE WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate user.' });
  }
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
