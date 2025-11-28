# Nota
Al instalar la API de docusign para la firma digital de los documentos, tuve que instalar la dependencia con el npm install docusign-esign
docker me leseo caleta pero ahora mismo esta funcionando, ademas del dotenv (npm install dotenv) 
(por temas de seguridad en la api, para hacer la conexion con mi cuenta, tuve que crear un .env con los valores, y para cargarlos descargar el dotenv, el .env no lo voy a subir al git, ni tampoco el archivo con la key, despues me los piden por wsp)
si no me equivoco, con que hagan un build de nuevo, deberia funcionar, ya que ahora las cosas que tuve que instalar estan en los package.json del backend

El pdf pruebaa es como dice el nombre, un pdf de prueba que use, para la api necesitamos generar pdfs y pasarlos a base 64, para eso esta en utils pdfBase64.js, solo faltaria como generarlos

Actualmente funciona para hacer peticiones a la api, solo lo probe con postman, donde a la url http://localhost:3000/api/docusign/iniciar-firma
se le pasa un json con formato "emailCliente": "", "nombreCliente":"", y al email que pongan va a llegar un correo pidiendo firmar

Ahora tambien funciona mediante la app, mediante el flujo, al tener una solicitud aprobada, aparece un boton de iniciar firma, al apretarlo se manda lo necesario
a la api.

Actualmente como esta, se puede ocupar la api, pero al no estar subida la pagina, la api necesita un endpoint activo para mandar las respuestas cuando es firmada
o rechazada, para esto, ahora la solucion es usar ngrok, donde puedes abrir el puerto del pc que tu quieras y te da un link subido a internet donde se puede
recibir el webhook de la api. El tema es que cada cuenta gratis de ngrok, tiene un link distinto, lo que significaria cambiar la configuracion de la api cada vez
que alguno de nosotros lo fuera a probar. Descarguense ngrok y despues me piden el token para que lo conecten a mi cuenta, para no tener que cambiar el link
en la config de la API. tambien pidanme los archivos de la api para que funcione, pq no estoy seguro si subirlos aca o no


# Aplicación Node.js con Docker y PostgreSQL

Este es un ejemplo de una aplicación Node.js usando Express, Docker y PostgreSQL. Incluye configuración para desarrollo y producción.

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Node.js](https://nodejs.org/) (opcional, solo para desarrollo local)
- `curl` o cliente HTTP (para probar endpoints)

## Instalación

### 1. Clonar el repositorio

`$ git clone git@github.com:WhoRegisteredAllTheGoodUsernames/GRUPO01-2025-PROYINF.git`

Debe tener docker-desktop abierto en todo momento, o el servicio. Ejecutar en terminal:

### 2. Deben navegar hasta la carpeta `./proyecto` (aquí mismo)

### 3. Les instalará las dependencias. Se suele demorar un poco la primera vez con esto levantan el proyecto:

`$ docker compose up --build`

Para detener los contenedores:

`$ docker compose down -v`

Si no les ejecuta asegurense de estar en la carpeta correcta. Si trabajan desde windows deben tener instalado WSL2 y tenerlo activado en docker desktop; esto se puede verificar en:

- Configuración   
    - Resources  
        - Configure which WSL 2 distros you want to access Docker from. (esto debe estar activo)  
        - Enable integration with additional distros:(esto debe estar activo)  

# Comandos útiles 

Pueden levantar el proyecto sin volver a construir las imágenes con el siguiente comando:

`$ docker compose up`

Si quieren levantar el proyecto en segundo plano pueden usar:

`$ docker compose up -d`

Para ver el estado de los servicios que están corriendo:

`$ docker compose ps`

Para ver los logs en tiempo real de todos los servicios:

`$ docker compose logs -f`

O de un servicio específico:

`$ docker compose logs -f nombre_servicio`

Para reiniciar un servicio específico:

`$ docker compose restart nombre_servicio`

Para detener todos los contenedores sin eliminar volúmenes:

`$ docker compose down`
