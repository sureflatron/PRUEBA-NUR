# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero (para aprovechar caché de Docker)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY src/ ./src/

# Puerto que expone la aplicación (ajusta según tu app)
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]