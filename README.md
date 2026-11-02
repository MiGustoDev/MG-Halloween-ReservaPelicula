# 🎃 Mi Gusto · Noche de Cine: Viernes 13

<p align="center">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/Status-Production_Ready-E50914?style=for-the-badge" alt="Status">
</p>

> **Experiencia gastronómica y cinematográfica inmersiva** desarrollada para **Mi Gusto Empanadas (Sucursal Vicente López)**. Landing page temática de alta conversión diseñada para la proyección exclusiva de *Viernes 13 (1980)* en Halloween, combinando ambientación slasher, video fullscreen adaptativo y sistema de reservas conectado en tiempo real.

---

## 📸 Galería de Vistas

<p align="center">
  <img src="public/screenshots/Screenshot_5.png" alt="Vista Hero y Video Fullscreen" width="49%">
  <img src="public/screenshots/Screenshot_6.png" alt="Formulario de Reserva y Cupos en Tiempo Real" width="49%">
</p>
<p align="center">
  <img src="public/screenshots/Screenshot_7.png" alt="Experiencia Slasher y Coordenadas del Evento" width="98.5%">
</p>

---

## 🩸 Características Principales

* **🎬 Background Video Responsive & Adaptativo:**
  * En dispositivos móviles reproduce exclusivamente `app.mp4` vertical.
  * En notebooks y monitores reproduce `web.mp4` horizontal en alta resolución.
  * Carga inteligente selectiva con `preload="metadata"`: ahorra más de 20 MB de descarga innecesaria en smartphones con datos móviles.

* **📝 Sistema de Reserva Oficial en Tiempo Real:**
  * Integración con **Google Sheets** a través de **Google Apps Script Webhook** para almacenamiento automático en la nube.
  * Sanitización de números telefónicos internacionales (`+` / `=`) para evitar errores de cálculo en hojas de cálculo.
  * Resguardo offline y concurrente con `localStorage`.

* **🔥 Gestor Dinámico de Cupos (Aforo: 34 Lugares):**
  * Contador reactivo que suma las reservas confirmadas y descuenta automáticamente los lugares restantes en tiempo real.
  * Indicador visual dinámico con estado de advertencia y mensaje de *¡Lugares agotados!* al alcanzar la capacidad máxima.

* **🔪 Ambientación Slasher Interactiva:**
  * Elemento acechante de **Jason Voorhees** de cuerpo entero (`jason-full.png`) con respiración orgánica y destellos en el machete para notebook y monitor.
  * Máscara de hockey acechando desde el margen izquierdo mediante *scroll triggers*.
  * Lluvia sutil de gotas de sangre y generador de truenos sintéticos procedurales a través de **Web Audio API** (sin archivos de audio pesados).

* **📱 Diseño Ultra Responsive & Escalado Calibrado:**
  * Adaptación milimétrica para **monitores de escritorio**, **notebooks/laptops** (ajuste especial de encuadre bajo el navbar sin colisiones) y **smartphones** (textos en una sola línea y navegación cómoda).

* **🚀 Optimización & SEO Social:**
  * `loading="lazy"` y `decoding="async"` en todos los assets visuales secundarios para maximizar la velocidad de apertura (*First Contentful Paint*).
  * Tarjetas **Open Graph** y **Twitter Cards** calibradas en `1200x630` con imagen de vista previa enriquecida para WhatsApp y redes sociales.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología / Herramienta |
| :--- | :--- |
| **Bundler & Dev Server** | [Vite 5.4](https://vitejs.dev/) |
| **Lenguaje Core** | HTML5 Semántico & Vanilla JavaScript (ES6+ Modules) |
| **Estilos & Animaciones** | CSS3 Moderno (Custom Properties, CSS Grid, Flexbox, Keyframes) |
| **Audio FX** | Web Audio API (BiquadFilter, BufferSource, Pink Noise Synthesis) |
| **Iconografía** | [Lucide Icons](https://lucide.dev/) |
| **Backend & Base de Datos** | Google Apps Script (Webhook JSONP/CORS) & Google Sheets |
| **Efectos Festivos** | Canvas Confetti |

---

## 📂 Estructura del Proyecto

```text
MG-Halloween-ReservaPelicula/
├── assets/                  # Imágenes, marcas de agua y figuras de Jason
│   ├── crystal-lake-bg.jpg
│   ├── jason-full.png       # Asset completo de Jason para notebook y monitor
│   ├── jason-mask.png       # Máscara clásica de hockey
│   ├── jason-shadow.png     # Marca de agua en tarjetas
│   └── logo-migusto.png     # Identidad oficial de Mi Gusto
├── public/                  # Archivos estáticos y multimedia pública
│   ├── og-image.jpg         # Vista previa optimizada para WhatsApp (1200x630)
│   ├── screenshots/         # Capturas de pantalla para documentación
│   │   ├── Screenshot_5.png
│   │   ├── Screenshot_6.png
│   │   └── Screenshot_7.png
│   └── videos/              # Video en bucle (web.mp4 y app.mp4)
├── dist/                    # Build final optimizado para DonWeb
├── index.html               # Estructura principal, meta tags y scripts
├── style.css                # Estilos globales, diseño responsive y temas
├── main.js                  # Lógica interactiva, contadores, audio y webhooks
├── vite.config.js           # Configuración del empaquetador Vite
└── package.json             # Scripts y dependencias del proyecto
```

---

## 🚀 Puesta en Marcha en Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/MG-Halloween-ReservaPelicula.git
   cd MG-Halloween-ReservaPelicula
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   # o con npm:
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   pnpm run dev
   # o con npm:
   npm run dev
   ```

4. **Compilar para producción (Carpeta `dist/`):**
   ```bash
   pnpm run build
   # o con npm:
   npm run build
   ```

---

## 📄 Licencia y Créditos

Desarrollado para la campaña temática de **Halloween · Noche de Película (Viernes 13)** en **Mi Gusto Vicente López**.  
Todos los derechos reservados © 2026.

