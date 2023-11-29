# Usar una imagen base con Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Copiar el script de inicio
COPY entrypoint.sh ./

# Da permisos de ejecución al script
RUN chmod +x entrypoint.sh

# Instalar las dependencias de Hardhat
#RUN npm install --global hardhat

# Crear un directorio para tus contratos
RUN mkdir contracts

# Crear un directorio para tus scripts
RUN mkdir scripts

# Crear un directorio para tus tests
RUN mkdir test

# Copiar los contratos al directorio /app/contracts
COPY ./contracts/ /app/contracts/

# Copiar los scripts al directorio /app/scripts 
COPY ./scripts/ /app/scripts/

# Copiar los tests al directorio /app/tests 
COPY ./test/ /app/test/

# Copiar el archivo hardhat.config.js
COPY hardhat.config.js .

# Instalar las dependencias del proyecto
RUN yarn install

# Exponer el puerto RPC de Hardhat (8545)
EXPOSE 8545

# Comando predeterminado para ejecutar Hardhat (se ejecutará cuando inicies el contenedor)
CMD ["/bin/sh","entrypoint.sh"]