
# Contexto del proyecto: API REST de Eventos

## 1. Objetivo

Desarrollar una API REST para gestionar eventos, entradas y recintos mediante Node.js, Express, Mongoose y MongoDB.

El proyecto corresponde a la Práctica 1 de Despliegue de Aplicaciones Web (curso 2026-2027).

El enunciado de la práctica es la fuente de verdad. No inventes requisitos ni modifiques los especificados.

## 2. Tecnologías y convenciones

- Node.js.
- Express.
- MongoDB.
- Mongoose.
- JavaScript.
- CommonJS: utilizar `require()` y `module.exports`.
- Utilizar `async/await` de manera consistente.
- Utilizar JSON para recibir y devolver información.
- Mantener los nombres de campos y rutas exactamente como aparecen en el enunciado.

El proyecto ya tiene instalados Express y Mongoose. No modifiques innecesariamente las dependencias ni las versiones de `package.json`.

## 3. Estructura obligatoria

Respetar esta estructura:

```text
Practica1_API_Eventos/
│
├── models/
│   ├── evento.js
│   └── recinto.js
│
├── routes/
│   ├── eventos.js
│   └── recintos.js
│
├── agents.md
├── index.js
├── package.json
└── package-lock.json
```

No crear carpetas `controllers`, `services` u otras estructuras adicionales que no exige la práctica.

## 4. Modelos y esquemas

### 4.1. Evento (`models/evento.js`)

Definir un esquema Evento con estos campos:

- `nombre`: String obligatorio, longitud mínima de 5 caracteres.
- `fecha`: Date obligatorio.
- `entradas`: array de subdocumentos del esquema Entrada.
- `recinto`: referencia obligatoria al modelo Recinto mediante ObjectId.

### 4.2. Entrada (subdocumento en `models/evento.js`)

Definir el esquema Entrada en el mismo archivo `evento.js`.

Campos:

- `tipo`: String obligatorio, longitud mínima de 3 caracteres.
- `precio`: Number obligatorio, valor mínimo 0.
- `disponibles`: Number obligatorio, entero y valor mínimo 0.

Entrada es un subdocumento de Evento, no un modelo independiente.

### 4.3. Recinto (`models/recinto.js`)

Definir un esquema Recinto con estos campos:

- `nombre`: String obligatorio, longitud mínima de 5 caracteres.
- `direccion`: String obligatorio, longitud mínima de 10 caracteres.
- `localidad`: String obligatorio, longitud mínima de 3 caracteres.
- `aforoMaximo`: Number opcional.

El campo `recinto` del modelo Evento debe referenciar al modelo Recinto.

## 5. Endpoints obligatorios

Hay que implementar los 13 endpoints siguientes.

Todas las respuestas deben incluir un campo booleano `ok`:
- `true` cuando la operación se realiza correctamente.
- `false` cuando se produce un error.

Las respuestas deben incluir `resultado` para los resultados satisfactorios y `error` para los errores, respetando los nombres y mensajes indicados.

### 5.1. Rutas de recintos (`routes/recintos.js`)

**1. GET /recintos**

- Obtener todos los recintos.
- Si hay resultados: HTTP 200 y `resultado`.
- Si no hay resultados o falla la consulta: HTTP 500 y `error: "No se han encontrado recintos"`.

**2. GET /recintos/:id**

- Obtener un recinto por su identificador.
- Si existe: HTTP 200 y `resultado`.
- Si no existe o se produce un error: HTTP 404 y `error: "Recinto X no encontrado"`.

**3. GET /recintos/localidad/:nombre**

- Buscar recintos por localidad.
- Si hay resultados: HTTP 200 y `resultado`.
- Si no hay resultados o falla la consulta: HTTP 404 y `error: "No se han encontrado recintos de la localidad indicada"`.

**4. POST /recintos**

- Recibir los datos del recinto en el cuerpo JSON.
- Si se crea correctamente: HTTP 201 y `resultado`.
- Si se produce un error: HTTP 500 y `error: "Error añadiendo recinto"`.

**5. DELETE /recintos/:id**

- Eliminar un recinto por su identificador.
- Si se elimina correctamente: HTTP 200 y `resultado`.
- Si no existe o se produce un error: HTTP 404 y `error: "Error eliminando recinto X"`.

### 5.2. Rutas de eventos (`routes/eventos.js`)

**6. GET /eventos**

- Obtener todos los eventos.
- Incluir la información de los recintos y las entradas.
- Utilizar `populate` cuando sea necesario para recuperar la información referenciada.
- Si hay resultados: HTTP 200 y `resultado`.
- Si no hay resultados o falla la consulta: HTTP 500 y `error: "No se han encontrado eventos"`.

**7. GET /eventos/:id**

- Obtener un evento por su identificador.
- Si existe: HTTP 200 y `resultado`.
- Si no existe o se produce un error: HTTP 404 y `error: "Evento X no encontrado"`.

**8. GET /eventos/localidad/:nombre**

- Obtener los eventos correspondientes a una localidad.
- Solo incluir eventos cuya fecha no haya pasado.
- Utilizar la relación con Recinto para filtrar por localidad.
- Si hay resultados: HTTP 200 y `resultado`.
- Si no hay resultados o falla la consulta: HTTP 404 y `error: "No se han encontrado eventos"`.

**9. POST /eventos**

- Recibir los datos del evento en el cuerpo JSON.
- Si se crea correctamente: HTTP 201 y `resultado`.
- Si se produce un error: HTTP 500 y `error: "Error añadiendo evento"`.

**10. PUT /eventos/:id**

- Actualizar un evento por su identificador.
- Si se actualiza correctamente: HTTP 200 y `resultado`.
- Si no existe o se produce un error: HTTP 404 y `error: "Error actualizando evento X"`.

**11. DELETE /eventos/:id**

- Eliminar un evento por su identificador.
- Si se elimina correctamente: HTTP 200 y `resultado`.
- Si no existe o se produce un error: HTTP 404 y `error: "Error eliminando evento X"`.

### 5.3. Rutas de entradas (`routes/eventos.js`)

**12. GET /eventos/entradas/:idEvento/:tipoEntrada**

- Buscar las entradas de un evento según su tipo.
- Devolver `precio` y `disponibles` en `resultado`.
- Si se encuentra la entrada: HTTP 200.
- Si no se encuentra o se produce un error: HTTP 404 y `error: "Error obteniendo datos de entrada para evento X"`.

**13. PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad**

- Restar la cantidad solicitada a las entradas disponibles del tipo indicado.
- Comprobar que existen suficientes entradas disponibles.
- Si se realiza correctamente: HTTP 200 y devolver el evento actualizado y sus entradas en `resultado`.
- Si falla la operación o no hay suficientes entradas: HTTP 404 y `error: "Error actualizando entradas del evento X"`.

## 6. Servidor principal (`index.js`)

El archivo principal debe:

1. Cargar las librerías necesarias.
2. Establecer la conexión con MongoDB.
3. Configurar Express.
4. Habilitar el middleware para recibir JSON.
5. Montar el router de eventos en `/eventos`.
6. Montar el router de recintos en `/recintos`.
7. Iniciar el servidor en un puerto configurable.

## 7. Reglas de implementación

- Respetar exactamente los nombres de los archivos, carpetas, campos y endpoints.
- Mantener CommonJS en todos los archivos.
- Utilizar `async/await` de forma consistente.
- Gestionar los errores de las operaciones.
- Respetar los códigos HTTP y mensajes de error del enunciado.
- No cambiar los nombres `ok`, `resultado` y `error`.
- No introducir funcionalidades que no solicita la práctica.
- Evitar duplicar código innecesariamente.
- Escribir código claro, sencillo y adecuado al nivel de 2.º DAM.
- No ocultar errores ni devolver respuestas de éxito cuando una operación haya fallado.

## 8. Forma de trabajo con la IA

- No generar todo el proyecto de una sola vez.
- Trabajar de manera incremental, archivo por archivo y endpoint por endpoint.
- Antes de modificar archivos, explicar qué se va a hacer y por qué.
- Explicar los conceptos técnicos necesarios para comprender el código.
- No modificar archivos existentes sin explicar previamente el motivo.
- No eliminar requisitos ni simplificar funcionalidades obligatorias.
- No dar por terminada una tarea sin comprobar que cumple el enunciado.
- Esperar la confirmación del estudiante antes de continuar con el siguiente paso.
- Priorizar que el estudiante comprenda y pueda defender oralmente todo el código generado.

## 9. Despliegue

La aplicación debe desplegarse en Render y conectarse a una base de datos MongoDB Atlas.

Los endpoints deben funcionar también desde la URL pública de Render, conservando sus rutas.

El proyecto entregable no debe incluir la carpeta `node_modules`.
