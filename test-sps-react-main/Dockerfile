# Etapa de construcción
FROM node:16 AS build

# Establecer el directorio de trabajo
WORKDIR /app


# Definir variables de construcción (ARG)
ARG REACT_APP_API_URL

# Establecer las variables de entorno (ENV)
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copia el archivo .env (si existe)
COPY .env ./

# Copia los archivos de dependencias primero (para aprovechar caché de Docker)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY src/ ./src/
COPY public/ ./public/

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto en el que Nginx servirá la aplicación
EXPOSE 3000

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
