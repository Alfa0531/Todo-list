# Todo List App

Aplicación fullstack con frontend en **Next.js/React** y backend en **Node.js/Express**, conectada a una base de datos en MongoDB.

---

## Instrucciones para ejecutar el proyecto localmente

Este proyecto está dividido en dos carpetas:

- `frontend/`: Aplicación web (Next.js + React)
- `backend/`: API (Node.js + Express + MongoDB)

---

### Configurar las variables de entorno

1. Crear un archivo .env en la carpeta de backend y añadir lo siguiente:

PORT=4000
MONGODB_URI=mongodb+srv://alfaroga31:L0RJY1Pnc9NQthZh@todo-list-db.cjldznz.mongodb.net/?retryWrites=true&w=majority&appName=todo-list-db
JWT_SECRET=tnoqtCOmMNMSwy0ZybYhC5NtiutJxH7L92mLQHks6xLr/vcxBgnGt7rrvKuEduK/0LNt4N9SpIRzJpOM1xubMA==

2. Desde la carpeta backend, ejecuta:

`npm install`

3. Desde la carpeta frontend, ejecuta:

`npm install`

### Ejecutar el proyecto

1. Desde la carpeta backend:

`node server.js`

2. Desde la carpeta frontend:

`npm run dev`
