# Olympex Contracts
En este repositorio se almacena el código de los contratos del DEX Olympex

## Enviroment
Existe un archivo .env.example que contiene todas las variables de entorno mínimas indispensables para el correcto funcionamiento del proyecto. Solo tiene que copiarlo a un archivo .env (sin el .example) y completar el contenido de cada variable que así lo requiera. No elimine ni modifique el .env.example, a menos que sea para agregar o eliminar variables de entorno que sean necesarias a medida que se avanza con el desarrollo.

De momento, solo existe una única variable que es indispensable para el correcto funcionamiento en sus funciones básicas del resto de comandos antes mencionados, la cual es `WALLET_PRIVKEY`.

## Commands
Para el desarrollo disponemos de varios comandos en el package.json los cuales se listan y describen a continuación:

- `task` Ejecuta las tareas disponibles en harthat y cualquier otra tarea personalizada creada por nosotros mismo como por ejemplo `yarn task signers`. Si ejecuta `yarn task` a secas sin paráetros podrá ver todas las opciones disponibles que existen

- `test` Si se ejecuta a secas sin parámetros corren todos los test escritos en la carpeta [tests](/tests) en la raíz del proyecto. Si solo necesita ejecutar un unico test lo puede indicar como primer parámetro de la siguiente manera `yarn test tests/mi_contrato.test.ts`

- `compile`  Compila todo los contratos

- `deploy` Si se ejecuta a secas sin parámetros se deployan todos los contratos listados en la carpeta [contracts](/contracts). Si solo dejea ejecutar un único contrato puede usar la bandera `--tags` para especificar el contrato que se desea deployar, por lo generar las tags son el mismo nombre del contrato, puede ver la lista de tags disponibles para cada contrato en el fichero [constants.ts](/constants.ts) ejemplo: `yarn deploy --tags ERC20Mock`. Por dejecto se deployan en la testnet de hardhat (local) si desea utilizar otra red como goerli puede usar la bandera --network así: `yarn deploy --network goerli --tags ERC20Mock`. Debes asegurarte de que la red que quieras usar está configurada en [hardhat.config.ts](/hardhat.config.ts)

- `typechain` genera todo el typescrypt necesario para los contratos. Automáticamente encontrará todos los .abi archivos en el proyecto y generará clases de Typecript basadas en ellos.
  - **Nota:** El desarrollador de typechain ha anunciado un anuncio de desuso suave y recomienda migrar a [Viem](https://hardhat.org/hardhat-runner/docs/advanced/using-viem). **No es urgente hacer una migración ahora pero se recomienda hacerla en un futuro no muy lejano**

- `test:gas` Ejecuta los test y muestra al final un reporte del gas utilizado en todos los test


## Development
Paso a seguir para comenzar a desarrollar.

- Complete los pasos descritos en la sección [Enviroment](#Enviroment)
- instale las dependencias con `yarn install`
- Ejecute los test para ver que todo ande bien `yarn test`
- 🚀 Listo ya deberíamos tener ejecutando nuestro proyecto en local