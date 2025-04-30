# Backend Development Learning Path

A comprehensive guide to learning and implementing backend development using Node.js, Express.js, EJS templating, and related technologies.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Node.js Basics](#nodejs-basics)
- [Express.js Framework](#expressjs-framework)
- [Templating with EJS](#templating-with-ejs)
- [Database Integration](#database-integration)
- [Authentication & Authorization](#authentication--authorization)
- [API Development](#api-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Further Resources](#further-resources)

## Introduction

Backend development involves creating the server-side logic that powers web applications. It includes:

- Server setup and management
- Database operations
- API creation and handling
- Authentication and security
- Business logic implementation

This guide will take you from beginner to proficient in backend development using the Node.js ecosystem.

## Prerequisites

Before starting, ensure you have:

- Basic understanding of JavaScript
- Knowledge of HTML/CSS 
- Familiarity with command line operations
- Understanding of HTTP protocol basics

## Development Environment Setup

### Installing Node.js and npm

```bash
# Download and install Node.js from https://nodejs.org/
# Verify installation
node -v
npm -v
```

### Setting up a project

```bash
# Create a new directory
mkdir my-backend-project
cd my-backend-project

# Initialize a new Node.js project
npm init -y

# Create basic folder structure
mkdir views models controllers routes public config
touch app.js
```

### Essential packages to install

```bash
# Express - web framework
npm install express

# EJS - templating engine
npm install ejs

# Nodemon - for development auto-restart
npm install nodemon --save-dev

# Environment variables
npm install dotenv

# Request parsing
npm install body-parser

# Session management
npm install express-session
```

### Setting up package.json scripts

Add these to your `package.json`:

```json
"scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
}
```

## Node.js Basics

### Core modules

```javascript
// File system operations
const fs = require('fs');

// Path manipulation
const path = require('path');

// HTTP server
const http = require('http');

// URL parsing
const url = require('url');
```

### Creating a simple server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(3000, 'localhost', () => {
    console.log('Server running at http://localhost:3000/');
});
```

### Asynchronous programming

```javascript
// Using callbacks
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// Using promises
const fsPromises = require('fs').promises;
fsPromises.readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));

// Using async/await
async function readFileContent() {
    try {
        const data = await fsPromises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

## Express.js Framework

### Basic Express Application

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

### Middleware

```javascript
// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Custom middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Route-specific middleware
const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

app.get('/profile', authMiddleware, (req, res) => {
    res.send('Profile page');
});
```

### Routing

```javascript
// Basic routing
app.get('/', (req, res) => {
    res.send('Home page');
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.send('Form submitted');
});

// Router modules
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

// In ./routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Users list');
});

router.get('/:id', (req, res) => {
    res.send(`User ${req.params.id}`);
});

module.exports = router;
```

## Templating with EJS

### Setup

```javascript
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

### Basic Usage

Create a file `views/index.ejs`:

```ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= heading %></h1>
    <p><%= content %></p>
    
    <ul>
    <% items.forEach(item => { %>
        <li><%= item %></li>
    <% }); %>
    </ul>
</body>
</html>
```

Render the template:

```javascript
app.get('/', (req, res) => {
    res.render('index', {
        title: 'My App',
        heading: 'Welcome!',
        content: 'This is an EJS template',
        items: ['Item 1', 'Item 2', 'Item 3']
    });
});
```

### Partials & Layouts

Create `views/partials/header.ejs`:

```ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
```

Include in your templates:

```ejs
<%- include('partials/header', {title: 'Page Title'}) %>
<h1>Page Content</h1>
<%- include('partials/footer') %>
```

## Database Integration

### MongoDB with Mongoose

```bash
# Install mongoose
npm install mongoose
```

```javascript
// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create a model
const User = mongoose.model('User', userSchema);

// CRUD operations
async function createUser() {
    try {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        });
        await user.save();
        console.log('User created');
    } catch (err) {
        console.error(err);
    }
}

async function findUsers() {
    try {
        const users = await User.find({ name: 'John Doe' });
        console.log(users);
    } catch (err) {
        console.error(err);
    }
}
```

### SQL with Sequelize

```bash
# Install Sequelize and a driver
npm install sequelize
npm install mysql2 # or pg for PostgreSQL
```

```javascript
const { Sequelize, DataTypes } = require('sequelize');

// Connect to database
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define a model
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// Sync models with database
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Sync error:', err));

// CRUD operations
async function createUser() {
    try {
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com'
        });
        console.log('User created:', user.toJSON());
    } catch (err) {
        console.error(err);
    }
}
```

## Authentication & Authorization

### Using Passport.js

```bash
npm install passport passport-local bcrypt
```

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');

// Session setup
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Incorrect email' });
            
            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: 'Incorrect password' });
            
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Auth routes
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
});
```

## API Development

### RESTful API Structure

```javascript
// Create API routes
const apiRouter = express.Router();

// Get all items
apiRouter.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single item
apiRouter.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create item
apiRouter.post('/items', async (req, res) => {
    const item = new Item(req.body);
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update item
apiRouter.patch('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete item
apiRouter.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use('/api', apiRouter);
```

### API Authentication with JWT

```bash
npm install jsonwebtoken
```

```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// Login and generate token
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// JWT middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

// Protected route
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
```

## Testing

```bash
npm install jest supertest --save-dev
```

```javascript
// In package.json
"scripts": {
    "test": "jest"
}

// Example test for an endpoint (tests/user.test.js)
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
```

## Deployment

### Preparing for Production

```javascript
// Use environment variables
require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Security best practices
const helmet = require('helmet');
app.use(helmet());

// Enable CORS
const cors = require('cors');
app.use(cors());

// Set NODE_ENV
if (process.env.NODE_ENV === 'production') {
    // Production-specific settings
}
```

### Deploying to Heroku

```bash
# Install Heroku CLI and login
npm install -g heroku
heroku login

# Initialize git and create a Heroku app
git init
git add .
git commit -m "Initial commit"
heroku create my-app-name

# Set environment variables
heroku config:set MONGO_URI=mongodb://...

# Deploy
git push heroku master

# Check logs
heroku logs --tail
```

## Best Practices

- **Project Structure**: Follow MVC pattern
- **Security**: Validate inputs, sanitize data, use HTTPS
- **Performance**: Use caching, optimize database queries
- **Error Handling**: Implement comprehensive error handling
- **Documentation**: Document your API and codebase
- **Version Control**: Use Git for version control
- **CI/CD**: Implement continuous integration/deployment

## Troubleshooting

Common issues and solutions:

- **CORS errors**: Ensure CORS is properly configured
- **Memory leaks**: Check for unclosed connections
- **Performance issues**: Use monitoring tools like New Relic
- **Authentication problems**: Check token validation and session handling
- **Database connection issues**: Verify connection strings and credentials

## Further Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)

---

This guide covers the fundamentals of backend development with Node.js and related technologies. As you progress, continue exploring more advanced topics and keep your skills updated with the latest practices and tools in the backend development landscape.