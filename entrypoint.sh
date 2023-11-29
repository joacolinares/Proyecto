#!/bin/bash

# Iniciar el daemon de Hardhat en segundo plano
yarn run hardhat node &

# Esperar un momento para que el daemon se inicie completamente
sleep 5

# Compilar los contratos inteligentes con Hardhat
yarn run hardhat compile

# Desplegar a la red local de Hardhat
yarn run hardhat run scripts/deploy.js --network localhost

# Ejecutar las pruebas
REPORT_GAS=true yarn hardhat test

# Conocer la cobertura de las pruebas.
yarn run hardhat coverage --network localhost

# Mantener el contenedor en ejecución para evitar que se cierre
tail -f /dev/null






