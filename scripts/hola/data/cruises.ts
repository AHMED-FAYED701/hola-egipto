import type { CruiseSample } from './types'

/** Sample Nile cruises (content rules §2). Prices are flagged samples; ship names are pending. */
export const CRUISES: CruiseSample[] = [
  {
    collection: 'cruises',
    key: 'cruise-luxor-aswan-4',
    title: {
      es: 'Crucero por el Nilo de Luxor a Asuán, 4 noches',
      en: 'Nile cruise from Luxor to Aswan, 4 nights',
    },
    slug: {
      es: 'crucero-nilo-luxor-asuan-4-noches',
      en: 'nile-cruise-luxor-aswan-4-nights',
    },
    excerpt: {
      es: 'Cuatro noches a bordo entre Luxor y Asuán, con visitas guiadas en español a Karnak, el Valle de los Reyes, Edfu, Kom Ombo y Philae.',
      en: 'Four nights on board from Luxor to Aswan, with guided visits to Karnak, the Valley of the Kings, Edfu, Kom Ombo and Philae.',
    },
    subtitle: {
      es: 'Templos del Alto Egipto desde la cubierta de un barco 5★',
      en: 'Upper Egypt temples from the deck of a 5★ ship',
    },
    overview: {
      es: [
        'Este crucero recorre el tramo clásico del Nilo, de Luxor a Asuán, en cinco días y cuatro noches. Embarcas en Luxor al mediodía y desembarcas en Asuán después del desayuno del quinto día. Entre medio, el barco navega de día y por la tarde, y tú visitas los templos con un guía que habla tu idioma.',
        'En Luxor ves la orilla este (Karnak y el Templo de Luxor) y la orilla oeste (Valle de los Reyes y el templo de Hatshepsut). Después el barco cruza la esclusa de Esna y sigue hacia Edfu y Kom Ombo, dos templos que se visitan a pie desde el muelle.',
        'En Asuán el ritmo cambia: la Presa Alta, el templo de Philae en su isla y un paseo en faluca al atardecer. El barco es un 5★ cuyo nombre está pendiente de confirmar; la pensión completa a bordo está incluida.',
      ],
      en: [
        'This cruise covers the classic stretch of the Nile between Luxor and Aswan over five days and four nights. You board in Luxor around midday and leave the ship in Aswan after breakfast on day five. In between, the ship sails while you rest, and you visit the temples with a guide who speaks your language.',
        "In Luxor you see the east bank (Karnak and Luxor Temple) and the west bank (Valley of the Kings and Hatshepsut's temple). The ship then passes the Esna lock and continues to Edfu and Kom Ombo, two temples you can walk to from the mooring.",
        "Aswan is slower: the High Dam, Philae temple on its island and a felucca sail in the late afternoon. The ship is a 5★ vessel whose name is still to be confirmed; full board on the ship is included.",
      ],
    },
    meta_description: {
      es: 'Crucero de 4 noches por el Nilo de Luxor a Asuán: Karnak, Valle de los Reyes, Edfu, Kom Ombo y Philae con guía en español. Pensión completa a bordo.',
      en: 'Four-night Nile cruise from Luxor to Aswan: Karnak, Valley of the Kings, Edfu, Kom Ombo and Philae with a guide. Full board on a 5★ ship.',
    },
    featured_image: 'card-cruise-luxor-aswan',
    gallery: ['nile-deck', 'sight-karnak', 'sight-edfu', 'sight-kom-ombo', 'sight-philae'],
    price_from_eur: 640,
    price_from_usd: 690,
    price_basis: 'per_person_double',
    price_note: {
      es: 'Precio de muestra por persona en cabina doble estándar. Las entradas a los monumentos dependen de la tarifa vigente [verificar].',
      en: 'Sample price per person in a standard double cabin. Monument entry depends on current ticket prices [verify].',
    },
    group_type: 'shared',
    group_min: 1,
    group_max: 30,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Karnak y el Templo de Luxor en la orilla este',
        'Valle de los Reyes y templo de Hatshepsut en la orilla oeste',
        'Paso de la esclusa de Esna desde la cubierta',
        'Templo de Horus en Edfu',
        'Templo doble de Kom Ombo al atardecer',
        'Templo de Philae y paseo en faluca en Asuán',
      ],
      en: [
        'Karnak and Luxor Temple on the east bank',
        "Valley of the Kings and Hatshepsut's temple on the west bank",
        'Passing the Esna lock from the deck',
        'Temple of Horus at Edfu',
        'The double temple of Kom Ombo at sunset',
        'Philae temple and a felucca sail in Aswan',
      ],
    },
    itinerary: {
      es: [
        {
          label: 'Día 1',
          title: 'Embarque en Luxor y orilla este',
          description:
            'Embarcas en Luxor hacia el mediodía y almuerzas a bordo. Por la tarde visitas el complejo de Karnak y el Templo de Luxor, ambos en la orilla este. Cena y noche con el barco amarrado en Luxor.',
          places: ['dest-luxor'],
          meals: ['L', 'D'],
          overnight: 'Luxor · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 2',
          title: 'Orilla oeste y esclusa de Esna',
          description:
            'Temprano cruzas a la orilla oeste para ver el Valle de los Reyes, el templo de Hatshepsut y los Colosos de Memnón. De vuelta a bordo, el barco zarpa hacia el sur y pasa la esclusa de Esna. Noche navegando hacia Edfu.',
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 3',
          title: 'Edfu y Kom Ombo',
          description:
            'Por la mañana visitas el templo de Horus en Edfu, un templo ptolemaico casi completo. El barco sigue hasta Kom Ombo, donde ves al atardecer el templo dedicado a Sobek y Haroeris. Navegación nocturna hacia Asuán.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 4',
          title: 'Asuán: Presa Alta, Philae y faluca',
          description:
            'Visitas la Presa Alta y llegas en lancha al templo de Philae, en su isla. Por la tarde das un paseo en faluca alrededor de la isla Elefantina. La excursión opcional a Abu Simbel sale de madrugada y tiene coste aparte [verificar].',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Asuán · Barco 5★ (nombre pendiente)',
        },
        {
          label: 'Día 5',
          title: 'Desembarque en Asuán',
          description:
            'Desayuno a bordo y desembarque por la mañana. Si sigues el viaje, te llevamos al aeropuerto, a la estación de tren o a tu hotel en Asuán.',
          places: ['dest-aswan'],
          meals: ['B'],
        },
      ],
      en: [
        {
          label: 'Day 1',
          title: 'Board in Luxor and see the east bank',
          description:
            'You board in Luxor around midday and have lunch on the ship. In the afternoon you visit the Karnak complex and Luxor Temple, both on the east bank. Dinner and overnight moored in Luxor.',
          places: ['dest-luxor'],
          meals: ['L', 'D'],
          overnight: 'Luxor · 5★ ship (name pending)',
        },
        {
          label: 'Day 2',
          title: 'West bank and the Esna lock',
          description:
            "Early in the morning you cross to the west bank for the Valley of the Kings, Hatshepsut's temple and the Colossi of Memnon. Back on board, the ship heads south and passes the Esna lock. Overnight sailing towards Edfu.",
          places: ['dest-luxor'],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · 5★ ship (name pending)',
        },
        {
          label: 'Day 3',
          title: 'Edfu and Kom Ombo',
          description:
            'In the morning you visit the Temple of Horus at Edfu, a Ptolemaic temple that is almost complete. The ship continues to Kom Ombo, where you see the temple of Sobek and Haroeris around sunset. Overnight sailing to Aswan.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · 5★ ship (name pending)',
        },
        {
          label: 'Day 4',
          title: 'Aswan: High Dam, Philae and a felucca',
          description:
            'You visit the High Dam and take a small boat to Philae temple on its island. Later in the day you sail by felucca around Elephantine Island. The optional Abu Simbel trip leaves before dawn and costs extra [verify].',
          places: ['dest-aswan'],
          meals: ['B', 'L', 'D'],
          overnight: 'Aswan · 5★ ship (name pending)',
        },
        {
          label: 'Day 5',
          title: 'Leave the ship in Aswan',
          description:
            'Breakfast on board, then you leave the ship in the morning. If your trip continues, we take you to the airport, the railway station or your hotel in Aswan.',
          places: ['dest-aswan'],
          meals: ['B'],
        },
      ],
    },
    includes: {
      es: [
        'Cuatro noches en cabina doble en barco 5★ (nombre pendiente)',
        'Pensión completa a bordo, del almuerzo del día 1 al desayuno del día 5',
        'Visitas guiadas en español o inglés según el programa',
        'Paseo en faluca en Asuán',
        'Traslados entre el barco y los templos',
      ],
      en: [
        'Four nights in a double cabin on a 5★ ship (name pending)',
        'Full board on the ship, from lunch on day 1 to breakfast on day 5',
        'Guided visits in Spanish or English as per the programme',
        'Felucca sail in Aswan',
        'Transfers between the ship and the temples',
      ],
    },
    excludes: {
      es: [
        'Entradas a los monumentos, según la tarifa vigente [verificar]',
        'Excursión opcional a Abu Simbel',
        'Bebidas a bordo',
        'Vuelos y visado de Egipto [verificar]',
        'Propinas para la tripulación y el guía',
      ],
      en: [
        'Monument entry tickets, at current rates [verify]',
        'Optional trip to Abu Simbel',
        'Drinks on board',
        'Flights and Egypt visa [verify]',
        'Tips for the crew and guide',
      ],
    },
    what_to_bring: {
      es: [
        'Sombrero, gafas de sol y protector solar',
        'Calzado cómodo para caminar en los templos',
        'Una chaqueta ligera para las noches en cubierta de noviembre a febrero',
        'Ropa que cubra hombros y rodillas para las visitas',
        'Pasaporte, que se entrega en recepción al embarcar',
      ],
      en: [
        'Hat, sunglasses and sunscreen',
        'Comfortable shoes for walking around the temples',
        'A light jacket for evenings on deck from November to February',
        'Clothes that cover shoulders and knees for the visits',
        'Your passport, which reception keeps during the cruise',
      ],
    },
    availability_days: ['mon'],
    season_note: {
      es: 'Salidas todo el año. De octubre a abril las temperaturas son más suaves; de junio a agosto el calor en Luxor y Asuán es intenso y las visitas se hacen a primera hora.',
      en: 'Departures all year. October to April is milder; from June to August Luxor and Aswan are very hot and visits start early in the morning.',
    },
    cancellation_policy: 'standard',
    faq: {
      es: [
        {
          q: '¿Puedo hacer el crucero en sentido contrario, de Asuán a Luxor?',
          a: 'Sí. El crucero de Asuán a Luxor suele durar 3 noches porque se navega a favor de la corriente. Escríbenos y te contamos las fechas.',
        },
        {
          q: '¿Las entradas a los templos están incluidas?',
          a: 'En este programa de muestra no. Las tarifas cambian con frecuencia y te las confirmamos al reservar [verificar].',
        },
        {
          q: '¿Hay guía en español durante todo el crucero?',
          a: 'Sí, las visitas del programa se hacen con guía en español o en inglés, según el idioma que elijas al reservar.',
        },
      ],
      en: [
        {
          q: 'Can I do the cruise the other way, from Aswan to Luxor?',
          a: 'Yes. Aswan to Luxor usually takes 3 nights because the ship sails with the current. Get in touch and we will share dates.',
        },
        {
          q: 'Are temple tickets included?',
          a: 'Not in this sample programme. Ticket prices change often, so we confirm them when you book [verify].',
        },
        {
          q: 'Is there a guide for the whole cruise?',
          a: 'Yes. Every visit in the programme is guided in Spanish or English, whichever you choose when you book.',
        },
      ],
    },
    destinations: ['dest-luxor', 'dest-aswan'],
    related_trips: ['tour-classic-8', 'cruise-dahabiya-5', 'exc-luxor-day'],
    featured: true,
    nights: 4,
    cruise_type: 'crucero-luxor-asuan',
    trip_style: ['clasico'],
    ship_name: { es: 'Barco 5★ (nombre pendiente)', en: '5★ ship (name pending)' },
    ship_category: '5star',
    embark: 'dest-luxor',
    disembark: 'dest-aswan',
    start_dates: [
      {
        date: '2027-01-11',
        note: { es: 'Temporada de invierno', en: 'Winter season' },
      },
      {
        date: '2027-02-15',
        note: { es: 'Temporada de invierno', en: 'Winter season' },
      },
      {
        date: '2027-03-15',
        note: { es: 'Primavera, días más largos', en: 'Spring, longer days' },
      },
      {
        date: '2027-10-11',
        note: { es: 'Inicio de la temporada de otoño', en: 'Start of the autumn season' },
      },
    ],
    cabins: [
      {
        type: { es: 'Cabina estándar', en: 'Standard cabin' },
        size_m2: 22,
        beds: { es: 'Dos camas individuales o una cama doble', en: 'Two single beds or one double bed' },
        price_from_eur: 640,
        price_from_usd: 690,
      },
      {
        type: { es: 'Cabina con balcón', en: 'Balcony cabin' },
        size_m2: 26,
        beds: { es: 'Una cama doble', en: 'One double bed' },
        price_from_eur: 760,
        price_from_usd: 820,
      },
      {
        type: { es: 'Suite', en: 'Suite' },
        size_m2: 40,
        beds: { es: 'Una cama de matrimonio grande y zona de estar', en: 'One king-size bed and a sitting area' },
        price_from_eur: 980,
        price_from_usd: 1060,
      },
    ],
    ship_facilities: ['pool', 'sun_deck', 'restaurant', 'bar', 'air_conditioning', 'wifi'],
    deck_plan: 'deck-plan',
  },
  {
    collection: 'cruises',
    key: 'cruise-dahabiya-5',
    title: {
      es: 'Dahabiya por el Nilo, 5 noches',
      en: 'Nile dahabiya, 5 nights',
    },
    slug: {
      es: 'dahabiya-nilo-5-noches',
      en: 'nile-dahabiya-5-nights',
    },
    excerpt: {
      es: 'Cinco noches a vela en una dahabiya de pocas cabinas, con paradas en El Kab, Edfu, Gebel el-Silsila y Kom Ombo antes de llegar a Asuán.',
      en: 'Five nights under sail on a small dahabiya, stopping at El Kab, Edfu, Gebel el-Silsila and Kom Ombo on the way to Aswan.',
    },
    subtitle: {
      es: 'El Nilo a vela, con paradas que los barcos grandes no hacen',
      en: 'The Nile under sail, with stops the big ships skip',
    },
    overview: {
      es: [
        'La dahabiya es un velero tradicional de dos mástiles con entre 8 y 12 cabinas. Navega más despacio que un crucero grande y puede amarrar en orillas e islas donde los barcos de mayor tamaño no paran.',
        'Te recogemos en Luxor y embarcas cerca de Esna, ya pasada la esclusa. Durante cinco noches el barco sube el río hacia Asuán y se detiene en El Kab, Edfu, Gebel el-Silsila y Kom Ombo. Las tardes se pasan en cubierta, viendo pasar aldeas y campos.',
        'Cuando el viento no acompaña, un remolcador ayuda a cumplir el horario. A bordo hay un solo turno de comidas para todo el grupo y un guía que habla tu idioma. El nombre del barco está pendiente de confirmar.',
      ],
      en: [
        'A dahabiya is a traditional two-masted sailing boat with 8 to 12 cabins. It moves more slowly than a large cruise ship and can moor at banks and islands where bigger boats do not stop.',
        'We pick you up in Luxor and you board near Esna, past the lock. Over five nights the boat travels upriver to Aswan, stopping at El Kab, Edfu, Gebel el-Silsila and Kom Ombo. Afternoons are spent on deck, watching villages and fields go by.',
        'When the wind drops, a tug helps the boat keep to schedule. Meals are served at one sitting for the whole group, and a guide who speaks your language travels with you. The boat name is still to be confirmed.',
      ],
    },
    meta_description: {
      es: 'Dahabiya de 5 noches por el Nilo de Luxor a Asuán: El Kab, Edfu, Gebel el-Silsila y Kom Ombo en un velero de pocas cabinas con guía en español.',
      en: 'Five-night Nile dahabiya from Luxor to Aswan: El Kab, Edfu, Gebel el-Silsila and Kom Ombo on a small sailing boat with a guide.',
    },
    featured_image: 'card-cruise-dahabiya',
    gallery: ['dahabiya-sails', 'nile-sunset', 'sight-edfu', 'sight-kom-ombo', 'nile-cabin'],
    price_from_eur: 1150,
    price_from_usd: 1240,
    price_basis: 'per_person_double',
    price_note: {
      es: 'Precio de muestra por persona en cabina doble. Las entradas a los monumentos dependen de la tarifa vigente [verificar].',
      en: 'Sample price per person in a double cabin. Monument entry depends on current ticket prices [verify].',
    },
    group_type: 'small',
    group_min: 2,
    group_max: 20,
    guide_languages: ['es', 'en'],
    highlights: {
      es: [
        'Navegación a vela en un barco de 8 a 12 cabinas',
        'Tumbas de los nobles y templo en El Kab',
        'Templo de Horus en Edfu',
        'Canteras y capillas de Gebel el-Silsila',
        'Templo de Kom Ombo junto al río',
        'Noches amarradas en orillas e islas tranquilas',
      ],
      en: [
        'Sailing on a boat with 8 to 12 cabins',
        'Tombs of the nobles and temple at El Kab',
        'Temple of Horus at Edfu',
        'Quarries and chapels of Gebel el-Silsila',
        'Kom Ombo temple on the riverbank',
        'Nights moored at quiet banks and islands',
      ],
    },
    itinerary: {
      es: [
        {
          label: 'Día 1',
          title: 'De Luxor a Esna y embarque',
          description:
            'Te recogemos en tu hotel de Luxor y vamos por carretera hasta el muelle cerca de Esna. Embarcas, almuerzas a bordo y la dahabiya empieza a navegar hacia el sur. Primera noche amarrada en la orilla.',
          places: ['dest-luxor'],
          meals: ['L', 'D'],
          overnight: 'A bordo · Dahabiya (nombre pendiente)',
        },
        {
          label: 'Día 2',
          title: 'El Kab',
          description:
            'Por la mañana bajas a tierra en El Kab, la antigua Nejeb, para ver las tumbas de los nobles excavadas en la roca y los restos de su templo. Vuelves a bordo para el almuerzo y la tarde transcurre navegando.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Dahabiya (nombre pendiente)',
        },
        {
          label: 'Día 3',
          title: 'Edfu',
          description:
            'Visitas temprano el templo de Horus en Edfu, antes de que lleguen los grupos de los barcos grandes. Después la dahabiya continúa hacia el sur entre campos y palmerales.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Dahabiya (nombre pendiente)',
        },
        {
          label: 'Día 4',
          title: 'Gebel el-Silsila',
          description:
            'Paras en Gebel el-Silsila, donde se extrajo la arenisca de muchos templos del Alto Egipto. Recorres las canteras y las capillas excavadas en la roca, entre ellas el speos de Horemheb. Noche amarrada cerca del lugar.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Dahabiya (nombre pendiente)',
        },
        {
          label: 'Día 5',
          title: 'Kom Ombo',
          description:
            'Llegas a Kom Ombo y visitas el templo doble dedicado a Sobek y Haroeris, junto al museo de los cocodrilos. Por la tarde la dahabiya navega el último tramo hacia Asuán.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'A bordo · Dahabiya (nombre pendiente)',
        },
        {
          label: 'Día 6',
          title: 'Llegada a Asuán y desembarque',
          description:
            'Desayuno a bordo y llegada a Asuán por la mañana. Desembarcas y te llevamos a tu hotel, al aeropuerto o a la estación de tren.',
          places: ['dest-aswan'],
          meals: ['B'],
        },
      ],
      en: [
        {
          label: 'Day 1',
          title: 'Luxor to Esna and boarding',
          description:
            'We pick you up from your Luxor hotel and drive to the mooring near Esna. You board, have lunch and the dahabiya starts sailing south. First night moored at the riverbank.',
          places: ['dest-luxor'],
          meals: ['L', 'D'],
          overnight: 'On board · Dahabiya (name pending)',
        },
        {
          label: 'Day 2',
          title: 'El Kab',
          description:
            'In the morning you go ashore at El Kab, ancient Nekheb, to see the rock-cut tombs of the nobles and what remains of its temple. Back on board for lunch, then an afternoon of sailing.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · Dahabiya (name pending)',
        },
        {
          label: 'Day 3',
          title: 'Edfu',
          description:
            'You visit the Temple of Horus at Edfu early, before the groups from the large ships arrive. The dahabiya then carries on south past fields and palm groves.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · Dahabiya (name pending)',
        },
        {
          label: 'Day 4',
          title: 'Gebel el-Silsila',
          description:
            'The boat stops at Gebel el-Silsila, where the sandstone for many Upper Egypt temples was quarried. You walk through the quarries and rock-cut chapels, including the speos of Horemheb. Overnight moored nearby.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · Dahabiya (name pending)',
        },
        {
          label: 'Day 5',
          title: 'Kom Ombo',
          description:
            'You reach Kom Ombo and visit the double temple of Sobek and Haroeris, next to the crocodile museum. In the afternoon the dahabiya sails the last stretch towards Aswan.',
          places: [],
          meals: ['B', 'L', 'D'],
          overnight: 'On board · Dahabiya (name pending)',
        },
        {
          label: 'Day 6',
          title: 'Arrive in Aswan and leave the boat',
          description:
            'Breakfast on board and arrival in Aswan in the morning. You leave the boat and we take you to your hotel, the airport or the railway station.',
          places: ['dest-aswan'],
          meals: ['B'],
        },
      ],
    },
    includes: {
      es: [
        'Cinco noches en cabina doble en dahabiya (nombre pendiente)',
        'Pensión completa a bordo, con agua, té y café',
        'Visitas guiadas en español o inglés según el programa',
        'Traslado por carretera de Luxor al punto de embarque',
        'Traslado de salida en Asuán',
      ],
      en: [
        'Five nights in a double cabin on a dahabiya (name pending)',
        'Full board on the boat, with water, tea and coffee',
        'Guided visits in Spanish or English as per the programme',
        'Road transfer from Luxor to the boarding point',
        'Departure transfer in Aswan',
      ],
    },
    excludes: {
      es: [
        'Entradas a los monumentos, según la tarifa vigente [verificar]',
        'Bebidas alcohólicas y refrescos',
        'Vuelos y visado de Egipto [verificar]',
        'Propinas para la tripulación y el guía',
        'Póliza de asistencia en viaje',
      ],
      en: [
        'Monument entry tickets, at current rates [verify]',
        'Alcoholic and soft drinks',
        'Flights and Egypt visa [verify]',
        'Tips for the crew and guide',
        'Travel insurance',
      ],
    },
    what_to_bring: {
      es: [
        'Sombrero, gafas de sol y protector solar',
        'Calzado cerrado para bajar a tierra por orillas de arena',
        'Una chaqueta o forro polar para las noches de invierno en cubierta',
        'Bolsa blanda en lugar de maleta rígida, por el espacio en cabina',
        'Linterna pequeña',
      ],
      en: [
        'Hat, sunglasses and sunscreen',
        'Closed shoes for going ashore on sandy banks',
        'A jacket or fleece for winter evenings on deck',
        'A soft bag rather than a hard suitcase, as cabin space is limited',
        'A small torch',
      ],
    },
    availability_days: ['sat'],
    season_note: {
      es: 'Las dahabiyas suelen operar de octubre a abril [verificar]. En verano muchas no navegan por el calor.',
      en: 'Dahabiyas usually operate from October to April [verify]. Many do not sail in summer because of the heat.',
    },
    cancellation_policy: 'standard',
    faq: {
      es: [
        {
          q: '¿Qué pasa si no hay viento?',
          a: 'La dahabiya navega a vela siempre que puede. Si el viento no basta, un remolcador la acompaña para llegar a tiempo a cada parada.',
        },
        {
          q: '¿Cuántas personas viajan a bordo?',
          a: 'Depende del barco: estas embarcaciones tienen entre 8 y 12 cabinas, así que el grupo es pequeño.',
        },
        {
          q: '¿Puedo reservar la dahabiya entera para mi familia o grupo?',
          a: 'Sí, es posible en muchas fechas. Escríbenos con el número de personas y te preparamos una propuesta.',
        },
      ],
      en: [
        {
          q: 'What happens if there is no wind?',
          a: 'The dahabiya sails whenever it can. When the wind is too light, a tug travels with it so it reaches each stop on time.',
        },
        {
          q: 'How many people are on board?',
          a: 'It depends on the boat: these vessels have 8 to 12 cabins, so the group stays small.',
        },
        {
          q: 'Can I charter the whole dahabiya for my family or group?',
          a: 'Yes, on many dates. Send us the number of travellers and we will put together a proposal.',
        },
      ],
    },
    destinations: ['dest-luxor', 'dest-aswan'],
    related_trips: ['cruise-luxor-aswan-4', 'tour-classic-8'],
    featured: true,
    nights: 5,
    cruise_type: 'dahabiya',
    trip_style: ['clasico'],
    ship_name: { es: 'Dahabiya (nombre pendiente)', en: 'Dahabiya (name pending)' },
    ship_category: 'dahabiya',
    embark: 'dest-luxor',
    disembark: 'dest-aswan',
    start_dates: [
      {
        date: '2027-01-16',
        note: { es: 'Temporada de invierno', en: 'Winter season' },
      },
      {
        date: '2027-02-20',
        note: { es: 'Temporada de invierno', en: 'Winter season' },
      },
      {
        date: '2027-03-20',
        note: { es: 'Últimas salidas de primavera', en: 'Late spring departure' },
      },
      {
        date: '2027-11-13',
        note: { es: 'Inicio de la temporada de vela', en: 'Start of the sailing season' },
      },
    ],
    cabins: [
      {
        type: { es: 'Cabina doble', en: 'Double cabin' },
        size_m2: 16,
        beds: { es: 'Dos camas individuales o una cama doble', en: 'Two single beds or one double bed' },
        price_from_eur: 1150,
        price_from_usd: 1240,
      },
      {
        type: { es: 'Suite', en: 'Suite' },
        size_m2: 26,
        beds: { es: 'Una cama doble y terraza privada', en: 'One double bed and a private terrace' },
        price_from_eur: 1450,
        price_from_usd: 1560,
      },
    ],
    ship_facilities: ['sun_deck', 'restaurant', 'bar', 'air_conditioning'],
    deck_plan: 'deck-plan',
  },
]
