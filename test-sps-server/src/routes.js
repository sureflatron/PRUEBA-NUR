const { Router } = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const routes = Router();

// Repositorio en memoria
let users = [
    { id: 1, name: "admin", email: "admin@spsgroup.com.br", type: "admin", password: "1234" }
];

// Clave secreta para JWT
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Ruta de autenticación
routes.post('/login', (req, res) => {
  const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const accessToken = jwt.sign({ email: user.email, type: user.type }, SECRET_KEY);
        res.json({ accessToken, type: user.type });
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

// Obtener todos los usuarios (solo admin)
routes.get('/users', authenticateToken, (req, res) => {
    if (req.user.type !== 'admin') {
        const filteredUsers = users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
        return res.json(filteredUsers);
    }else{
        res.json(users);
    }
});

// Crear un nuevo usuario
routes.post('/users', authenticateToken, (req, res) => {
    if (req.user.type !== 'admin') return res.sendStatus(403);

    const { name, email, type, password } = req.body;

    if (users.some(u => u.email === email)) {
        return res.status(400).send('El correo electrónico ya está registrado');
    }

    const newUser = { id: users.length + 1, name, email, type, password };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Obtener un usuario por ID (solo admin)
routes.get('/users/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id); // Convertir ID a número
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔹 Si el usuario NO es admin y está consultando otro usuario, ocultar la contraseña
    if (req.user.type !== "admin" && req.user.email !== user.email) {
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
    }

    // 🔹 Si el usuario es admin o está viendo su propio perfil, enviar toda la info
    res.json(user);
});




// Modificar un usuario
// Modificar un usuario
routes.put('/users/:id', authenticateToken, (req, res) => {
    if (req.user.type !== 'admin') return res.sendStatus(403);

    const { id } = req.params;
    const { name, email, type, password } = req.body;

    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) return res.status(404).send('Usuario no encontrado');

    // Verificar si el correo ya está registrado por otro usuario
    if (email && users.some(u => u.email === email && u.id !== parseInt(id))) {
        return res.status(400).send('El correo electrónico ya está registrado');
    }

    // Mantener la contraseña anterior si `password` no se envía o está vacío
    const updatedUser = {
        ...users[userIndex],
        name,
        email,
        type,
        password: password ? password : users[userIndex].password // Si `password` está vacío, no se actualiza
    };

    users[userIndex] = updatedUser;
    res.json(updatedUser);
});


// Eliminar un usuario
routes.delete('/users/:id', authenticateToken, (req, res) => {
    if (req.user.type !== 'admin') return res.sendStatus(403);

    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) return res.status(404).send('Usuario no encontrado');

    users.splice(userIndex, 1);
    res.sendStatus(204);
});



module.exports = routes;