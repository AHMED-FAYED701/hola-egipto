import type { ExcursionSample } from './types'

/** Sample day excursions (content rules §2). Prices are flagged samples. */
export const EXCURSIONS: ExcursionSample[] = [
  {
    collection: 'excursions',
    key: 'exc-luxor-day',
    title: {
      es: 'Luxor en un día desde Hurghada',
      en: 'Luxor day trip from Hurghada',
    },
    slug: {
      es: 'luxor-en-un-dia-desde-hurghada',
      en: 'luxor-day-trip-from-hurghada',
    },
    excerpt: {
      es: 'Excursión de 14 horas desde Hurghada a Luxor: Karnak, el Templo de Luxor, el Valle de los Reyes y el templo de Hatshepsut, con almuerzo.',
      en: "A 14-hour trip from Hurghada to Luxor: Karnak, Luxor Temple, the Valley of the Kings and Hatshepsut's temple, with lunch.",
    },
    subtitle: {
      es: 'Las dos orillas de Luxor en una jornada desde el Mar Rojo',
      en: 'Both banks of Luxor in one day from the Red Sea',
    },
    overview: {
      es: [
        'Si te alojas en Hurghada y quieres ver Luxor sin hacer noche, esta excursión es la opción más directa. Sales de madrugada, cruzas el desierto oriental por carretera durante unas cuatro horas y llegas a Luxor a media mañana.',
        'En la orilla este visitas Karnak y paras frente al Templo de Luxor. Después cruzas a la orilla oeste para entrar en el Valle de los Reyes y ver el templo de Hatshepsut en Deir el-Bahari. El almuerzo está incluido.',
        'Es un día largo: unas ocho horas de carretera en total. Si prefieres un ritmo más tranquilo, puedes combinarlo con una noche en Luxor o con un crucero por el Nilo.',
      ],
      en: [
        'If you are staying in Hurghada and want to see Luxor without an overnight stay, this is the most direct way to do it. You leave before dawn, drive about four hours across the Eastern Desert and reach Luxor mid-morning.',
        "On the east bank you visit Karnak and stop outside Luxor Temple. You then cross to the west bank for the Valley of the Kings and Hatshepsut's temple at Deir el-Bahari. Lunch is included.",
        'It is a long day, with around eight hours on the road in total. For a slower pace, you can add a night in Luxor or a Nile cruise.',
      ],
    },
    meta_description: {
      es: 'Excursión a Luxor desde Hurghada en un día: Karnak, Templo de Luxor, Valle de los Reyes y Hatshepsut con guía en español y almuerzo incluido.',
      en: "Luxor day trip from Hurghada: Karnak, Luxor Temple, the Valley of the Kings and Hatshepsut's temple with a guide and lunch included.",
    },
    featured_image: 'card-exc-luxor-day',
    gallery: ['sight-desert-road', 'sight-karnak', 'sight-valley-kings', 'sight-hatshepsut', 'sight-luxor-temple'],
    price_from_eur: 95,
    price_from_usd: 105,
    price_basis: 'per_person',
    price_note: {
      es: 'Precio de muestra por persona. Las entradas a los monumentos dependen de la tarifa vigente [verificar].',
      en: 'Sample price per person. Monument entry depends on current ticket prices [verify].',
    },
    group_type: 'shared',
    group_min: 1,
    group_max: 30,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Complejo de templos de Karnak',
        'Parada frente al Templo de Luxor',
        'Valle de los Reyes en la orilla oeste',
        'Templo de Hatshepsut en Deir el-Bahari',
        'Colosos de Memnón',
        'Almuerzo en Luxor',
      ],
      en: [
        'The Karnak temple complex',
        'A stop outside Luxor Temple',
        'Valley of the Kings on the west bank',
        "Hatshepsut's temple at Deir el-Bahari",
        'The Colossi of Memnon',
        'Lunch in Luxor',
      ],
    },
    itinerary: {
      es: [
        {
          label: '05:00',
          title: 'Recogida en Hurghada',
          description:
            'Te recogemos en tu hotel de Hurghada con una caja de desayuno. El trayecto hasta Luxor por la carretera del desierto dura unas cuatro horas, con una parada técnica.',
          places: ['dest-hurghada'],
          meals: ['B'],
        },
        {
          label: '09:00',
          title: 'Templos de Karnak',
          description:
            'Recorres con el guía la gran sala hipóstila, los obeliscos y el lago sagrado de Karnak. La visita dura cerca de hora y media.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '10:45',
          title: 'Templo de Luxor desde fuera',
          description:
            'Parada breve frente al Templo de Luxor y la avenida de las esfinges, en la orilla este. Después cruzas el Nilo hacia la orilla oeste.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '11:30',
          title: 'Valle de los Reyes',
          description:
            'Entras en el Valle de los Reyes, donde la entrada general suele incluir varias tumbas [verificar]. La tumba de Tutankamón tiene entrada aparte.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '13:15',
          title: 'Templo de Hatshepsut y Colosos de Memnón',
          description:
            'Visitas el templo en terrazas de Hatshepsut en Deir el-Bahari. De camino al almuerzo paras ante los Colosos de Memnón.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '14:30',
          title: 'Almuerzo y regreso',
          description:
            'Almuerzo en un restaurante local en Luxor. Hacia las 15:30 sales de vuelta a Hurghada y llegas a tu hotel sobre las 19:00.',
          places: ['dest-luxor', 'dest-hurghada'],
          meals: ['L'],
        },
      ],
      en: [
        {
          label: '05:00',
          title: 'Pickup in Hurghada',
          description:
            'We pick you up from your Hurghada hotel with a breakfast box. The desert road to Luxor takes about four hours, with one rest stop.',
          places: ['dest-hurghada'],
          meals: ['B'],
        },
        {
          label: '09:00',
          title: 'Karnak temples',
          description:
            'With your guide you walk through the great hypostyle hall, the obelisks and the sacred lake at Karnak. The visit takes about an hour and a half.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '10:45',
          title: 'Luxor Temple from outside',
          description:
            'A short stop outside Luxor Temple and the avenue of sphinxes on the east bank. Then you cross the Nile to the west bank.',
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '11:30',
          title: 'Valley of the Kings',
          description:
            "You enter the Valley of the Kings, where the standard ticket usually covers several tombs [verify]. Tutankhamun's tomb needs a separate ticket.",
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '13:15',
          title: "Hatshepsut's temple and the Colossi of Memnon",
          description:
            "You visit Hatshepsut's terraced temple at Deir el-Bahari. On the way to lunch you stop at the Colossi of Memnon.",
          places: ['dest-luxor'],
          meals: [],
        },
        {
          label: '14:30',
          title: 'Lunch and return',
          description:
            'Lunch at a local restaurant in Luxor. Around 15:30 you head back to Hurghada, reaching your hotel at about 19:00.',
          places: ['dest-luxor', 'dest-hurghada'],
          meals: ['L'],
        },
      ],
    },
    includes: {
      es: [
        'Recogida y regreso al hotel en Hurghada',
        'Transporte con aire acondicionado',
        'Guía en español o inglés',
        'Caja de desayuno y almuerzo en Luxor',
        'Agua embotellada en el vehículo',
      ],
      en: [
        'Hotel pickup and drop-off in Hurghada',
        'Air-conditioned transport',
        'Spanish- or English-speaking guide',
        'Breakfast box and lunch in Luxor',
        'Bottled water in the vehicle',
      ],
    },
    excludes: {
      es: [
        'Entradas a los monumentos, según la tarifa vigente [verificar]',
        'Entrada a la tumba de Tutankamón',
        'Bebidas en el almuerzo',
        'Propinas para el guía y el conductor',
      ],
      en: [
        'Monument entry tickets, at current rates [verify]',
        "Entry to Tutankhamun's tomb",
        'Drinks with lunch',
        'Tips for the guide and driver',
      ],
    },
    what_to_bring: {
      es: [
        'Pasaporte o copia, que se pide en los controles de carretera',
        'Sombrero, gafas de sol y protector solar',
        'Calzado cómodo para caminar',
        'Dinero en efectivo para entradas y extras',
      ],
      en: [
        'Passport or a copy, which may be checked on the road',
        'Hat, sunglasses and sunscreen',
        'Comfortable walking shoes',
        'Cash for tickets and extras',
      ],
    },
    availability_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    season_note: {
      es: 'Funciona todo el año. De mayo a septiembre el calor en Luxor es muy fuerte a mediodía; lleva agua y protección solar.',
      en: 'Runs all year. From May to September Luxor is very hot at midday, so bring water and sun protection.',
    },
    cancellation_policy: 'flexible',
    faq: {
      es: [
        {
          q: '¿Merece la pena ir a Luxor en un solo día?',
          a: 'Ves lo principal de las dos orillas, pero el día es largo. Si tienes tiempo, una noche en Luxor te permite visitar con más calma.',
        },
        {
          q: '¿Cuántas tumbas se ven en el Valle de los Reyes?',
          a: 'La entrada general suele incluir varias tumbas abiertas por rotación [verificar]. El guía te recomienda cuáles ver ese día.',
        },
        {
          q: '¿Pueden venir niños pequeños?',
          a: 'Sí, a partir de 4 años. Ten en cuenta que pasan unas ocho horas en el vehículo entre ida y vuelta.',
        },
      ],
      en: [
        {
          q: 'Is one day in Luxor enough?',
          a: 'You see the main sights on both banks, but it is a long day. If you have time, a night in Luxor lets you visit at a slower pace.',
        },
        {
          q: 'How many tombs can I see in the Valley of the Kings?',
          a: 'The standard ticket usually covers several tombs that open on rotation [verify]. Your guide will suggest which ones to see that day.',
        },
        {
          q: 'Can young children come?',
          a: 'Yes, from age 4. Keep in mind there are about eight hours in the vehicle for the round trip.',
        },
      ],
    },
    destinations: ['dest-hurghada', 'dest-luxor'],
    related_trips: ['exc-giftun', 'tour-cairo-luxor-5', 'cruise-luxor-aswan-4'],
    featured: true,
    duration_hours: 14,
    departure: ['hurghada'],
    start_times: [{ time: '05:00', label: { es: 'Recogida en el hotel', en: 'Hotel pickup' } }],
    pickup_areas: {
      es: ['Hurghada centro y Sakkala', 'Zona hotelera de Hurghada', 'Sahl Hasheesh', 'Makadi Bay'],
      en: ['Hurghada town and Sakkala', 'Hurghada hotel strip', 'Sahl Hasheesh', 'Makadi Bay'],
    },
    child_price_eur: 50,
    child_price_usd: 55,
    min_age: 4,
    activity_level: 'moderate',
  },
  {
    collection: 'excursions',
    key: 'exc-giftun',
    title: {
      es: 'Snorkel en las islas Giftun desde Hurghada',
      en: 'Giftun Islands snorkelling trip from Hurghada',
    },
    slug: {
      es: 'snorkel-islas-giftun-desde-hurghada',
      en: 'giftun-islands-snorkelling-from-hurghada',
    },
    excerpt: {
      es: 'Salida en barco desde Hurghada a las islas Giftun: dos paradas de snorkel en arrecifes, almuerzo a bordo y tiempo de playa en la isla.',
      en: 'A boat trip from Hurghada to the Giftun Islands: two snorkel stops on the reef, lunch on board and time on an island beach.',
    },
    subtitle: {
      es: 'Arrecifes y playa en el parque nacional frente a Hurghada',
      en: 'Reefs and beach in the marine park off Hurghada',
    },
    overview: {
      es: [
        'Las islas Giftun están frente a la costa de Hurghada y forman parte de un área marina protegida. El barco sale del puerto por la mañana y en unos 45 minutos llegas a los primeros arrecifes.',
        'Haces dos paradas de snorkel con equipo incluido y un monitor en el agua. Entre una y otra se sirve el almuerzo a bordo. Por la tarde el barco se acerca a una playa de la isla para que pases un rato en la arena antes de volver.',
        'No hace falta experiencia previa: el monitor explica el uso de máscara y aletas, y hay chalecos para quien los necesite. El acceso al parque marino tiene una tasa que se paga aparte [verificar].',
      ],
      en: [
        'The Giftun Islands lie off the coast of Hurghada and are part of a protected marine area. The boat leaves the marina in the morning and reaches the first reefs in about 45 minutes.',
        'You make two snorkel stops with equipment provided and an instructor in the water. Lunch is served on board in between. In the afternoon the boat anchors near an island beach so you can spend time on the sand before heading back.',
        'No experience is needed: the instructor explains how to use the mask and fins, and life jackets are available. Entry to the marine park has a fee paid separately [verify].',
      ],
    },
    meta_description: {
      es: 'Snorkel en las islas Giftun desde Hurghada: barco, dos paradas en arrecifes, equipo, almuerzo a bordo y playa en la isla. Salida diaria.',
      en: 'Snorkelling at the Giftun Islands from Hurghada: boat trip, two reef stops, equipment, lunch on board and an island beach. Daily departures.',
    },
    featured_image: 'card-exc-giftun',
    gallery: ['sight-giftun', 'snorkel-gear', 'reef-fish', 'sight-hurghada-marina', 'sight-el-gouna'],
    price_from_eur: 45,
    price_from_usd: 50,
    price_basis: 'per_person',
    price_note: {
      es: 'Precio de muestra por persona. La tasa del parque marino se paga aparte [verificar].',
      en: 'Sample price per person. The marine park fee is paid separately [verify].',
    },
    group_type: 'shared',
    group_min: 1,
    group_max: 35,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Dos paradas de snorkel en arrecifes de coral',
        'Peces de arrecife en aguas poco profundas',
        'Almuerzo a bordo',
        'Tiempo de playa en una isla Giftun',
        'Monitor en el agua para principiantes',
      ],
      en: [
        'Two snorkel stops on coral reefs',
        'Reef fish in shallow water',
        'Lunch on board',
        'Beach time on a Giftun island',
        'An instructor in the water for beginners',
      ],
    },
    itinerary: {
      es: [
        {
          label: '08:30',
          title: 'Recogida en el hotel',
          description: 'Te recogemos en tu hotel de Hurghada y te llevamos al puerto deportivo.',
          places: ['dest-hurghada'],
          meals: [],
        },
        {
          label: '09:15',
          title: 'Salida en barco',
          description:
            'Embarcas, recibes el equipo de snorkel y el monitor da una charla sobre normas en el agua y cuidado del coral. El barco pone rumbo a las islas.',
          places: ['dest-hurghada'],
          meals: [],
        },
        {
          label: '10:00',
          title: 'Primera parada de snorkel',
          description:
            'Primera inmersión en un arrecife de poca profundidad. Te mueves junto al monitor y sin tocar ni pisar el coral.',
          places: [],
          meals: [],
        },
        {
          label: '11:30',
          title: 'Segunda parada y almuerzo',
          description:
            'El barco cambia de arrecife para una segunda sesión. Al volver a bordo se sirve el almuerzo.',
          places: [],
          meals: ['L'],
        },
        {
          label: '13:00',
          title: 'Playa en la isla',
          description:
            'Pasas algo más de una hora en una playa de la isla Giftun para nadar o descansar a la sombra.',
          places: [],
          meals: [],
        },
        {
          label: '14:30',
          title: 'Regreso a Hurghada',
          description: 'Vuelta al puerto y traslado a tu hotel, con llegada hacia las 15:30.',
          places: ['dest-hurghada'],
          meals: [],
        },
      ],
      en: [
        {
          label: '08:30',
          title: 'Hotel pickup',
          description: 'We pick you up from your Hurghada hotel and take you to the marina.',
          places: ['dest-hurghada'],
          meals: [],
        },
        {
          label: '09:15',
          title: 'Boat departure',
          description:
            'You board, get your snorkel gear and the instructor gives a short briefing on how to behave in the water and around the reef. The boat heads for the islands.',
          places: ['dest-hurghada'],
          meals: [],
        },
        {
          label: '10:00',
          title: 'First snorkel stop',
          description:
            'Your first swim on a shallow reef. You stay close to the instructor and do not touch or stand on the coral.',
          places: [],
          meals: [],
        },
        {
          label: '11:30',
          title: 'Second stop and lunch',
          description: 'The boat moves to a different reef for a second swim. Lunch is served when you are back on board.',
          places: [],
          meals: ['L'],
        },
        {
          label: '13:00',
          title: 'Island beach',
          description: 'A little over an hour on a Giftun island beach to swim or rest in the shade.',
          places: [],
          meals: [],
        },
        {
          label: '14:30',
          title: 'Back to Hurghada',
          description: 'Return to the marina and transfer to your hotel, arriving around 15:30.',
          places: ['dest-hurghada'],
          meals: [],
        },
      ],
    },
    includes: {
      es: [
        'Recogida y regreso al hotel en Hurghada',
        'Excursión en barco con tripulación',
        'Equipo de snorkel: máscara, tubo y aletas',
        'Monitor de snorkel en español o inglés',
        'Almuerzo, agua y refrescos a bordo',
      ],
      en: [
        'Hotel pickup and drop-off in Hurghada',
        'Boat trip with crew',
        'Snorkel gear: mask, snorkel and fins',
        'Spanish- or English-speaking snorkel instructor',
        'Lunch, water and soft drinks on board',
      ],
    },
    excludes: {
      es: [
        'Tasa de acceso al parque marino [verificar]',
        'Traje de neopreno',
        'Fotos y vídeo bajo el agua',
        'Propinas para la tripulación',
      ],
      en: [
        'Marine park entry fee [verify]',
        'Wetsuit',
        'Underwater photos and video',
        'Tips for the crew',
      ],
    },
    what_to_bring: {
      es: [
        'Bañador y toalla',
        'Protector solar respetuoso con el arrecife',
        'Camiseta o lycra para el sol en el agua',
        'Dinero en efectivo para la tasa del parque',
      ],
      en: [
        'Swimwear and a towel',
        'Reef-friendly sunscreen',
        'A T-shirt or rash vest for sun in the water',
        'Cash for the park fee',
      ],
    },
    availability_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    season_note: {
      es: 'Funciona todo el año. De diciembre a marzo el agua está más fresca y puede convenir un neopreno; con viento fuerte la salida puede cambiar de ruta o aplazarse.',
      en: 'Runs all year. From December to March the water is cooler and a wetsuit helps; in strong wind the boat may change route or postpone.',
    },
    cancellation_policy: 'flexible',
    faq: {
      es: [
        {
          q: '¿Necesito saber nadar?',
          a: 'Conviene saber flotar. Hay chalecos salvavidas a bordo y el monitor acompaña a quien lo necesite.',
        },
        {
          q: '¿Cuánto cuesta la tasa del parque marino?',
          a: 'La fija la autoridad del parque y cambia con el tiempo. Te confirmamos el importe al reservar [verificar].',
        },
        {
          q: '¿Qué pasa si hay mucho viento?',
          a: 'La tripulación puede elegir arrecifes más resguardados o aplazar la salida. Si se cancela, te proponemos otra fecha.',
        },
      ],
      en: [
        {
          q: 'Do I need to be able to swim?',
          a: 'You should be comfortable floating. Life jackets are on board and the instructor stays with anyone who needs help.',
        },
        {
          q: 'How much is the marine park fee?',
          a: 'It is set by the park authority and changes over time. We confirm the amount when you book [verify].',
        },
        {
          q: 'What if it is very windy?',
          a: 'The crew may choose more sheltered reefs or postpone the trip. If it is cancelled, we offer you another date.',
        },
      ],
    },
    destinations: ['dest-hurghada'],
    related_trips: ['exc-luxor-day', 'exc-abu-dabbab', 'tour-redsea-12'],
    featured: true,
    duration_hours: 7,
    departure: ['hurghada'],
    start_times: [{ time: '08:30', label: { es: 'Recogida en el hotel', en: 'Hotel pickup' } }],
    pickup_areas: {
      es: ['Hurghada centro y Sakkala', 'Zona hotelera de Hurghada', 'Sahl Hasheesh', 'Makadi Bay'],
      en: ['Hurghada town and Sakkala', 'Hurghada hotel strip', 'Sahl Hasheesh', 'Makadi Bay'],
    },
    child_price_eur: 25,
    child_price_usd: 28,
    min_age: 6,
    activity_level: 'easy',
  },
  {
    collection: 'excursions',
    key: 'exc-abu-dabbab',
    title: {
      es: 'Snorkel en Abu Dabbab desde Marsa Alam',
      en: 'Abu Dabbab snorkelling trip from Marsa Alam',
    },
    slug: {
      es: 'snorkel-abu-dabbab-desde-marsa-alam',
      en: 'abu-dabbab-snorkelling-from-marsa-alam',
    },
    excerpt: {
      es: 'Snorkel desde la playa en la bahía de Abu Dabbab, al norte de Marsa Alam, sobre praderas marinas donde a menudo se ven tortugas verdes.',
      en: 'Snorkelling from the beach at Abu Dabbab Bay, north of Marsa Alam, over seagrass beds where green turtles are often seen.',
    },
    subtitle: {
      es: 'Praderas marinas y tortugas verdes en grupo reducido',
      en: 'Seagrass and green turtles in a small group',
    },
    overview: {
      es: [
        'La bahía de Abu Dabbab está al norte de Marsa Alam y es conocida por sus praderas marinas, donde se alimentan tortugas verdes. Se entra al agua directamente desde la playa, sin barco.',
        'Haces dos sesiones de snorkel con un monitor en un grupo de pocas personas. Las tortugas se ven con frecuencia, pero son animales salvajes y nadie puede prometer que aparezcan. Si las encuentras, mantén la distancia, no las toques y no las persigas.',
        'Entre sesión y sesión hay almuerzo en la playa. El acceso a la playa tiene una tarifa que se paga aparte [verificar].',
      ],
      en: [
        'Abu Dabbab Bay lies north of Marsa Alam and is known for its seagrass beds, where green turtles feed. You walk into the water straight from the beach, with no boat needed.',
        'You make two snorkel sessions with an instructor in a small group. Turtles are seen often, but they are wild animals and nobody can promise they will appear. If you do meet one, keep your distance, do not touch it and do not follow it.',
        'Lunch is served on the beach between sessions. Beach access has a fee paid separately [verify].',
      ],
    },
    meta_description: {
      es: 'Snorkel en Abu Dabbab desde Marsa Alam: praderas marinas, tortugas verdes y arrecife desde la playa, en grupo reducido con monitor y almuerzo.',
      en: 'Abu Dabbab snorkelling from Marsa Alam: seagrass, green turtles and reef from the beach, in a small group with an instructor and lunch.',
    },
    featured_image: 'card-exc-abu-dabbab',
    gallery: ['sight-abu-dabbab', 'sight-turtle', 'reef-fish', 'snorkel-gear', 'sight-samadai'],
    price_from_eur: 55,
    price_from_usd: 60,
    price_basis: 'per_person',
    price_note: {
      es: 'Precio de muestra por persona. El acceso a la playa se paga aparte [verificar].',
      en: 'Sample price per person. Beach access is paid separately [verify].',
    },
    group_type: 'small',
    group_min: 2,
    group_max: 12,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Snorkel desde la playa, sin barco',
        'Praderas marinas donde se alimentan tortugas verdes',
        'Arrecife en los lados de la bahía',
        'Grupo de hasta 12 personas con monitor',
        'Almuerzo en la playa',
      ],
      en: [
        'Snorkelling from the beach, no boat needed',
        'Seagrass beds where green turtles feed',
        'Reef along the sides of the bay',
        'Groups of up to 12 with an instructor',
        'Lunch on the beach',
      ],
    },
    itinerary: {
      es: [
        {
          label: '08:00',
          title: 'Recogida en el hotel',
          description: 'Te recogemos en tu hotel de la zona de Marsa Alam y vamos por la carretera de la costa hacia el norte.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '09:00',
          title: 'Llegada a Abu Dabbab y charla',
          description:
            'Recibes el equipo y el monitor explica cómo comportarte cerca de las tortugas: distancia, sin tocar y sin perseguirlas.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '09:30',
          title: 'Primera sesión sobre la pradera',
          description:
            'Entras desde la playa y nadas sobre la pradera marina en el centro de la bahía. Es la zona donde las tortugas suelen alimentarse.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '11:15',
          title: 'Almuerzo en la playa',
          description: 'Almuerzo y descanso a la sombra antes de volver al agua.',
          places: ['dest-marsa-alam'],
          meals: ['L'],
        },
        {
          label: '12:15',
          title: 'Segunda sesión en el arrecife',
          description: 'Segunda salida, esta vez a lo largo del arrecife de uno de los lados de la bahía.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '13:15',
          title: 'Regreso al hotel',
          description: 'Te devolvemos a tu hotel, con llegada hacia las 14:00.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
      ],
      en: [
        {
          label: '08:00',
          title: 'Hotel pickup',
          description: 'We pick you up from your hotel in the Marsa Alam area and drive north along the coast road.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '09:00',
          title: 'Arrive at Abu Dabbab and briefing',
          description:
            'You get your gear and the instructor explains how to behave around turtles: keep your distance, no touching and no chasing.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '09:30',
          title: 'First swim over the seagrass',
          description:
            'You walk in from the beach and swim over the seagrass in the middle of the bay, where turtles usually feed.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '11:15',
          title: 'Lunch on the beach',
          description: 'Lunch and a rest in the shade before going back in.',
          places: ['dest-marsa-alam'],
          meals: ['L'],
        },
        {
          label: '12:15',
          title: 'Second swim on the reef',
          description: 'A second swim, this time along the reef on one side of the bay.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
        {
          label: '13:15',
          title: 'Back to the hotel',
          description: 'We take you back to your hotel, arriving around 14:00.',
          places: ['dest-marsa-alam'],
          meals: [],
        },
      ],
    },
    includes: {
      es: [
        'Recogida y regreso al hotel en la zona de Marsa Alam',
        'Equipo de snorkel: máscara, tubo y aletas',
        'Monitor de snorkel en español o inglés',
        'Almuerzo en la playa',
        'Agua embotellada',
      ],
      en: [
        'Hotel pickup and drop-off in the Marsa Alam area',
        'Snorkel gear: mask, snorkel and fins',
        'Spanish- or English-speaking snorkel instructor',
        'Lunch on the beach',
        'Bottled water',
      ],
    },
    excludes: {
      es: [
        'Acceso a la playa de Abu Dabbab [verificar]',
        'Traje de neopreno',
        'Hamacas y sombrillas',
        'Propinas para el monitor',
      ],
      en: [
        'Abu Dabbab beach access [verify]',
        'Wetsuit',
        'Sunbeds and umbrellas',
        'Tips for the instructor',
      ],
    },
    what_to_bring: {
      es: [
        'Bañador y toalla',
        'Protector solar respetuoso con el arrecife',
        'Escarpines para entrar desde la orilla',
        'Dinero en efectivo para el acceso a la playa',
      ],
      en: [
        'Swimwear and a towel',
        'Reef-friendly sunscreen',
        'Water shoes for walking in from the shore',
        'Cash for beach access',
      ],
    },
    availability_days: ['mon', 'wed', 'fri', 'sun'],
    season_note: {
      es: 'Funciona todo el año. De diciembre a marzo el agua está más fresca y conviene un neopreno.',
      en: 'Runs all year. From December to March the water is cooler and a wetsuit is a good idea.',
    },
    cancellation_policy: 'flexible',
    faq: {
      es: [
        {
          q: '¿Voy a ver tortugas con certeza?',
          a: 'No se puede prometer. Las tortugas se ven a menudo en Abu Dabbab, pero son animales salvajes y su presencia cambia de un día a otro.',
        },
        {
          q: '¿Puedo tocar o hacer fotos a las tortugas?',
          a: 'Puedes hacer fotos sin flash y a distancia. No se las toca, no se las persigue y no se les corta el paso cuando suben a respirar.',
        },
        {
          q: '¿Es apto para principiantes?',
          a: 'Sí. Se entra desde la playa en aguas tranquilas y el monitor acompaña al grupo en todo momento.',
        },
      ],
      en: [
        {
          q: 'Will I definitely see turtles?',
          a: 'We cannot promise it. Turtles are often seen at Abu Dabbab, but they are wild animals and sightings vary from day to day.',
        },
        {
          q: 'Can I touch or photograph the turtles?',
          a: 'You can take photos without flash and from a distance. Do not touch them, follow them or block their way when they come up to breathe.',
        },
        {
          q: 'Is it suitable for beginners?',
          a: 'Yes. You enter from the beach in calm water and the instructor stays with the group throughout.',
        },
      ],
    },
    destinations: ['dest-marsa-alam'],
    related_trips: ['exc-giftun', 'tour-redsea-12'],
    featured: false,
    duration_hours: 6,
    departure: ['marsa-alam'],
    start_times: [{ time: '08:00', label: { es: 'Recogida en el hotel', en: 'Hotel pickup' } }],
    pickup_areas: {
      es: ['Marsa Alam y Port Ghalib', 'Hoteles de la costa al norte de Marsa Alam', 'Hoteles de la costa al sur de Marsa Alam'],
      en: ['Marsa Alam and Port Ghalib', 'Coastal hotels north of Marsa Alam', 'Coastal hotels south of Marsa Alam'],
    },
    child_price_eur: 30,
    child_price_usd: 33,
    min_age: 6,
    activity_level: 'easy',
  },
  {
    collection: 'excursions',
    key: 'exc-pyramids',
    title: {
      es: 'Pirámides de Guiza y la Esfinge desde El Cairo',
      en: 'Giza pyramids and the Sphinx from Cairo',
    },
    slug: {
      es: 'piramides-de-guiza-y-esfinge-desde-el-cairo',
      en: 'giza-pyramids-and-sphinx-from-cairo',
    },
    excerpt: {
      es: 'Día guiado en El Cairo: las pirámides de Guiza, la Esfinge, el Museo Egipcio y un paseo por Jan el-Jalili, en grupo reducido con almuerzo.',
      en: 'A guided day in Cairo: the Giza pyramids, the Sphinx, the Egyptian Museum and a walk through Khan el-Khalili, in a small group with lunch.',
    },
    subtitle: {
      es: 'La meseta de Guiza y el Museo Egipcio en ocho horas',
      en: 'The Giza plateau and the Egyptian Museum in eight hours',
    },
    overview: {
      es: [
        'Esta excursión de ocho horas reúne lo esencial de El Cairo. Empiezas en la meseta de Guiza con las pirámides de Keops, Kefrén y Micerino, y bajas hasta la Esfinge y el templo del valle.',
        'Después del almuerzo visitas el Museo Egipcio, en la plaza Tahrir, con su colección de estatuas, sarcófagos y objetos de la vida cotidiana. El día termina con un paseo corto por el bazar de Jan el-Jalili.',
        'La entrada al recinto de las pirámides no incluye el interior de la Gran Pirámide, que tiene billete aparte y cupo diario [verificar].',
      ],
      en: [
        'This eight-hour trip covers the essentials of Cairo. You start on the Giza plateau with the pyramids of Khufu, Khafre and Menkaure, then walk down to the Sphinx and the valley temple.',
        "After lunch you visit the Egyptian Museum on Tahrir Square, with its statues, sarcophagi and everyday objects. The day ends with a short walk through Khan el-Khalili bazaar.",
        'The ticket for the pyramid site does not include going inside the Great Pyramid, which needs a separate ticket with a daily limit [verify].',
      ],
    },
    meta_description: {
      es: 'Excursión desde El Cairo a las pirámides de Guiza y la Esfinge, con Museo Egipcio y Jan el-Jalili. Grupo reducido, guía en español y almuerzo.',
      en: 'Day trip from Cairo to the Giza pyramids and the Sphinx, plus the Egyptian Museum and Khan el-Khalili. Small group, guide and lunch.',
    },
    featured_image: 'card-exc-pyramids',
    gallery: ['sight-giza', 'sight-sphinx', 'sight-egyptian-museum', 'sight-khan', 'nile-sunset'],
    price_from_eur: 65,
    price_from_usd: 70,
    price_basis: 'per_person',
    price_note: {
      es: 'Precio de muestra por persona. Las entradas a los monumentos dependen de la tarifa vigente [verificar].',
      en: 'Sample price per person. Monument entry depends on current ticket prices [verify].',
    },
    group_type: 'small',
    group_min: 2,
    group_max: 12,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Pirámides de Keops, Kefrén y Micerino',
        'Mirador panorámico de la meseta de Guiza',
        'La Esfinge y el templo del valle',
        'Museo Egipcio en la plaza Tahrir',
        'Paseo por el bazar de Jan el-Jalili',
        'Grupo de hasta 12 personas',
      ],
      en: [
        'The pyramids of Khufu, Khafre and Menkaure',
        'Panoramic viewpoint over the Giza plateau',
        'The Sphinx and the valley temple',
        'The Egyptian Museum on Tahrir Square',
        'A walk through Khan el-Khalili bazaar',
        'Groups of up to 12',
      ],
    },
    itinerary: {
      es: [
        {
          label: '08:00',
          title: 'Recogida en el hotel',
          description: 'Te recogemos en tu hotel de El Cairo o Guiza y vamos hacia la meseta.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '08:45',
          title: 'Pirámides de Guiza',
          description:
            'Recorres la base de la Gran Pirámide de Keops y ves las de Kefrén y Micerino. Si has comprado billete para el interior, este es el momento de entrar [verificar].',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '10:15',
          title: 'Mirador panorámico',
          description: 'Subes en el vehículo al mirador del desierto, desde donde se ven las tres pirámides juntas.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '11:00',
          title: 'La Esfinge y el templo del valle',
          description: 'Bajas hasta la Esfinge y el templo del valle de Kefrén, de donde partía la calzada hacia su pirámide.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '12:15',
          title: 'Almuerzo',
          description: 'Almuerzo en un restaurante local en Guiza.',
          places: ['dest-cairo'],
          meals: ['L'],
        },
        {
          label: '13:30',
          title: 'Museo Egipcio',
          description:
            'Visita guiada al Museo Egipcio de la plaza Tahrir, con estatuas, sarcófagos y objetos del Egipto antiguo.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '15:15',
          title: 'Jan el-Jalili y regreso',
          description: 'Paseo corto por el bazar de Jan el-Jalili y regreso a tu hotel hacia las 16:00.',
          places: ['dest-cairo'],
          meals: [],
        },
      ],
      en: [
        {
          label: '08:00',
          title: 'Hotel pickup',
          description: 'We pick you up from your hotel in Cairo or Giza and drive to the plateau.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '08:45',
          title: 'The Giza pyramids',
          description:
            'You walk around the base of the Great Pyramid of Khufu and see the pyramids of Khafre and Menkaure. If you have a ticket for the interior, this is when you go in [verify].',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '10:15',
          title: 'Panoramic viewpoint',
          description: 'A short drive to the desert viewpoint, where you see all three pyramids together.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '11:00',
          title: 'The Sphinx and the valley temple',
          description: "You walk down to the Sphinx and Khafre's valley temple, where the causeway to his pyramid began.",
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '12:15',
          title: 'Lunch',
          description: 'Lunch at a local restaurant in Giza.',
          places: ['dest-cairo'],
          meals: ['L'],
        },
        {
          label: '13:30',
          title: 'Egyptian Museum',
          description: 'A guided visit to the Egyptian Museum on Tahrir Square, with statues, sarcophagi and objects from ancient Egypt.',
          places: ['dest-cairo'],
          meals: [],
        },
        {
          label: '15:15',
          title: 'Khan el-Khalili and return',
          description: 'A short walk through Khan el-Khalili bazaar, then back to your hotel at around 16:00.',
          places: ['dest-cairo'],
          meals: [],
        },
      ],
    },
    includes: {
      es: [
        'Recogida y regreso al hotel en El Cairo o Guiza',
        'Transporte con aire acondicionado',
        'Guía en español o inglés',
        'Almuerzo en Guiza',
        'Agua embotellada en el vehículo',
      ],
      en: [
        'Hotel pickup and drop-off in Cairo or Giza',
        'Air-conditioned transport',
        'Spanish- or English-speaking guide',
        'Lunch in Giza',
        'Bottled water in the vehicle',
      ],
    },
    excludes: {
      es: [
        'Entradas a la meseta de Guiza y al Museo Egipcio [verificar]',
        'Entrada al interior de las pirámides [verificar]',
        'Paseo en camello o a caballo',
        'Bebidas en el almuerzo',
        'Propinas para el guía y el conductor',
      ],
      en: [
        'Entry to the Giza plateau and the Egyptian Museum [verify]',
        'Entry to the inside of the pyramids [verify]',
        'Camel or horse rides',
        'Drinks with lunch',
        'Tips for the guide and driver',
      ],
    },
    what_to_bring: {
      es: [
        'Calzado cómodo para caminar sobre arena y piedra',
        'Sombrero, gafas de sol y protector solar',
        'Ropa que cubra hombros y rodillas',
        'Dinero en efectivo para entradas y compras',
      ],
      en: [
        'Comfortable shoes for sand and stone',
        'Hat, sunglasses and sunscreen',
        'Clothes that cover shoulders and knees',
        'Cash for tickets and shopping',
      ],
    },
    availability_days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    season_note: {
      es: 'Funciona todo el año. De mayo a septiembre la meseta de Guiza es muy calurosa a partir del mediodía, por eso la visita empieza temprano.',
      en: 'Runs all year. From May to September the Giza plateau gets very hot after midday, which is why the visit starts early.',
    },
    cancellation_policy: 'standard',
    faq: {
      es: [
        {
          q: '¿Se puede entrar dentro de las pirámides?',
          a: 'Sí, con un billete aparte que tiene cupo diario y precio propio [verificar]. Dinos al reservar si quieres entrar.',
        },
        {
          q: '¿El paseo en camello está incluido?',
          a: 'No. Si te interesa, el guía te indica dónde hacerlo con operadores autorizados y cómo acordar el precio antes de subir.',
        },
        {
          q: '¿Puedo hacer la excursión en privado?',
          a: 'Sí. Podemos preparar la misma ruta solo para tu grupo, con horario a tu medida.',
        },
      ],
      en: [
        {
          q: 'Can I go inside the pyramids?',
          a: 'Yes, with a separate ticket that has its own price and a daily limit [verify]. Let us know when you book if you want to go in.',
        },
        {
          q: 'Is a camel ride included?',
          a: 'No. If you would like one, your guide will show you where to find licensed operators and how to agree the price before you get on.',
        },
        {
          q: 'Can I book this as a private tour?',
          a: 'Yes. We can run the same route just for your group, on your own schedule.',
        },
      ],
    },
    destinations: ['dest-cairo'],
    related_trips: ['tour-cairo-luxor-5', 'tour-classic-8', 'exc-luxor-day'],
    featured: true,
    duration_hours: 8,
    departure: ['el-cairo'],
    start_times: [{ time: '08:00', label: { es: 'Recogida en el hotel', en: 'Hotel pickup' } }],
    pickup_areas: {
      es: ['Centro de El Cairo', 'Zamalek y Garden City', 'Guiza', 'Heliópolis y Nuevo Cairo'],
      en: ['Downtown Cairo', 'Zamalek and Garden City', 'Giza', 'Heliopolis and New Cairo'],
    },
    child_price_eur: 35,
    child_price_usd: 38,
    min_age: 3,
    activity_level: 'moderate',
  },
]
