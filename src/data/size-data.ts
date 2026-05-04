// SIZE — data v3 (5 levels, 12 markets, 11 services, team, clients, words)
// Source: ExistingData/SIZE Web Prototype - standalone.html (babel script a8393419)
// Ported verbatim from the prototype. Do not paraphrase strings.

export type LevelCode = 'xs' | 's' | 'm' | 'l' | 'xl'
export type LevelNumber = 1 | 2 | 3 | 4 | 5

export interface SizeLevel {
  n: LevelNumber
  code: 'XS' | 'S' | 'M' | 'L' | 'XL'
  label: string
  line: string
}

export interface MarketTheme {
  primary: string
  secondary: string
  bg: string
  ink: string
  display: string
  body: string
}

export interface Market {
  id: string
  n: string
  name: string
  sub: string
  desc: string
  theme: MarketTheme
  services: ServiceId[]
}

export type ServiceId =
  | 'estrategia' | 'branding' | 'diseno' | 'audiovisual' | 'web'
  | 'performance' | 'social' | 'activaciones' | 'seo' | 'ia' | 'capacitaciones'

export interface Service {
  name: string
  short: string
  n: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  quotes: Record<LevelCode, string>
}

export interface ClientWork {
  t: string
  d: string
}

export interface Client {
  id: string
  name: string
  tagline: string
  desc: string
  work: ClientWork[]
}

export const SIZE_LEVELS: SizeLevel[] = [
  { n: 1, code: 'XS', label: 'Plain',     line: 'Web 1999. Como Tim Berners-Lee la pidió.' },
  { n: 2, code: 'S',  label: 'Clean',     line: 'Corporativo plano. Tipo banco serio.' },
  { n: 3, code: 'M',  label: 'Crafted',   line: 'Editorial moderno. El sweet spot.' },
  { n: 4, code: 'L',  label: 'Bold',      line: 'Brutalist contemporáneo. La marca grita.' },
  { n: 5, code: 'XL', label: 'Unleashed', line: 'Sin filtro. Todo o nada.' }
]

export const SIZE_SERVICES: Record<ServiceId, Service> = {
  estrategia:     { name: 'Estrategia de Marca y Comunicación', short: 'Estrategia',   n: '01' },
  branding:       { name: 'Branding & Identidad',                short: 'Branding',     n: '02' },
  diseno:         { name: 'Diseño & Contenido Visual',           short: 'Diseño',       n: '03' },
  audiovisual:    { name: 'Producción Audiovisual',              short: 'Audiovisual',  n: '04' },
  web:            { name: 'Desarrollo Web & Software a Medida',  short: 'Web & Soft',   n: '05' },
  performance:    { name: 'Performance & Paid Media',            short: 'Paid Media',   n: '06' },
  social:         { name: 'Social Media & Community',            short: 'Social',       n: '07' },
  activaciones:   { name: 'Activaciones de Marca & Eventos',     short: 'Activaciones', n: '08' },
  seo:            { name: 'SEO & SEM',                           short: 'SEO & SEM',    n: '09' },
  ia:             { name: 'IA Aplicada & Automatización',        short: 'IA',           n: '10' },
  capacitaciones: { name: 'Capacitaciones IA',                   short: 'Capacit. IA',  n: '11' }
}

export const SIZE_MARKETS: Market[] = [
  { id: 'cpg', n: '01', name: 'Consumo masivo', sub: 'CPG',
    desc: 'Marca presente en góndola y top of mind.',
    theme: { primary: '#D23700', secondary: '#FFD93D', bg: '#FFF8E7', ink: '#040404', display: "'Geist',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'diseno', 'audiovisual', 'performance', 'activaciones', 'social'] },
  { id: 'banca', n: '02', name: 'Banca y servicios financieros', sub: 'Finance',
    desc: 'Categoría regulada que vive de la confianza.',
    theme: { primary: '#0A2540', secondary: '#C9A961', bg: '#F4F1EA', ink: '#010304', display: "'Instrument Serif',serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'audiovisual', 'performance', 'web', 'ia', 'capacitaciones', 'social'] },
  { id: 'retail', n: '03', name: 'Retail', sub: 'Retail',
    desc: 'Vive del calendario comercial. Ciclos cortos y conversión medible.',
    theme: { primary: '#E60023', secondary: '#000000', bg: '#FFFFFF', ink: '#060606', display: "'Archivo Black',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'diseno', 'audiovisual', 'performance', 'web', 'seo', 'social', 'activaciones'] },
  { id: 'automotriz', n: '04', name: 'Automotriz', sub: 'Auto',
    desc: 'Decisión de compra larga, alto involucramiento, fuerte componente aspiracional.',
    theme: { primary: '#C0C0C0', secondary: '#FF3030', bg: '#0A0A0A', ink: '#F5F5F5', display: "'Geist',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'audiovisual', 'performance', 'web', 'activaciones', 'social'] },
  { id: 'salud', n: '05', name: 'Salud y farma', sub: 'Health',
    desc: 'Categoría sensible, regulada y de alta credibilidad.',
    theme: { primary: '#1B6CA8', secondary: '#7DC9E7', bg: '#F8FAFB', ink: '#000000', display: "'Geist',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'diseno', 'audiovisual', 'web', 'seo', 'performance', 'social'] },
  { id: 'bebidas', n: '06', name: 'Bebidas y licores', sub: 'Drinks',
    desc: 'Experiencia, ocasión de consumo y conexión cultural.',
    theme: { primary: '#B8731A', secondary: '#3D1F0F', bg: '#1A0F08', ink: '#F4E4C1', display: "'Instrument Serif',serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'diseno', 'audiovisual', 'activaciones', 'social', 'performance'] },
  { id: 'inmobiliario', n: '07', name: 'Inmobiliario y construcción', sub: 'Real Estate',
    desc: 'Tickets altos, ciclo de venta largo, decisión basada en confianza visual.',
    theme: { primary: '#3A3A3A', secondary: '#B8A88A', bg: '#EFECE6', ink: '#000000', display: "'Instrument Serif',serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'diseno', 'audiovisual', 'web', 'performance', 'seo', 'social'] },
  { id: 'educacion', n: '08', name: 'Educación', sub: 'Edu',
    desc: 'Temporadas claras de matrícula, decisión racional y emocional.',
    theme: { primary: '#2E5BFF', secondary: '#FFB800', bg: '#FBFBFD', ink: '#03050C', display: "'Geist',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'audiovisual', 'performance', 'seo', 'web', 'social', 'ia', 'capacitaciones'] },
  { id: 'turismo', n: '09', name: 'Turismo y hospitalidad', sub: 'Travel',
    desc: 'Vende imagen, momentos y emociones. Conversión 100% digital.',
    theme: { primary: '#0D7776', secondary: '#F4A261', bg: '#F1EDE3', ink: '#010202', display: "'Instrument Serif',serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'diseno', 'audiovisual', 'web', 'seo', 'performance', 'social'] },
  { id: 'tech', n: '10', name: 'Tecnología y electrónicos', sub: 'Tech',
    desc: 'Lanzamientos constantes, lenguaje técnico que humanizar.',
    theme: { primary: '#00FFD1', secondary: '#7B61FF', bg: '#050816', ink: '#E8E8FF', display: "'Geist',sans-serif", body: "'Geist Mono',monospace" },
    services: ['estrategia', 'diseno', 'audiovisual', 'performance', 'seo', 'web', 'ia', 'capacitaciones', 'social'] },
  { id: 'moda', n: '11', name: 'Moda y belleza', sub: 'Fashion',
    desc: 'Vive de la estética, las tendencias y los creadores.',
    theme: { primary: '#000000', secondary: '#D4A1A1', bg: '#F5EFE8', ink: '#020202', display: "'Instrument Serif',serif", body: "'Geist',sans-serif" },
    services: ['branding', 'diseno', 'audiovisual', 'social', 'performance', 'web', 'activaciones', 'seo'] },
  { id: 'startups', n: '12', name: 'Fintech, D2C y Startups', sub: 'Startups',
    desc: 'Crecimiento ágil, métricas claras, marca desde cero con presupuesto eficiente.',
    theme: { primary: '#7C3AED', secondary: '#10B981', bg: '#FAFAFA', ink: '#050505', display: "'Geist',sans-serif", body: "'Geist',sans-serif" },
    services: ['estrategia', 'branding', 'web', 'performance', 'seo', 'ia', 'capacitaciones', 'social', 'diseno'] }
]

export type ServiceCopy = Partial<Record<ServiceId, string>>

export const SIZE_SERVICE_COPY: Record<string, ServiceCopy> = {
  cpg: { estrategia: 'Plataformas de marca que aguantan tres años de góndola sin perder filo.', diseno: 'Sistemas gráficos que sobreviven al packaging y al POP sin diluirse.', audiovisual: 'Comerciales y contenido que escalan de TV a Reels sin reciclar fórmulas.', performance: 'Activaciones digitales que mueven sell-out, no solo impresiones.', activaciones: 'Sampling y eventos que se sienten más allá de la marca.', social: 'Community management que entiende que es 70% servicio al cliente.' },
  banca: { estrategia: 'Narrativa de confianza que aguanta crisis y empuja productos.', branding: 'Identidades que cumplen normativa y se ven contemporáneas.', audiovisual: 'Producción de campañas grandes con la prolijidad que la categoría exige.', performance: 'Funnels medidos por costo por cliente activado, no por click.', web: 'Landings de productos financieros que convierten y pasan compliance.', ia: 'Onboarding, scoring y retención automatizados sin romper el cumplimiento.', capacitaciones: 'Equipos internos que aprenden IA con guardrails de la categoría.', social: 'Manejo de redes en categoría regulada con respuestas auditables.' },
  retail: { estrategia: 'Plataforma de marca que sobrevive al calendario sin reducirse a descuentos.', diseno: 'Sistemas para temporada, e-commerce y POP que se producen rápido.', audiovisual: 'Contenido producido en lotes para mantener costos por pieza bajos.', performance: 'Performance ligado a ROAS y ticket promedio, no solo a tráfico.', web: 'E-commerce, PDPs y check-outs que cargan rápido y convierten.', seo: 'Categorías y fichas con CPCs bajo control.', social: 'Calendarios alineados a stock real y promociones vivas.', activaciones: 'Activaciones en tienda física conectadas a la conversación digital.' },
  automotriz: { estrategia: 'Storytelling para una decisión de compra que dura meses.', branding: 'Identidad que aguanta de showroom a Reels sin perder estatus.', audiovisual: 'Producción de alto valor: marca, producto, lifestyle.', performance: 'Lead gen calificado: test drives, cotizaciones, visitas a sala.', web: 'Configuradores y reservas online conectados a CRM real.', activaciones: 'Eventos de lanzamiento y test drives diseñados para convertir.', social: 'Contenido aspiracional y servicio postventa, en el mismo canal.' },
  salud: { estrategia: 'Posicionamiento que cumple regulación y construye autoridad médica.', branding: 'Identidad seria sin volverse fría. Profesional sin volverse vieja.', diseno: 'Materiales para paciente y profesional, con el rigor de la categoría.', audiovisual: 'Educación al paciente y testimonios producidos con sensibilidad.', web: 'Citas online e historiales con UX que respeta al usuario.', seo: 'SEO y SEM para búsquedas de síntoma, especialidad y prestador.', performance: 'Captación digital responsable, dentro del marco de cada vertical.', social: 'Comunidad construida sobre educación, no sobre promesa.' },
  bebidas: { estrategia: 'Plataforma cultural que conecta producto con ocasión de consumo.', branding: 'Identidad que vive bien en botella, en bar y en feed.', diseno: 'Sistemas para etiquetas, ediciones especiales y campañas culturales.', audiovisual: 'Contenido de ocasión, ritual y cultura.', activaciones: 'Eventos y barras de marca como experiencia, no como logo grande.', social: 'Comunidad alrededor de la ocasión, no del producto.', performance: 'Campañas digitales dentro de las restricciones de la categoría.' },
  inmobiliario: { estrategia: 'Narrativa de proyecto que sostiene 18 meses de venta sin agotarse.', branding: 'Identidad que se ve premium en valla, brochure y redes.', diseno: 'Brochures, renders y materiales como sistema, no piezas sueltas.', audiovisual: 'Recorridos virtuales, drone y video aspiracional para etapas tempranas.', web: 'Landings y plataformas de venta con seguimiento real.', performance: 'Lead gen calificado conectado a la fuerza de venta.', seo: 'SEO y SEM para búsquedas de zona, tipología y proyecto.', social: 'Contenido de obra, avance y testimonios para alimentar confianza.' },
  educacion: { estrategia: 'Posicionamiento que diferencia donde casi todos prometen lo mismo.', branding: 'Identidad que conversa con padres y estudiantes a la vez.', audiovisual: 'Tours y testimonios para temporadas de matrícula.', performance: 'Captación medida por matrícula, no por lead bruto.', seo: 'SEO y SEM para carrera, programa y comparadores.', web: 'Admisiones y portales de aspirante con conversión real.', social: 'Aspirante, alumno y egresado en el mismo ecosistema.', ia: 'Admisiones, atención y nurturing automatizados.', capacitaciones: 'Capacitación a docentes y staff para usar IA en aula y back office.' },
  turismo: { estrategia: 'Promesa de experiencia sostenida desde el ad hasta el check-out.', branding: 'Identidad que vende destino o ruta como una idea memorable.', diseno: 'Sistema visual editorial: feed, sitio, brochure, key visuals.', audiovisual: 'Contenido de lugar, momento y emoción.', web: 'Reserva directa que reduce dependencia de OTAs.', seo: 'SEO y SEM para destino, hotel y ruta.', performance: 'Campañas atadas a ocupación y revenue, no a impresiones.', social: 'UGC, creadores y comunidad alrededor del destino.' },
  tech: { estrategia: 'Tecnología compleja traducida a beneficio entendible.', diseno: 'Sistemas para keynote, web, retail, redes en cada lanzamiento.', audiovisual: 'Producto, demo y lifestyle alineados al ciclo de lanzamiento.', performance: 'Performance comparativo: specs, reseñas, retargeting.', seo: 'SEO y SEM para fichas, comparadores y queries técnicos.', web: 'Sitios de producto y configuradores con UX de categoría.', ia: 'Soporte técnico, ventas y postventa automatizados.', capacitaciones: 'Capacitaciones internas en IA aplicada a soporte y producto.', social: 'Comunidad técnica + audiencia general, manejadas distinto.' },
  moda: { branding: 'Identidad que vive en pasarela, feed y empaque sin perder coherencia.', diseno: 'Dirección de arte y sistemas editoriales para cada drop.', audiovisual: 'Lookbooks y contenido de creador al ritmo de la categoría.', social: 'Calendario al ritmo de la cultura, no del marketing.', performance: 'Performance atado a sell-through y a colecciones vivas.', web: 'E-commerce y lookbooks con UX de marca, no de plantilla.', activaciones: 'Lanzamientos, pop-ups y experiencias para creadores.', seo: 'SEO y SEM para colección, prenda y tendencia.' },
  startups: { estrategia: 'Plataforma de marca y mensaje optimizada para tracción.', branding: 'Identidad que sobrevive al pivote y escala con el producto.', web: 'Producto, landing, onboarding. UX de growth, no de brochure.', performance: 'Adquisición medida por CAC, LTV y payback. Sin teatro.', seo: 'SEO y SEM desde cero con foco en intención de compra.', ia: 'Operación, soporte y growth automatizados desde el día uno.', capacitaciones: 'Capacitación a founder y early hires en stack de IA.', social: 'Comunidad y founder-led content donde toca.', diseno: 'Sistemas escalables que no se rompen al primer rediseño.' }
}

export const SIZE_HOME_WORDS: string[] = [
  'amigo', 'ayuda', 'conciencia', 'competencia', 'socio', 'aliado', 'arma', 'escudo'
]

export const SIZE_TEAM: TeamMember[] = [
  { id: 'javier', name: 'Javier Andrade', role: 'Director General',
    quotes: {
      xs: 'Hago publicidad desde antes de Photoshop 5. Sí, lo digo en serio.',
      s:  'Lidero la operación. Mi trabajo es que el equipo entregue lo prometido.',
      m:  'Después de 20 años, entendí que la mejor estrategia es no rendirse en la primera reunión.',
      l:  'DIRIJO. NO MANDO. HAY DIFERENCIA.',
      xl: 'Soy un node en una red de creatividad distribuida. Bleep boop.'
    } },
  { id: 'melissa', name: 'Melissa Ponce', role: 'Directora Creativa',
    quotes: {
      xs: 'Diseño cosas bonitas. Y también algunas feas, pero a propósito.',
      s:  'Lidero la dirección creativa de las cuentas grandes.',
      m:  'Una buena idea no necesita explicación. Una mala, tampoco.',
      l:  'SI NO TE INCOMODA UN POCO, NO ES CREATIVO.',
      xl: 'Co-piloteo entre el caos generativo y la intención humana.'
    } },
  { id: 'rafael', name: 'Rafael Cevallos', role: 'Head of Performance',
    quotes: {
      xs: 'Mido cosas. Hago Excel. Es divertido, lo prometo.',
      s:  'Optimizo medios pagos. Mi KPI es tu KPI.',
      m:  'El performance no es una hoja de cálculo. Es una conversación con el algoritmo.',
      l:  'ROAS O MUERTE.',
      xl: 'Entreno bandits multivariate en producción. El media plan es un grafo vivo.'
    } },
  { id: 'ismael', name: 'Ismael Quezada', role: 'Tech Lead',
    quotes: {
      xs: 'Programo. También arreglo la impresora.',
      s:  'Construyo el software a medida que la agencia entrega a clientes.',
      m:  'El mejor stack es el que tu equipo puede mantener en seis meses.',
      l:  'NO HAY MAGIA. SOLO CACHÉ.',
      xl: 'Compilo realidades alternas en TypeScript. WebGL es el medio.'
    } }
]

export const SIZE_CLIENTS: Client[] = [
  { id: 'mma-el-valle', name: 'MMA El Valle', tagline: 'Gimnasio de artes marciales mixtas en El Valle.',
    desc: 'Construimos la marca, el sitio y la estrategia digital de uno de los gimnasios MMA más activos del valle de Cumbayá. Desde el logo hasta el funnel de membresías.',
    work: [
      { t: 'Identidad de marca', d: 'Logo, paleta y sistema gráfico' },
      { t: 'Sitio web', d: 'Reservas y membresías online' },
      { t: 'Social media', d: 'Calendario semanal y community' },
      { t: 'Producción audiovisual', d: 'Reels de entrenamientos' }
    ] },
  { id: 'cranial-trading', name: 'Cranial Trading', tagline: 'Plataforma educativa de trading cuantitativo.',
    desc: 'De cero a producto: marca, identidad, sitio, onboarding y captación digital para una plataforma de educación en trading algorítmico.',
    work: [
      { t: 'Branding', d: 'Wordmark y manual de marca' },
      { t: 'Web & software', d: 'LMS + portal de estudiantes' },
      { t: 'Performance', d: 'Captación con CAC controlado' },
      { t: 'SEO', d: 'Posicionamiento en queries técnicos' }
    ] },
  { id: 'sin-cero', name: 'Sin-Cero', tagline: 'D2C de bebida funcional sin azúcar.',
    desc: 'Lanzamiento end-to-end: posicionamiento, branding, packaging, e-commerce y campaña de awareness para una bebida funcional D2C.',
    work: [
      { t: 'Estrategia', d: 'Posicionamiento de categoría' },
      { t: 'Branding', d: 'Identidad y packaging' },
      { t: 'E-commerce', d: 'Tienda directa al consumidor' },
      { t: 'Activaciones', d: 'Sampling en eventos fitness' }
    ] }
]

export function findMarket(id: string): Market | undefined {
  return SIZE_MARKETS.find((m) => m.id === id)
}

export function findClient(id: string): Client | undefined {
  return SIZE_CLIENTS.find((c) => c.id === id)
}
