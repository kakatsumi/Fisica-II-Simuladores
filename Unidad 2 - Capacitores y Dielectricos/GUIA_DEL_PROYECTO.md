# Guía del proyecto — Unidad 2: Capacitores y dieléctricos

## 1. Información general

- **Proyecto:** Simuladores Interactivos de Física II.
- **Curso:** Física II.
- **Universidad:** Universidad Peruana Unión (UPeU).
- **Desarrollador:** Pedro Ricardo Alva Pardave.
- **Usuario GitHub indicado:** kakatsumi.
- **Repositorio público:** https://github.com/kakatsumi/Fisica-II-Simuladores.
- **Tecnologías:** React, Vite, JavaScript, CSS y SVG.

El objetivo es explorar la capacitancia de un capacitor ideal de placas paralelas y su energía almacenada mediante parámetros editables y resultados inmediatos en unidades del Sistema Internacional.

La aplicación implementa área, separación, material dieléctrico, constante dieléctrica manual, voltaje, representación SVG, fórmulas con sustitución de valores, validación y restablecimiento. Cumple los requisitos funcionales solicitados para la Unidad 2; falta verificar visualmente la interfaz y sus interacciones en un navegador. No tiene backend, base de datos ni funciones para guardar datos.

**Estado del proyecto:** la Unidad 2 está implementada. Las unidades 1, 3 y 4 tienen carpetas con una nota de estado pendiente; todavía no contienen aplicaciones. Se creó el repositorio público `kakatsumi/Fisica-II-Simuladores` y se configuró Git en la raíz con el remoto `origin`. La entrega inicial incluye el código de la Unidad 2 y las carpetas de las unidades pendientes.

## 2. Estructura del proyecto

```text
FÍSICA II/
├── AGENTS.md
└── Unidad 2 - Capacitores y Dielectricos/
    ├── .gitignore
    ├── GUIA_DEL_PROYECTO.md
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── main.jsx
        ├── style.css
        ├── physics.js
        └── physics.test.js
```

| Archivo | Función |
| --- | --- |
| `AGENTS.md` | Reglas generales del proyecto universitario. |
| `index.html` | Página inicial, idioma español y elemento donde se monta React. |
| `package.json` | Dependencias y comandos de desarrollo, compilación y pruebas. |
| `package-lock.json` | Versiones resueltas de las dependencias para reproducir la instalación. |
| `src/main.jsx` | Componente `App`, controles, estado, resultados y dibujo SVG. |
| `src/style.css` | Diseño verde y distribución adaptable al ancho de pantalla. |
| `src/physics.js` | Constante ε₀, materiales, valores iniciales y función `calculate`. |
| `src/physics.test.js` | Ocho pruebas automáticas de cálculos y validaciones. |
| `.gitignore` | Excluye dependencias, compilación y caché local de npm. |

La carpeta `dist/` se genera al compilar; no es código fuente.

## 3. Instalación y ejecución en Ubuntu

1. Abre una terminal con **Ctrl+Alt+T**.
2. Entra en la carpeta de la aplicación. Las comillas son necesarias por los espacios:

```bash
cd "/home/ricardo/Documentos/Universidad/FÍSICA II/Unidad 2 - Capacitores y Dielectricos"
```

3. Comprueba las herramientas locales:

```bash
node --version
npm --version
```

Durante la comprobación inicial se encontraron Node.js `v22.22.1` y npm `9.2.0`. La aplicación compiló con ese entorno. La primera instalación requiere conexión a Internet para descargar dependencias.

4. Instala las dependencias del proyecto, sin herramientas globales:

```bash
npm install
```

5. Inicia el servidor:

```bash
npm run dev
```

6. Abre Firefox y escribe la dirección `Local` que imprime la terminal, normalmente `http://localhost:5173/`. Si el puerto está ocupado, utiliza el que indique Vite. Mantén la terminal abierta mientras usas la aplicación. No abras `index.html` directamente desde el explorador de archivos.
7. Para detener el servidor, vuelve a la terminal y pulsa **Ctrl+C**.

Para generar la versión de producción:

```bash
npm run build
```

Los archivos resultantes quedan en `dist/`. Para revisarlos localmente:

```bash
npm run preview
```

Abre en Firefox la dirección que imprima este comando. `preview` es una revisión local de la compilación; no publica la aplicación en Internet. También se detiene con **Ctrl+C**.

## 4. Uso de la aplicación

La pantalla contiene el título de la unidad, el panel de parámetros, el capacitor y el panel de resultados. Todos los parámetros se editan con campos numéricos o con el selector de material; no hay que pulsar un botón de calcular.

| Control | Uso y valores permitidos | Efecto |
| --- | --- | --- |
| Área A | Área de una placa en m², mayor que cero. | Aumentar A aumenta C y, a voltaje fijo, U. El dibujo se ensancha. |
| Distancia d | Separación entre placas en m, mayor que cero. | Aumentar d reduce C y U. El dibujo aumenta la separación. |
| Material | Vacío, aire, vidrio o personalizado. | Los materiales predeterminados actualizan εr. Elegir personalizado conserva su valor actual. |
| Constante εr | Número adimensional mayor o igual que 1. | Editarlo manualmente selecciona material personalizado. Aumentarlo aumenta C y U. |
| Voltaje V | Número finito en voltios; admite cero y valores negativos. | Modifica U según V²; no cambia C. |
| Restablecer valores | Botón bajo los controles. | Recupera todos los valores iniciales. |

Los materiales usan εr = 1 para vacío, 1.0006 para aire y 5 para vidrio. El vidrio muestra una nota: su valor es representativo y depende de la composición.

Los resultados muestran capacitancia en F, energía en J, fórmulas y sustituciones. Por ejemplo, `8.854188 × 10^-11 F` significa `0.00000000008854188 F`. Los resultados visibles se redondean a siete cifras significativas; el cálculo interno utiliza la precisión de JavaScript.

El SVG identifica A, d y εr. Una trama representa el espacio dieléctrico cuando εr es mayor que 1. Las dimensiones están acotadas para mantener el dibujo legible y no representan una escala física real.

### Ejemplo práctico

1. Pulsa **Restablecer valores**: A = 0.01 m², d = 0.001 m, vacío, εr = 1 y V = 12 V.
2. Comprueba C ≈ 8.854188 × 10⁻¹¹ F y U ≈ 6.375015 × 10⁻⁹ J.
3. Cambia A a 0.02 m²: C y U se duplican.
4. Restablece y cambia d a 0.002 m: C y U se reducen a la mitad.
5. Restablece y selecciona vidrio: C y U se multiplican por 5.
6. Restablece y cambia V a 24 V: C se mantiene y U se multiplica por 4.
7. Introduce d = 0: el panel de resultados muestra un error. Corrige d a 0.001 para recuperar los resultados.

Una entrada inválida sustituye los resultados por un mensaje de error; no se acepta para calcular. Al borrar un campo ocurre lo mismo hasta completarlo con un valor válido.

## 5. Fundamentos físicos

### Capacitancia de placas paralelas

```text
C = ε₀ × εr × A / d
```

| Símbolo | Significado | Unidad |
| --- | --- | --- |
| C | Capacitancia | Faradio (F) |
| ε₀ | Permitividad del vacío: 8.8541878128 × 10⁻¹² | F/m |
| εr | Permitividad relativa del dieléctrico | Adimensional |
| A | Área de una placa | m² |
| d | Separación entre placas | m |

Con los valores iniciales:

```text
C = (8.8541878128 × 10⁻¹² F/m) × 1 × (0.01 m²) / (0.001 m)
C = 8.8541878128 × 10⁻¹¹ F
```

### Energía almacenada

```text
U = ½ × C × V²
```

U es energía en julios (J), C es la capacitancia anterior en faradios y V es el voltaje en voltios (V). El simulador usa el mismo valor interno de C para este cálculo.

```text
U = ½ × (8.8541878128 × 10⁻¹¹ F) × (12 V)²
U = 6.375015225216 × 10⁻⁹ J
```

La energía crece con la magnitud del voltaje: 12 V y −12 V producen la misma energía, y 0 V produce 0 J. No se implementaron otras fórmulas físicas.

## 6. Arquitectura del software

La aplicación funciona en el navegador. React mantiene los parámetros en el estado del componente `App` mediante `useState`; inicialmente son cadenas de texto para permitir la edición y el vaciado temporal de los campos.

Cada cambio actualiza ese estado. React vuelve a ejecutar el componente, llama a `calculate(params)` y actualiza los resultados y los atributos del SVG. Los campos conservan lo escrito por el usuario; `calculate` convierte sus valores a números después de comprobarlos.

`physics.js` separa los cálculos de la interfaz. `main.jsx` presenta los controles y el resultado válido o el error. CSS organiza los paneles en columnas en pantallas amplias y en una columna en pantallas estrechas. Vite sirve el proyecto durante el desarrollo y genera los archivos de producción. Las únicas dependencias directas son React, React DOM y Vite.

## 7. Algoritmos utilizados

### Validación y cálculo

```text
Recibir área, distancia, constante dieléctrica y voltaje.
Si algún campo está vacío o no representa un número finito:
    devolver un mensaje de error.
Convertir las entradas a números.
Si área ≤ 0, distancia ≤ 0 o εr < 1:
    devolver el error correspondiente.
Calcular C = ε₀ × εr × área / distancia.
Calcular U = 0.5 × C × voltaje × voltaje.
Si C o U no son finitos, C ≤ 0 o U ≤ 0 con voltaje distinto de cero:
    devolver un error de rango numérico.
Devolver C y U.
```

La última comprobación detecta desbordamientos y algunos valores extremadamente pequeños que se redondean a cero. La energía cero se permite cuando el voltaje es cero.

### Actualización visual

El ancho del dibujo crece mediante una función acotada de √A, coherente con representar placas cuadradas. La separación usa otra función acotada de d. Estas transformaciones sirven exclusivamente para dibujar; no intervienen en las fórmulas físicas. Ante un error se usan dimensiones esquemáticas de respaldo y se muestra un guion para εr.

Seleccionar un material predeterminado asigna su εr. Editar εr asigna el material personalizado. Restablecer copia nuevamente los valores de `DEFAULTS` al estado.

## 8. Pruebas y validación

Se volvieron a ejecutar las pruebas el 14 de octubre de 2026 con:

```bash
node src/physics.test.js
npm run build
```

Resultado: **8 pruebas aprobadas, 0 fallidas**, y compilación correcta con Vite 8.3.4. Para ejecutar habitualmente las pruebas se dispone de `npm test`. El comando directo de Node permitió ver individualmente los ocho casos en este entorno.

En la tabla, los valores no indicados conservan el caso inicial A = 0.01 m², d = 0.001 m, εr = 1 y V = 12 V.

| Prueba | Entrada | Resultado esperado | Comprobación obtenida |
| --- | --- | --- | --- |
| Área | A = 0.02 m² | C mayor que en el caso inicial. | Aprobada. |
| Separación | d = 0.002 m | C menor que en el caso inicial. | Aprobada. |
| Dieléctrico | εr = 5 | C mayor que en el caso inicial. | Aprobada. |
| Voltaje | V = 24 V | U exactamente cuatro veces la energía inicial en el cálculo probado. | Aprobada. |
| Cálculo manual | Valores iniciales | C = 8.8541878128 × 10⁻¹¹ F y U = 6.375015225216 × 10⁻⁹ J. | Aprobada con tolerancia relativa menor que 10⁻¹². |
| Entradas inválidas | A y d: 0, −1; εr: 0, 0.99; V: vacío, Infinity, NaN. | Devolver error. | Todos los casos aprobados. |
| Rango numérico | A = εr = 10³⁰⁸; y, por separado, A = 5 × 10⁻³²⁴. | Devolver error. | Ambos casos aprobados. |
| Voltaje cero o negativo | V = 0; V = −12 V. | U = 0; U igual a la del caso de 12 V. | Ambos casos aprobados. |

Las cifras de los ejemplos anteriores son cálculos manuales de referencia; las pruebas de área, separación y dieléctrico verifican la dirección del cambio, no una igualdad numérica específica.

Durante el desarrollo también se comprobó el arranque de `npm run dev` y una respuesta HTTP 200 para la página. El entorno restringido bloqueó inicialmente la descarga de dependencias y el puerto local; esas comprobaciones se completaron con autorización. No fueron errores del cálculo físico.

**Verificación pendiente:** no se ejecutaron pruebas de interacción ni inspección visual en navegador. Para revisarlas manualmente, sigue el ejemplo práctico y comprueba el botón de restablecimiento, los mensajes de error y la disposición en distintos anchos de ventana.

## 9. Limitaciones

- Modelo ideal: ignora efectos de borde y supone dieléctrico uniforme que llena el espacio entre placas.
- No calcula ruptura dieléctrica ni dependencia de εr con frecuencia, temperatura o voltaje.
- εr = 5 para vidrio es un valor representativo, no universal.
- La visualización es esquemática y no cambia con el voltaje.
- Los números extremadamente grandes o pequeños pueden quedar fuera del rango de JavaScript; el programa rechaza los casos detectados.
- Los resultados visibles están redondeados. Para contrastarlos con cálculos manuales se debe considerar ese redondeo.
- No se han identificado fallos en las pruebas físicas y la compilación; las interacciones del navegador siguen pendientes de verificación.
- Las otras tres unidades no están implementadas en la estructura inspeccionada.

La mejora inmediata es completar la comprobación manual en navegador. No se agregaron funcionalidades adicionales.

## 10. Código fuente y entrega en GitHub

Usuario indicado: https://github.com/kakatsumi.

Repositorio público: https://github.com/kakatsumi/Fisica-II-Simuladores.

El repositorio es público a petición del usuario. Se utiliza un único repositorio Git en la raíz para las cuatro unidades. Cualquier persona puede ver y descargar el código.

El código se puede utilizar actualmente desde la carpeta local siguiendo la sección 3. Para conservar o entregar la Unidad 2 son necesarios `src/`, `index.html`, `package.json` y `package-lock.json`; también conviene conservar `.gitignore` y esta guía. La instalación reconstruye las dependencias y la compilación reconstruye `dist/`.

El `.gitignore` de la unidad excluye `node_modules/`, `dist/` y `.npm-cache/`. El `.gitignore` general también excluye archivos `.env`, registros, temporales, carpetas locales del entorno y nombres comunes de archivos de credenciales. Permite ejemplos `.env.example`. Nunca se deben incorporar credenciales al código fuente.

Puedes descargar el código desde GitHub mediante **Code → Download ZIP**, extraerlo y entrar en la carpeta de la Unidad 2. Como alternativa:

```bash
git clone https://github.com/kakatsumi/Fisica-II-Simuladores.git
cd "Fisica-II-Simuladores/Unidad 2 - Capacitores y Dielectricos"
npm install
npm run dev
```

Después de ejecutar `npm run dev`, abre la dirección local que indique Vite. Las unidades pendientes no tienen comandos de ejecución todavía.
