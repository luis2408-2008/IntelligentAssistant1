# Nova AI - Chatbot Inteligente

Un chatbot web interactivo e inteligente que utiliza la API de Gemini para proporcionar respuestas precisas y naturales a las consultas de los usuarios.

## Características

- Interfaz de usuario moderna y profesional
- Integración con la API de Gemini AI (modelo gemini-2.0-flash)
- Almacenamiento persistente en base de datos PostgreSQL
- Diseño adaptable para móviles y escritorio
- Animaciones fluidas y transiciones elegantes

## Requisitos

- Node.js 18 o superior
- PostgreSQL
- Clave API de Google Gemini

## Despliegue en Render

1. Crea una cuenta en [Render](https://render.com/) si aún no tienes una.
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket a Render.
3. Crea un nuevo servicio web y selecciona el repositorio.
4. Configura los siguientes parámetros:

   - **Nombre**: Nova AI Chatbot (o el nombre que prefieras)
   - **Entorno**: Node
   - **Build Command**: `chmod +x ./build.sh && ./build.sh`
   - **Start Command**: `npm start`

5. Configura las siguientes variables de entorno:

   - `DATABASE_URL`: URL de conexión a tu base de datos PostgreSQL
   - `GEMINI_API_KEY`: Tu clave API de Google Gemini
   - `NODE_ENV`: production

6. Si deseas, puedes crear una base de datos PostgreSQL directamente en Render y enlazarla a tu servicio web.

7. Haz clic en "Create Web Service" para comenzar el despliegue.

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales

# Ejecutar migraciones de base de datos
npm run db:push

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del proyecto

- `client/`: Código frontend (React, TailwindCSS)
- `server/`: Código backend (Express, API endpoints)
- `shared/`: Esquemas y tipos compartidos
- `scripts/`: Scripts de utilidad