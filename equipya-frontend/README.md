# EquipYa — Frontend

Aplicación React/Vite para la plataforma EquipYa, un marketplace híbrido de alquiler de herramientas y contratación de servicios locales.

## Stack

- **React 18** + **Vite**
- Estilos en CSS puro (sin frameworks de UI)
- Fetch nativo para llamadas al backend
- Google Fonts (Montserrat + Inter + Syne)

## Estructura del proyecto

```
src/
├── pages/
│   ├── auth/
│   │   ├── Login.jsx        # Pantalla de inicio de sesión
│   │   ├── Register.jsx     # Pantalla de registro
│   │   ├── AuthPage.jsx     # Router entre login y registro
│   │   └── Auth.css         # Estilos compartidos de auth
│   ├── Home.jsx             # Feed principal con filtros y búsqueda
│   ├── Home.css             # Estilos del feed
│   └── ProductDetail.jsx    # Detalle de artículo/herramienta
├── App.jsx                  # Navegación principal
├── App.css
├── main.jsx
└── index.css
```

## Funcionalidades implementadas

### Autenticación
- Registro de usuario con validación de campos
- Inicio de sesión con manejo de errores del servidor
- Toggle para mostrar/ocultar contraseña
- Guardado de sesión en `localStorage`
- Diseño split: panel de marca + formulario

### Home / Feed
- Feed de artículos fetcheado desde `GET /api/articulos`
- Búsqueda en tiempo real por nombre, categoría y ubicación
- Tabs de categorías: Todo, Productos, Servicios, Cámaras, Herramientas, Electricidad, Plomería
- Sidebar con filtros de fecha, zona (km) y precio
- Cards con imagen, precio, ubicación, rating y botones de like/guardar
- Banner y modal del asistente IA (estructura lista, pendiente API key)
- Burbuja de chat directo
- Modal para subir nueva publicación

### Detalle de producto
- Galería de imágenes con thumbnails
- Selector de rango de fechas con cálculo de total
- Card del vendedor con rating y verificación
- Tabs de descripción, especificaciones y reseñas
- Botones de reservar y contactar

### Navegación
```
Login / Registro → Home → ProductDetail
```

## Configuración

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:3000
```

### Instalación y ejecución

```bash
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

> El backend debe estar corriendo en `http://localhost:3000` para que las llamadas funcionen.

## Endpoints utilizados

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/usuarios/registro` | Registro de usuario |
| POST | `/api/usuarios/login` | Inicio de sesión |
| GET | `/api/articulos` | Lista de artículos con filtros |
| GET | `/api/articulos/:id` | Detalle de un artículo |

## Pendiente

- [ ] Conectar imágenes reales por producto
- [ ] Activar asistente IA (requiere API key server-side)
- [ ] Conectar modal "Subir publicación" a `POST /api/articulos`
- [ ] Implementar filtros de fecha y zona funcionales
- [ ] Pantalla de perfil de usuario

## Autores

Proyecto académico — Desarrollo de Software  
Universidad / Instituto — 2026
