import type { TourSample } from './types'

/** Sample tours (content rules §2). Prices are sample values set by the owner; changeable facts carry [verificar]/[verify]. */
export const TOURS: TourSample[] = [
  // ---------------------------------------------------------------------------
  // 1. Classic Egypt, 8 days
  // ---------------------------------------------------------------------------
  {
    collection: 'tours',
    key: 'tour-classic-8',
    title: {
      es: 'Egipto clásico en 8 días: El Cairo, Nilo y Abu Simbel',
      en: 'Classic Egypt in 8 days: Cairo, the Nile and Abu Simbel',
    },
    slug: { es: 'egipto-clasico-8-dias', en: 'classic-egypt-8-days' },
    excerpt: {
      es: 'Pirámides de Guiza, vuelo a Asuán, excursión a Abu Simbel y crucero por el Nilo hasta Luxor, con guía en español y grupo reducido.',
      en: 'The Giza pyramids, a flight to Aswan, a day at Abu Simbel and a Nile cruise to Luxor, with a Spanish- or English-speaking guide.',
    },
    subtitle: {
      es: 'El Cairo, Asuán, Abu Simbel, crucero por el Nilo y Luxor',
      en: 'Cairo, Aswan, Abu Simbel, a Nile cruise and Luxor',
    },
    overview: {
      es: [
        'Este itinerario reúne en ocho días los lugares que casi todo el mundo quiere ver en su primer viaje a Egipto. Empiezas en El Cairo con las pirámides de Guiza, la Esfinge y el Gran Museo Egipcio, y después vuelas al sur, a Asuán, donde te espera el barco.',
        'Desde Asuán sales por carretera hacia Abu Simbel, unos 280 km al sur, para ver los dos templos excavados en la roca por Ramsés II. De vuelta al barco, el crucero baja por el Nilo con paradas en Kom Ombo y Edfu antes de llegar a Luxor.',
        'En Luxor visitas Karnak y el Templo de Luxor en la orilla oriental, y el Valle de los Reyes y el templo de Hatshepsut en la occidental. El último tramo te devuelve a El Cairo para tu vuelo de regreso.',
      ],
      en: [
        'This route covers, in eight days, the places most people want to see on a first trip to Egypt. You start in Cairo with the Giza pyramids, the Sphinx and the Grand Egyptian Museum, then fly south to Aswan to board your Nile boat.',
        'From Aswan you drive to Abu Simbel, about 280 km to the south, to see the two rock-cut temples of Ramesses II. Back on board, the boat sails downriver with stops at Kom Ombo and Edfu before reaching Luxor.',
        'In Luxor you visit Karnak and Luxor Temple on the east bank, and the Valley of the Kings and the temple of Hatshepsut on the west bank. A domestic flight then takes you back to Cairo for your trip home.',
      ],
    },
    meta_description: {
      es: 'Viaje de 8 días por Egipto: pirámides de Guiza, Abu Simbel, crucero por el Nilo de Asuán a Luxor y Valle de los Reyes. Desde 1290 € por persona.',
      en: '8-day Egypt tour: the Giza pyramids, Abu Simbel, a Nile cruise from Aswan to Luxor and the Valley of the Kings. From €1290 per person.',
    },
    featured_image: 'card-tour-classic',
    gallery: ['sight-giza', 'sight-sphinx', 'sight-abu-simbel-great', 'nile-deck', 'sight-karnak'],
    price_from_eur: 1290,
    price_from_usd: 1390,
    price_basis: 'per_person_double',
    price_note: {
      es: 'Precio desde, por persona en habitación o camarote doble, en temporada media. El precio final depende de la fecha y del tipo de alojamiento que elijas.',
      en: 'From price per person sharing a double room or cabin in mid season. The final price depends on your dates and the type of accommodation you choose.',
    },
    group_type: 'small',
    group_min: 2,
    group_max: 16,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Pirámides de Guiza y Esfinge con guía',
        'Visita al Gran Museo Egipcio',
        'Excursión por carretera a los templos de Abu Simbel',
        'Crucero de cuatro noches por el Nilo de Asuán a Luxor',
        'Templos de Kom Ombo y Edfu durante la navegación',
        'Karnak y Templo de Luxor en la orilla oriental',
        'Valle de los Reyes y templo de Hatshepsut',
      ],
      en: [
        'Guided visit to the Giza pyramids and the Sphinx',
        'Time at the Grand Egyptian Museum',
        'Road trip to the temples of Abu Simbel',
        'Four-night Nile cruise from Aswan to Luxor',
        'Kom Ombo and Edfu temples along the way',
        'Karnak and Luxor Temple on the east bank',
        'Valley of the Kings and the temple of Hatshepsut',
      ],
    },
    itinerary: {
      es: [
        {
          label: 'Día 1',
          title: 'Llegada a El Cairo',
          description:
            'Te recibimos en el aeropuerto de El Cairo y te llevamos al hotel. El resto del día es libre para descansar del vuelo. Por la tarde recibes la información del viaje y los horarios del día siguiente.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 2',
          title: 'Pirámides de Guiza, Esfinge y Gran Museo Egipcio',
          description:
            'Por la mañana visitas la meseta de Guiza con las pirámides de Keops, Kefrén y Micerinos, y la Esfinge. Después del almuerzo recorres el Gran Museo Egipcio, junto a la meseta. Vuelta al hotel a media tarde.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 3',
          title: 'Vuelo a Asuán y embarque en el crucero',
          description:
            'Traslado al aeropuerto para el vuelo doméstico a Asuán; el horario depende de la compañía [verificar]. Al llegar subes al barco y por la tarde visitas el templo de Philae, en su isla. Cena y noche a bordo, amarrados en Asuán.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 4',
          title: 'Excursión a Abu Simbel',
          description:
            'Sales de madrugada por carretera hacia Abu Simbel, a unos 280 km al sur de Asuán. Visitas el templo mayor de Ramsés II y el templo de Nefertari, frente al lago Nasser. Regreso al barco a primera hora de la tarde y tiempo libre a bordo.',
          places: ['dest-abu-simbel', 'dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 5',
          title: 'Navegación a Kom Ombo',
          description:
            'El barco zarpa hacia el norte y navega entre palmerales y campos de cultivo. Por la tarde desembarcas en Kom Ombo para ver el templo dedicado a Sobek y Haroeris, junto al río. Por la noche el barco sigue hacia Edfu.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 6',
          title: 'Templo de Edfu y llegada a Luxor',
          description:
            'Temprano visitas el templo de Horus en Edfu, con sus muros y techos casi completos. El barco continúa hacia Luxor y por la tarde recorres Karnak y el Templo de Luxor, en la orilla oriental. Última noche a bordo.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 7',
          title: 'Orilla occidental de Luxor y vuelo a El Cairo',
          description:
            'Desembarcas y cruzas a la orilla occidental para visitar el Valle de los Reyes, el templo de Hatshepsut y los Colosos de Memnón. Por la tarde, vuelo doméstico a El Cairo [verificar horarios]. Traslado al hotel.',
          places: ['dest-luxor', 'dest-cairo'],
          meals: ['B'],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 8',
          title: 'Regreso',
          description:
            'Desayuno y tiempo libre según la hora de tu vuelo. Te llevamos al aeropuerto de El Cairo para el vuelo internacional de vuelta.',
          places: ['dest-cairo'],
          meals: ['B'],
        },
      ],
      en: [
        {
          label: 'Day 1',
          title: 'Arrival in Cairo',
          description:
            'We meet you at Cairo airport and drive you to your hotel. The rest of the day is free to rest after the flight. In the evening you receive your trip documents and the plan for the next day.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 2',
          title: 'Giza pyramids, the Sphinx and the Grand Egyptian Museum',
          description:
            'In the morning you visit the Giza plateau, with the pyramids of Khufu, Khafre and Menkaure and the Sphinx. After lunch you explore the Grand Egyptian Museum next to the plateau. Back at the hotel by mid-afternoon.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 3',
          title: 'Fly to Aswan and board the boat',
          description:
            'Transfer to the airport for the domestic flight to Aswan; flight times depend on the airline [verify]. On arrival you board the boat, and in the afternoon you visit the temple of Philae on its island. Dinner and overnight on board, moored in Aswan.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 4',
          title: 'Day trip to Abu Simbel',
          description:
            'An early start by road to Abu Simbel, about 280 km south of Aswan. You visit the Great Temple of Ramesses II and the temple of Nefertari, both facing Lake Nasser. Back on board in the early afternoon, with free time on deck.',
          places: ['dest-abu-simbel', 'dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 5',
          title: 'Sail to Kom Ombo',
          description:
            'The boat heads north past palm groves and farmland. In the afternoon you go ashore at Kom Ombo to see the riverside temple of Sobek and Haroeris. The boat sails on towards Edfu overnight.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 6',
          title: 'Edfu and on to Luxor',
          description:
            'Early in the morning you visit the temple of Horus at Edfu, with its walls and roofs still largely intact. The boat continues to Luxor, where you spend the afternoon at Karnak and Luxor Temple on the east bank. Last night on board.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 7',
          title: "Luxor's west bank and fly to Cairo",
          description:
            'You leave the boat and cross to the west bank for the Valley of the Kings, the temple of Hatshepsut and the Colossi of Memnon. In the afternoon you take a domestic flight to Cairo [verify flight times]. Transfer to your hotel.',
          places: ['dest-luxor', 'dest-cairo'],
          meals: ['B'],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 8',
          title: 'Departure',
          description:
            'Breakfast and free time depending on your flight. We drive you to Cairo airport for your international flight home.',
          places: ['dest-cairo'],
          meals: ['B'],
        },
      ],
    },
    includes: {
      es: [
        'Traslados de llegada y salida en El Cairo',
        '3 noches en hotel 5★ en El Cairo con desayuno',
        '4 noches de crucero por el Nilo en pensión completa',
        'Vuelos domésticos El Cairo–Asuán y Luxor–El Cairo',
        'Guía de habla hispana o inglesa en las visitas del programa',
        'Entradas a los lugares indicados en el itinerario',
      ],
      en: [
        'Arrival and departure transfers in Cairo',
        '3 nights in a 5★ hotel in Cairo with breakfast',
        '4 nights on a Nile cruise, full board',
        'Domestic flights Cairo–Aswan and Luxor–Cairo',
        'Spanish- or English-speaking guide for the listed visits',
        'Entrance fees to the sites named in the itinerary',
      ],
    },
    excludes: {
      es: [
        'Vuelos internacionales',
        'Visado de entrada a Egipto [verificar requisitos y tasa]',
        'Propinas para guías, tripulación y conductores',
        'Bebidas y comidas no indicadas',
        'Póliza de asistencia en viaje',
        'Entradas opcionales, como el interior de la Gran Pirámide',
      ],
      en: [
        'International flights',
        'Egypt entry visa [verify requirements and fee]',
        'Tips for guides, crew and drivers',
        'Drinks and meals not listed',
        'Travel insurance',
        'Optional tickets, such as inside the Great Pyramid',
      ],
    },
    what_to_bring: {
      es: [
        'Pasaporte con al menos seis meses de validez [verificar]',
        'Calzado cómodo para caminar sobre arena y piedra',
        'Sombrero, gafas de sol y protector solar',
        'Una capa ligera para las mañanas de invierno y el aire acondicionado',
        'Ropa que cubra hombros y rodillas para mezquitas',
      ],
      en: [
        'Passport valid for at least six months [verify]',
        'Comfortable shoes for sand and stone',
        'Hat, sunglasses and sunscreen',
        'A light layer for winter mornings and air conditioning',
        'Clothes covering shoulders and knees for mosques',
      ],
    },
    availability_days: ['fri', 'sat'],
    season_note: {
      es: 'Sale todo el año. De octubre a abril las temperaturas son más suaves en el sur; en verano las visitas se hacen temprano para evitar el calor.',
      en: 'Runs all year. October to April is milder in the south; in summer the visits start early to avoid the midday heat.',
    },
    cancellation_policy: 'standard',
    faq: {
      es: [
        {
          q: '¿Hay que madrugar para ir a Abu Simbel?',
          a: 'Sí. La salida por carretera desde Asuán suele ser antes del amanecer, porque el trayecto es largo. La hora exacta se confirma en destino [verificar].',
        },
        {
          q: '¿Puedo hacer el viaje en privado?',
          a: 'Sí, podemos preparar este itinerario en privado para tu grupo. El precio cambia según el número de personas y las fechas, así que te enviamos una propuesta antes de reservar.',
        },
        {
          q: '¿Qué pasa si mi vuelo internacional llega de noche?',
          a: 'El traslado de llegada está incluido a cualquier hora. Solo necesitamos tu número de vuelo y hora prevista; si hay retrasos, lo ajustamos en la medida de lo posible.',
        },
      ],
      en: [
        {
          q: 'Is there an early start for Abu Simbel?',
          a: 'Yes. The drive from Aswan usually leaves before sunrise because the journey is long. The exact time is confirmed locally [verify].',
        },
        {
          q: 'Can I do this trip privately?',
          a: 'Yes, we can arrange this route as a private trip for your group. The price depends on group size and dates, so we send you a proposal before you book.',
        },
        {
          q: 'What if my international flight lands at night?',
          a: 'The arrival transfer is included at any hour. We only need your flight number and expected arrival time, and we adjust for delays as far as we can.',
        },
      ],
    },
    destinations: ['dest-cairo', 'dest-aswan', 'dest-abu-simbel', 'dest-luxor'],
    related_trips: ['cruise-luxor-aswan-4', 'tour-cairo-luxor-5', 'exc-pyramids'],
    featured: true,
    duration_days: 8,
    trip_style: ['clasico'],
    guides: ['guide-luxor-2-days', 'guide-when-to-travel'],
  },

  // ---------------------------------------------------------------------------
  // 2. Egypt and the Red Sea, 12 days
  // ---------------------------------------------------------------------------
  {
    collection: 'tours',
    key: 'tour-redsea-12',
    title: {
      es: 'Egipto y Mar Rojo en 12 días',
      en: 'Egypt and the Red Sea in 12 days',
    },
    slug: { es: 'egipto-y-mar-rojo-12-dias', en: 'egypt-and-red-sea-12-days' },
    excerpt: {
      es: 'El Cairo, crucero por el Nilo de Luxor a Asuán, Abu Simbel y tres noches en Hurghada con snorkel en las islas Giftun.',
      en: 'Cairo, a Nile cruise from Luxor to Aswan, Abu Simbel and three nights in Hurghada with a snorkel trip to the Giftun Islands.',
    },
    subtitle: {
      es: 'Pirámides, templos del Nilo y días de playa en Hurghada',
      en: 'Pyramids, Nile temples and beach days in Hurghada',
    },
    overview: {
      es: [
        'Este viaje combina los templos del valle del Nilo con unos días en la costa del Mar Rojo. Empiezas con tres noches en El Cairo para ver Guiza, el Gran Museo Egipcio y el barrio de Khan el-Khalili sin prisas.',
        'Después vuelas a Luxor y subes al barco: cuatro noches de crucero hasta Asuán, con Karnak, el Valle de los Reyes, Edfu y Kom Ombo por el camino. Desde Asuán haces la excursión a Abu Simbel.',
        'El último tramo es en Hurghada, en la costa del Mar Rojo. Tienes un día de barco con snorkel en las islas Giftun y tiempo libre para la playa antes del vuelo de regreso.',
      ],
      en: [
        'This trip pairs the temples of the Nile valley with a few days on the Red Sea coast. It starts with three nights in Cairo, enough time for Giza, the Grand Egyptian Museum and the Khan el-Khalili bazaar without rushing.',
        'You then fly to Luxor and board your boat for four nights to Aswan, stopping at Karnak, the Valley of the Kings, Edfu and Kom Ombo. From Aswan you make the trip to Abu Simbel.',
        'The last stretch is in Hurghada on the Red Sea. You spend a day on a boat snorkelling around the Giftun Islands, with free time on the beach before your flight home.',
      ],
    },
    meta_description: {
      es: 'Viaje de 12 días: El Cairo, crucero por el Nilo de Luxor a Asuán, Abu Simbel y playa en Hurghada con snorkel en Giftun. Desde 1690 € por persona.',
      en: '12-day trip: Cairo, a Nile cruise from Luxor to Aswan, Abu Simbel and beach time in Hurghada with Giftun snorkelling. From €1690 per person.',
    },
    featured_image: 'card-tour-redsea',
    gallery: ['sight-giza', 'sight-karnak', 'nile-deck', 'sight-abu-simbel-great', 'sight-giftun'],
    price_from_eur: 1690,
    price_from_usd: 1820,
    price_basis: 'per_person_double',
    price_note: {
      es: 'Precio desde, por persona en habitación o camarote doble, en temporada media. Varía según la fecha y la categoría del hotel de playa.',
      en: 'From price per person sharing a double room or cabin in mid season. It varies with your dates and the category of the beach hotel.',
    },
    group_type: 'small',
    group_min: 2,
    group_max: 16,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Pirámides de Guiza, Esfinge y Gran Museo Egipcio',
        'Tarde libre en Khan el-Khalili',
        'Crucero de cuatro noches por el Nilo de Luxor a Asuán',
        'Valle de los Reyes y templo de Hatshepsut',
        'Excursión a los templos de Abu Simbel',
        'Día de barco con snorkel en las islas Giftun',
        'Tres noches en Hurghada, frente al Mar Rojo',
      ],
      en: [
        'Giza pyramids, the Sphinx and the Grand Egyptian Museum',
        'A free afternoon in Khan el-Khalili',
        'Four-night Nile cruise from Luxor to Aswan',
        'Valley of the Kings and the temple of Hatshepsut',
        'Trip to the temples of Abu Simbel',
        'Boat day with snorkelling at the Giftun Islands',
        'Three nights in Hurghada on the Red Sea',
      ],
    },
    itinerary: {
      es: [
        {
          label: 'Día 1',
          title: 'Llegada a El Cairo',
          description:
            'Te recibimos en el aeropuerto y te llevamos al hotel. Tienes el resto del día libre para descansar. Por la tarde te explicamos el programa de los próximos días.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 2',
          title: 'Guiza y el Gran Museo Egipcio',
          description:
            'Visitas las pirámides de Guiza y la Esfinge por la mañana, cuando hace menos calor. Después del almuerzo recorres el Gran Museo Egipcio, que reúne miles de piezas del antiguo Egipto. Regreso al hotel.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 3',
          title: 'El Cairo islámico y Khan el-Khalili',
          description:
            'Por la mañana recorres la Ciudadela y la mezquita de Mohamed Alí. La tarde es libre para pasear por el bazar de Khan el-Khalili y sus cafés. Vuelta al hotel por tu cuenta o con traslado.',
          places: ['dest-cairo'],
          meals: ['B'],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 4',
          title: 'Vuelo a Luxor y orilla oriental',
          description:
            'Vuelo doméstico a Luxor; el horario depende de la compañía [verificar]. Subes al barco y por la tarde visitas Karnak y el Templo de Luxor, en la orilla oriental. Cena y noche a bordo.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 5',
          title: 'Orilla occidental y navegación a Edfu',
          description:
            'Cruzas a la orilla occidental para ver el Valle de los Reyes, el templo de Hatshepsut y los Colosos de Memnón. De vuelta a bordo, el barco navega hacia el sur y pasa la esclusa de Esna. Noche de navegación hacia Edfu.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 6',
          title: 'Edfu y Kom Ombo',
          description:
            'Por la mañana visitas el templo de Horus en Edfu. El barco sigue hacia el sur y por la tarde paras en Kom Ombo, con su templo doble a orillas del Nilo. Noche de navegación hacia Asuán.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 7',
          title: 'Asuán: Philae y paseo en faluca',
          description:
            'Visitas el templo de Philae y el obelisco inacabado, en las canteras de granito. Por la tarde das un paseo en faluca entre las islas del Nilo. Última noche a bordo, amarrados en Asuán.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Crucero por el Nilo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 8',
          title: 'Abu Simbel',
          description:
            'Desembarcas temprano y sales por carretera hacia Abu Simbel, a unos 280 km al sur de Asuán. Visitas el templo mayor de Ramsés II y el templo de Nefertari. Regreso a Asuán por la tarde y noche en hotel.',
          places: ['dest-abu-simbel', 'dest-aswan'],
          meals: ['B'],
          overnight: 'Asuán · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 9',
          title: 'Traslado a Hurghada',
          description:
            'Sales por carretera hacia la costa del Mar Rojo; es un trayecto largo, de varias horas, con paradas para descansar [verificar duración]. Llegada a Hurghada por la tarde y resto del día libre en el hotel.',
          places: ['dest-aswan', 'dest-hurghada'],
          meals: ['B', 'D'],
          overnight: 'Hurghada · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 10',
          title: 'Snorkel en las islas Giftun',
          description:
            'Sales en barco desde Hurghada hacia las islas Giftun, frente a la costa. Haces dos paradas de snorkel en arrecifes de coral y tienes tiempo en una de las playas de la isla. Almuerzo a bordo y regreso por la tarde.',
          places: ['dest-hurghada'],
          meals: ['B', 'L', 'D'],
          overnight: 'Hurghada · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 11',
          title: 'Día libre en Hurghada',
          description:
            'Día libre para la playa, la piscina o un paseo por la marina de Hurghada. Si quieres hacer otra actividad en el mar, te ayudamos a reservarla en destino.',
          places: ['dest-hurghada'],
          meals: ['B', 'D'],
          overnight: 'Hurghada · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 12',
          title: 'Regreso',
          description:
            'Desayuno y traslado al aeropuerto de Hurghada según la hora de tu vuelo. Si tu vuelo internacional sale de El Cairo, añadimos el vuelo doméstico [verificar horarios].',
          places: ['dest-hurghada'],
          meals: ['B'],
        },
      ],
      en: [
        {
          label: 'Day 1',
          title: 'Arrival in Cairo',
          description:
            'We meet you at the airport and drive you to your hotel. The rest of the day is free to rest. In the evening we go over the plan for the coming days.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 2',
          title: 'Giza and the Grand Egyptian Museum',
          description:
            'You visit the Giza pyramids and the Sphinx in the morning, while it is cooler. After lunch you explore the Grand Egyptian Museum and its collection from ancient Egypt. Back to the hotel.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 3',
          title: 'Islamic Cairo and Khan el-Khalili',
          description:
            'In the morning you visit the Citadel and the Mosque of Muhammad Ali. The afternoon is free to wander the Khan el-Khalili bazaar and its cafés. Return to the hotel on your own or with a transfer.',
          places: ['dest-cairo'],
          meals: ['B'],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 4',
          title: 'Fly to Luxor and the east bank',
          description:
            'Domestic flight to Luxor; times depend on the airline [verify]. You board the boat and spend the afternoon at Karnak and Luxor Temple on the east bank. Dinner and overnight on board.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 5',
          title: 'West bank and sail to Edfu',
          description:
            'You cross to the west bank for the Valley of the Kings, the temple of Hatshepsut and the Colossi of Memnon. Back on board, the boat sails south through the Esna lock. Overnight sailing towards Edfu.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 6',
          title: 'Edfu and Kom Ombo',
          description:
            'In the morning you visit the temple of Horus at Edfu. The boat continues south, and in the afternoon you stop at Kom Ombo and its double temple on the riverbank. Overnight sailing to Aswan.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 7',
          title: 'Aswan: Philae and a felucca ride',
          description:
            'You visit the temple of Philae and the Unfinished Obelisk in the old granite quarries. In the afternoon you take a felucca between the islands of the Nile. Last night on board, moored in Aswan.',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Nile cruise · 5★ ship (name pending)',
        },
        {
          label: 'Day 8',
          title: 'Abu Simbel',
          description:
            'You leave the boat early and drive to Abu Simbel, about 280 km south of Aswan. You visit the Great Temple of Ramesses II and the temple of Nefertari. Back in Aswan in the afternoon for a night in a hotel.',
          places: ['dest-abu-simbel', 'dest-aswan'],
          meals: ['B'],
          overnight: 'Aswan · 5★ hotel (pending)',
        },
        {
          label: 'Day 9',
          title: 'Transfer to Hurghada',
          description:
            'A long road transfer to the Red Sea coast, with rest stops along the way [verify journey time]. You reach Hurghada in the afternoon and have the rest of the day free at the hotel.',
          places: ['dest-aswan', 'dest-hurghada'],
          meals: ['B', 'D'],
          overnight: 'Hurghada · 5★ hotel (pending)',
        },
        {
          label: 'Day 10',
          title: 'Snorkelling at the Giftun Islands',
          description:
            'A boat takes you from Hurghada out to the Giftun Islands, just off the coast. You make two snorkel stops on coral reefs and spend some time on one of the island beaches. Lunch on board and back in the afternoon.',
          places: ['dest-hurghada'],
          meals: ['B', 'L', 'D'],
          overnight: 'Hurghada · 5★ hotel (pending)',
        },
        {
          label: 'Day 11',
          title: 'Free day in Hurghada',
          description:
            'A free day for the beach, the pool or a walk along Hurghada marina. If you want another activity at sea, we can help you book it locally.',
          places: ['dest-hurghada'],
          meals: ['B', 'D'],
          overnight: 'Hurghada · 5★ hotel (pending)',
        },
        {
          label: 'Day 12',
          title: 'Departure',
          description:
            'Breakfast and transfer to Hurghada airport in time for your flight. If your international flight leaves from Cairo, we add a domestic flight [verify flight times].',
          places: ['dest-hurghada'],
          meals: ['B'],
        },
      ],
    },
    includes: {
      es: [
        'Traslados de llegada y salida, y traslado por carretera de Asuán a Hurghada',
        '3 noches en El Cairo, 1 en Asuán y 3 en Hurghada en hotel 5★',
        '4 noches de crucero por el Nilo en pensión completa',
        'Vuelo doméstico El Cairo–Luxor',
        'Guía de habla hispana o inglesa en las visitas del programa',
        'Excursión en barco a las islas Giftun con equipo de snorkel',
      ],
      en: [
        'Arrival and departure transfers, plus the road transfer from Aswan to Hurghada',
        '3 nights in Cairo, 1 in Aswan and 3 in Hurghada in 5★ hotels',
        '4 nights on a Nile cruise, full board',
        'Domestic flight Cairo–Luxor',
        'Spanish- or English-speaking guide for the listed visits',
        'Boat trip to the Giftun Islands with snorkel gear',
      ],
    },
    excludes: {
      es: [
        'Vuelos internacionales',
        'Visado de entrada a Egipto [verificar requisitos y tasa]',
        'Propinas para guías, tripulación y conductores',
        'Tasa de acceso a las islas Giftun, si se cobra aparte [verificar]',
        'Bebidas y comidas no indicadas',
        'Póliza de asistencia en viaje',
      ],
      en: [
        'International flights',
        'Egypt entry visa [verify requirements and fee]',
        'Tips for guides, crew and drivers',
        'Giftun Islands park fee, if charged separately [verify]',
        'Drinks and meals not listed',
        'Travel insurance',
      ],
    },
    what_to_bring: {
      es: [
        'Pasaporte con al menos seis meses de validez [verificar]',
        'Calzado cómodo para los templos y sandalias para la playa',
        'Bañador, toalla y camiseta de manga larga para el snorkel',
        'Protector solar respetuoso con el arrecife',
        'Sombrero y gafas de sol',
      ],
      en: [
        'Passport valid for at least six months [verify]',
        'Comfortable shoes for the temples and sandals for the beach',
        'Swimwear, a towel and a long-sleeved top for snorkelling',
        'Reef-friendly sunscreen',
        'Hat and sunglasses',
      ],
    },
    availability_days: ['sat'],
    season_note: {
      es: 'Sale todo el año. De octubre a abril el valle del Nilo es más templado; de mayo a octubre el agua del Mar Rojo está más cálida para el snorkel.',
      en: 'Runs all year. October to April is milder in the Nile valley; from May to October the Red Sea is warmer for snorkelling.',
    },
    cancellation_policy: 'standard',
    faq: {
      es: [
        {
          q: '¿Necesito saber nadar para el snorkel en Giftun?',
          a: 'Conviene saber nadar y sentirte cómodo en el agua. El barco suele llevar chalecos y la tripulación indica dónde entrar; si prefieres no meterte, puedes quedarte a bordo o en la playa.',
        },
        {
          q: '¿Puedo cambiar Hurghada por Marsa Alam?',
          a: 'Sí, podemos adaptar la parte de playa a Marsa Alam. El traslado y el precio cambian, así que te enviamos una propuesta antes de reservar.',
        },
        {
          q: '¿Cuánto dura el traslado de Asuán a Hurghada?',
          a: 'Es un trayecto largo por carretera que ocupa buena parte del día, con paradas. La duración depende del tráfico y de los controles [verificar].',
        },
      ],
      en: [
        {
          q: 'Do I need to be able to swim for the Giftun snorkel trip?',
          a: 'You should be able to swim and feel at ease in the water. Boats usually carry life vests and the crew shows you where to get in; if you prefer, you can stay on board or on the beach.',
        },
        {
          q: 'Can I swap Hurghada for Marsa Alam?',
          a: 'Yes, we can move the beach part to Marsa Alam. The transfer and the price change, so we send you a proposal before you book.',
        },
        {
          q: 'How long is the transfer from Aswan to Hurghada?',
          a: 'It is a long drive that takes up most of the day, with stops. The time depends on traffic and checkpoints [verify].',
        },
      ],
    },
    destinations: ['dest-cairo', 'dest-luxor', 'dest-aswan', 'dest-abu-simbel', 'dest-hurghada'],
    related_trips: ['tour-classic-8', 'exc-giftun', 'cruise-luxor-aswan-4'],
    featured: true,
    duration_days: 12,
    trip_style: ['egipto-y-mar-rojo'],
    guides: ['guide-red-sea-snorkel', 'guide-when-to-travel'],
  },

  // ---------------------------------------------------------------------------
  // 3. Cairo and Luxor, 5 days (private)
  // ---------------------------------------------------------------------------
  {
    collection: 'tours',
    key: 'tour-cairo-luxor-5',
    title: {
      es: 'El Cairo y Luxor en 5 días',
      en: 'Cairo and Luxor in 5 days',
    },
    slug: { es: 'el-cairo-y-luxor-5-dias', en: 'cairo-and-luxor-5-days' },
    excerpt: {
      es: 'Viaje privado de cinco días: pirámides de Guiza y Gran Museo Egipcio en El Cairo, y las dos orillas de Luxor con tu propio guía.',
      en: 'A private five-day trip: the Giza pyramids and the Grand Egyptian Museum in Cairo, then both banks of Luxor with your own guide.',
    },
    subtitle: {
      es: 'Viaje privado con guía y vehículo para ti',
      en: 'A private trip with your own guide and vehicle',
    },
    overview: {
      es: [
        'Si tienes pocos días, este viaje privado se centra en dos lugares: El Cairo y Luxor. Tienes guía y vehículo solo para ti o tu grupo, así que el ritmo y los horarios se ajustan a lo que prefieran.',
        'En El Cairo visitas las pirámides de Guiza, la Esfinge y el Gran Museo Egipcio. Luego tomas un vuelo doméstico a Luxor para pasar dos noches allí.',
        'En Luxor dedicas un día a cada orilla: Karnak y el Templo de Luxor en la oriental, y el Valle de los Reyes y el templo de Hatshepsut en la occidental.',
      ],
      en: [
        'If you are short on time, this private trip focuses on two places: Cairo and Luxor. The guide and vehicle are just for you or your group, so the pace and timings can follow what suits you.',
        'In Cairo you see the Giza pyramids, the Sphinx and the Grand Egyptian Museum. A domestic flight then takes you to Luxor for two nights.',
        'In Luxor you spend a day on each bank: Karnak and Luxor Temple on the east, and the Valley of the Kings and the temple of Hatshepsut on the west.',
      ],
    },
    meta_description: {
      es: 'Viaje privado de 5 días a El Cairo y Luxor: pirámides de Guiza, Gran Museo Egipcio, Karnak y Valle de los Reyes con guía. Desde 890 € por persona.',
      en: 'Private 5-day trip to Cairo and Luxor: the Giza pyramids, the Grand Egyptian Museum, Karnak and the Valley of the Kings. From €890 per person.',
    },
    featured_image: 'card-tour-cairo-luxor',
    gallery: ['sight-giza', 'sight-egyptian-museum', 'sight-karnak', 'sight-luxor-temple', 'sight-valley-kings'],
    price_from_eur: 890,
    price_from_usd: 960,
    price_basis: 'per_person_double',
    price_note: {
      es: 'Precio desde, por persona en habitación doble, para un grupo privado de dos personas. Con más personas el precio por persona suele bajar.',
      en: 'From price per person sharing a double room, for a private group of two. With more people the price per person is usually lower.',
    },
    group_type: 'private',
    group_min: 2,
    group_max: 8,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Guía y vehículo privados durante todo el viaje',
        'Pirámides de Guiza y Esfinge',
        'Gran Museo Egipcio',
        'Karnak y Templo de Luxor',
        'Valle de los Reyes y templo de Hatshepsut',
        'Horarios adaptados a tu ritmo',
      ],
      en: [
        'Private guide and vehicle throughout',
        'The Giza pyramids and the Sphinx',
        'The Grand Egyptian Museum',
        'Karnak and Luxor Temple',
        'Valley of the Kings and the temple of Hatshepsut',
        'Timings set around your pace',
      ],
    },
    itinerary: {
      es: [
        {
          label: 'Día 1',
          title: 'Llegada a El Cairo',
          description:
            'Te recibimos en el aeropuerto de El Cairo y te llevamos al hotel en vehículo privado. El resto del día es libre. Tu guía se pone en contacto contigo para acordar la hora de salida del día siguiente.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 2',
          title: 'Guiza, la Esfinge y el Gran Museo Egipcio',
          description:
            'Empiezas en la meseta de Guiza con las tres grandes pirámides y la Esfinge. Después del almuerzo visitas el Gran Museo Egipcio con tu guía. Si te queda energía, puedes acabar el día en Khan el-Khalili.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'El Cairo · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 3',
          title: 'Vuelo a Luxor y orilla oriental',
          description:
            'Traslado al aeropuerto para el vuelo doméstico a Luxor; los horarios de vuelo cambian según la temporada [verificar]. Por la tarde visitas Karnak y, al caer el sol, el Templo de Luxor. Noche en Luxor.',
          places: ['dest-cairo', 'dest-luxor'],
          meals: ['B'],
          overnight: 'Luxor · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 4',
          title: 'Orilla occidental de Luxor',
          description:
            'Cruzas el Nilo para visitar el Valle de los Reyes, el templo de Hatshepsut en Deir el-Bahari y los Colosos de Memnón. Almuerzo en la orilla occidental y tarde libre.',
          places: ['dest-luxor'],
          meals: ['B', 'L'],
          overnight: 'Luxor · Hotel 5★ (pendiente)',
        },
        {
          label: 'Día 5',
          title: 'Regreso',
          description:
            'Desayuno y traslado al aeropuerto de Luxor. Según tu vuelo internacional, sales desde Luxor o enlazas con un vuelo doméstico a El Cairo [verificar horarios].',
          places: ['dest-luxor'],
          meals: ['B'],
        },
      ],
      en: [
        {
          label: 'Day 1',
          title: 'Arrival in Cairo',
          description:
            'We meet you at Cairo airport and drive you to your hotel in a private vehicle. The rest of the day is free. Your guide gets in touch to agree a start time for the next morning.',
          places: ['dest-cairo'],
          meals: [],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 2',
          title: 'Giza, the Sphinx and the Grand Egyptian Museum',
          description:
            'You start on the Giza plateau with the three main pyramids and the Sphinx. After lunch you visit the Grand Egyptian Museum with your guide. If you still have energy, you can end the day at Khan el-Khalili.',
          places: ['dest-cairo'],
          meals: ['B', 'L'],
          overnight: 'Cairo · 5★ hotel (pending)',
        },
        {
          label: 'Day 3',
          title: 'Fly to Luxor and the east bank',
          description:
            'Transfer to the airport for the domestic flight to Luxor; flight times change with the season [verify]. In the afternoon you visit Karnak and, as the sun goes down, Luxor Temple. Overnight in Luxor.',
          places: ['dest-cairo', 'dest-luxor'],
          meals: ['B'],
          overnight: 'Luxor · 5★ hotel (pending)',
        },
        {
          label: 'Day 4',
          title: "Luxor's west bank",
          description:
            'You cross the Nile for the Valley of the Kings, the temple of Hatshepsut at Deir el-Bahari and the Colossi of Memnon. Lunch on the west bank and a free afternoon.',
          places: ['dest-luxor'],
          meals: ['B', 'L'],
          overnight: 'Luxor · 5★ hotel (pending)',
        },
        {
          label: 'Day 5',
          title: 'Departure',
          description:
            'Breakfast and transfer to Luxor airport. Depending on your international flight, you either leave from Luxor or connect through Cairo on a domestic flight [verify flight times].',
          places: ['dest-luxor'],
          meals: ['B'],
        },
      ],
    },
    includes: {
      es: [
        'Traslados privados de llegada y salida',
        '2 noches en El Cairo y 2 en Luxor en hotel 5★ con desayuno',
        'Vuelo doméstico El Cairo–Luxor',
        'Guía privado de habla hispana o inglesa y vehículo con conductor',
        'Entradas a los lugares indicados en el itinerario',
        'Dos almuerzos durante las visitas',
      ],
      en: [
        'Private arrival and departure transfers',
        '2 nights in Cairo and 2 in Luxor in 5★ hotels with breakfast',
        'Domestic flight Cairo–Luxor',
        'Private Spanish- or English-speaking guide and vehicle with driver',
        'Entrance fees to the sites named in the itinerary',
        'Two lunches during the visits',
      ],
    },
    excludes: {
      es: [
        'Vuelos internacionales',
        'Visado de entrada a Egipto [verificar requisitos y tasa]',
        'Propinas para guía y conductor',
        'Entradas opcionales, como la tumba de Tutankamón [verificar]',
        'Póliza de asistencia en viaje',
      ],
      en: [
        'International flights',
        'Egypt entry visa [verify requirements and fee]',
        'Tips for your guide and driver',
        "Optional tickets, such as Tutankhamun's tomb [verify]",
        'Travel insurance',
      ],
    },
    what_to_bring: {
      es: [
        'Pasaporte con al menos seis meses de validez [verificar]',
        'Calzado cómodo para caminar',
        'Sombrero, gafas de sol y protector solar',
        'Algo de efectivo en libras egipcias para pequeños gastos',
      ],
      en: [
        'Passport valid for at least six months [verify]',
        'Comfortable walking shoes',
        'Hat, sunglasses and sunscreen',
        'Some cash in Egyptian pounds for small expenses',
      ],
    },
    availability_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    season_note: {
      es: 'Disponible todo el año, cualquier día. En verano conviene empezar las visitas muy temprano por el calor en Luxor.',
      en: 'Available all year, on any day. In summer it is worth starting the visits very early because of the heat in Luxor.',
    },
    cancellation_policy: 'flexible',
    faq: {
      es: [
        {
          q: '¿Puedo añadir días o un crucero?',
          a: 'Sí. Al ser un viaje privado, podemos sumar noches en El Cairo, una excursión o un crucero corto por el Nilo. Te enviamos el itinerario y el precio ajustados antes de reservar.',
        },
        {
          q: '¿El guía es el mismo en El Cairo y en Luxor?',
          a: 'Normalmente no: tienes un guía local en cada ciudad, que conoce bien sus lugares. Los dos hablan tu idioma y siguen el mismo programa.',
        },
        {
          q: '¿Es adecuado para viajar con niños?',
          a: 'Puede serlo, porque el ritmo se adapta a ustedes. En las tumbas y templos se camina bastante y hace calor, así que lo planificamos con pausas.',
        },
      ],
      en: [
        {
          q: 'Can I add days or a cruise?',
          a: 'Yes. As it is a private trip, we can add nights in Cairo, an excursion or a short Nile cruise. We send you the adjusted itinerary and price before you book.',
        },
        {
          q: 'Is the guide the same in Cairo and Luxor?',
          a: 'Usually not: you have a local guide in each city who knows its sites well. Both speak your language and follow the same plan.',
        },
        {
          q: 'Does it work for families with children?',
          a: 'It can, because the pace is set around you. The tombs and temples involve a fair amount of walking in the heat, so we plan in breaks.',
        },
      ],
    },
    destinations: ['dest-cairo', 'dest-luxor'],
    related_trips: ['tour-classic-8', 'exc-pyramids', 'exc-luxor-day'],
    featured: false,
    duration_days: 5,
    trip_style: ['privado'],
    guides: ['guide-luxor-2-days'],
  },
]
