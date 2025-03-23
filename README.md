# Proyecto Veterinaria Node.js con TypeORM y MySQL

Este proyecto utiliza **Node.js**, **Express**, **TypeORM** y **MySQL** como base de datos.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto y agrega:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_de_datos
   ```

## Ejecución en Desarrollo

Para iniciar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

## Construcción y Ejecución en Producción

1. Construir el proyecto:

   ```bash
   npm run build
   ```

2. Iniciar el servidor en producción:

   ```bash
   npm start
   ```


