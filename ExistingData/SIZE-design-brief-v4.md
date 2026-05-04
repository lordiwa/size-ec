# SIZE — Brief de proyecto y diseño (v4)

> Documento maestro del proyecto. Cubre marca, concepto, experiencia, stack técnico, despliegue, modelo operativo agentic, integración con Jira y entregables.

---

## 1. La marca

**SIZE** es una nueva agencia de publicidad y medios en Ecuador.

**Tagline:** *We size up to anything.*

**Promesa de marca:** *Publicidad a tu medida.*

**Posicionamiento:** agencia integral con corazón creativo y músculo digital/tecnológico. No vendemos un menú genérico de servicios: nos adaptamos al tamaño y la naturaleza de cada cliente, sea una marca masiva o una startup.

---

## 2. El concepto del sitio — 17 estilos, uno a la vez

El sitio es la primera prueba viva del posicionamiento. El cliente lo controla eligiendo entre **17 estilos mutuamente excluyentes**:

### Eje 1 — Estilo de mercado (12 opciones)
El visitante elige su industria. SIZE le **aplica el lenguaje visual de ese mercado** (paleta, tipografía, fotografía, ritmo, tono) y **le muestra los servicios relevantes** para esa industria.

### Eje 2 — Tamaño de creatividad (5 opciones)
El visitante elige una **intensidad creativa pura** (XS / S / M / L / XL). El sitio se transforma a esa intensidad sin sesgo de industria, mostrando los 11 servicios completos en estilo neutro de marca SIZE.

### La fórmula

```
Total = 12 mercados + 5 tamaños = 17 estilos posibles
Activo a la vez = 1
```

El usuario siempre puede cambiar de estilo. Cada elección reemplaza la anterior. El último estilo elegido es el activo.

---

## 3. REGLA INVIOLABLE — Legibilidad

**El texto del sitio siempre debe ser legible. En todos los niveles. En todos los mercados. Sin excepción.**

- Contraste WCAG AA mínimo (4.5:1 body, 3:1 texto grande) en todos los niveles, incluido XL.
- Jerarquía tipográfica clara siempre.
- En XL, los efectos viven en background y elementos decorativos. El contenido funcional (servicios, copy, CTAs) siempre se lee sin esfuerzo.
- Test de la abuela: si una abuela puede leer los nombres de los servicios y entender qué hace SIZE, el nivel está bien implementado.

---

## 3.bis REGLA INVIOLABLE — Estilos mutuamente excluyentes

**Los estilos de mercado y los tamaños de creatividad NO se mezclan. Se reemplazan.**

El sitio tiene **17 estilos totales** y son mutuamente excluyentes:
- **12 estilos de mercado** (CPG, Banca, Retail, Automotriz, Salud, Bebidas, Inmobiliario, Educación, Turismo, Tecnología, Moda, Fintech)
- **5 tamaños de creatividad** (XS, S, M, L, XL)

```
Total = 12 mercados + 5 tamaños = 17 estilos
```

El usuario tiene **un solo estilo activo a la vez**. Elegir un mercado desactiva cualquier tamaño previo, y viceversa. No existen las 60 combinaciones. Existen 17 maneras distintas de ver el sitio.

### Cómo se traduce esto en producto

- Hay un **único flag** en `localStorage`:
  ```
  size-style: { type: 'market' | 'size', value: 'banking' | 'M', updatedAt: ... }
  ```
- Cuando el usuario elige un mercado: el estilo del sitio cambia a **ese mercado puro**, en su versión M (Crafted) por default visual.
- Cuando el usuario elige un tamaño creativo: el estilo del sitio cambia a **ese tamaño puro**, sin sesgo de mercado (estilo neutro de marca SIZE en esa intensidad).
- Cambiar de estilo **siempre es posible**: el último elegido reemplaza al anterior. El usuario puede ir y volver entre mercados y tamaños cuantas veces quiera.

### Filosofía detrás del cambio

La promesa "we size up to anything" se cumple igual: 17 maneras de ver el sitio prueban la adaptabilidad. La diferencia es que cada estilo se ejecuta en su forma más pura, sin diluir personalidad mezclando dos sistemas distintos. Más simple de implementar, más claro de entender, más fuerte como statement.

---

## 3.ter Flujo de selección de estilo — el "gate"

El sitio tiene un **gate de primera selección** que se activa una sola vez por usuario.

### Estado inicial (sin selección)
- Usuario entra → Home con **default M (Crafted)** y `localStorage` vacío.
- En Home, el usuario puede elegir un **mercado** (vía dropdown, botón o entrada directa al flujo de Servicios).

### Gate de creatividad
- Si el usuario hace click en cualquier botón del footer (**Servicios / Quiénes somos / Contacto**) **sin haber elegido aún**, la vista solicitada se reemplaza temporalmente por un bloque:
  > **"¿Cuál es el tamaño de tu creatividad?"**
  > [XS · S · M · L · XL]
- Al elegir un tamaño, el usuario **cae automáticamente en la vista que originalmente pidió**, ya con el estilo aplicado.

### Persistencia
- Cualquier elección (mercado desde Home **o** tamaño desde el gate) escribe el flag en `localStorage`.
- A partir de ese momento, las vistas se muestran directamente. El gate ya no aparece.

### Cambio de estilo posterior
- El usuario siempre puede cambiar de estilo:
  - Volviendo a Home y eligiendo otro mercado.
  - Usando un control accesible desde el footer (ej. un pequeño "Cambiar estilo" o el slider integrado en la vista de Servicios).
- El **último estilo elegido reemplaza al anterior**. Solo hay uno activo.

### Estados resumidos

| Estado | Qué ve el usuario |
|---|---|
| Primera visita, sin selección, en Home | Home en M default, opciones de mercado disponibles |
| Primera visita, sin selección, click en footer | Gate "¿Cuál es el tamaño de tu creatividad?" |
| Visita recurrente con mercado elegido | Sitio en estilo del mercado, vistas directas |
| Visita recurrente con tamaño elegido | Sitio en estilo del tamaño, vistas directas |
| Cambio de estilo en cualquier momento | Reemplazo inmediato, transición animada ~600ms |

---

## 4. Servicios SIZE (11)

1. Estrategia de Marca y Comunicación
2. Branding & Identidad
3. Diseño & Contenido Visual
4. Producción Audiovisual
5. Desarrollo Web & Software a Medida
6. Performance & Paid Media
7. Social Media & Community
8. Activaciones de Marca & Eventos
9. SEO & SEM
10. IA Aplicada & Automatización
11. Capacitaciones IA

---

## 5. Mercados objetivo (12) — servicios y estilo base

Cada mercado tiene **dos atributos**:
- **Servicios prioritarios** (lo que se renderiza)
- **Estilo base** (paleta, tipografía, fotografía, ritmo, tono)

### 1. Consumo masivo (CPG)
> Marca presente en góndola y top of mind. Volumen, recordación y empuje en punto de venta.

**Servicios:** Estrategia de Marca y Comunicación · Diseño & Contenido Visual · Producción Audiovisual · Performance & Paid Media · Activaciones de Marca & Eventos · Social Media & Community

**Estilo base:**
- Paleta: saturada y alegre (rojo `#E63946`, amarillo `#FFD60A`, azul `#0077B6`)
- Tipografía: sans-serif redondeada (Poppins, DM Sans, Nunito)
- Fotografía: producto en primer plano, gente real consumiendo, hogar y supermercado
- Ritmo: rápido, energético, abundante
- Tono: cercano, popular, directo

### 2. Banca y servicios financieros
> Categoría regulada que vive de la confianza. Campañas de marca grandes + captación digital constante.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Producción Audiovisual · Performance & Paid Media · Desarrollo Web & Software a Medida · IA Aplicada & Automatización · Capacitaciones IA · Social Media & Community

**Estilo base:**
- Paleta: azules profundos (`#003566`, `#001D3D`), grises corporativos, dorados
- Tipografía: serif institucional (Source Serif, Lyon) + sans (Inter, IBM Plex)
- Fotografía: retratos profesionales, manos firmando, espacios arquitectónicos
- Ritmo: pausado, jerárquico
- Tono: formal, confiable, autoridad

### 3. Retail
> Vive del calendario comercial. Ciclos cortos de campaña, e-commerce sólido y conversión medible.

**Servicios:** Estrategia de Marca y Comunicación · Diseño & Contenido Visual · Producción Audiovisual · Performance & Paid Media · Desarrollo Web & Software a Medida · SEO & SEM · Social Media & Community · Activaciones de Marca & Eventos

**Estilo base:**
- Paleta: alto contraste con un acento hero (rojo `#FF003C`, naranja `#FF6B00`, magenta `#E5006D`)
- Tipografía: sans condensada bold (Druk, Bebas Neue, Anton) + sans neutra
- Fotografía: producto editorial, modelos lifestyle, flat lays, packaging hero
- Ritmo: dinámico, con urgencia
- Tono: directo, vendedor

### 4. Automotriz
> Decisión larga, alto involucramiento, aspiracional con prueba en concesionario.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Producción Audiovisual · Performance & Paid Media · Desarrollo Web & Software a Medida · Activaciones de Marca & Eventos · Social Media & Community

**Estilo base:**
- Paleta: negros profundos, plateados, acento metálico
- Tipografía: sans geométrica con peso (Eurostile, Neue Haas Grotesk, Suisse)
- Fotografía: vehículo en movimiento, primeros planos, tomas cinemáticas
- Ritmo: cinemático
- Tono: aspiracional, técnico, performance

### 5. Salud y farma
> Categoría sensible y regulada. Educación, posicionamiento profesional y discoverability.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Diseño & Contenido Visual · Producción Audiovisual · Desarrollo Web & Software a Medida · SEO & SEM · Performance & Paid Media · Social Media & Community

**Estilo base:**
- Paleta: blanco dominante, azules clínicos suaves (`#A8DADC`, `#457B9D`), verdes (`#06A77D`)
- Tipografía: sans humanista legible (Inter, Source Sans, Karla)
- Fotografía: rostros reales, manos cuidando, espacios luminosos
- Ritmo: calmo, pedagógico
- Tono: humano, empático, educativo

### 6. Bebidas y licores
> Experiencia, ocasión de consumo y conexión cultural.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Diseño & Contenido Visual · Producción Audiovisual · Activaciones de Marca & Eventos · Social Media & Community · Performance & Paid Media

**Estilo base:**
- Paleta: ámbares y dorados sobre negro (premium) o vibrantes frutales (refrescos)
- Tipografía: serif con carácter (Canela, Domaine) o sans condensada
- Fotografía: producto con condensación, ocasiones de consumo, texturas
- Ritmo: sensual, con momentos suspendidos
- Tono: evocador, sensorial

### 7. Inmobiliario y construcción
> Tickets altos, ciclo largo, decisión por confianza visual.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Diseño & Contenido Visual · Producción Audiovisual · Desarrollo Web & Software a Medida · Performance & Paid Media · SEO & SEM · Social Media & Community

**Estilo base:**
- Paleta: neutros arquitectónicos (off-white, beige, grafito), acento dorado o terroso
- Tipografía: serif arquitectónica (Tiempos, GT Sectra) + sans clean (Söhne)
- Fotografía: renders fotorrealistas, drone shots, interiores con luz natural
- Ritmo: lento, contemplativo
- Tono: aspiracional, calmo

### 8. Educación
> Temporadas de matrícula, decisión racional+emocional, SEO y reputación digital pesan.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Producción Audiovisual · Performance & Paid Media · SEO & SEM · Desarrollo Web & Software a Medida · Social Media & Community · IA Aplicada & Automatización · Capacitaciones IA

**Estilo base:**
- Paleta: azules confiables + un color joven (verde `#00C49A`, naranja `#FF6B00`, violeta `#7209B7`)
- Tipografía: sans amigable (Inter, DM Sans) + serif ocasional para titulares
- Fotografía: estudiantes reales, espacios académicos, descubrimiento, diversidad
- Ritmo: dinámico
- Tono: motivador, claro, futuro

### 9. Turismo y hospitalidad
> Vende imagen, momentos y emociones. 100% digital.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Diseño & Contenido Visual · Producción Audiovisual · Desarrollo Web & Software a Medida · SEO & SEM · Performance & Paid Media · Social Media & Community

**Estilo base:**
- Paleta: turquesas/arenas (playa), verdes profundos (selva), ocres (sierra), negros/dorados (lujo)
- Tipografía: serif evocadora (Playfair, Cormorant) + sans funcional
- Fotografía: paisajes panorámicos, detalles experienciales, gastronomía
- Ritmo: inmersivo, full-bleed
- Tono: evocador, narrativo

### 10. Tecnología y electrónicos
> Lanzamientos constantes, lenguaje técnico humanizado, mercado comparativo.

**Servicios:** Estrategia de Marca y Comunicación · Diseño & Contenido Visual · Producción Audiovisual · Performance & Paid Media · SEO & SEM · Desarrollo Web & Software a Medida · IA Aplicada & Automatización · Capacitaciones IA · Social Media & Community

**Estilo base:**
- Paleta: dark mode dominante, acento vibrante (cian `#00F0FF`, lima `#C5FF00`, púrpura `#7B2FFF`)
- Tipografía: sans neo-grotesque o mono (Inter, JetBrains Mono, Geist)
- Fotografía: producto 3D, macros de circuitos/pantallas, gradientes generativos
- Ritmo: preciso, modular
- Tono: técnico pero accesible, con datos

### 11. Moda y belleza
> Estética, tendencias y creadores. Imagen y velocidad de contenido.

**Servicios:** Branding & Identidad · Diseño & Contenido Visual · Producción Audiovisual · Social Media & Community · Performance & Paid Media · Desarrollo Web & Software a Medida · Activaciones de Marca & Eventos · SEO & SEM

**Estilo base:**
- Paleta: nudes y crema, o combinaciones editoriales fuertes (rojo+rosa, negro+lima)
- Tipografía: serif editorial alta (Didot, Bodoni, Migra) + sans condensada
- Fotografía: editorial fashion, beauty close-ups, BTS, modelos con dirección
- Ritmo: editorial, magazine
- Tono: trendy, conciso, voz de autor

### 12. Fintech / D2C / Startups
> Crecimiento ágil, métricas claras, marca desde cero con presupuesto eficiente.

**Servicios:** Estrategia de Marca y Comunicación · Branding & Identidad · Desarrollo Web & Software a Medida · Performance & Paid Media · SEO & SEM · IA Aplicada & Automatización · Capacitaciones IA · Social Media & Community · Diseño & Contenido Visual

**Estilo base:**
- Paleta: color-blocking moderno (verde mint `#00D9A0`, lila `#9B7AFF`, off-white)
- Tipografía: sans geométrica (Söhne, Geist, Satoshi, General Sans)
- Fotografía: mockups de producto, isométrica, abstracciones, retratos de fundadores
- Ritmo: ágil, product-led
- Tono: confiado, directo

---

## 6. Tamaños de creatividad (5)

Los 5 tamaños son **estilos puros**, sin sesgo de mercado. Se aplican como estilo neutro de marca SIZE en esa intensidad.

| Tamaño | Nombre A | Nombre B | Personalidad |
|---|---|---|---|
| 1 | **XS** | Plain | Web 1999 literal: gris, Times New Roman, links azules |
| 2 | **S** | Clean | Corporativo limpio, formal, plano |
| 3 | **M** | Crafted | Editorial moderno, dark mode default. **Es el default.** |
| 4 | **L** | Bold | Brutalist contemporáneo: tipografía gigante, contraste, motion |
| 5 | **XL** | Unleashed | Sin límites: WebGL + Phaser + audio generativo — pero legible |

**Default de entrada:** M (Crafted), dark mode.

**Reglas globales:**
- Contenido siempre el mismo, solo cambia expresión.
- Transición ~600ms entre cambios de estilo, no reload.
- Carga progresiva: tamaños XS-M livianos, L-XL lazy-load Three.js / Phaser / Tone.js.
- Legibilidad WCAG AA en todos los tamaños.

### Cuándo se usa un tamaño y cuándo un mercado

- El usuario elige **un mercado** cuando quiere ver el sitio adaptado a su industria (con servicios filtrados y look del mercado).
- El usuario elige **un tamaño** cuando quiere ver la "personalidad pura" del sitio en esa intensidad creativa, sin sesgo de industria, mostrando los 11 servicios completos.

---

## 7. Experiencia de usuario — 5 vistas

**Estructura global:**
- **Footer sticky con 3 botones flotantes**: Quiénes somos · Servicios · Contacto
- Cada botón es una vista distinta (URL propia para SEO).
- Componentes reutilizables entre vistas.
- Default visual de entrada: **dark mode + nivel M (Crafted)**.

---

### 7.1 Vista Home (`/`)

**Composición:**
- **SIZE** en escala dominante (logo grande).
- Línea siguiente: **"Publicidad a tu medida."**
- Línea siguiente: **"Somos tu [palabra rotativa]"** — la palabra cambia cíclicamente desde una lista (palabras tentativas: *amigo, ayuda, conciencia, competencia, socio, aliado, partner, voz, fuerza, sombra* — lista final TBD).
- **CTA principal:** botón a Servicios con animación de brillo / pulso / hover destacado.
- **Acceso a mercados:** punto de entrada visible para que el usuario elija su industria directamente desde Home (ej. dropdown discreto, link "¿De qué industria vienes?", o botón secundario que abre el listado de los 12 mercados). Al elegir un mercado aquí, **el usuario se queda en Home** con el estilo del mercado aplicado al instante, y el flag queda marcado en `localStorage` (omite el gate en futuras navegaciones).

**Comportamiento:**
- Si el usuario no ha elegido nada, Home se ve con el default M (Crafted).
- Si el usuario elige un mercado en Home, **Home se reestiliza con ese mercado en vivo, sin redirección**. El usuario decide cuándo navegar a otras vistas usando el footer o el CTA principal.
- Si el usuario ya eligió un estilo, Home aplica ese estilo (excepto donde el contenido neutro de marca lo requiera explícitamente).
- La rotación de palabras es continua, con transición tipográfica (typewriter, fade, scramble — definir en design).
- El CTA debe ser claramente la acción dominante; el footer sticky existe pero no compite con el botón principal.

**Pendiente TBD:** lista final de palabras rotativas (10-15 palabras).

---

### 7.2 Vista Servicios (`/servicios`)

Esta vista se comporta diferente según si el usuario ya eligió un estilo o no.

#### Estado A — Sin estilo elegido aún (gate activo)

Cuando el usuario llega a Servicios sin haber elegido nunca un estilo:

**Composición:**
- **SIZE** mediano.
- **Bloque centrado con el gate de creatividad:**
  > **"¿Cuál es el tamaño de tu creatividad?"**
  > [XS · S · M · L · XL]
- Subtítulo dinámico debajo de cada opción con el nombre B (Plain / Clean / Crafted / Bold / Unleashed).

**Comportamiento:**
- Al elegir un tamaño, el flag se escribe en `localStorage` y la vista se recarga inmediatamente como Servicios completos en ese estilo.

#### Estado B — Estilo ya elegido

Cuando el usuario ya tiene un estilo activo (mercado o tamaño):

**Composición:**
- **SIZE** mediano.
- **Header de la vista** con el estilo activo aplicado (paleta, tipografía, fotografía, ritmo).
- **Sección de servicios:**
  - Si el estilo activo es un **mercado**: se muestran los servicios filtrados de ese mercado con descripciones adaptadas.
  - Si el estilo activo es un **tamaño**: se muestran los **11 servicios completos** en estilo neutro de marca SIZE en esa intensidad.
- **Control de cambio de estilo** accesible (ej. botón "Cambiar estilo" o selector compacto que permite elegir otro mercado u otro tamaño).
- **CTA de cierre** apuntando a Contacto.

**Comportamiento:**
- Cualquier cambio de estilo (a otro mercado o a otro tamaño) reemplaza el actual y se transiciona en ~600ms.
- El estilo elegido persiste para todas las vistas y para visitas recurrentes.

---

### 7.3 Vista Quiénes somos (`/quienes-somos`)

#### Estado A — Sin estilo elegido aún (gate activo)

Si el usuario llega a Quiénes somos sin haber elegido nunca un estilo:
- Se muestra el mismo gate que en Servicios:
  > **"¿Cuál es el tamaño de tu creatividad?"**
- Al elegir un tamaño, cae automáticamente en Quiénes somos completa con ese estilo.

#### Estado B — Estilo ya elegido

**Composición:**
- **SIZE** mediano.
- **Fila Equipo:**
  - Imágenes con caras del equipo. **5 imágenes por persona** (una por tamaño de creatividad).
  - Debajo de cada imagen: nombre, cargo, comentario personal.
  - El comentario también tiene **5 versiones** (una por tamaño).
  - Personas iniciales:
    - **Javier Ricaurte** — Administración y Estrategia
    - **Melissa Gaitán** — Creatividad y Estrategia
    - **Rafael Matovelle** — Tecnología y Estrategia
    - **Ismael Guerra** — Tecnología y Creatividad
- **Fila Clientes:**
  - Logos en fila horizontal.
  - Click en logo → vista individual del cliente con URL propia (ver 7.4).
  - Clientes iniciales:
    - **MMA El Valle**
    - **Cranial Trading**
    - **Sin-Cero**

**Comportamiento:**
- La fila del equipo es escalable: cuando se agreguen más personas, se acomodan en grid.
- **Las imágenes y comentarios cambian con el tamaño elegido** (XS / S / M / L / XL).
- Si el estilo activo es un **mercado** (no un tamaño), se aplica un mapeo: cada mercado se asocia a un tamaño "equivalente" para mostrar la versión adecuada de fotos y comentarios. Mapeo recomendado: **todos los mercados usan la versión M (Crafted)** del equipo, ya que es la versión "presentable" del equipo. Las versiones XS/S/L/XL solo se ven cuando el usuario eligió específicamente ese tamaño.

**Pendiente TBD:**
- 4 personas × 5 fotos = 20 fotos por levantar.
- 4 personas × 5 comentarios = 20 textos por escribir.

---

### 7.4 Vista Cliente individual (`/clientes/[slug]`)

**Composición:**
- Header con nombre del cliente.
- Datos del cliente: descripción, industria, año de relación.
- **Botón Back** prominente para regresar a Quiénes somos.
- Galería con ejemplos de trabajos realizados para ese cliente.

**Comportamiento:**
- URL propia y compartible (`/clientes/mma-el-valle`, `/clientes/cranial-trading`, `/clientes/sin-cero`).
- SEO optimizado: meta title, description, structured data.

**Pendiente TBD:**
- Contenido y assets de cada caso (descripción + ejemplos).

---

### 7.5 Vista Contacto (`/contacto`)

#### Estado A — Sin estilo elegido aún (gate activo)

Si el usuario llega a Contacto sin haber elegido nunca un estilo:
- Se muestra el gate:
  > **"¿Cuál es el tamaño de tu creatividad?"**
- Al elegir un tamaño, cae automáticamente en Contacto completa con ese estilo.

#### Estado B — Estilo ya elegido

**Composición:**
- **SIZE** mediano.
- Layout de **dos columnas 40/60**:

**Columna izquierda (40%):**
- Caja con accesos directos a:
  - Instagram (`@TBD`)
  - WhatsApp (`+593 TBD`)
  - Correo electrónico (`TBD@size.ec` o similar — pendiente de creación)
  - Facebook (`TBD`)

**Columna derecha (60%):**
- **Chatbot** integrado.
- Función: dirigir correctamente a clientes a través de Facebook (intermediario que califica y rutea).
- Provider: **TBD** (opciones a evaluar: integración con Meta WhatsApp Business + flow propio, ManyChat, Tidio, o chatbot custom con OpenAI/Claude API).

**Pendiente TBD:**
- Email corporativo
- Handles de redes sociales
- Provider del chatbot
- Backend del formulario: ¿guardar interacciones en Firestore + enviar email?

---

## 8. Stack técnico

### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **Vite** como bundler
- **Vue Router** para SPA con URLs reales por vista
- **Pinia** para estado global (industria seleccionada + nivel de creatividad + tema activo)
- **Tailwind CSS** + CSS custom properties para sistema de tokens
- **TypeScript** (recomendado, no obligatorio)

### Animación e interactividad por nivel
- Niveles 1-2: cero JS de animación.
- Nivel 3 (M): GSAP (ScrollTrigger) + Lenis para scroll smooth.
- Nivel 4 (L): GSAP completo + Lottie para iconografía.
- Nivel 5 (XL, lazy-loaded):
  - **Three.js** vía `@tresjs/core` (wrapper Vue oficial)
  - **Phaser 3** para mini-juegos embebidos
  - **Tone.js** para audio generativo (default OFF)
  - **postprocessing** para shaders (bloom, glitch, RGB shift)
  - **Cannon-es** o **Rapier** para física

### Tipografía
- Self-hosted vía `@font-face`.
- Variable fonts para niveles 3-5.
- Subsets latinos solamente (español).

### Build y deploy
- **Repositorio:** GitHub
- **Hosting:** Firebase Hosting (plan **Spark / gratis**)
- **DNS y CDN:** Cloudflare (proxy + SSL)
- **Solo ambiente de producción** (sin staging).
- **Pipeline:** push a `main` → deploy automático a Firebase Hosting → propagación vía Cloudflare.
- **Code-splitting agresivo** por nivel de intensidad y por mercado para optimizar bundles.

### Dominio
- **TBD** — varios candidatos en evaluación.

### Backend / persistencia
- **Firebase Firestore** para:
  - Almacenar interacciones del formulario de contacto.
  - (Futuro) leads del chatbot.
- **Firebase Functions** (si se requiere) para:
  - Envío de email transaccional al equipo cuando se recibe contacto.
  - Webhook con el chatbot.
- **Email corporativo:** TBD (pendiente de crear).

### Performance
- Sin métricas Lighthouse estrictas en esta etapa.
- Filosofía: **avanzar con cuidado, no excederse**. Si un nivel impacta la performance del sitio, se optimiza antes de pasar al siguiente.

### SEO
- **Fase final del proyecto** (post-MVP funcional).
- Cuando se aborde: meta tags dinámicos por mercado, sitemap, structured data, prerender del nivel M para Google.

### Analytics
- **Fase final del proyecto** (post-MVP funcional).

### Idiomas
- **Solo español.**

### Legales / cookies
- Fuera de alcance en esta etapa.

---

## 9. Modelo operativo — Equipo agentic

El proyecto se ejecuta con un equipo de **agentes especializados** orquestados por un PM, todo operado a través de **Claude Code** con **GSD MCP** conectado a Jira.

### 9.1 Roster de agentes

| Agente | Skills |
|---|---|
| **Developer** | Front End Dev · Back End Dev · ReportToPM |
| **Researcher** | Research · ReportToPM |
| **QA** | Find Bugs · ReportToPM |
| **Strategist** | Advertisement Analysis · Marketing Analysis · Design Analysis · ReportToPM |
| **PM** | UseJira (vía GSD MCP) · ProcessTeamReports |

### 9.2 Responsabilidades

- **Developer** — implementa todo lo técnico: componentes Vue, integración Firebase, sistema de tokens, lazy loading, deploy.
- **Researcher** — investiga referentes, tecnologías, validaciones, librerías, mejores prácticas. Reporta hallazgos al PM.
- **QA** — prueba combinaciones (12 mercados × 5 niveles = 60), reporta bugs y oportunidades. Verifica legibilidad WCAG AA en todos los estados.
- **Strategist** — analiza si el output de cada vista cumple objetivos publicitarios, de marketing y de diseño. Hace análisis competitivo y de mercado cuando sea necesario.
- **PM** — gestiona el board de Jira, groomea tickets, prioriza, comunica al humano (vos), y consolida los reportes del equipo.

### 9.3 Flujo de trabajo

1. **Origen del ticket:**
   - Cualquier agente o el humano puede crear/escribir un ticket o reportar algo.
   - El PM lo recibe.

2. **Grooming por PM:**
   - Al inicio de cada sesión de trabajo (o en schedule), el PM groomea los tickets pendientes: clarifica descripción, agrega criterios de aceptación, estima, asigna labels, mueve al estado correcto.
   - Una vez groomeado, el ticket queda **listo como skill** para que cualquier agente lo tome.

3. **Sugerencia de revisión:**
   - Al inicio de cada sesión (o cada cierto tiempo), si hay tickets críticos groomeados, el PM **sugiere proactivamente** que se revisen.

4. **Ejecución:**
   - El agente correspondiente toma el ticket, lo ejecuta y reporta al PM al cerrar.
   - El PM actualiza el ticket en Jira con el resultado.

5. **QA:**
   - Cuando un ticket pasa a estado de revisión, QA lo valida antes de marcarse como Done.

### 9.4 Integración con Jira (GSD MCP)

- **Proyecto Jira:** SIZE
- **URL del board:** https://cranialtrading.atlassian.net/jira/software/projects/SIZE/boards/100
- **Metodología:** Kanban con sprint eterno (un solo sprint que nunca cierra).
- **Workflow del board:** estados standard (Backlog · To Do · In Progress · In Review · Done).
- **Tool de integración:** **GSD MCP** corriendo en Claude Code, conectado al Jira de cranialtrading.

### 9.5 Definición de Done

Un ticket se considera Done cuando:
- El criterio de aceptación se cumple en producción.
- QA lo validó.
- Si involucra una vista o componente: la legibilidad WCAG AA está verificada.
- Si involucra una combinación mercado × nivel: las 60 combinaciones afectadas siguen funcionando.

### 9.6 Manejo de bloqueos

- **Bloqueo técnico** detectado por Developer → escala primero a Researcher (para evaluar alternativas técnicas), luego a PM si requiere decisión de scope.
- **Bug crítico en producción** detectado por QA → reporta a PM, PM decide rollback o hotfix consultando al humano.
- **Conflicto entre creatividad y legibilidad** detectado por Strategist o QA → siempre gana legibilidad (regla inviolable, sección 3).

---

## 10. Roadmap sugerido del proyecto

### Fase 0 — Setup
- Crear proyecto Firebase (Spark).
- Crear repositorio GitHub.
- Conectar GitHub → Firebase Hosting.
- Configurar Cloudflare con dominio (cuando se decida).
- Configurar GSD MCP en Claude Code apuntando al proyecto SIZE en Jira.
- Crear épicas iniciales en Jira.

### Fase 1 — Sistema base
- Sistema de tokens (marca + 12 mercados + 5 tamaños). Mercados y tamaños son sets independientes.
- Vue Router con las 5 rutas.
- Pinia store con un único flag de estilo activo (tipo + valor).
- Footer sticky con 3 botones.
- Vista Home con marca rotativa.
- **Gate de creatividad** funcional para Servicios/Quiénes somos/Contacto cuando no hay estilo elegido.
- Validación de cambios de estilo en vivo.

### Fase 2 — Tamaño M (Crafted) y default visual
- Implementar M sobre Home, Servicios, Quiénes somos y Contacto en estilo neutro de marca SIZE.
- Validar gate, persistencia, legibilidad y performance.

### Fase 3 — Mercados sobre M
- Implementar los 12 estilos de mercado, todos en su versión M (Crafted).
- Validar que cada mercado se reconoce inmediatamente como su industria.
- QA: 12 estilos × 4 vistas = 48 estados visuales.

### Fase 4 — Tamaños S y L
- Implementar S (Clean) y L (Bold) en estilo neutro de marca SIZE.
- QA: 4 vistas × 2 nuevos tamaños.

### Fase 5 — Tamaño XS (Plain)
- Implementación 1999 fiel en estilo neutro de marca SIZE.
- Trabajo principalmente de CSS y assets retro.

### Fase 6 — Tamaño XL (Unleashed)
- Lazy-load de Three.js, Phaser, Tone.js.
- Implementación experimental en estilo neutro de marca SIZE.
- Detección de capacidad del dispositivo + fallback a L.
- Pulido de performance.

### Fase 7 — Contenido
- Levantar 20 fotos del equipo (4 personas × 5 tamaños).
- Escribir 20 comentarios del equipo.
- Construir las 3 vistas de cliente (MMA El Valle, Cranial Trading, Sin-Cero).
- Definir lista final de palabras rotativas en Home.

### Fase 8 — Integraciones
- Formulario de contacto: Firestore + email transaccional.
- Chatbot en vista de Contacto.
- Email corporativo creado y conectado.

### Fase 9 — Cierre
- SEO: meta tags, sitemap, structured data, prerender estilo M.
- Analytics: GA4 con eventos clave (selección de mercado, selección de tamaño, gate completado, CTAs, scroll depth).
- Validación final QA en los 17 estilos.
- Deploy a producción con dominio definitivo.

---

## 11. Pendientes abiertos (TBD)

| Item | Categoría | Bloqueante para |
|---|---|---|
| Dominio definitivo | Infraestructura | Fase 0 (parcial) y Fase 8 |
| Email corporativo | Producto | Fase 7 |
| Handles de redes sociales | Producto | Fase 6/7 |
| Provider del chatbot | Producto | Fase 7 |
| 20 fotos del equipo | Contenido | Fase 6 |
| 20 comentarios del equipo | Contenido | Fase 6 |
| Casos de los 3 clientes (descripciones + ejemplos) | Contenido | Fase 6 |
| Lista final de palabras rotativas en Home | Contenido | Fase 1 (puede ir con placeholders) |
| Estrategia y eventos de analytics | Producto | Fase 8 |

---

## 12. Entregable esperado

Un sitio web en producción que cumple los **17 estilos** (12 mercados + 5 tamaños de creatividad), funcional en todos, con:

- **5 vistas** navegables: Home, Servicios, Quiénes somos, Cliente individual (URL propia), Contacto.
- **Footer sticky** con los 3 accesos principales.
- **Gate de creatividad** funcional cuando el usuario llega a Servicios/Quiénes somos/Contacto sin haber elegido aún.
- **Selector de mercado** accesible desde Home y desde el control de cambio de estilo.
- **Selector de tamaño** accesible desde el gate y desde el control de cambio de estilo.
- **Sistema de tokens** dual (12 mercados + 5 tamaños) implementado limpiamente, sin mezclas.
- **Carga progresiva** de librerías pesadas en tamaños L y XL.
- **Responsive** en todos los estilos.
- **Legibilidad WCAG AA** verificada en los 17 estilos.
- **Detección de capacidad** del dispositivo (XL bloqueado si no hay WebGL2).
- **Persistencia** de la selección en localStorage (un único flag con tipo + valor).
- **Formulario de contacto** funcional con Firestore + email.
- **Chatbot** integrado en vista Contacto.
- **3 vistas de cliente** con URL propia y caso completo.

### Criterio de aceptación

El sitio se considera entregado cuando cualquier visitante puede entrar, navegar entre las 5 vistas, elegir cualquiera de los 12 mercados o cualquiera de los 5 tamaños, cambiar entre ellos cuantas veces quiera, y ver una experiencia coherente, funcional y legible — sin estilos rotos, placeholders ni "próximamente".

---

## 13. Gaps detectados — consideraciones que conviene resolver antes de Fase 1

Escaneo crítico del brief. Estos puntos no estaban explícitos y conviene tomarlos en cuenta para evitar refactors caros más adelante.

### 13.1 Estado de "primera visita" vs visita recurrente

**Gap:** ¿Qué ve el usuario que entra por primera vez vs. el que vuelve con `localStorage` guardado?

**Recomendación:**
- Primera visita: Home con default M (Crafted) y sin mercado seleccionado.
- Visita recurrente: misma Home pero el slider ya muestra el nivel guardado, y si elige Servicios el dropdown ya tiene la última industria pre-seleccionada.
- Botón discreto "reset experiencia" en footer o en Servicios para volver al default.

### 13.2 Estado "sin selección de mercado" en la vista de Servicios

**Gap:** ¿Qué se muestra en Servicios *antes* de que el usuario elija un mercado?

**Recomendación:**
- Mostrar los 11 servicios completos en cards genéricas con estilo neutro de marca SIZE.
- O alternativamente, mostrar un texto invitador ("Elige tu categoría para ver los servicios que aplican a ti") con el dropdown destacado.
- Decisión a tomar por design.

### 13.3 Comportamiento del nivel cuando se cambia de vista

**Gap:** Si el usuario está en Servicios con Banca + L, va a Quiénes somos: ¿Quiénes somos también se ve "Banca + L"? ¿O Quiénes somos tiene su propio mercado?

**Recomendación:**
- El **nivel** persiste en todas las vistas (es la "intensidad creativa" del usuario, transversal).
- El **mercado** solo aplica donde tiene sentido: Servicios sí, Quiénes somos parcialmente (puede usar el mercado para tintar acentos), Home y Contacto no (usan estilo neutro de marca SIZE).
- Las fotos y comentarios del equipo en Quiénes somos cambian con el **nivel**, no con el mercado.

### 13.4 Comportamiento del slider en mobile

**Gap:** Un slider horizontal en mobile compite con el scroll y puede ser frustrante.

**Recomendación:**
- En mobile, el slider puede convertirse en 5 pills/botones tap-friendly en lugar de slider deslizable.
- O slider con drag explícito + label grande del nivel actual.
- Tamaño mínimo del target táctil: 44×44px.

### 13.5 Galería del cliente individual — formato de los "ejemplos de trabajo"

**Gap:** ¿Qué son los "ejemplos de trabajos"? ¿Imágenes? ¿Videos? ¿Casos con narrativa? ¿Links externos?

**Recomendación:**
- Formato definido: cada caso del cliente tiene título, año, descripción del problema, descripción de la solución, 3-5 piezas visuales (imagen/video).
- Soporte para video embebido (Vimeo o YouTube) y galería tipo lightbox.

### 13.6 Comportamiento del chatbot cuando no hay backend listo

**Gap:** El chatbot es TBD pero la vista de Contacto tiene que existir desde Fase 1.

**Recomendación:**
- Construir la vista de Contacto con un **placeholder funcional** del chatbot (UI estática que dice "Conversemos" + link directo a WhatsApp/email mientras se define el provider).
- Cuando se decida el provider, se reemplaza el placeholder sin tocar el resto de la vista.

### 13.7 Manejo de errores

**Gap:** No hay definición de qué pasa cuando algo falla.

**Recomendación:**
- **404:** vista propia con SIZE grande, un mensaje breve ("Esta talla no existe") y CTA al Home. Estilo nivel M.
- **Error de carga del nivel XL:** fallback automático a L con toast informativo.
- **Error de Firestore al enviar contacto:** mensaje claro + email alternativo visible.
- **Sin conexión:** banner sutil arriba.

### 13.8 Tiempo de loading del nivel XL

**Gap:** Three.js + Phaser + assets WebGL pueden tardar varios segundos. ¿Qué ve el usuario?

**Recomendación:**
- Loader con personalidad ("Calibrando creatividad… X%") con barra de progreso real, no fake.
- Si pasa de 8 segundos, ofrecer "¿Prefieres bajar a L?" como opción.
- Pre-warm: cuando el usuario está en nivel L, empezar a precargar XL en background.

### 13.9 Compatibilidad de browsers

**Gap:** No hay definición de qué browsers soportar.

**Recomendación:**
- **Soporte oficial:** Chrome, Edge, Safari y Firefox últimas 2 versiones mayores. Móviles iOS 15+ y Android 10+.
- **Nivel XL bloqueado** en browsers sin WebGL2 (mensaje educativo).
- **Nivel XS** funciona en cualquier browser, incluido IE11 si fuera necesario (es la ironía del nivel).

### 13.10 Versionado y comunicación de cambios

**Gap:** El sitio va a evolucionar (nuevos clientes, nuevas personas en equipo, nuevas palabras rotativas). ¿Cómo se actualiza?

**Recomendación:**
- Contenido editable vive en archivos JSON o TypeScript estáticos del repo (no se necesita CMS para esta etapa).
- Cuando se agregue un cliente o miembro, se hace via PR.
- (Futuro fase 2) si crece mucho, considerar Sanity, Contentful o Firestore como CMS.

### 13.11 Accesibilidad más allá del contraste

**Gap:** La regla de legibilidad cubre contraste pero no accesibilidad completa.

**Recomendación:**
- Navegación completa por teclado en las 5 vistas (Tab, Enter, Esc).
- ARIA labels en slider, dropdown, footer sticky, chatbot.
- `prefers-reduced-motion`: respeta y bloquea/atenúa animaciones en niveles 3-5 cuando está activo.
- `prefers-color-scheme`: aunque el default es dark, respetar la preferencia del usuario donde aplique.
- Lector de pantalla: probar al menos en VoiceOver (macOS) y NVDA (Windows).

### 13.12 Texto rotativo en Home — accesibilidad y SEO

**Gap:** "Somos tu [palabra rotativa]" es animado. Los lectores de pantalla y los crawlers pueden tener problemas.

**Recomendación:**
- Texto en DOM real (no canvas/imagen), con `aria-live="polite"` para que el lector lea cambios.
- Alternativa: una sola versión "canónica" en `<noscript>` o como meta description para SEO.
- Velocidad de cambio: cada 2.5-3 segundos. Suficiente para leer.

### 13.13 Testing automatizado

**Gap:** QA va a probar 60 combinaciones manualmente. ¿Hay tests automatizados?

**Recomendación:**
- **Visual regression testing** con Percy, Chromatic o Playwright para capturar las 60 combinaciones automáticamente y detectar regresiones cuando se cambia algo.
- **Tests unitarios** mínimos para el sistema de tokens y la lógica del store Pinia.
- **E2E** con Playwright para los flujos principales: navegación entre vistas, cambio de nivel, cambio de mercado, envío de formulario.
- Decisión: ¿se invierte en tests desde Fase 1 o se posterga? Recomendado invertir desde Fase 1.

### 13.14 Manejo de assets pesados

**Gap:** Las 20 fotos del equipo × varios tamaños responsive + assets del nivel XL pueden inflar el bundle.

**Recomendación:**
- Imágenes en formato **WebP** (con fallback JPG) y AVIF para browsers modernos.
- Lazy loading nativo (`loading="lazy"`) en todas las imágenes below-the-fold.
- Sprites o SVG para iconografía.
- Compresión en pipeline de build (vite-imagetools o similar).
- CDN de imágenes opcional (Cloudflare Images) si crece el catálogo.

### 13.15 Capacitación del equipo agentic

**Gap:** Los agentes necesitan contexto del proyecto al arrancar cada sesión.

**Recomendación:**
- Crear un archivo `CLAUDE.md` o `AGENTS.md` en la raíz del repo con:
  - Resumen del proyecto (1 página).
  - Link al brief completo.
  - Convenciones de código (naming, estructura de carpetas, commits).
  - Lista de comandos útiles (`pnpm dev`, `pnpm build`, etc.).
  - Cómo correr los agentes y reportar al PM.
- Cada sesión de Claude Code arranca leyendo este archivo.

### 13.16 Métricas de éxito del proyecto (post-launch)

**Gap:** ¿Cómo sabemos si el sitio está funcionando comercialmente?

**Recomendación:** definir KPIs antes del launch (puede vivir en analytics, fase 8):
- Tiempo en sitio promedio.
- % de visitantes que mueven el slider de creatividad.
- % de visitantes que seleccionan un mercado.
- % que llegan a Contacto.
- Conversiones reales (formularios enviados / chatbot iniciados).
- Distribución de niveles elegidos (cuál es el más popular).
- Distribución de mercados elegidos.

Estas métricas también informan futuras iteraciones del producto.

---

## 14. Priorización de los gaps

No todos los gaps son urgentes. Esta es la priorización sugerida:

### 🔴 Resolver antes de Fase 1
- 13.1 Estado primera vs recurrente
- 13.2 Estado sin mercado seleccionado
- 13.3 Persistencia de nivel/mercado entre vistas
- 13.7 Manejo de errores básico (al menos 404)
- 13.15 Archivo CLAUDE.md/AGENTS.md para el equipo

### 🟡 Resolver durante Fases 2-4
- 13.4 Slider en mobile
- 13.5 Formato de casos de cliente
- 13.6 Placeholder de chatbot
- 13.9 Compatibilidad de browsers
- 13.10 Versionado de contenido
- 13.11 Accesibilidad completa
- 13.12 Texto rotativo accesible

### 🟢 Resolver durante Fases 5-8
- 13.8 Loading XL con personalidad
- 13.13 Testing automatizado (idealmente desde antes, pero se puede ir agregando)
- 13.14 Optimización de assets
- 13.16 Métricas de éxito
