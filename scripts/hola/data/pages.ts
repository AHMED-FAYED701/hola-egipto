/** Fixed pages (contracts §5) with draft copy (content rules §5–§6). Real launch data, not samples. */
import type { L } from './types'

export type PageBlock = Record<string, unknown> & { blockType: string }
export type Rich = ({ h2: string } | { h3: string } | { p: string } | { ul: string[] })[]

export interface PageSeed {
  key: string
  template: 'home' | 'default' | 'about' | 'contact' | 'faq' | 'plan-my-trip' | 'thank-you' | 'legal'
  title: L
  slug: L
  excerpt: L
  content?: L<Rich>
  layout?: L<PageBlock[]>
  faq_groups?: L<{ title: string; items: { q: string; a: string }[] }[]>
}

const LEGAL_ES = '[Texto legal pendiente: lo aporta el propietario]'
const LEGAL_EN = '[Legal text pending: supplied by the owner]'
const legal = (headings: L<string[]>, extra?: L<Rich>): L<Rich> => ({
  es: [...headings.es.flatMap((h) => [{ h2: h }, { p: LEGAL_ES }]), ...(extra?.es ?? [])],
  en: [...headings.en.flatMap((h) => [{ h2: h }, { p: LEGAL_EN }]), ...(extra?.en ?? [])],
})

export const PAGES: PageSeed[] = [
  {
    key: 'home',
    template: 'home',
    title: { es: 'Inicio', en: 'Home' },
    slug: { es: 'inicio', en: 'home' },
    excerpt: {
      es: 'Viajes por Egipto, cruceros por el Nilo y excursiones en el Mar Rojo, planificados con un equipo local que te atiende en español.',
      en: 'Egypt tours, Nile cruises and Red Sea excursions, planned with a local team that answers you in English or Spanish.',
    },
    layout: {
      es: [
        { blockType: 'hero', heading: 'Tu viaje a Egipto, planificado con gente de aquí', lead: 'Circuitos por El Cairo y el Alto Egipto, cruceros por el Nilo y excursiones en el Mar Rojo, organizados por un equipo que vive en Egipto.', image: 'home-hero', show_stats: true, draft: true },
        { blockType: 'booking-band' },
        { blockType: 'trust-bar' },
        { blockType: 'destinations-grid', eyebrow: 'Destinos', title: 'Los rincones de Egipto que vale la pena incluir en tu viaje', intro: 'De las pirámides de Guiza a los arrecifes de Marsa Alam: seis lugares para empezar a dibujar tu ruta.', limit: 6 },
        { blockType: 'trips-grid', eyebrow: 'Viajes', title: 'Viajes por Egipto', intro: 'Rutas completas con guía en español, que adaptamos a tus fechas y a tu ritmo.', limit: 6 },
        { blockType: 'cruises-split', eyebrow: 'Cruceros por el Nilo', title: 'El Nilo, de Luxor a Asuán', intro: 'Tres a cinco noches a bordo entre templos, con el río como hilo del viaje. En barco de crucero o en dahabiya.', image: 'hero-cruises' },
        { blockType: 'excursions-by-city', eyebrow: 'Excursiones', title: 'Excursiones por ciudad de salida', intro: 'Salidas de un día con recogida en tu hotel.', cities: ['hurghada', 'marsa-alam', 'el-cairo'] },
        { blockType: 'why', eyebrow: 'Por qué Hola Egipto', title: 'Planificar con gente que vive aquí', draft: true, columns: [
          { icon: 'map-pin', title: 'Equipo local en el Mar Rojo', text: 'Vivimos y trabajamos en Egipto. Conocemos los horarios, las distancias y los detalles que no salen en los folletos.' },
          { icon: 'languages', title: 'Todo en español e inglés', text: 'Te atendemos en tu idioma desde la primera pregunta hasta el último traslado.' },
          { icon: 'compass', title: 'Viajes a tu medida', text: 'Partimos de una ruta probada y la ajustamos a tus fechas, tu presupuesto y tu ritmo.' },
        ] },
        { blockType: 'guides-grid', eyebrow: 'Guía de viaje', title: 'Antes de viajar', intro: 'Consejos prácticos escritos desde Egipto.', limit: 3 },
        { blockType: 'cta-band', title: 'Cuéntanos qué estás planeando', text: 'Te respondemos en persona con una propuesta concreta.' },
      ],
      en: [
        { blockType: 'hero', heading: 'Your Egypt trip, planned with people who live here', lead: 'Tours of Cairo and Upper Egypt, Nile cruises and Red Sea excursions, organised by a team based in Egypt.', image: 'home-hero', show_stats: true, draft: true },
        { blockType: 'booking-band' },
        { blockType: 'trust-bar' },
        { blockType: 'destinations-grid', eyebrow: 'Destinations', title: 'The corners of Egypt worth building your trip around', intro: 'From the Giza pyramids to the reefs of Marsa Alam: six places to start shaping your route.', limit: 6 },
        { blockType: 'trips-grid', eyebrow: 'Tours', title: 'Egypt tours', intro: 'Complete routes with English-speaking guides, adjusted to your dates and pace.', limit: 6 },
        { blockType: 'cruises-split', eyebrow: 'Nile cruises', title: 'The Nile, from Luxor to Aswan', intro: 'Three to five nights on board between temples, with the river as the thread of the trip. On a cruise ship or a dahabiya.', image: 'hero-cruises' },
        { blockType: 'excursions-by-city', eyebrow: 'Excursions', title: 'Excursions by departure city', intro: 'Day trips with hotel pickup.', cities: ['hurghada', 'marsa-alam', 'el-cairo'] },
        { blockType: 'why', eyebrow: 'Why Hola Egipto', title: 'Plan with people who live here', draft: true, columns: [
          { icon: 'map-pin', title: 'A local team on the Red Sea', text: 'We live and work in Egypt. We know the timings, the distances and the details brochures leave out.' },
          { icon: 'languages', title: 'Everything in English and Spanish', text: 'We answer in your language from the first question to the last transfer.' },
          { icon: 'compass', title: 'Trips shaped around you', text: 'We start from a tested route and adjust it to your dates, budget and pace.' },
        ] },
        { blockType: 'guides-grid', eyebrow: 'Travel guide', title: 'Before you travel', intro: 'Practical advice written in Egypt.', limit: 3 },
        { blockType: 'cta-band', title: "Tell us what you're planning", text: 'We reply personally with a concrete proposal.' },
      ],
    },
  },
  {
    key: 'about',
    template: 'about',
    title: { es: 'Sobre nosotros', en: 'About us' },
    slug: { es: 'sobre-nosotros', en: 'about-us' },
    excerpt: { es: 'Quiénes somos y cómo trabajamos para organizar tu viaje a Egipto.', en: 'Who we are and how we work to organise your Egypt trip.' },
    layout: {
      es: [
        { blockType: 'text', eyebrow: 'Nuestra historia', title: 'Una agencia pequeña con base en el Mar Rojo', body: [{ p: '[pendiente] La historia de Hola Egipto la aporta el propietario.' }], draft: true },
        { blockType: 'team', eyebrow: 'Equipo', title: 'Las personas que te atienden', members: [
          { name: 'Nombre pendiente', role: 'Rol pendiente', languages: 'Español · Inglés' },
          { name: 'Nombre pendiente', role: 'Rol pendiente', languages: 'Español · Inglés' },
          { name: 'Nombre pendiente', role: 'Rol pendiente', languages: 'Español · Inglés' },
        ] },
        { blockType: 'steps', eyebrow: 'Cómo trabajamos', title: 'De la primera pregunta al último traslado', draft: true, items: [
          { title: 'Nos cuentas tu idea', text: 'Fechas aproximadas, con quién viajas y qué te gustaría ver. Por el formulario o por WhatsApp.' },
          { title: 'Te proponemos una ruta', text: 'Una propuesta concreta con días, alojamientos y precio, que ajustamos contigo.' },
          { title: 'Viajas con apoyo local', text: 'Durante el viaje tienes a nuestro equipo en Egipto para cualquier cambio.' },
        ] },
        { blockType: 'licence', title: 'Licencia', text: '[pendiente] Empresa operadora y número de licencia del Ministerio de Turismo.' },
        { blockType: 'cta-band', title: 'Cuéntanos qué estás planeando', text: 'Te respondemos en persona.' },
      ],
      en: [
        { blockType: 'text', eyebrow: 'Our story', title: 'A small agency based on the Red Sea', body: [{ p: '[pending] The Hola Egipto story is supplied by the owner.' }], draft: true },
        { blockType: 'team', eyebrow: 'Team', title: 'The people who answer you', members: [
          { name: 'Name pending', role: 'Role pending', languages: 'Spanish · English' },
          { name: 'Name pending', role: 'Role pending', languages: 'Spanish · English' },
          { name: 'Name pending', role: 'Role pending', languages: 'Spanish · English' },
        ] },
        { blockType: 'steps', eyebrow: 'How we work', title: 'From the first question to the last transfer', draft: true, items: [
          { title: 'Tell us your idea', text: 'Rough dates, who you are travelling with and what you would like to see. Through the form or WhatsApp.' },
          { title: 'We suggest a route', text: 'A concrete proposal with days, accommodation and price, which we adjust with you.' },
          { title: 'Travel with local support', text: 'During the trip our team in Egypt is there for any change.' },
        ] },
        { blockType: 'licence', title: 'Licence', text: '[pending] Operating company and Ministry of Tourism licence number.' },
        { blockType: 'cta-band', title: "Tell us what you're planning", text: 'We reply personally.' },
      ],
    },
  },
  {
    key: 'contact',
    template: 'contact',
    title: { es: 'Contacto', en: 'Contact' },
    slug: { es: 'contacto', en: 'contact' },
    excerpt: { es: 'Escríbenos por WhatsApp o por email, o déjanos un mensaje. Te respondemos en persona.', en: 'Message us on WhatsApp or by email, or leave us a note. We reply personally.' },
    content: {
      es: [{ p: 'Cuéntanos qué necesitas. Si ya tienes fechas o un viaje en mente, el formulario «Planifica tu viaje» nos ayuda a responderte con más detalle.' }],
      en: [{ p: 'Tell us what you need. If you already have dates or a trip in mind, the “Plan my trip” form helps us reply in more detail.' }],
    },
  },
  {
    key: 'faq',
    template: 'faq',
    title: { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },
    slug: { es: 'preguntas-frecuentes', en: 'faq' },
    excerpt: { es: 'Respuestas a las dudas más habituales antes, durante y después de reservar tu viaje a Egipto.', en: 'Answers to the most common questions before, during and after booking your Egypt trip.' },
    faq_groups: {
      es: [
        { title: 'Antes de reservar', items: [
          { q: '¿Cómo empiezo a planificar mi viaje?', a: 'Rellena el formulario «Planifica tu viaje» o escríbenos. Con tus fechas aproximadas, el número de viajeros y lo que te gustaría ver te preparamos una propuesta.' },
          { q: '¿Necesito visado para Egipto?', a: 'Depende de tu nacionalidad y las normas cambian. Consulta la información oficial antes de viajar. [verificar]' },
          { q: '¿Cuál es la mejor época para viajar?', a: 'De octubre a abril las temperaturas son más suaves en el valle del Nilo. El Mar Rojo se disfruta casi todo el año.' },
        ] },
        { title: 'Pagos', items: [
          { q: '¿Cómo se paga un viaje?', a: 'Las condiciones de pago se indican en la propuesta de cada viaje. [pendiente]' },
          { q: '¿En qué moneda están los precios?', a: 'En euros en la web en español y en dólares en la web en inglés. Son precios desde, por persona, según la base indicada en cada viaje.' },
          { q: '¿Puedo reservar online?', a: 'Todavía no. Las reservas online están en camino; mientras tanto gestionamos cada viaje en persona.' },
        ] },
        { title: 'Durante el viaje', items: [
          { q: '¿Los guías hablan español?', a: 'Cada viaje indica los idiomas del guía. Trabajamos con guías en español y en inglés.' },
          { q: '¿Qué ropa conviene llevar?', a: 'Ropa ligera que cubra hombros y rodillas para templos y mezquitas, calzado cómodo, sombrero y protección solar.' },
          { q: '¿Puedo contactar con ustedes durante el viaje?', a: 'Sí. Te damos un contacto de nuestro equipo local al confirmar el viaje. [pendiente]' },
        ] },
        { title: 'Cancelaciones', items: [
          { q: '¿Qué pasa si tengo que cancelar?', a: 'Depende de la política de cada viaje y de la antelación. Las condiciones se detallan en la propuesta. [pendiente]' },
          { q: '¿Puedo cambiar las fechas?', a: 'Lo intentamos siempre que haya disponibilidad. Los posibles costes dependen de los servicios ya reservados.' },
          { q: '¿Qué ocurre si se cancela una excursión por el tiempo?', a: 'Si el puerto cierra o las condiciones no lo permiten, te proponemos otra fecha o una alternativa.' },
        ] },
      ],
      en: [
        { title: 'Before booking', items: [
          { q: 'How do I start planning my trip?', a: 'Fill in the “Plan my trip” form or message us. With rough dates, the number of travellers and what you would like to see, we prepare a proposal.' },
          { q: 'Do I need a visa for Egypt?', a: 'It depends on your nationality and the rules change. Check the official information before you travel. [verify]' },
          { q: 'When is the best time to travel?', a: 'From October to April temperatures are milder in the Nile valley. The Red Sea works for most of the year.' },
        ] },
        { title: 'Payments', items: [
          { q: 'How do I pay for a trip?', a: 'Payment terms are set out in the proposal for each trip. [pending]' },
          { q: 'What currency are prices in?', a: 'Euros on the Spanish site and US dollars on the English site. They are from-prices per person, on the basis shown for each trip.' },
          { q: 'Can I book online?', a: 'Not yet. Online booking is on its way; meanwhile we handle every trip personally.' },
        ] },
        { title: 'During the trip', items: [
          { q: 'Do the guides speak English?', a: 'Each trip shows the guide languages. We work with English- and Spanish-speaking guides.' },
          { q: 'What should I wear?', a: 'Light clothing that covers shoulders and knees for temples and mosques, comfortable shoes, a hat and sun protection.' },
          { q: 'Can I reach you during the trip?', a: 'Yes. You get a contact for our local team when the trip is confirmed. [pending]' },
        ] },
        { title: 'Cancellations', items: [
          { q: 'What if I have to cancel?', a: 'It depends on each trip’s policy and on notice. The terms are set out in the proposal. [pending]' },
          { q: 'Can I change my dates?', a: 'We try whenever there is availability. Any costs depend on the services already booked.' },
          { q: 'What happens if an excursion is cancelled because of the weather?', a: 'If the port closes or conditions do not allow it, we offer another date or an alternative.' },
        ] },
      ],
    },
  },
  {
    key: 'plan-my-trip',
    template: 'plan-my-trip',
    title: { es: 'Planifica tu viaje', en: 'Plan my trip' },
    slug: { es: 'planifica-tu-viaje', en: 'plan-my-trip' },
    excerpt: { es: 'Cuéntanos en cuatro pasos qué viaje te imaginas y te respondemos con una propuesta personal.', en: 'Tell us in four steps what trip you have in mind and we will reply with a personal proposal.' },
    content: {
      es: [{ p: 'Cuatro pasos cortos. Solo el nombre, el email y el número de adultos son obligatorios.' }],
      en: [{ p: 'Four short steps. Only your name, email and number of adults are required.' }],
    },
  },
  {
    key: 'thank-you',
    template: 'thank-you',
    title: { es: 'Gracias por tu mensaje', en: 'Thank you for your message' },
    slug: { es: 'gracias', en: 'thank-you' },
    excerpt: { es: 'Hemos recibido tu solicitud.', en: 'We have received your request.' },
    content: {
      es: [{ p: 'Hemos recibido tu solicitud. Una persona de nuestro equipo la revisará y te responderá por el canal que has elegido.' }],
      en: [{ p: 'We have received your request. Someone from our team will review it and reply through the channel you chose.' }],
    },
  },
  {
    key: 'legal-notice',
    template: 'legal',
    title: { es: 'Aviso legal', en: 'Legal notice' },
    slug: { es: 'aviso-legal', en: 'legal-notice' },
    excerpt: { es: 'Datos de la empresa que opera Hola Egipto.', en: 'Details of the company that operates Hola Egipto.' },
    content: legal({
      es: ['Empresa operadora', 'Dirección', 'Registro', 'Licencia de turismo', 'Contacto'],
      en: ['Operating company', 'Address', 'Registration', 'Tourism licence', 'Contact'],
    }),
  },
  {
    key: 'privacy',
    template: 'legal',
    title: { es: 'Política de privacidad', en: 'Privacy policy' },
    slug: { es: 'politica-de-privacidad', en: 'privacy-policy' },
    excerpt: { es: 'Cómo tratamos los datos que nos envías.', en: 'How we handle the data you send us.' },
    content: legal({
      es: ['Responsable del tratamiento', 'Finalidades', 'Base legal', 'Encargados del tratamiento', 'Transferencias internacionales', 'Conservación', 'Tus derechos'],
      en: ['Controller', 'Purposes', 'Legal basis', 'Processors', 'International transfers', 'Retention', 'Your rights'],
    }),
  },
  {
    key: 'cookies',
    template: 'legal',
    title: { es: 'Política de cookies', en: 'Cookie policy' },
    slug: { es: 'politica-de-cookies', en: 'cookie-policy' },
    excerpt: { es: 'Qué cookies usa este sitio y cómo gestionarlas.', en: 'Which cookies this site uses and how to manage them.' },
    content: legal(
      { es: ['Qué son las cookies', 'Cómo gestionarlas'], en: ['What cookies are', 'How to manage them'] },
      {
        es: [
          { h2: 'Cookies propias de este sitio' },
          { ul: [
            'hola_consent — guarda tu elección de cookies (necesaria, 12 meses).',
            'hola_preview — acceso de revisión al sitio antes del lanzamiento (necesaria, 30 días).',
            'hola_session — sesión del panel de administración, solo para el equipo (necesaria, 7 días).',
            'hola_admin_lang — idioma del panel de administración, solo para el equipo (necesaria, 12 meses).',
          ] },
          { p: 'Las cookies de analítica y publicidad solo se activan si las aceptas en el aviso de cookies. [pendiente]' },
        ],
        en: [
          { h2: "This site's own cookies" },
          { ul: [
            'hola_consent — stores your cookie choice (necessary, 12 months).',
            'hola_preview — review access to the site before launch (necessary, 30 days).',
            'hola_session — admin panel session, team only (necessary, 7 days).',
            'hola_admin_lang — admin panel language, team only (necessary, 12 months).',
          ] },
          { p: 'Analytics and advertising cookies are only set if you accept them in the cookie notice. [pending]' },
        ],
      },
    ),
  },
  {
    key: 'terms',
    template: 'legal',
    title: { es: 'Condiciones y cancelación', en: 'Terms and cancellation' },
    slug: { es: 'condiciones-y-cancelacion', en: 'terms-and-cancellation' },
    excerpt: { es: 'Condiciones de reserva, pago y cancelación.', en: 'Booking, payment and cancellation terms.' },
    content: legal({
      es: ['Reserva y pago', 'Cancelación', 'Cambios', 'Fuerza mayor', 'Responsabilidad', 'Viajes combinados'],
      en: ['Booking and payment', 'Cancellation', 'Changes', 'Force majeure', 'Liability', 'Package travel'],
    }),
  },
]
