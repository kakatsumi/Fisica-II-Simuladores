# Guía del proyecto — Unidad III: Corriente eléctrica y Ley de Ohm

## 1. Información general

- **Proyecto:** Simuladores Interactivos de Física II.
- **Universidad:** Universidad Peruana Unión (UPeU).
- **Curso:** Física II.
- **Estudiante:** Pedro Ricardo Alva Pardave.
- **Cuenta GitHub:** https://github.com/kakatsumi.
- **Repositorio público:** https://github.com/kakatsumi/Fisica-II-Simuladores.
- **Carpeta:** `/home/ricardo/Documentos/Universidad/FÍSICA II/Unidad 3 - Corriente Electrica y Ley de Ohm/`.
- **Tecnologías:** JavaScript, React, React DOM, Vite, CSS y SVG.
- **Validación de esta entrega:** 22 de octubre de 2026.

Aplicación independiente de las unidades I y II. Funciona localmente en Ubuntu, sin backend, base de datos, cuentas ni almacenamiento de simulaciones. Después de instalar las dependencias, no necesita Internet para funcionar. El enlace al repositorio es opcional y no interviene en los cálculos. No se generan documentos PDF, Word, imágenes ni videos como parte de esta guía.

## 2. Objetivos

**General:** comprender las relaciones entre corriente, voltaje, resistencia y potencia mediante circuitos resistivos sencillos y resultados que cambian al editar sus parámetros.

**Específicos:** resolver las tres formas de la Ley de Ohm; obtener resistencias equivalentes en serie y paralelo; reducir un circuito mixto definido; interpretar el reparto de voltaje y corriente; comprobar la conservación de potencia; relacionar las fórmulas con los diagramas y los cálculos numéricos.

## 3. Funcionalidades implementadas

1. Ley de Ohm: selección de V, I o R como incógnita y entrada de los dos datos conocidos. Incluye fórmula, sustitución, resultado e interpretación breve.
2. Serie: fuente editable, de una a ocho resistencias editables, suma de resistencias, corriente total, caídas de voltaje y potencias.
3. Paralelo: de una a ocho ramas, resistencia equivalente, corriente total y por rama, voltaje común y potencia total y por resistencia.
4. Mixto: R1 en serie con un grupo de una a ocho ramas paralelas; reducción del grupo, resistencia total, reparto de voltaje y corriente y potencias. Puede tener hasta nueve resistencias contando R1.
5. Diagramas SVG de la fuente, símbolos de resistencias, cables y nodos. Los valores se actualizan con los parámetros. La flecha I representa la corriente convencional total respecto a la polaridad de referencia y se invierte si la corriente es negativa; no aparece con corriente cero ni cuando existen errores.
6. Diseño ámbar en español, panel de entradas, resultados principales, tabla por componente, fórmulas y restablecimiento del modo actual.
7. Validación de entradas y rechazo de resultados fuera del rango numérico.

Los cuatro modos conservan sus entradas al alternar entre ellos durante la sesión. No hay editor libre de circuitos ni representación 3D.

## 4. Estructura del proyecto

```text
Unidad 3 - Corriente Electrica y Ley de Ohm/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── GUIA_DEL_PROYECTO.md
└── src/
    ├── main.jsx
    ├── style.css
    ├── physics.js
    ├── CircuitDiagram.jsx
    └── physics.test.js
```

| Archivo | Función |
| --- | --- |
| `index.html` | Página HTML en español y raíz de React. |
| `package.json` | Dependencias y comandos de desarrollo, pruebas, compilación y vista previa. |
| `package-lock.json` | Versiones resueltas para reproducir la instalación. |
| `src/main.jsx` | Estado de los modos, entradas, tablas, fórmulas y resultados. |
| `src/style.css` | Diseño ámbar, rejillas y adaptación a distintos tamaños de pantalla. |
| `src/physics.js` | Cálculos y validaciones independientes de la interfaz. |
| `src/CircuitDiagram.jsx` | Diagramas SVG generados según topología y número de resistencias. |
| `src/physics.test.js` | Veinticuatro casos automatizados con `node:test`. |
| `README.md` | Resumen y comandos de esta unidad. |

El `.gitignore` de la raíz general excluye `node_modules/`, `dist/`, `.npm-cache/`, archivos de entorno y temporales. Esos directorios no forman parte de la entrega de código. La unidad utiliza el repositorio Git de la raíz y no contiene uno independiente.

## 5. Instalación y ejecución en Ubuntu

1. Abre una terminal con **Ctrl+Alt+T**.
2. Comprueba que existen Node.js y npm:

```bash
node --version
npm --version
```

El entorno del proyecto dispone de Node.js 22.22.1 y npm 9.2.0. Esta entrega compiló con Vite 8.3.5. Se necesita un Node.js compatible con la versión de Vite instalada; Node.js 22.22.1 es el entorno comprobado.

3. Entra en la unidad e instala sus dependencias locales:

```bash
cd "/home/ricardo/Documentos/Universidad/FÍSICA II/Unidad 3 - Corriente Electrica y Ley de Ohm"
npm install
```

La primera instalación requiere Internet. No instala herramientas globales y no depende de las carpetas de otras unidades.

4. Inicia el servidor:

```bash
npm run dev
```

5. Abre Firefox y escribe la dirección `Local` que aparece en la terminal, normalmente `http://localhost:5173/`. Si Vite elige otro puerto, utiliza ese. No abras `index.html` directamente desde el explorador de archivos.
6. Mantén la terminal abierta mientras utilizas la aplicación. Para detenerla pulsa **Ctrl+C** en esa terminal.

Para comprobar los cálculos y crear la versión de producción:

```bash
npm test
npm run build
```

`build` genera `dist/`. Puedes revisar esa versión localmente con:

```bash
npm run preview
```

Abre la dirección que indique este último comando. También se detiene con Ctrl+C. No publica el sitio en Internet.

## 6. Manual de usuario completo

### Abrir y orientarse

Inicia la aplicación siguiendo la sección 5. La barra superior contiene el nombre del laboratorio y un enlace al repositorio. Bajo el título aparecen cuatro opciones: **Ley de Ohm**, **Serie**, **Paralelo** y **Mixto**. El panel izquierdo contiene los parámetros; a la derecha aparecen el diagrama y los resultados. En pantallas estrechas, el panel de parámetros se coloca arriba.

Los valores de entrada se escriben en unidades SI: voltios, ohmios y amperios. Por ejemplo, introduce `1000` para 1 kΩ y `0.02` para 20 mA. No hay selectores de prefijos. Para números extremos puede usarse notación como `1e-6`. Los resultados visibles tienen hasta seis cifras significativas y muestran notación científica cuando su magnitud es menor que 0.001 o al menos un millón. Los cálculos internos usan valores sin ese redondeo de presentación.

### Ley de Ohm

1. Selecciona **Ley de Ohm**.
2. En **¿Qué deseas calcular?**, elige Corriente, Voltaje o Resistencia.
3. Introduce los otros dos datos. El campo de la incógnita es una salida automática y no se edita.
4. Lee el resultado, la fórmula, la sustitución y la interpretación bajo el diagrama.

Inicialmente se calcula I con V=12 V y R=100 Ω, obteniendo 0.12 A. Al cambiar de incógnita se usan los datos conocidos almacenados para esa modalidad: el valor anteriormente calculado no se guarda automáticamente como una entrada. Revisa los dos campos antes de interpretar un nuevo cálculo.

R debe ser positiva. Si se calcula R, la corriente no puede ser cero y la razón V/I debe producir una resistencia positiva. Se admiten V e I negativos coherentes con la referencia de polaridad. V=0 es válido al calcular corriente, y I=0 es válido al calcular voltaje con R>0.

### Serie

1. Selecciona **Serie** e introduce el voltaje de la fuente.
2. Modifica los campos de R1, R2, etc.
3. Pulsa **Agregar resistencia** para añadir una de 100 Ω. El máximo es ocho.
4. Usa **×**, con nombre accesible «Eliminar Rn», para retirar la resistencia de esa fila. No se puede eliminar la última: el circuito necesita al menos una.
5. Comprueba el diagrama y las tarjetas de R_eq, I_total y P_total.
6. Consulta la tabla para las caídas de voltaje, corrientes y potencias de cada resistencia.

Las etiquetas se numeran consecutivamente al eliminar componentes. La corriente es igual en todos y los voltajes se suman. La misma configuración se conserva al visitar otro modo.

### Paralelo

Selecciona **Paralelo**. La fuente alimenta todas las ramas. Agrega, elimina y modifica resistencias con los mismos controles. La tabla muestra un voltaje común y corrientes diferentes según cada R. La corriente total es la suma de las corrientes de rama; R_eq es menor que la resistencia más pequeña cuando hay dos o más resistencias positivas.

### Mixto

Selecciona **Mixto**. El bloque **En serie · R1** edita la resistencia fija de la estructura. El **Grupo paralelo** contiene R2, R3, etc.; sus ramas pueden agregarse y eliminarse hasta ocho. R1 no se elimina porque define el modelo mixto solicitado.

Los resultados incluyen la resistencia del grupo R_p, la total R_eq, corriente total, voltaje en R1 y voltaje en el grupo. La tabla muestra que I_total atraviesa R1 y luego se reparte entre las ramas. Las ramas comparten V_p, que generalmente es menor que el voltaje de la fuente.

### Fórmulas e interpretación

En los tres modos de circuito se muestra **Cálculo paso a paso** con fórmulas y sustituciones globales. Despliega **Ver fórmulas y sustituciones de cada resistencia** para revisar los cálculos individuales. Las potencias de resistencias positivas son no negativas, incluso si se invierte la polaridad de la fuente. El resultado P_total representa potencia suministrada por la fuente y disipada por las resistencias; no es la potencia absorbida con el signo pasivo de la propia fuente.

Con muchas resistencias, desplázate dentro del diagrama o de la lista. En móvil, el diagrama y la tabla pueden tener desplazamiento horizontal propio para conservar etiquetas legibles. No hay que arrastrar componentes: la estructura del circuito la determina el modo seleccionado.

### Restablecer y errores frecuentes

**Restablecer valores** recupera solamente los valores iniciales del simulador visible. Cambiar de modo no borra sus datos. Recargar la página recupera todos los valores iniciales porque no existe almacenamiento.

| Situación | Solución |
| --- | --- |
| Resistencia igual a cero o negativa | Introduce un valor estrictamente mayor que cero. No se modelan cortocircuitos. |
| Campo vacío o no numérico | Completa los datos conocidos y todas las resistencias. |
| R calculada con I=0 | Introduce corriente no nula. Si V=I=0, R no puede deducirse de esa relación. |
| R calculada negativa | Revisa los signos de V e I; el simulador solo admite resistencias pasivas positivas. |
| Valores fuera del rango numérico | Usa magnitudes menos extremas. No se muestra un resultado inválido. |
| No se puede agregar otra resistencia | Se alcanzaron las ocho posiciones del grupo editable. |
| No aparece la página | Comprueba que Vite siga ejecutándose y utiliza el puerto indicado. |
| No se ven todas las ramas | Desplázate dentro del área del diagrama. |

Un mensaje de error sustituye los resultados; no se conserva un cálculo anterior como si fuera válido. Los valores de los componentes aún aparecen en el esquema para poder identificar y corregir la entrada.

## 7. Fundamentos físicos

La corriente I es el flujo de carga por unidad de tiempo; la aplicación la calcula mediante la Ley de Ohm, no simula cargas individuales ni integra Q/t. El voltaje es la diferencia de potencial entre nodos. Una resistencia óhmica ideal conserva una relación lineal V=IR.

En serie existe una única trayectoria: la corriente es común y las caídas de voltaje suman el voltaje de la fuente, de acuerdo con la ley de voltajes de Kirchhoff. En paralelo todas las ramas comparten dos nodos y el voltaje es común; la suma de corrientes respeta la conservación de carga. La potencia eléctrica disipada en las resistencias coincide con la suministrada por la fuente.

El mixto se resuelve por reducción: primero se sustituye el paralelo por R_p y luego se suma R1. No se resuelve una red arbitraria mediante matrices de nodos.

## 8. Fórmulas implementadas

| Cálculo | Fórmula |
| --- | --- |
| Voltaje | V = I × R |
| Corriente | I = V / R |
| Resistencia | R = V / I, si I≠0 |
| Equivalente en serie | R_eq = Σ R_i |
| Equivalente en paralelo | R_p = (Σ 1/R_i)⁻¹ |
| Corriente total | I_total = V / R_eq |
| Caída de voltaje en serie | V_i = I_total × R_i |
| Corriente de una rama | I_i = V_grupo / R_i |
| Corriente total en paralelo | I_total = Σ I_i |
| Potencia por resistencia | P_i = V_i × I_i = I_i² × R_i |
| Potencia total | P_total = V × I_total = Σ P_i |
| Equivalente mixto | R_eq = R1 + R_p |
| Voltaje de R1 | V_R1 = I_total × R1 |
| Voltaje del grupo paralelo | V_p = I_total × R_p |
| Balance de voltaje mixto | V = V_R1 + V_p |

V, V_i y V_p se expresan en voltios (V); I e I_i en amperios (A); R, R_i y R_eq en ohmios (Ω); P y P_i en vatios (W). El subíndice identifica la resistencia. En paralelo puro, V_grupo=V de la fuente. En el mixto, V_grupo=V_p.

El código utiliza V_i×I_i para potencia, equivalente a I_i²R_i, evitando elevar la corriente al cuadrado antes de multiplicar cuando las magnitudes son extremas.

## 9. Arquitectura del software

`App` mantiene el modo seleccionado y un objeto de parámetros independiente por simulador mediante `useState`. Los campos numéricos conservan su texto durante la edición para permitir borrar y corregir valores. En cada cambio, React solicita un nuevo resultado a `calculateOhm` o `calculateCircuit`.

`physics.js` no importa React ni utiliza el navegador. Devuelve un resultado numérico válido o `{ error: mensaje }`. La interfaz presenta ese resultado en `OhmResults` o `CircuitResults`; `Derivation` compone las explicaciones de cálculo. `CircuitDiagram` recibe el mismo modo y los mismos parámetros y genera la topología SVG. Las posiciones dibujadas no se utilizan en las fórmulas físicas.

Solo se usan React y React DOM como dependencias de ejecución y Vite para desarrollo y compilación. El diseño utiliza CSS propio y fuentes del sistema: no descarga tipografías ni recursos de servicios externos durante su funcionamiento.

## 10. Algoritmos

### Validación común

Rechazar campos vacíos, espacios, texto no numérico, valores no finitos y resistencias no positivas. Comprobar que el grupo tenga entre una y ocho resistencias. Calcular y verificar que los resultados sean finitos; rechazar desbordamientos y subdesbordamientos detectados que producirían cero indebidamente con una fuente no nula. Una fuente de 0 V es válida.

### Ley de Ohm

Validar la incógnita elegida → validar únicamente los dos datos conocidos → impedir R≤0 o división por I=0 según corresponda → aplicar la fórmula → exigir R calculada positiva → devolver las tres variables con el valor resuelto.

### Serie

Sumar resistencias → I=V/R_eq → para cada componente usar la misma I y calcular V_i=IR_i y P_i=V_iI → P_total=VI → comprobar resultados.

### Paralelo

Calcular R_p → I_total=V/R_p → asignar V_i=V a cada rama → I_i=V/R_i → P_i=V_iI_i → P_total=VI_total.

Para estabilidad numérica, el código evalúa una forma algebraicamente equivalente de la suma recíproca: si R_min es la menor resistencia, R_p=R_min/Σ(R_min/R_i). Así evita desbordar innecesariamente al calcular directamente 1/R_i.

### Mixto

Reducir el grupo paralelo a R_p → R_eq=R1+R_p → I_total=V/R_eq → V_R1=I_totalR1 → V_p=I_totalR_p → calcular corrientes de rama con V_p y sus resistencias → calcular potencias individuales y total.

La lista de resultados se construye sin modificar los parámetros originales. La presentación redondea a seis cifras significativas; las verificaciones y operaciones se realizan antes del redondeo.

## 11. Pruebas y validación

### Pruebas automáticas ejecutadas

Se ejecutaron `npm test` y `node src/physics.test.js`: **24 casos aprobados, cero fallidos**. En este entorno, `npm test` agrupa el archivo en la salida del ejecutor; la ejecución directa muestra los 24 casos individuales. Las comparaciones numéricas usan tolerancia de 10⁻¹² × max(1, |valor esperado|).

| Prueba | Entrada | Esperado | Obtenido | Estado |
| --- | --- | --- | --- | --- |
| 01 · Ohm, corriente | V=12, R=100 | I=0.12 A | 0.12 A | Aprobada |
| 02 · Ohm, voltaje | I=0.12, R=100 | V=12 V | 12 V | Aprobada |
| 03 · Ohm, resistencia | V=12, I=0.12 | R=100 Ω | 100 Ω | Aprobada |
| 04 · Equivalente serie | 100 y 200 Ω | 300 Ω | 300 Ω | Aprobada |
| 05 · Equivalente paralelo | 100 y 200 Ω | 200/3 Ω | 66.666666… Ω | Aprobada |
| 06 · Equivalente mixto | R1=100, ramas 200 y 200 Ω | R_p=100, R_eq=200 Ω | 100 y 200 Ω | Aprobada |
| 07 · Corriente serie | 12 V; 100 y 200 Ω | 0.04 A | 0.04 A | Aprobada |
| 08 · Corrientes paralelo | 12 V; 100 y 200 Ω | 0.12, 0.06 y total 0.18 A | Coinciden los tres valores | Aprobada |
| 09 · Voltajes serie | 12 V; 100 y 200 Ω | 4 y 8 V | 4 y 8 V | Aprobada |
| 10 · Potencias serie | Mismo circuito | 0.16, 0.32 y total 0.48 W | Coinciden los tres valores | Aprobada |
| 11 · Resistencias inválidas | R=0 y R<0 en modos y R1 mixto | Error | Error en todos los casos | Aprobada |
| 12 · Datos inválidos | Vacío, espacio, texto, NaN, ±Infinity, null, false | Error | Error en todos los casos | Aprobada |
| 13 · Resistencia indeterminada/no positiva | I=0; V=0 con I=1; V=12 con I=−1 | Error | Error en los tres casos | Aprobada |
| 14 · Reparto mixto | 12 V; R1=100; ramas 200 y 200 Ω | I=0.06 A; V_R1=V_p=6 V; ramas 0.03 A | Coinciden todos los valores | Aprobada |
| 15 · Potencias mixto | Mismo circuito | 0.36, 0.18, 0.18; total 0.72 W | Coinciden los cuatro valores | Aprobada |
| 16 · Conservación de potencia | Ejemplos de las tres topologías | ΣP_i=VI e I_i²R_i=V_iI_i | Igualdad dentro de tolerancia | Aprobada |
| 17 · Conservación de V e I | Ejemplos de las tres topologías | Suma de caídas/corrientes coherente | Igualdad dentro de tolerancia | Aprobada |
| 18 · Fuente apagada | V=0 en los circuitos y Ohm I | I=0 y P=0 sin error | Coincide | Aprobada |
| 19 · Inversión de polaridad | V=−12 en circuitos; V=−12, I=−0.12 en Ohm R | I<0, P>0; R=100 Ω | Coincide | Aprobada |
| 20 · Cantidad de resistencias | 1, 8, 0 y 9 en grupo editable | Aceptar 1 y 8; rechazar 0 y 9 | Coincide en tres topologías | Aprobada |
| 21 · Rango numérico | Razones/sumas extremas y resistencia 5×10⁻³²⁴ | Mensaje de error | Error en todos los casos probados | Aprobada |
| 22 · Incógnita no validada como entrada | Vaciar I al calcular I y R al calcular R | 0.12 A y 100 Ω | Ambos valores correctos | Aprobada |
| 23 · Presentación segura | NaN, Infinity, cero y magnitudes extremas | Guion para inválidos; cero y notación científica | Coincide | Aprobada |
| 24 · Actualización sin mutación | Serie 100+100; cambiar a 200+100 Ω | 200 y 300 Ω; entrada original intacta | Coincide | Aprobada |

### Verificaciones técnicas y de interacción

- `npm run build`: compilación correcta con Vite 8.3.5, sin advertencias de tamaño en la ejecución inicial.
- `npm run dev`: servidor local iniciado y página abierta en el navegador integrado de Codex.
- Se comprobó la selección de incógnitas, el ejemplo de voltaje de Ohm y el mensaje al calcular R con I=0.
- En serie se cambió R1 a 300 Ω con R2=200 Ω y V=12 V: la interfaz mostró R_eq=500 Ω, I=0.024 A y P=0.288 W; el SVG mostró el nuevo valor.
- Se comprobaron resistencia cero, restablecimiento, límite de ocho componentes y eliminación de uno de ellos.
- Se comprobaron las tablas de paralelo y mixto con sus valores iniciales y el despliegue de fórmulas individuales.
- Se comprobó la adaptación de la página en tamaños de laptop (1366×900) y móvil (390×844). Se detectó un desbordamiento de la rejilla en móvil y se corrigió; la medición posterior no mostró desbordamiento horizontal de la página. El diagrama y la tabla conservan su desplazamiento interno cuando lo requieren.
- No se registraron errores de navegador en las consultas de consola realizadas.

Estas comprobaciones de interacción se distinguen de las 24 pruebas físicas automatizadas. No se generaron capturas ni archivos multimedia. Está pendiente una comprobación específica en Firefox y una revisión visual detallada en el equipo de entrega; no se afirma haberlas ejecutado.

## 12. Ejemplos prácticos verificables

### A. Ley de Ohm

Con V=12 V y R=100 Ω: I=12/100=0.12 A. Para comprobar las otras dos opciones, utiliza I=0.12 A y R=100 Ω al calcular V, o V=12 V e I=0.12 A al calcular R.

### B. Serie

Fuente 12 V, R1=100 Ω y R2=200 Ω:

```text
R_eq = 100 + 200 = 300 Ω
I = 12 / 300 = 0.04 A
V1 = 0.04 × 100 = 4 V
V2 = 0.04 × 200 = 8 V
P1 = 0.04² × 100 = 0.16 W
P2 = 0.04² × 200 = 0.32 W
P_total = 12 × 0.04 = 0.48 W = 0.16 + 0.32 W
```

### C. Paralelo

Fuente 12 V, ramas de 100 y 200 Ω:

```text
R_eq = (1/100 + 1/200)⁻¹ = 66.666666… Ω
I1 = 12/100 = 0.12 A
I2 = 12/200 = 0.06 A
I_total = 0.18 A
V1 = V2 = 12 V
P1 = 12 × 0.12 = 1.44 W
P2 = 12 × 0.06 = 0.72 W
P_total = 12 × 0.18 = 2.16 W
```

### D. Mixto

Fuente 12 V, R1=100 Ω en serie con ramas R2=200 Ω y R3=200 Ω:

```text
R_p = (1/200 + 1/200)⁻¹ = 100 Ω
R_eq = 100 + 100 = 200 Ω
I_total = 12/200 = 0.06 A
V_R1 = 0.06 × 100 = 6 V
V_p = 0.06 × 100 = 6 V
I2 = I3 = 6/200 = 0.03 A
P1 = 6 × 0.06 = 0.36 W
P2 = P3 = 6 × 0.03 = 0.18 W
P_total = 12 × 0.06 = 0.72 W
```

Los cuatro casos corresponden a los valores iniciales. No es necesario reconstruirlos manualmente: selecciona el modo y pulsa Restablecer valores.

## 13. Limitaciones

- Solo corriente continua en régimen estacionario y resistencias óhmicas constantes.
- Fuente de voltaje ideal y cables de resistencia cero. No hay resistencia interna de fuente, tolerancias, calentamiento ni variación de resistencia con temperatura.
- Resistencias estrictamente positivas: no se simulan cortocircuitos, circuitos abiertos de resistencia infinita ni componentes activos.
- Estructuras definidas; el mixto solo admite R1 en serie con un grupo paralelo. No hay editor libre ni redes arbitrarias.
- Hasta ocho resistencias en el grupo editable. En mixto se suma la R1 fija.
- Diagramas sin escala y sin animación de electrones. Se utilizan áreas desplazables para muchos componentes o pantallas estrechas.
- Precisión finita de JavaScript y redondeo de presentación. Magnitudes extremas pueden rechazarse; los valores redondeados de una tabla pueden sumar con una pequeña diferencia respecto al total mostrado.
- No hay guardado de datos, exportaciones ni integración entre unidades.
- Verificación específica en Firefox pendiente. No se identificaron fallos de cálculo en las pruebas ejecutadas.

## 14. Guía textual para video demostrativo

Guion propuesto de unos siete minutos; no se genera un video:

1. **0:00–0:45:** presentar universidad, curso, estudiante y objetivo.
2. **0:45–2:00:** resolver I=12/100=0.12 A y mostrar las otras incógnitas. Mostrar el error de I=0 al calcular R.
3. **2:00–3:15:** circuito serie inicial, sus 4 y 8 V y la misma corriente de 0.04 A. Cambiar una resistencia y restablecer.
4. **3:15–4:30:** paralelo inicial, 12 V por rama y corrientes de 0.12 y 0.06 A. Agregar y eliminar una rama.
5. **4:30–6:00:** mixto inicial, reducción del paralelo a 100 Ω y total a 200 Ω. Explicar los 6 V en R1 y en el grupo.
6. **6:00–7:00:** desplegar fórmulas, mencionar las 24 pruebas, conservación de potencia y las simplificaciones del modelo. Indicar el repositorio.

## 15. Guía para presentación

Temas sugeridos, sin generar diapositivas:

1. Portada: proyecto, Unidad III, UPeU y estudiante.
2. Objetivo y problema: relacionar V, I, R y potencia.
3. Tecnologías y separación de cálculos e interfaz.
4. Ley de Ohm: selección de incógnita y ejemplo.
5. Serie y paralelo: contraste del reparto de corriente y voltaje.
6. Mixto: reducción del grupo y ejemplo de 12 V.
7. Pruebas realizadas, conservación de potencia y validación.
8. Limitaciones, conclusiones y acceso al código.

## 16. Información de GitHub

Repositorio existente público: https://github.com/kakatsumi/Fisica-II-Simuladores.

Ubicación de la aplicación: `Unidad 3 - Corriente Electrica y Ley de Ohm/`. El README principal incluye el estado y enlace a esta guía. La entrega de esta unidad añade sus archivos y actualiza esos README; no modifica los simuladores de las unidades I y II ni desarrolla la Unidad IV.

Para obtener el código usa **Code → Download ZIP** en el repositorio y extrae el archivo, o ejecuta:

```bash
git clone https://github.com/kakatsumi/Fisica-II-Simuladores.git
cd "Fisica-II-Simuladores/Unidad 3 - Corriente Electrica y Ley de Ohm"
npm install
npm run dev
```

Conserva `src/`, `index.html`, `package.json` y `package-lock.json` para instalar y ejecutar. Las dependencias se reconstruyen con `npm install`; `dist/` se reconstruye con `npm run build`. No se incluyen dependencias, archivos generados, caché ni credenciales en el commit.
