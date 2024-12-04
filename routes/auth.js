const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.post('/login', authController.login);

// Registro
router.post('/register', authController.register);

// Activación del correo electrónico
router.post('/verify-email', authController.verifyEmail);

// Verificación de doble factor
router.post('/verify-2fa', authController.verify2FA);

// Modificar usuario
router.put('/update', authController.updateUser);

// Ruta para habilitar la 2FA
router.post('/enable-2fa', authController.enable2FA);

// Ruta para deshabilitar la 2FA
router.post('/disable-2fa', authController.disable2FA);

// Obtener perfil del usuario
router.post('/profile', authController.getProfile);




module.exports = router;
