/** site-settings defaults and the navigation global (spec §4, content rules §5). Real launch data. */
import type { L } from './types'

const faq = (es: [string, string][], en: [string, string][]): L<{ q: string; a: string }[]> => ({
  es: es.map(([q, a]) => ({ q, a })),
  en: en.map(([q, a]) => ({ q, a })),
})

export const SETTINGS = {
  whatsapp_message_default: { es: 'Hola, quiero planificar un viaje a Egipto', en: "Hi, I'd like to plan a trip to Egypt" },
  reply_hours: { es: '[pendiente]', en: '[pending]' },
  booking_band: {
    es: {
      enabled: true,
      badge: 'Próximamente',
      title: 'Las reservas online están en camino',
      text: 'Estamos terminando de verificar nuestras primeras excursiones y viajes por Egipto. Mientras tanto, cuéntanos qué estás planeando y te respondemos en persona.',
      primary_label: 'Planifica tu viaje',
      secondary_label: 'Escríbenos por WhatsApp',
    },
    en: {
      enabled: true,
      badge: 'Coming soon',
      title: 'Online booking is on its way',
      text: "We're finishing our first verified excursions and tours in Egypt. Meanwhile, tell us what you're planning and we'll reply personally.",
      primary_label: 'Plan my trip',
      secondary_label: 'Message us on WhatsApp',
    },
  },
  stats: {
    es: [
      { value: '2026', label: 'Guías de viaje actualizadas' },
      { value: '100%', label: 'Contenido en español e inglés' },
      { value: 'Mar Rojo', label: 'Nuestra base' },
    ],
    en: [
      { value: '2026', label: 'Fresh local travel guides' },
      { value: '100%', label: 'Content in Spanish & English' },
      { value: 'Red Sea', label: "Where we're based" },
    ],
  },
  trust_items: {
    es: [
      { icon: 'languages', text: 'Atención en español e inglés', enabled: true },
      { icon: 'map-pin', text: 'Equipo local en el Mar Rojo', enabled: true },
      { icon: 'calendar-check', text: 'Guías actualizadas en 2026', enabled: true },
    ],
    en: [
      { icon: 'languages', text: 'Support in Spanish & English', enabled: true },
      { icon: 'map-pin', text: 'Local team on the Red Sea', enabled: true },
      { icon: 'calendar-check', text: 'Guides updated in 2026', enabled: true },
    ],
  },
  archive_intros: {
    es: {
      tours: {
        h1: 'Viajes a Egipto',
        intro: 'Circuitos por El Cairo, el Nilo y el Mar Rojo, organizados por un equipo que vive en Egipto. Todos se pueden adaptar.',
        seo_text: 'Nuestros viajes a Egipto combinan las pirámides de Guiza, los templos de Luxor y Asuán, un crucero por el Nilo y, si quieres, unos días en el Mar Rojo. Elige por duración o por estilo y escríbenos para ajustarlo a tus fechas.',
        faq: faq(
          [['¿Cuántos días necesito para ver Egipto?', 'Para un primer viaje recomendamos entre 7 y 9 días: El Cairo, tres o cuatro noches por el Nilo y Abu Simbel. Con menos días conviene elegir entre el norte y el sur.'], ['¿Los precios incluyen los vuelos internacionales?', 'No. Los precios son por persona desde el punto indicado en cada viaje; los vuelos internacionales se cotizan aparte.'], ['¿Puedo viajar con niños?', 'Sí. Ajustamos el ritmo, los horarios y el alojamiento para familias.']],
          [['How many days do I need for Egypt?', 'For a first trip we suggest 7 to 9 days: Cairo, three or four nights on the Nile and Abu Simbel. With fewer days it is better to choose between the north and the south.'], ['Do prices include international flights?', 'No. Prices are per person from the starting point shown on each trip; international flights are quoted separately.'], ['Can I travel with children?', 'Yes. We adjust the pace, timings and accommodation for families.']],
        ),
      },
      cruises: {
        h1: 'Cruceros por el Nilo',
        intro: 'Barcos y dahabiyas entre Luxor y Asuán, con visitas guiadas en cada parada.',
        seo_text: 'Un crucero por el Nilo es la forma más cómoda de ver los templos del Alto Egipto: el barco es tu hotel y las visitas empiezan junto al muelle. Compara rutas, duración y tipo de barco.',
        faq: faq(
          [['¿Qué diferencia hay entre un barco y una dahabiya?', 'Los barcos de crucero tienen más camarotes y servicios; la dahabiya es un velero tradicional con pocos camarotes y un ritmo más pausado.'], ['¿En qué sentido es mejor hacer la ruta?', 'Ambos sentidos visitan los mismos templos. De Luxor a Asuán suele ser una noche más larga; te indicamos el sentido en cada salida.'], ['¿Las visitas están incluidas?', 'Cada crucero indica qué visitas incluye. Las entradas se detallan en la sección de precios.']],
          [['What is the difference between a cruise ship and a dahabiya?', 'Cruise ships have more cabins and facilities; a dahabiya is a traditional sailing boat with few cabins and a slower pace.'], ['Which direction should I sail?', 'Both directions visit the same temples. Luxor to Aswan is usually one night longer; each departure shows its direction.'], ['Are the visits included?', 'Each cruise lists the visits it includes. Entry tickets are detailed in the prices section.']],
        ),
      },
      excursions: {
        h1: 'Excursiones en Egipto',
        intro: 'Salidas de un día desde Hurghada, Marsa Alam y El Cairo, con recogida en tu hotel.',
        seo_text: 'Snorkel en los arrecifes del Mar Rojo, Luxor en un día o las pirámides de Guiza: elige tu ciudad de salida y te contamos qué incluye cada excursión.',
        faq: faq(
          [['¿Recogen en el hotel?', 'Sí, en las zonas indicadas en cada excursión. Si tu hotel está fuera, te proponemos un punto de encuentro.'], ['¿Necesito saber nadar para hacer snorkel?', 'Conviene saber nadar. Hay chalecos para quien no se sienta seguro en el agua; avísanos al reservar.'], ['¿Qué pasa si hay viento fuerte?', 'Las salidas en barco dependen del parte del puerto. Si se cancela, te proponemos otra fecha.']],
          [['Do you pick up from my hotel?', 'Yes, in the areas listed for each excursion. If your hotel is outside them, we suggest a meeting point.'], ['Do I need to swim to snorkel?', 'Being able to swim helps. Life vests are available for anyone less confident in the water; let us know when you ask.'], ['What happens if it is very windy?', 'Boat trips depend on the port authority. If one is cancelled we offer another date.']],
        ),
      },
      destinations: {
        h1: 'Destinos de Egipto',
        intro: 'Del delta del Nilo a los arrecifes del sur: lo que vale la pena ver en cada lugar y cuántos días reservar.',
        seo_text: 'Guías por destino con los imprescindibles, la mejor época y cómo llegar, y los viajes que pasan por cada lugar.',
        faq: faq(
          [['¿Qué destinos son imprescindibles en un primer viaje?', 'El Cairo y Guiza, Luxor, Asuán y Abu Simbel. Si te queda tiempo, suma el Mar Rojo.'], ['¿Cómo se viaja entre destinos?', 'En vuelo interno, tren, carretera o crucero por el Nilo, según la ruta.'], ['¿Cuál es la mejor época?', 'De octubre a abril para el valle del Nilo; el Mar Rojo se disfruta casi todo el año.']],
          [['Which places are essential on a first trip?', 'Cairo and Giza, Luxor, Aswan and Abu Simbel. If you have time, add the Red Sea.'], ['How do you travel between places?', 'By domestic flight, train, road or Nile cruise, depending on the route.'], ['When is the best time to go?', 'October to April for the Nile valley; the Red Sea works for most of the year.']],
        ),
      },
      guides: {
        h1: 'Guía de viaje de Egipto',
        intro: 'Consejos prácticos escritos desde Egipto: cuándo ir, qué ver y cómo moverte.',
        seo_text: 'Artículos actualizados en 2026 sobre planificación, destinos, cultura y Mar Rojo. Los datos que cambian a menudo están marcados para que los compruebes antes de viajar.',
        faq: faq(
          [['¿Cada cuánto actualizan las guías?', 'Revisamos cada artículo al menos una vez al año y mostramos la fecha de actualización.'], ['¿Puedo pedir una guía sobre un tema?', 'Sí, escríbenos y lo tendremos en cuenta.'], ['¿Las guías incluyen precios?', 'Solo orientativos y marcados para verificar, porque cambian con frecuencia.']],
          [['How often are the guides updated?', 'We review every article at least once a year and show the update date.'], ['Can I request a guide on a topic?', 'Yes, message us and we will consider it.'], ['Do the guides include prices?', 'Only as rough guidance and marked for checking, because they change often.']],
        ),
      },
    },
  },
  cancellation_policies: [
    {
      key: 'standard',
      name: { es: 'Estándar (muestra)', en: 'Standard (sample)' },
      text: { es: '[Texto de muestra: condiciones de cancelación pendientes de aprobación por el propietario.] Los gastos de cancelación dependen de la antelación con que se comunique. [pendiente]', en: '[Sample text: cancellation terms pending owner approval.] Cancellation charges depend on how far in advance you notify us. [pending]' },
    },
    {
      key: 'flexible',
      name: { es: 'Flexible (muestra)', en: 'Flexible (sample)' },
      text: { es: '[Texto de muestra: condiciones de cancelación pendientes de aprobación por el propietario.] Excursiones de un día: consulta las condiciones al pedir tu presupuesto. [pendiente]', en: '[Sample text: cancellation terms pending owner approval.] Day excursions: ask for the terms when you request a quote. [pending]' },
    },
  ],
}

type Link = { label: string; href: string }
type Col = { heading: string; links: Link[] }
type HeaderItem = { label: string; href: string; columns: Col[]; panel_extra: 'featured' | 'map' | 'latest_guides' | 'none'; featured?: string }

/** Navigation per language. `featured` is a trip key resolved by the seeder. */
export const NAVIGATION: L<{ header: HeaderItem[]; footer_columns: Col[]; footer_description: string; legal_links: Link[] }> = {
  es: {
    header: [
      {
        label: 'Viajes a Egipto', href: '/viajes-a-egipto/', panel_extra: 'featured', featured: 'tour-classic-8',
        columns: [
          { heading: 'Por duración', links: [
            { label: 'Hasta 6 días', href: '/viajes-a-egipto/duracion/hasta-6-dias/' },
            { label: '7–9 días', href: '/viajes-a-egipto/duracion/7-9-dias/' },
            { label: '10–12 días', href: '/viajes-a-egipto/duracion/10-12-dias/' },
            { label: '13 días o más', href: '/viajes-a-egipto/duracion/13-dias-o-mas/' },
          ] },
          { heading: 'Por estilo', links: [
            { label: 'Clásico', href: '/viajes-a-egipto/estilo/clasico/' },
            { label: 'Egipto y Mar Rojo', href: '/viajes-a-egipto/estilo/egipto-y-mar-rojo/' },
            { label: 'Privado', href: '/viajes-a-egipto/estilo/privado/' },
            { label: 'En familia', href: '/viajes-a-egipto/estilo/en-familia/' },
            { label: 'Luna de miel', href: '/viajes-a-egipto/estilo/luna-de-miel/' },
            { label: 'Desierto y aventura', href: '/viajes-a-egipto/estilo/desierto-y-aventura/' },
          ] },
        ],
      },
      {
        label: 'Cruceros por el Nilo', href: '/cruceros-por-el-nilo/', panel_extra: 'featured', featured: 'cruise-luxor-aswan-4',
        columns: [
          { heading: 'Por tipo', links: [
            { label: 'Barcos Luxor–Asuán', href: '/cruceros-por-el-nilo/tipo/crucero-luxor-asuan/' },
            { label: 'Dahabiyas', href: '/cruceros-por-el-nilo/tipo/dahabiya/' },
            { label: 'Lago Nasser', href: '/cruceros-por-el-nilo/tipo/lago-nasser/' },
          ] },
          { heading: 'Rutas principales', links: [
            { label: 'Luxor → Asuán, 4 noches', href: '/cruceros-por-el-nilo/crucero-nilo-luxor-asuan-4-noches/' },
            { label: 'Dahabiya, 5 noches', href: '/cruceros-por-el-nilo/dahabiya-nilo-5-noches/' },
          ] },
        ],
      },
      {
        label: 'Excursiones', href: '/excursiones/', panel_extra: 'featured', featured: 'exc-giftun',
        columns: [
          { heading: 'Desde el Mar Rojo', links: [
            { label: 'Desde Hurghada', href: '/excursiones/desde/hurghada/' },
            { label: 'Desde El Gouna', href: '/excursiones/desde/el-gouna/' },
            { label: 'Desde Marsa Alam', href: '/excursiones/desde/marsa-alam/' },
            { label: 'Desde Sharm el Sheikh', href: '/excursiones/desde/sharm-el-sheikh/' },
          ] },
          { heading: 'Desde el Nilo', links: [
            { label: 'Desde El Cairo', href: '/excursiones/desde/el-cairo/' },
            { label: 'Desde Luxor', href: '/excursiones/desde/luxor/' },
            { label: 'Desde Asuán', href: '/excursiones/desde/asuan/' },
          ] },
        ],
      },
      {
        label: 'Destinos', href: '/destinos/', panel_extra: 'map',
        columns: [
          { heading: 'El Cairo y el Alto Egipto', links: [
            { label: 'El Cairo y Guiza', href: '/destinos/el-cairo-y-guiza/' },
            { label: 'Luxor', href: '/destinos/luxor/' },
            { label: 'Asuán', href: '/destinos/asuan/' },
            { label: 'Abu Simbel', href: '/destinos/abu-simbel/' },
          ] },
          { heading: 'Mar Rojo y desierto', links: [
            { label: 'Hurghada', href: '/destinos/hurghada/' },
            { label: 'Marsa Alam', href: '/destinos/marsa-alam/' },
            { label: 'Mar Rojo', href: '/destinos/region/mar-rojo/' },
            { label: 'Desierto Occidental', href: '/destinos/region/desierto-occidental/' },
          ] },
        ],
      },
      {
        label: 'Guía de viaje', href: '/guia-de-viaje/', panel_extra: 'latest_guides',
        columns: [
          { heading: 'Planificar', links: [
            { label: 'Planificar el viaje', href: '/guia-de-viaje/tema/planificar-el-viaje/' },
            { label: 'Cuándo viajar', href: '/guia-de-viaje/cuando-viajar-a-egipto/' },
          ] },
          { heading: 'Explorar', links: [
            { label: 'Qué ver', href: '/guia-de-viaje/tema/que-ver/' },
            { label: 'Cultura y gastronomía', href: '/guia-de-viaje/tema/cultura-y-gastronomia/' },
            { label: 'Mar Rojo y buceo', href: '/guia-de-viaje/tema/mar-rojo-y-buceo/' },
            { label: 'Itinerarios', href: '/guia-de-viaje/tema/itinerarios/' },
          ] },
        ],
      },
    ],
    footer_description: 'Viajes por Egipto, cruceros por el Nilo y excursiones en el Mar Rojo, planificados con gente de aquí.',
    footer_columns: [
      { heading: 'Viajes', links: [
        { label: 'Viajes de 7–9 días', href: '/viajes-a-egipto/duracion/7-9-dias/' },
        { label: 'Viajes de 10–12 días', href: '/viajes-a-egipto/duracion/10-12-dias/' },
        { label: 'Viajes clásicos', href: '/viajes-a-egipto/estilo/clasico/' },
        { label: 'Egipto y Mar Rojo', href: '/viajes-a-egipto/estilo/egipto-y-mar-rojo/' },
        { label: 'Cruceros por el Nilo', href: '/cruceros-por-el-nilo/' },
      ] },
      { heading: 'Excursiones y destinos', links: [
        { label: 'Excursiones desde Hurghada', href: '/excursiones/desde/hurghada/' },
        { label: 'Excursiones desde Marsa Alam', href: '/excursiones/desde/marsa-alam/' },
        { label: 'El Cairo y Guiza', href: '/destinos/el-cairo-y-guiza/' },
        { label: 'Luxor', href: '/destinos/luxor/' },
        { label: 'Asuán', href: '/destinos/asuan/' },
      ] },
      { heading: 'Hola Egipto', links: [
        { label: 'Sobre nosotros', href: '/sobre-nosotros/' },
        { label: 'Guía de viaje', href: '/guia-de-viaje/' },
        { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
        { label: 'Contacto', href: '/contacto/' },
        { label: 'Planifica tu viaje', href: '/planifica-tu-viaje/' },
      ] },
    ],
    legal_links: [
      { label: 'Aviso legal', href: '/aviso-legal/' },
      { label: 'Privacidad', href: '/politica-de-privacidad/' },
      { label: 'Cookies', href: '/politica-de-cookies/' },
      { label: 'Condiciones y cancelación', href: '/condiciones-y-cancelacion/' },
    ],
  },
  en: {
    header: [
      {
        label: 'Egypt tours', href: '/en/egypt-tours/', panel_extra: 'featured', featured: 'tour-classic-8',
        columns: [
          { heading: 'By length', links: [
            { label: 'Up to 6 days', href: '/en/egypt-tours/duration/up-to-6-days/' },
            { label: '7–9 days', href: '/en/egypt-tours/duration/7-9-days/' },
            { label: '10–12 days', href: '/en/egypt-tours/duration/10-12-days/' },
            { label: '13 days or more', href: '/en/egypt-tours/duration/13-days-or-more/' },
          ] },
          { heading: 'By style', links: [
            { label: 'Classic', href: '/en/egypt-tours/style/classic/' },
            { label: 'Egypt & Red Sea', href: '/en/egypt-tours/style/egypt-red-sea/' },
            { label: 'Private', href: '/en/egypt-tours/style/private/' },
            { label: 'Family', href: '/en/egypt-tours/style/family/' },
            { label: 'Honeymoon', href: '/en/egypt-tours/style/honeymoon/' },
            { label: 'Desert & adventure', href: '/en/egypt-tours/style/desert-adventure/' },
          ] },
        ],
      },
      {
        label: 'Nile cruises', href: '/en/nile-cruises/', panel_extra: 'featured', featured: 'cruise-luxor-aswan-4',
        columns: [
          { heading: 'By type', links: [
            { label: 'Luxor–Aswan ships', href: '/en/nile-cruises/type/luxor-aswan-cruise/' },
            { label: 'Dahabiyas', href: '/en/nile-cruises/type/dahabiya/' },
            { label: 'Lake Nasser', href: '/en/nile-cruises/type/lake-nasser/' },
          ] },
          { heading: 'Main routes', links: [
            { label: 'Luxor → Aswan, 4 nights', href: '/en/nile-cruises/nile-cruise-luxor-aswan-4-nights/' },
            { label: 'Dahabiya, 5 nights', href: '/en/nile-cruises/nile-dahabiya-5-nights/' },
          ] },
        ],
      },
      {
        label: 'Excursions', href: '/en/excursions/', panel_extra: 'featured', featured: 'exc-giftun',
        columns: [
          { heading: 'From the Red Sea', links: [
            { label: 'From Hurghada', href: '/en/excursions/from/hurghada/' },
            { label: 'From El Gouna', href: '/en/excursions/from/el-gouna/' },
            { label: 'From Marsa Alam', href: '/en/excursions/from/marsa-alam/' },
            { label: 'From Sharm el Sheikh', href: '/en/excursions/from/sharm-el-sheikh/' },
          ] },
          { heading: 'From the Nile', links: [
            { label: 'From Cairo', href: '/en/excursions/from/cairo/' },
            { label: 'From Luxor', href: '/en/excursions/from/luxor/' },
            { label: 'From Aswan', href: '/en/excursions/from/aswan/' },
          ] },
        ],
      },
      {
        label: 'Destinations', href: '/en/destinations/', panel_extra: 'map',
        columns: [
          { heading: 'Cairo and Upper Egypt', links: [
            { label: 'Cairo and Giza', href: '/en/destinations/cairo-and-giza/' },
            { label: 'Luxor', href: '/en/destinations/luxor/' },
            { label: 'Aswan', href: '/en/destinations/aswan/' },
            { label: 'Abu Simbel', href: '/en/destinations/abu-simbel/' },
          ] },
          { heading: 'Red Sea and desert', links: [
            { label: 'Hurghada', href: '/en/destinations/hurghada/' },
            { label: 'Marsa Alam', href: '/en/destinations/marsa-alam/' },
            { label: 'Red Sea', href: '/en/destinations/region/red-sea/' },
            { label: 'Western Desert', href: '/en/destinations/region/western-desert/' },
          ] },
        ],
      },
      {
        label: 'Travel guide', href: '/en/travel-guide/', panel_extra: 'latest_guides',
        columns: [
          { heading: 'Plan', links: [
            { label: 'Planning', href: '/en/travel-guide/topic/planning/' },
            { label: 'When to visit', href: '/en/travel-guide/when-to-visit-egypt/' },
          ] },
          { heading: 'Explore', links: [
            { label: 'What to see', href: '/en/travel-guide/topic/what-to-see/' },
            { label: 'Culture & food', href: '/en/travel-guide/topic/culture-food/' },
            { label: 'Red Sea & diving', href: '/en/travel-guide/topic/red-sea-diving/' },
            { label: 'Itineraries', href: '/en/travel-guide/topic/itineraries/' },
          ] },
        ],
      },
    ],
    footer_description: 'Egypt tours, Nile cruises and Red Sea excursions, planned with people who live here.',
    footer_columns: [
      { heading: 'Trips', links: [
        { label: '7–9 day tours', href: '/en/egypt-tours/duration/7-9-days/' },
        { label: '10–12 day tours', href: '/en/egypt-tours/duration/10-12-days/' },
        { label: 'Classic tours', href: '/en/egypt-tours/style/classic/' },
        { label: 'Egypt & Red Sea', href: '/en/egypt-tours/style/egypt-red-sea/' },
        { label: 'Nile cruises', href: '/en/nile-cruises/' },
      ] },
      { heading: 'Excursions and destinations', links: [
        { label: 'Excursions from Hurghada', href: '/en/excursions/from/hurghada/' },
        { label: 'Excursions from Marsa Alam', href: '/en/excursions/from/marsa-alam/' },
        { label: 'Cairo and Giza', href: '/en/destinations/cairo-and-giza/' },
        { label: 'Luxor', href: '/en/destinations/luxor/' },
        { label: 'Aswan', href: '/en/destinations/aswan/' },
      ] },
      { heading: 'Hola Egipto', links: [
        { label: 'About us', href: '/en/about-us/' },
        { label: 'Travel guide', href: '/en/travel-guide/' },
        { label: 'FAQ', href: '/en/faq/' },
        { label: 'Contact', href: '/en/contact/' },
        { label: 'Plan my trip', href: '/en/plan-my-trip/' },
      ] },
    ],
    legal_links: [
      { label: 'Legal notice', href: '/en/legal-notice/' },
      { label: 'Privacy', href: '/en/privacy-policy/' },
      { label: 'Cookies', href: '/en/cookie-policy/' },
      { label: 'Terms and cancellation', href: '/en/terms-and-cancellation/' },
    ],
  },
}
