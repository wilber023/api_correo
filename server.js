 const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email de destino
const DESTINATION_EMAIL = 'dev404.codmaster@gmail.com';

// Configurar transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error(' Error en la configuración de email:', error);
  } else {
    console.log(' Servidor de email listo para enviar mensajes');
  }
});

// Funciones auxiliares para obtener labels
const getCategoryLabel = (value) => {
  const categories = {
    'help': 'Solicitar ayuda para jóvenes en riesgo',
    'volunteer': 'Voluntariado y colaboración',
    'partnership': 'Alianza con mi organización',
    'research': 'Colaboración en investigación',
    'implementation': 'Implementar en mi comunidad',
    'funding': 'Patrocinio y financiamiento',
    'training': 'Capacitación y recursos',
    'support': 'Soporte técnico'
  };
  return categories[value] || value;
};

const getUrgencyLabel = (value) => {
  const urgencyLevels = {
    'low': 'Consulta general - Sin prisa',
    'medium': 'Importante - Respuesta en 48h',
    'high': 'Urgente - Respuesta en 24h',
    'critical': 'Crítico - Respuesta inmediata'
  };
  return urgencyLevels[value] || value;
};

// Endpoint principal para enviar correos
app.post('/api/contact', async (req, res) => {
  try {
    // Obtener datos del formulario
    const { name, email, company, phone, category, urgency, message } = req.body;
    
    // Validar campos requeridos
    const requiredFields = ['name', 'email', 'company', 'category', 'urgency', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

    // Obtener labels legibles
    const categoryLabel = getCategoryLabel(category);
    const urgencyLabel = getUrgencyLabel(urgency);
    const phoneText = phone || 'No proporcionado';
    
    // Fecha y hora actual en español
    const submissionDate = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Asunto del email
    const subject = `[AURA] Consulta - ${urgencyLabel}`;

   // Reemplaza la sección del htmlBody en tu código (líneas ~100-280) con este nuevo diseño:

 // REEMPLAZA TODA la sección del htmlBody (aproximadamente líneas 100-280) con esto:

const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2c3e50;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px 0;
    }
    .email-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 50px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 15s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(180deg); }
    }
    .logo-container {
      position: relative;
      z-index: 1;
      margin-bottom: 25px;
    }
    .logo {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 20px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      margin: 0 auto;
    }
    .logo-text {
      font-size: 11px;
      font-weight: 700;
      color: #667eea;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 5px;
      line-height: 1.2;
    }
    .logo-brand {
      font-size: 28px;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 2px;
    }
    .header-title {
      position: relative;
      z-index: 1;
      color: #ffffff;
      font-size: 32px;
      font-weight: 800;
      margin: 20px 0 10px 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      position: relative;
      z-index: 1;
      color: rgba(255, 255, 255, 0.95);
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .alert-badge {
      position: relative;
      z-index: 1;
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 12px 28px;
      border-radius: 30px;
      margin-top: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .alert-badge span {
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .content {
      padding: 45px 40px;
    }
    .section {
      margin-bottom: 40px;
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      border-left: 5px solid #667eea;
      position: relative;
    }
    .section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px 12px 0 0;
    }
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
    }
    .section-icon {
      font-size: 28px;
      margin-right: 15px;
    }
    .section-title {
      color: #2c3e50;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
    .info-grid {
      display: table;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 15px;
    }
    .info-row {
      display: table-row;
    }
    .info-label {
      display: table-cell;
      font-weight: 600;
      color: #555;
      padding-right: 25px;
      width: 160px;
      vertical-align: top;
      padding-top: 5px;
    }
    .info-value {
      display: table-cell;
      color: #2c3e50;
      font-weight: 500;
      vertical-align: top;
      padding-top: 5px;
    }
    .info-value a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .info-value a:hover {
      color: #764ba2;
      text-decoration: underline;
    }
    .urgency-badge {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .urgency-badge::before {
      content: '●';
      margin-right: 8px;
      font-size: 16px;
      animation: blink 2s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .urgency-low {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
    }
    .urgency-medium {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      color: #856404;
    }
    .urgency-high {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
    }
    .urgency-critical {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: #ffffff;
    }
    .message-container {
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      border: 2px solid #e0e0e0;
      margin-top: 20px;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .message-text {
      color: #2c3e50;
      line-height: 1.8;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 15px;
    }
    .category-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .footer {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      padding: 40px;
      text-align: center;
      color: #ecf0f1;
    }
    .footer-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    .footer-logo-text {
      font-size: 8px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .footer-logo-brand {
      font-size: 18px;
      font-weight: 900;
      color: #667eea;
      letter-spacing: 1.5px;
    }
    .footer-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }
    .footer-divider {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #667eea, transparent);
      margin: 20px auto;
    }
    .footer-text {
      font-size: 13px;
      line-height: 1.8;
      color: #bdc3c7;
      margin: 10px 0;
    }
    .footer-email {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
    }
    .footer-copyright {
      font-size: 11px;
      color: #95a5a6;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0 10px;
      }
      .content {
        padding: 30px 25px;
      }
      .section {
        padding: 20px;
      }
      .header {
        padding: 40px 25px;
      }
      .header-title {
        font-size: 24px;
      }
      .info-label {
        display: block;
        margin-bottom: 5px;
        padding-right: 0;
      }
      .info-value {
        display: block;
        padding-bottom: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header con Logo de Texto -->
    <div class="header">
      <div class="logo-container">
        <div class="logo">
          <div class="logo-text">Innovación</div>
          <div class="logo-brand">W.E.L.</div>
        </div>
      </div>
      <h1 class="header-title">NUEVA CONSULTA RECIBIDA</h1>
      <p class="header-subtitle">AURA Platform</p>
      <div class="alert-badge">
        <span> SISTEMA DE RECONEXIÓN HUMANA</span>
      </div>
    </div>
    
    <!-- Contenido Principal -->
    <div class="content">
      <!-- Sección: Información del Contacto -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon"></span>
          <h2 class="section-title">Información del Contacto</h2>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Nombre Completo:</div>
            <div class="info-value"><strong>${name}</strong></div>
          </div>
          <div class="info-row">
            <div class="info-label">Correo Electrónico:</div>
            <div class="info-value"><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="info-row">
            <div class="info-label">Organización:</div>
            <div class="info-value"><strong>${company}</strong></div>
          </div>
          <div class="info-row">
            <div class="info-label">Teléfono:</div>
            <div class="info-value">${phoneText}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fecha de Envío:</div>
            <div class="info-value">${submissionDate}</div>
          </div>
        </div>
      </div>
      
      <!-- Sección: Detalles de la Consulta -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">📋</span>
          <h2 class="section-title">Detalles de la Consulta</h2>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <div class="info-label">Tipo de Consulta:</div>
            <div class="info-value"><span class="category-badge">${categoryLabel}</span></div>
          </div>
          <div class="info-row">
            <div class="info-label">Nivel de Urgencia:</div>
            <div class="info-value"><span class="urgency-badge urgency-${urgency}">${urgencyLabel}</span></div>
          </div>
        </div>
      </div>
      
      <!-- Sección: Mensaje -->
      <div class="section">
        <div class="section-header">
          <span class="section-icon">💬</span>
          <h2 class="section-title">Mensaje del Usuario</h2>
        </div>
        <div class="message-container">
          <div class="message-text">${message}</div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">
        <div class="footer-logo-text">Innovación</div>
        <div class="footer-logo-brand">W.E.L.</div>
      </div>
      <div class="footer-title"> SISTEMA AUTOMÁTICO AURA v2.0</div>
      <div class="footer-divider"></div>
      <p class="footer-text">
        Este correo fue generado automáticamente desde el<br/>
        formulario de contacto de AURA Platform
      </p>
      <p class="footer-text" style="margin-top: 20px;">
        Para responder a esta consulta, contacta directamente a:<br/>
        <a href="mailto:${email}" class="footer-email">${email}</a>
      </p>
      <div class="footer-divider"></div>
      <p class="footer-copyright">
        © 2025 AURA Platform - Sistema de Reconexión Humana<br/>
        Todos los derechos reservados
      </p>
    </div>
  </div>
</body>
</html>
`;
    // Cuerpo del email en texto plano (fallback)
    const textBody = `
═══════════════════════════════════════
NUEVA CONSULTA - AURA PLATFORM
═══════════════════════════════════════

ORIGEN: Formulario de Contacto Web
SITIO: AURA - Reconexión Humana
FECHA: ${submissionDate}

───────────────────────────────────────
DATOS DEL CONTACTO
───────────────────────────────────────
• Nombre Completo: ${name}
• Email de Contacto: ${email}
• Organización: ${company}
• Teléfono: ${phoneText}

───────────────────────────────────────
INFORMACIÓN DE LA CONSULTA
───────────────────────────────────────
• Tipo de Consulta: ${categoryLabel}
• Nivel de Prioridad: ${urgencyLabel}
• Estado: Nueva consulta pendiente de respuesta

───────────────────────────────────────
MENSAJE COMPLETO
───────────────────────────────────────
${message}

═══════════════════════════════════════
SISTEMA AUTOMÁTICO AURA v2.0
═══════════════════════════════════════
Este email fue generado automáticamente desde
el formulario de contacto de AURA Platform.

Para responder, utiliza directamente el email:
${email}
    `;

    // Configurar opciones del email
    const mailOptions = {
      from: `"AURA Platform" <${process.env.MAIL_USERNAME}>`,
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: subject,
      text: textBody,
      html: htmlBody
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('═══════════════════════════════════════');
    console.log(' EMAIL ENVIADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log(' Destinatario:', DESTINATION_EMAIL);
    console.log(' Remitente:', name);
    console.log(' Email remitente:', email);
    console.log(' Organización:', company);
    console.log(' Categoría:', categoryLabel);
    console.log(' Prioridad:', urgencyLabel);
    console.log(' Message ID:', info.messageId);
    console.log('═══════════════════════════════════════');

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Consulta enviada exitosamente',
      data: {
        name,
        email,
        company,
        category: categoryLabel,
        urgency: urgencyLabel,
        messageId: info.messageId
      }
    });

  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error(' ERROR AL ENVIAR EMAIL');
    console.error('═══════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════');
    
    res.status(500).json({
      success: false,
      error: 'Error al enviar el correo. Por favor, intenta nuevamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'AURA Contact API',
    version: '2.0',
    timestamp: new Date().toISOString(),
    emailConfigured: !!process.env.MAIL_USERNAME && !!process.env.MAIL_PASSWORD
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🌟 AURA Contact API v2.0',
    description: 'API para el formulario de contacto de AURA Platform',
    endpoints: {
      health: 'GET /api/health - Verificar estado del servidor',
      contact: 'POST /api/contact - Enviar consulta por email'
    },
    documentation: 'Consulta el README.md para más información'
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/contact'
    ]
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(' AURA CONTACT API v2.0');
  console.log('═══════════════════════════════════════');
  console.log(` Servidor iniciado exitosamente`);
  console.log(` Puerto: ${PORT}`);
  console.log(` URL Local: http://localhost:${PORT}`);
  console.log(` Emails enviados a: ${DESTINATION_EMAIL}`);
  console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════');
  console.log(' Endpoints disponibles:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log('═══════════════════════════════════════');
  
  if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    console.log('  ADVERTENCIA: Variables de entorno de email no configuradas');
    console.log('   Configura MAIL_USERNAME y MAIL_PASSWORD en tu archivo .env');
    console.log('═══════════════════════════════════════');
  }
});