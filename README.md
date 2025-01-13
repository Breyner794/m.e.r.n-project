# Proyecto Nombre

## Descripción
Breve descripción del proyecto.

## Requisitos
- Node.js
- MongoDB

## Configuración
1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu_usuario/tu_repositorio.git
    cd tu_repositorio
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura las variables de entorno:
    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
    ```env
    PORT=5550 Depende de tu puerto
    MONGO=mongodb://localhost:2301/base_de_datos
    JWT_SECRET=secreto_seguro_inserta_tu_propio_token
    ```

## Ejecución
Para iniciar el servidor, ejecuta:
```bash
npm start
