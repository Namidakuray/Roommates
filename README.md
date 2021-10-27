# Información general:
- Curso: DESARROLLO DE APLICACIONES FULL STACK JAVASCRIPT TRAINEE
- Autor: Mario Flores Cruz
- Módulo: 06 - Desarrollo de backend en node
- Lenguajes: [JavaScript]
- Tecnologías: [NodeJS]
- Dependencias: [Axios,UUID]

## Instrucciones:
- Primero, iniciar el paquete de modulos de node, a modo de descargar las dependencias.
- Segundo, iniciar el servidor con el comando personalizado "npm run dev"
- En caso de querer corroborar los cálculos relacionado a los arrays de participación por gasto, utilizar el archivo "checking.js" por medio de "node checking.js"

## Descripción:
En este ejercicio deberás crear un servidor con Node que sirva una interfaz HTML y cuya temática está basada en el registro de gastos entre roommates.

>Además deberás servir una API REST que permita hacer lo siguiente:
>>- Almacenar roommates nuevos ocupando random user.
>>- Devolver todos los roommates almacenados.
>>- Registrar nuevos gastos.
>>- Devolver el historial de gastos registrados.
>>- Modificar la información correspondiente a un gasto.
>>- Eliminar gastos del historial.

>Rutas que debes crear en tu servidor:
>>- / GET: Debe devolver el documento HTML disponibilizado en el apoyo.
>>- /roommate POST: Almacena un nuevo roommate ocupando random user.
>>- /roommate GET: Devuelve todos los roommates almacenados.
>>- /gastos GET: Devuelve el historial con todos los gastos registrados.
>>- /gasto PUT: Edita los datos de un gasto.
>>- /gasto DELETE: Elimina un gasto del historial.

## Requerimientos:
1. Ocupar el módulo File System para la manipulación de archivos alojados en el servidor
2. Capturar los errores para condicionar el código a través del manejo de excepciones.
3. El botón “Agregar roommate” de la aplicación cliente genera una petición POST (sin payload) esperando que el servidor registre un nuevo roommate random con la API randomuser, por lo que debes preparar una ruta POST /roommate en el servidor que ejecute una función asíncrona importada de un archivo externo al del servidor (la función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule en un JSON (roommates.json). El objeto correspondiente al usuario que se almacenará debe tener un id generado con el paquete UUID.
4. Crear una API REST que contenga las siguientes rutas:
   - a. GET /gastos: Devuelve todos los gastos almacenados en el archivo gastos.json.
    - b. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un archivo JSON (gastos.json).
   - c. PUT /gasto: Recibe el payload de la consulta y modifica los datos almacenados en el servidor (gastos.json).
   - d. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine del historial de gastos (gastos.json).
   - e. GET /roommates: Devuelve todos los roommates almacenados en el servidor (roommates.json)
- Se debe considerar recalcular y actualizar las cuentas de los roommates luego de este proceso.
5. Devolver los códigos de estado HTTP correspondientes a cada situación.

[Pd: Se intentó inicialmente el poder enviar email de confirmación.]

## Lógica de cálculo: 
### El objetivo fue generar un sistema de distribución de gastos justo, en donde cada nuevo integrante pagase una "comisión de ingreso"
>NOTA: Cada objeto de gastos, posee un Arr que contiene actualizado y en orden la [participacion] de cada uno de los room mates.

>NOTA_02: Información de relevancia es impresa por Stdout del servidor.

Sabiendo que:
- cantidad inicial de participantes = ci ; cantidad final de participantes = cf
- participación inicial de room mates por gasto = pig ; participación final de room mates por gasto = pfg
- diferencial de participación (pfg - pig) = dp ; monto gasto = mg

Entonces:
>- Nuevo room mate:
>>Por cada gasto se recalcula como:
>>- nuevo integrante => deuda = dp [Este monto es cargado al nuevo participante por consepto de comisión de ingreso al grupo]
>>- participante titular de gasto => recibe -= (mg - dp)/ci
>>- participantes => deuda += (mg - dp)/ci
[ mg = ci((mg - dp)/ci) + dp ]

>- Nuevo gasto:
>>Por cada room mate se calcula como:
>>- participante titular de gasto => recibe += mg/cf
>>- participantes => deuda -= mg/cf
>>- [ mg = cf(mg/cf) ]

>- Editado de gasto:
>>Por cada room mate se calcula como:
>>>con igual titular:
>>>- participante titular de gasto => recibe += dp
>>>- participantes => deuda -= dp
>>>- [ mg{end} = mg{init} + cf(dp) ]

>>>con diferente titular:
>>>- participante ex-titular del gasto => recibe += [participación correspondiente] ; debe -= [participación correspondiente]
>>>- participante new-titular del gasto => deuda -= recibe += [participación correspondiente] ; debe -= [participación correspondiente]
>>>- participantes => deuda -= dp
>>>- [ mg{end} = mg{init} + (cf-2)(dp) + [part ex-tit] + [part new-tit] ]

>- Eliminación de gasto:
>>Por cada room mate se calcula como:
>>>- participante titular de gasto => recibe -= [participación correspondiente]
>>>- participantes => deuda += [participación correspondiente]
>>>- [ mg{end} = sum([participacion])]