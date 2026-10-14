# Guía del proyecto — Unidad 1: Electricidad y campo eléctrico

## 1. Información general

- **Proyecto:** Simuladores Interactivos de Física II.
- **Universidad:** Universidad Peruana Unión (UPeU).
- **Curso:** Física II.
- **Desarrollador:** Pedro Ricardo Alva Pardave.
- **GitHub:** https://github.com/kakatsumi.
- **Repositorio público:** https://github.com/kakatsumi/Fisica-II-Simuladores.
- **Carpeta:** `/home/ricardo/Documentos/Universidad/FÍSICA II/Unidad 1 - Electricidad y Campo Electrico/`.
- **Tecnologías:** React, React DOM, Vite, JavaScript, CSS, Canvas 2D y Three.js para la vista 3D.

La aplicación es independiente de la Unidad 2. Funciona localmente y no tiene backend, base de datos, cuentas, exportaciones ni almacenamiento de simulaciones. Tras instalar las dependencias no necesita Internet para ejecutarse.

## 2. Objetivos

Explorar cargas puntuales, su campo eléctrico, el potencial con referencia cero en el infinito y las equipotenciales. Observar el movimiento de una partícula de prueba sometida al campo de las cargas existentes. Relacionar las representaciones con fórmulas y resultados en unidades SI.

## 3. Funcionalidades implementadas

- Agregar hasta 10 cargas, eliminarlas y editar carga con signo y coordenadas X, Y y Z.
- Cuatro ejemplos: una carga positiva, una negativa, dipolo y dos positivas.
- Cargas ingresadas en nC y convertidas internamente a C.
- Campo total, Ex, Ey, Ez, magnitud y dirección unitaria en un punto configurable.
- Potencial total y aportes individuales con fórmulas y sustitución numérica.
- Canvas 2D del plano z = 0 con vectores, líneas cuando las fuentes son coplanares, curvas equipotenciales y selección del punto mediante clic.
- Vista Three.js con posiciones reales, vectores 3D, isosuperficies y cámara orbital con giro, zoom y desplazamiento.
- Trayectoria 3D calculada con RK4, dibujada también como proyección en 2D; controles de iniciar/continuar, pausar y reiniciar.
- Validación, mensajes de singularidad y paradas numéricas de seguridad.

## 4. Estructura del proyecto

```text
Unidad 1 - Electricidad y Campo Electrico/
├── index.html
├── package.json
├── package-lock.json
├── GUIA_DEL_PROYECTO.md
└── src/
    ├── main.jsx
    ├── style.css
    ├── physics.js
    ├── contours.js
    ├── trajectory.js
    ├── View2D.jsx
    ├── View3D.jsx
    └── physics.test.js
```

`main.jsx` contiene el componente App, los controles y el estado. `physics.js` evalúa campo, potencial y aportes; define constantes, ejemplos y validaciones. `contours.js` calcula curvas, superficies y líneas 2D. `trajectory.js` integra el movimiento. Las vistas dibujan los resultados; CSS organiza la interfaz azul y adaptable. `physics.test.js` reúne las pruebas automatizadas. `package-lock.json` conserva las versiones instaladas.

El repositorio Git se encuentra únicamente en la raíz general. Su `.gitignore` excluye dependencias, compilación, caché, archivos de entorno y temporales. `dist/` se genera al compilar. La carpeta inicial con el nombre `Unidad 1 - Electricidad Campo Electrico y Potencial Electrico` conserva un README que dirige a la aplicación actual; no contiene otra aplicación.

## 5. Instalación y ejecución en Ubuntu

Abre la terminal con Ctrl+Alt+T:

```bash
cd "/home/ricardo/Documentos/Universidad/FÍSICA II/Unidad 1 - Electricidad y Campo Electrico"
npm install
npm run dev
```

Se comprobó el proyecto con Node.js 22.22.1 y npm 9.2.0. La instalación inicial requiere Internet y solo instala dependencias locales. Abre Firefox y escribe la dirección `Local` que imprima Vite, normalmente `http://localhost:5173/`. Si el puerto está ocupado, utiliza el indicado por la terminal. No abras `index.html` directamente. Mantén la terminal abierta y pulsa Ctrl+C para detener el servidor.

```bash
npm test
npm run build
npm run preview
```

El primer comando ejecuta las pruebas, el segundo genera `dist/` y el tercero sirve esa compilación localmente. Abre la dirección que indique `preview` y detén también ese servidor con Ctrl+C. Ninguno de esos comandos publica la aplicación en Internet. La vista 3D necesita WebGL2 y aceleración gráfica; la vista 2D utiliza Canvas.

## 6. Manual de usuario

### Cargas

La configuración inicial es un dipolo: +5 nC en (−0.6, 0, 0) m y −5 nC en (0.6, 0, 0) m. Utiliza el selector para cambiar de ejemplo. Cada carga tiene identificador, valor con signo y tres coordenadas. Rojo representa carga positiva, azul negativa y gris nula. El signo forma parte del número: escribe `-3` para −3 nC.

**Agregar carga** crea una carga de +5 nC en el origen con un identificador nuevo. Se desactiva al llegar a 10. **Eliminar** retira la carga correspondiente. **Restablecer cargas** vuelve al dipolo. Es válido eliminar todas las cargas; en ese caso campo y potencial son cero. Editar una fuente detiene y reinicia la trayectoria.

Rangos: carga de −1000 a 1000 nC y cada coordenada de −2 a 2 m. Un campo vacío o inválido produce un mensaje y suspende los cálculos hasta corregirlo.

### Vista 2D

Selecciona **2D**. Los ejes muestran metros y el dominio visible es de −2 a 2 m. Activa u oculta **Líneas 2D**, **Vectores** y **Equipotenciales**. Haz clic dentro del dominio para cambiar el punto de las calculadoras a ese X, Y y z = 0.

El campo y el potencial se evalúan en el plano z = 0. Las cargas con Z distinta de cero aparecen proyectadas y etiquetadas con su Z; no están físicamente sobre ese plano. Por eso las líneas de campo solo se dibujan si todas las cargas están en z = 0. Para fuentes fuera del plano, los vectores muestran las componentes Ex y Ey del campo 3D calculado.

### Vista 3D

Selecciona **3D**. Arrastra con el botón izquierdo para girar la cámara, usa la rueda para acercar o alejar y el botón derecho para desplazar. Las cargas son esferas situadas en sus coordenadas reales. Ejes X rojo, Y verde y Z azul. Los colores de las cargas mantienen el significado del panel.

**Vectores** muestra flechas 3D orientadas según el campo calculado. No se implementan líneas de campo 3D: se utiliza la alternativa de vectores solicitada. Las longitudes de las flechas están acotadas para facilitar su lectura y no constituyen una escala lineal del módulo.

**Restablecer vista** vuelve a 2D, activa líneas y vectores, desactiva equipotenciales y recupera el nivel de 20 V. Al regresar a 3D la cámara usa su posición inicial. Cambiar cargas o parámetros de la vista también reconstruye la escena 3D.

### Equipotenciales

Activa **Equipotenciales** e introduce un nivel positivo |V|. Se extraen tres niveles: −|V|, 0 y +|V|. Rojo representa potencial positivo, azul negativo y gris cero. El nivel debe ser mayor que cero y como máximo 10 000 V.

En 2D aparecen curvas del potencial real en z = 0; en 3D aparecen superficies trianguladas semitransparentes. Si un nivel no cruza el dominio, su curva o superficie no aparece. Con una sola carga positiva no existen niveles negativos o cero finitos. Si no hay cargas, todo el espacio tiene potencial cero y no se dibuja una frontera equipotencial particular.

### Calculadoras

Introduce X, Y y Z del punto de evaluación; cada componente se limita a ±10 m. Las calculadoras se actualizan inmediatamente y muestran Ex, Ey, Ez y |E| en N/C, dirección unitaria sin unidades y V en voltios. Cuando el campo es nulo dentro de una tolerancia de 10⁻¹² N/C, su dirección se indica como indefinida.

Despliega **Aportes y sustitución numérica por carga** para ver cada qi en nC y C, Δr, distancia, campo y potencial individual. El potencial total es la suma de los aportes con sus signos. Los valores se presentan con seis cifras significativas en notación científica. Una carga nula tiene aporte cero y se trata sin dividir entre su distancia.

Si el punto coincide con una carga no nula o está a menos de 10⁻⁸ m, no se presenta un resultado finito: aparece un mensaje sobre el modelo puntual. El programa no suaviza la fórmula de Coulomb.

### Partícula

Configura carga en nC, masa en kg, posición inicial en m, velocidad inicial por eje en m/s y tiempo físico en s. **Iniciar / continuar** empieza o reanuda; **Pausar** conserva el estado; **Reiniciar** devuelve la partícula a la posición y velocidad iniciales actuales y borra el recorrido. Modificar un parámetro de la partícula también prepara una trayectoria nueva.

La línea ocre muestra el recorrido y la flecha su dirección de velocidad. Los resultados incluyen tiempo, posición, velocidad y rapidez. La vista 3D dibuja su trayectoria real; 2D representa su proyección XY.

Rangos: q entre −100 y 100 nC; masa entre 10⁻¹² y 1 kg; posición inicial entre ±2 m; cada velocidad inicial entre ±10 m/s; tiempo mayor que cero y hasta 10 s. Los valores iniciales son q = 0.1 nC, m = 10⁻⁸ kg, posición (0, 0.8, 0) m, velocidad cero y duración 2 s. El tiempo de la animación no equivale necesariamente al tiempo físico.

### Ejemplo verificable

1. Selecciona una carga positiva de +5 nC en el origen.
2. Evalúa (2, 0, 0) m: Ex = 11.234439740375 N/C, Ey = Ez = 0 y V = 22.46887948075 V, antes del redondeo de pantalla.
3. Selecciona la carga negativa: Ex y V cambian de signo y la dirección es (−1, 0, 0).
4. Restablece el dipolo y evalúa (0, 0, 0): V = 0 pero Ex ≈ 249.654216453 N/C. Potencial cero no implica campo cero.
5. Para observar equipotenciales cerradas, selecciona una carga positiva y usa nivel 45 V: el radio teórico es aproximadamente 0.998617 m.
6. Con esa carga positiva, usa los parámetros iniciales de partícula y tiempo 0.1 s: la partícula comienza a alejarse en +Y.

## 7. Fundamentos físicos

Las fuentes son cargas puntuales fijas en el vacío. Los aportes de campo son vectores y se suman por componentes; los de potencial son escalares y se suman con signo. Las líneas tangentes al campo salen de cargas positivas y entran en negativas. Una equipotencial corresponde a un valor constante de V.

La partícula es de prueba: responde al campo de las fuentes, pero no modifica sus posiciones ni su campo. Su movimiento es clásico y no incluye magnetismo, radiación, choques físicos ni efectos relativistas.

## 8. Fórmulas utilizadas

```text
k = 8.9875517923 × 10⁹ N·m²/C²
qi(C) = qi(nC) × 10⁻⁹
Δri = r − ri
Ri = |Δri|
E(r) = k Σ [qi Δri / Ri³]                  (N/C)
|E| = √(Ex² + Ey² + Ez²)                   (N/C)
dirección = E / |E|                        (adimensional, si E ≠ 0)
V(r) = k Σ [qi / Ri]                       (V)
F = qE                                    (N)
a = qE / m                                (m/s²)
dr/dt = v                                 (m/s)
dv/dt = a                                 (m/s²)
```

r y ri son posiciones en m; qi y q son cargas en C; m es masa en kg. En el ejemplo de +5 nC a 2 m: E = k × 5 × 10⁻⁹ / 2² y V = k × 5 × 10⁻⁹ / 2. La referencia de potencial es cero en el infinito.

## 9. Arquitectura del software

React conserva cargas, punto de evaluación, opciones gráficas, parámetros de partícula y estado de simulación. Las entradas se conservan como números o cadenas durante la edición y se convierten después de validar. `evaluate` proporciona valores físicos comunes a calculadoras, gráficos e integración; ninguna vista usa trayectorias o campos predefinidos.

Canvas dibuja rejilla, fuentes, líneas, flechas, curvas y trayectoria. Three.js crea la escena, geometrías y cámara; OrbitControls permite manipularla. Se liberan geometrías, materiales, controles y contexto gráfico al desmontar la vista. La dependencia 3D se carga bajo demanda al abrir esa pestaña.

`requestAnimationFrame` organiza la actualización de la trayectoria con un presupuesto de trabajo por fotograma. El avance físico utiliza pasos controlados, independientemente de la frecuencia de dibujo. No hay solicitudes a servicios externos desde la aplicación.

## 10. Algoritmos utilizados

### Campo y potencial

Validar entradas → convertir nC a C → para cada fuente calcular Δr y R → detectar singularidad → acumular E por componentes y V por signo → verificar valores finitos → calcular magnitud y dirección.

### Líneas 2D

Se generan ocho semillas por carga no nula a 0.08 m de ella. Se integra la dirección normalizada del campo con punto medio y paso espacial de 0.025 m. Se avanza en el sentido del campo para fuentes positivas y hacia atrás para negativas; luego se invierte ese último recorrido para dibujar sus flechas en el sentido físico. Cada línea se limita a 350 pasos y se detiene al acercarse a una fuente, salir del dominio o encontrar campo prácticamente nulo.

### Curvas y superficies

Se muestrea V sobre una rejilla. En 2D se divide cada celda en dos triángulos; se buscan aristas que crucen el nivel y se conectan sus intersecciones. En 3D se divide cada cubo en seis tetraedros y se triangulan sus cortes por el nivel (**marching tetrahedra**). Las intersecciones se refinan con 14 iteraciones de bisección del potencial calculado. Se reutilizan las intersecciones de aristas 3D.

Resolución 2D: 64 × 64 celdas. Resolución 3D: 18 × 18 × 18 celdas. Se omiten muestras a menos de 0.055 m de las fuentes en las curvas y 0.07 m en las superficies. Los vértices corresponden aproximadamente al nivel; los segmentos y triángulos son aproximaciones entre esos vértices.

### Movimiento RK4

```text
estado = [x, y, z, vx, vy, vz]
derivada(estado) = [vx, vy, vz, qEx/m, qEy/m, qEz/m]
obtener k1, k2, k3, k4 con las cuatro evaluaciones RK4
estado siguiente = estado + dt × (k1 + 2k2 + 2k3 + k4) / 6
```

Se compara un paso completo con dos medios pasos. Si el error normalizado máximo supera 10⁻⁷ o el desplazamiento supera 0.02 m, se reduce dt a la mitad y se vuelve a intentar. Se acepta el resultado de los dos medios pasos. Paso máximo: 0.002 s; hasta 16 intentos por avance y 20 000 pasos por trayectoria.

Se detiene por acercamiento menor o igual a 0.06 m a una carga, salida del dominio ±2 m, rapidez superior a 100 m/s, resultado no finito, límite de pasos o necesidad de un paso demasiado pequeño. También se comprueba el segmento entre posiciones para evitar atravesar una fuente inadvertidamente. Las comprobaciones durante las etapas RK4 pueden detener conservadoramente antes de alcanzar el límite.

## 11. Pruebas y validación

### Automatizadas, ejecutadas

Se ejecutaron `npm test` y `node src/physics.test.js`: **14 casos aprobados y 0 fallidos**. El comando directo permitió consultar cada caso individual en este entorno. `npm run build` terminó correctamente con Vite 8.3.4.

| Caso | Entrada y resultado esperado | Resultado |
| --- | --- | --- |
| 1 | +5 nC en origen, punto (2,0,0): Ex = 11.234439740375 N/C, dirección +X. | Aprobado |
| 2 | −5 nC en origen, mismo punto: Ex negativo, dirección −X. | Aprobado |
| 3 | Dipolo ±5 nC en x = ±0.6: campo +X en centro; par positivo: campo nulo en centro. | Aprobado |
| 4 | Potencial de ±5 nC a 2 m: ±22.46887948075 V. | Aprobado |
| 5 | Dos cargas +5 nC: potencial central igual a la suma de aportes. | Aprobado |
| 6 | Coincidencia y distancia 10⁻⁹ m: error; 10⁻⁴ m: resultado finito; entradas vacías o NaN: error. | Aprobado |
| 7 | RK4 bajo E = (2,0,0) N/C, q/m = 1 C/kg, x₀=0, vx₀=1 m/s: a=2 m/s², x(1)=2 m y vx(1)=3 m/s. | Aprobado |
| 8 | Curva de +5 nC, nivel 45 V: vértices y puntos medios próximos al nivel. | Aprobado |
| 9 | Superficie de +5 nC, nivel 45 V: vértices y centroides próximos al nivel. | Aprobado |
| 10 | Rechazo de 11 cargas, coordenada 3 m y carga vacía; configuración sin fuentes válida. | Aprobado |
| 11 | Fuente en z=1 m, evaluación en z=2 m: Ez=k×5×10⁻⁹ N/C y Ex=0. | Aprobado |
| 12 | Sentido de líneas para fuentes positivas/negativas; omisión de líneas cuando z≠0. | Aprobado |
| 13 | Aceleración en campo de una carga, movimiento libre sin fuentes y parada a 0.05 m. | Aprobado |
| 14 | Validación de masa, tiempo, velocidad y valores no finitos de la partícula. | Aprobado |

Los casos de campo uniforme prueban el integrador con una aceleración conocida; la aplicación utiliza el campo real de las cargas, verificado adicionalmente en el caso 13.

En la medición de equipotenciales de +5 nC a 45 V se generaron 214 segmentos y 2328 triángulos. Errores relativos máximos medidos respecto al nivel:

| Muestreo | Error máximo |
| --- | --- |
| Vértices de curvas | 0.000260 % |
| Puntos medios de segmentos | 0.0468 % |
| Vértices de superficies | 0.001165 % |
| Centroides de triángulos | 1.4124 % |

Estas cifras corresponden al caso probado; no garantizan la misma precisión para toda configuración. Las pruebas admiten hasta 0.5 % en puntos medios 2D y 4 % en centroides 3D para ese caso. Una medición con diez fuentes y tres niveles generó aproximadamente 11 466 triángulos en 1.87 s en el entorno de desarrollo; el rendimiento depende del equipo.

### Comprobaciones de interacción, ejecutadas

Se comprobó la página local en el navegador integrado de Codex: carga de 2D, límite de 10 fuentes y botón desactivado, restablecimiento, selección de una carga positiva, valores de E y V a 2 m, rechazo de masa cero y desactivación de iniciar, pausa de trayectoria, reinicio, finalización a 0.1 s, carga de Three.js con equipotenciales, arrastre orbital y rueda de zoom. Se probó un tamaño de laptop de 1280 × 900. No se registraron errores ni advertencias de navegador en las consultas de consola realizadas.

En el caso de +5 nC y los parámetros iniciales de partícula durante 0.1 s, la interfaz mostró y ≈ 0.803506 m y vy ≈ 0.0700108 m/s. Esto es una comprobación de interacción, distinta de las pruebas analíticas automatizadas.

No se generaron capturas ni otros archivos multimedia. No se realizó una revisión visual por imágenes. **Queda pendiente una comprobación específica en Firefox** y la evaluación de rendimiento en el equipo de entrega. La compilación conserva un aviso de tamaño del módulo Three.js (~513 kB minificado), que se carga solo al abrir 3D; no impide compilar ni ejecutar.

## 12. Guía textual para una demostración de 5 a 10 minutos

Plan orientativo; no se genera ni se incluye un video:

1. Minuto 0–1: presentar curso, objetivo y paneles.
2. Minuto 1–2: mostrar +5 nC y luego −5 nC, sus colores y el sentido del campo.
3. Minuto 2–3: configurar dipolo, evaluar el centro y explicar que V=0 puede coexistir con E≠0.
4. Minuto 3–5: una carga positiva, nivel 45 V, curvas 2D y superficies 3D; girar y acercar cámara.
5. Minuto 5–6: mostrar sustitución numérica para (2,0,0) m.
6. Minuto 6–8: iniciar, pausar y reiniciar la partícula; explicar F=qE, a=qE/m y las paradas.
7. Minuto 8–9: ejecutar las pruebas y mencionar el modelo puntual y la resolución limitada.

## 13. Guía textual para una presentación

Propuesta de ocho temas; no se generan diapositivas:

1. Portada: universidad, curso, unidad y desarrollador.
2. Objetivo: cargas, campo, potencial y movimiento.
3. Tecnologías y estructura modular.
4. Gestión de cargas y vistas 2D/3D.
5. Fórmulas de E, V, F y a, con el ejemplo a 2 m.
6. Equipotenciales y método numérico RK4.
7. Pruebas automatizadas y comprobaciones de interacción realmente ejecutadas.
8. Conclusiones, limitaciones y enlace al repositorio.

## 14. Limitaciones

- Modelo de cargas puntuales fijas y partícula de prueba; no hay interacción dinámica entre fuentes.
- Dominio gráfico finito ±2 m y rangos de entrada acotados para mantener estabilidad.
- La vista 2D es un corte z=0 para E y V, y una proyección para fuentes y trayectoria. No se dibujan líneas físicas 2D para fuentes fuera del plano.
- Densidad de líneas limitada y sin escala proporcional exacta al valor de la carga. Las flechas muestran sentido; su longitud no es proporcional al módulo real.
- Equipotenciales trianguladas a resolución fija; pueden omitir estructuras pequeñas o muy cercanas a cargas. Tres niveles se muestran a la vez.
- La extracción 3D es síncrona y puede producir una pausa breve al modificar fuentes o nivel; se puede desactivar.
- Las superficies de potencial cero no se extraen si todo el dominio tiene V=0: no existe una frontera particular para dibujar.
- La integración puede detenerse antes del tiempo solicitado por proximidad, límites del dominio o límites numéricos. No modela una colisión física con una carga.
- WebGL2 es necesario para 3D. La escena se reconstruye al modificar sus fuentes/opciones, restableciendo la cámara.
- No se guardan simulaciones: recargar la página recupera los ejemplos iniciales.
- No se ha verificado específicamente Firefox; sí se comprobó la interacción en el navegador integrado. No se identificaron errores en las pruebas ejecutadas.

## 15. Información de GitHub

Cuenta: https://github.com/kakatsumi.

Repositorio existente público: https://github.com/kakatsumi/Fisica-II-Simuladores.

La Unidad 1 se entrega en el mismo repositorio que la Unidad 2; no se inicializa un Git independiente ni se cambia la visibilidad. El código de la Unidad 2 y las unidades 3 y 4 se conservan. El README raíz contiene enlaces a ambas guías.

Para obtener el proyecto, usa **Code → Download ZIP** en GitHub y extrae el archivo, o clona el repositorio:

```bash
git clone https://github.com/kakatsumi/Fisica-II-Simuladores.git
cd "Fisica-II-Simuladores/Unidad 1 - Electricidad y Campo Electrico"
npm install
npm run dev
```

Para reproducirlo son necesarios `src/`, `index.html`, `package.json` y `package-lock.json`. No se entrega `node_modules/`, `dist/` ni `.npm-cache/`: se reconstruyen al instalar o compilar. No se incorporan credenciales ni archivos de entorno al repositorio.
