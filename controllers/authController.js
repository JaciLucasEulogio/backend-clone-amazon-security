const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Enviar correo electrónico
const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    if (!user.isVerified)
      return res.status(400).json({ msg: 'Por favor verifica tu correo electrónico' });

    if (user.is2FAEnabled) {
      const code = crypto.randomBytes(3).toString('hex');
      user.twoFactorCode = code;
      await user.save();
      sendEmail(user.email, 'Código de verificación 2FA', `Tu código de verificación es: ${code}`);
      return res.status(200).json({ msg: 'Verificación de doble factor enviada' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Correo ya registrado' });

    const user = new User({ name, email, password });
    const verificationCode = crypto.randomBytes(3).toString('hex');
    user.verificationCode = verificationCode;
    await user.save();

    sendEmail(user.email, 'Código de verificación', `Tu código de verificación es: ${verificationCode}`);
    res.status(201).json({ msg: 'Usuario registrado. Verifica tu correo electrónico.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Verificación de correo electrónico
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    if (user.verificationCode !== code)
      return res.status(400).json({ msg: 'Código incorrecto' });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res.status(200).json({ msg: 'Correo verificado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Verificación de doble factor
exports.verify2FA = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    if (user.twoFactorCode !== code)
      return res.status(400).json({ msg: 'Código incorrecto' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


// Actualización de usuario
exports.updateUser = async (req, res) => {
  const { name, email, phoneNumber, ruc } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.ruc = ruc || user.ruc;
    await user.save();

    res.status(200).json({ msg: 'Datos actualizados' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


// Activar 2FA
exports.enable2FA = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    user.is2FAEnabled = true;
    await user.save();
    res.status(200).json({ msg: 'Verificación de doble factor habilitada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

// Desactivar 2FA
exports.disable2FA = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    user.is2FAEnabled = false;
    await user.save();
    res.status(200).json({ msg: 'Verificación de doble factor deshabilitada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};








// Obtener datos del perfil del usuario
exports.getProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const { name, email: userEmail, phoneNumber, ruc, isVerified, is2FAEnabled } = user;
    res.status(200).json({ name, email: userEmail, phoneNumber, ruc, isVerified, is2FAEnabled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};