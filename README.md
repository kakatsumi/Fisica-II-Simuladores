# Simuladores Interactivos de Física II

Universidad Peruana Unión (UPeU) · Física II  
Desarrollador: Pedro Ricardo Alva Pardave · GitHub: [kakatsumi](https://github.com/kakatsumi)

Cuatro aplicaciones independientes para explorar los temas del curso con React, Vite, JavaScript, CSS y representaciones gráficas.

| Unidad | Tema | Estado |
| --- | --- | --- |
| 1 | Electricidad, Campo Eléctrico y Potencial Eléctrico | Implementada; revisión específica en Firefox pendiente |
| 2 | Capacitores y Dieléctricos | Implementada; verificación visual pendiente |
| 3 | Corriente Eléctrica y Ley de Ohm | Implementada; 24 pruebas automáticas aprobadas |
| 4 | Fuerza y Campo Magnético | Pendiente |

Las carpetas de las unidades pendientes contienen únicamente una nota de estado; sus aplicaciones se desarrollarán por separado.

## Ejecutar la Unidad 1

Incluye hasta 10 cargas editables, cuatro ejemplos, campo y potencial por superposición, vista Canvas 2D, vista Three.js 3D, equipotenciales y trayectoria de una partícula con RK4. No utiliza backend ni base de datos.

Desde la carpeta del repositorio, con Node.js 22.22.1 o un entorno compatible con Vite:

```bash
cd "Unidad 1 - Electricidad y Campo Electrico"
npm install
npm run dev
```

Abre la dirección indicada por Vite. Pruebas: `npm test`. Compilación: `npm run build`. La vista 3D requiere WebGL2 y aceleración gráfica.

[Guía de la Unidad 1](Unidad%201%20-%20Electricidad%20y%20Campo%20Electrico/GUIA_DEL_PROYECTO.md).

La carpeta anterior `Unidad 1 - Electricidad Campo Electrico y Potencial Electrico` conserva una nota que enlaza a esta aplicación; no contiene un segundo simulador.

## Ejecutar la Unidad 2

Requiere Node.js compatible con Vite (el proyecto se comprobó con Node.js 22.22.1) y npm.

```bash
git clone https://github.com/kakatsumi/Fisica-II-Simuladores.git
cd "Fisica-II-Simuladores/Unidad 2 - Capacitores y Dielectricos"
npm install
npm run dev
```

Abre en el navegador la dirección indicada por Vite. Detén el servidor con Ctrl+C.

Pruebas: `npm test`. Compilación: `npm run build`.

[Guía de la Unidad 2](Unidad%202%20-%20Capacitores%20y%20Dielectricos/GUIA_DEL_PROYECTO.md).

## Ejecutar la Unidad 3

Incluye Ley de Ohm con selección de incógnita, circuitos en serie, paralelo y mixtos (R1 en serie con un grupo paralelo). Ofrece diagramas SVG, resultados por resistencia, fórmulas y sustituciones. Utiliza React, Vite, JavaScript y CSS, sin backend ni servicios externos durante su ejecución.

Desde la carpeta del repositorio:

```bash
cd "Unidad 3 - Corriente Electrica y Ley de Ohm"
npm install
npm run dev
```

Abre la dirección indicada por Vite. Pruebas: `npm test`. Compilación: `npm run build`. Se comprobaron los controles y la adaptación a laptop y móvil en el navegador integrado; la revisión específica en Firefox está pendiente.

[Guía de la Unidad 3](Unidad%203%20-%20Corriente%20Electrica%20y%20Ley%20de%20Ohm/GUIA_DEL_PROYECTO.md).

Repositorio público: [Fisica-II-Simuladores](https://github.com/kakatsumi/Fisica-II-Simuladores). Cualquier persona puede consultar y descargar el código.
