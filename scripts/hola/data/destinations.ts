import type { DestinationSample } from './types'

/** Sample destinations (content rules §2). Six items, both languages in each. */
export const DESTINATIONS: DestinationSample[] = [
  {
    key: 'dest-cairo',
    title: { es: 'El Cairo y Guiza', en: 'Cairo and Giza' },
    slug: { es: 'el-cairo-y-guiza', en: 'cairo-and-giza' },
    excerpt: {
      es: 'Las pirámides de Guiza, la Esfinge, los museos de antigüedades y el bazar de Khan el-Khalili, en una ciudad a orillas del Nilo.',
      en: 'The Giza pyramids, the Sphinx, the antiquities museums and the Khan el-Khalili bazaar, in a city on the banks of the Nile.',
    },
    content: {
      es: [
        'El Cairo es la capital de Egipto y la puerta de entrada de casi todos los viajes. La ciudad se extiende a ambos lados del Nilo, justo antes de que el río se abra en el delta, y reúne en pocos kilómetros cinco mil años de historia: las pirámides del Imperio Antiguo, las mezquitas y madrasas del Cairo medieval y los barrios del siglo XIX.',
        'Guiza, en la orilla oeste, forma hoy parte del área metropolitana. En su meseta se levantan las pirámides de Keops, Kefrén y Micerinos, junto con la Esfinge y varios templos y tumbas de nobles. Conviene llegar temprano, cuando la luz es suave y el calor todavía no aprieta.',
        'Para entender lo que verás después en el Alto Egipto, dedica unas horas a los museos. El Museo Egipcio de la plaza Tahrir conserva una colección enorme de estatuas, sarcófagos y objetos cotidianos, y el Gran Museo Egipcio, junto a las pirámides, reúne buena parte del ajuar de Tutankamón [verificar].',
        'El Cairo islámico y copto completa la visita: la Ciudadela de Saladino, la mezquita de Muhammad Ali, las iglesias del barrio copto y el bazar de Khan el-Khalili, donde puedes terminar el día con un té en uno de sus cafés históricos.',
        'Con tres días tienes tiempo para Guiza, un museo y un paseo por el centro histórico sin prisas. Muchos viajeros combinan El Cairo con Luxor y Asuán en tren, en avión o con un crucero por el Nilo.',
      ],
      en: [
        'Cairo is the capital of Egypt and the starting point for most trips. It spreads along both banks of the Nile just before the river fans out into the delta, and within a few kilometres you move from Old Kingdom pyramids to medieval mosques and nineteenth-century boulevards.',
        'Giza, on the west bank, is now part of the greater city. Its plateau holds the pyramids of Khufu, Khafre and Menkaure, the Great Sphinx and a cluster of temples and noble tombs. Aim to arrive early, while the light is soft and the heat is still mild.',
        'Spend a few hours in the museums before heading south: they give context to everything you will see in Upper Egypt. The Egyptian Museum on Tahrir Square holds statues, coffins and everyday objects, while the Grand Egyptian Museum near the pyramids now displays much of the Tutankhamun collection [verify].',
        'Islamic and Coptic Cairo round out the visit: the Citadel of Saladin, the Mosque of Muhammad Ali, the churches of Coptic Cairo and the Khan el-Khalili bazaar, where a mint tea in an old cafe is a good way to end the day.',
        'Three days give you time for Giza, one museum and an unhurried walk through the historic centre. Many travellers then continue to Luxor and Aswan by train, by plane or on a Nile cruise.',
      ],
    },
    region: 'el-cairo-y-el-norte',
    tagline: {
      es: 'Pirámides, museos y bazares a orillas del Nilo',
      en: 'Pyramids, museums and bazaars on the Nile',
    },
    best_months: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr'],
    days_recommended: 3,
    how_to_get_there: {
      es: 'La mayoría de los vuelos internacionales llegan al aeropuerto internacional de El Cairo, a unos 20 km del centro; desde allí se llega en taxi o traslado privado en 40–60 minutos según el tráfico. El aeropuerto Sphinx, al oeste de Guiza, recibe también algunos vuelos [verificar]. Desde Luxor y Asuán hay vuelos internos y trenes, incluidos trenes nocturnos [verificar].',
      en: 'Most international flights land at Cairo International Airport, about 20 km from the centre; a taxi or private transfer takes 40–60 minutes depending on traffic. Sphinx International Airport, west of Giza, also handles some flights [verify]. Domestic flights and trains, including overnight sleeper trains, link Cairo with Luxor and Aswan [verify].',
    },
    nearest_airport: {
      es: 'Aeropuerto Internacional de El Cairo (CAI)',
      en: 'Cairo International Airport (CAI)',
    },
    top_sights: {
      es: [
        {
          name: 'Pirámides de Guiza',
          image: 'sight-giza',
          text: 'Las tres grandes pirámides de Keops, Kefrén y Micerinos, construidas en la IV dinastía, hace unos 4.500 años. Desde el mirador del desierto se ven las tres alineadas.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Pyramids+of+Giza',
        },
        {
          name: 'La Esfinge',
          image: 'sight-sphinx',
          text: 'Tallada en la roca de la meseta, con cuerpo de león y cabeza humana, vigila el acceso al complejo funerario de Kefrén junto a su templo del valle.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Great+Sphinx+of+Giza',
        },
        {
          name: 'Museo Egipcio',
          image: 'sight-egyptian-museum',
          text: 'El edificio rojo de la plaza Tahrir, abierto en 1902, guarda miles de piezas de todas las épocas faraónicas. Parte de sus colecciones se ha trasladado al Gran Museo Egipcio [verificar].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Egyptian+Museum+Tahrir+Cairo',
        },
        {
          name: 'Khan el-Khalili',
          image: 'sight-khan',
          text: 'Bazar del Cairo medieval, con orígenes en el siglo XIV: callejones de lámparas, especias, plata y telas, a pocos pasos de la mezquita de Al-Azhar.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Khan+el-Khalili+Cairo',
        },
      ],
      en: [
        {
          name: 'Giza pyramids',
          image: 'sight-giza',
          text: 'The three great pyramids of Khufu, Khafre and Menkaure, built in the Fourth Dynasty around 4,500 years ago. From the desert viewpoint you can see all three in a row.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Pyramids+of+Giza',
        },
        {
          name: 'Great Sphinx',
          image: 'sight-sphinx',
          text: 'Carved from the bedrock of the plateau, with a lion\'s body and a human head, it guards the approach to Khafre\'s funerary complex next to his valley temple.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Great+Sphinx+of+Giza',
        },
        {
          name: 'Egyptian Museum',
          image: 'sight-egyptian-museum',
          text: 'The red building on Tahrir Square, opened in 1902, holds thousands of objects from every pharaonic period. Part of its collection has moved to the Grand Egyptian Museum [verify].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Egyptian+Museum+Tahrir+Cairo',
        },
        {
          name: 'Khan el-Khalili',
          image: 'sight-khan',
          text: 'A bazaar in medieval Cairo dating back to the fourteenth century: lanes of lamps, spices, silver and textiles, a short walk from Al-Azhar Mosque.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Khan+el-Khalili+Cairo',
        },
      ],
    },
    lat: 30.0444,
    lng: 31.2357,
    nearby: ['dest-luxor'],
    featured_image: 'dest-cairo',
  },
  {
    key: 'dest-luxor',
    title: { es: 'Luxor', en: 'Luxor' },
    slug: { es: 'luxor', en: 'luxor' },
    excerpt: {
      es: 'La antigua Tebas: los templos de Karnak y Luxor en la orilla este, y el Valle de los Reyes y el templo de Hatshepsut en la oeste.',
      en: 'Ancient Thebes: Karnak and Luxor Temple on the east bank, the Valley of the Kings and Hatshepsut\'s temple on the west bank.',
    },
    content: {
      es: [
        'Luxor ocupa el lugar de la antigua Tebas, capital religiosa de Egipto durante buena parte del Imperio Nuevo. El Nilo divide la ciudad en dos: en la orilla este, la de la vida, están los grandes templos dedicados a Amón; en la orilla oeste, la de los muertos, las necrópolis reales y los templos funerarios.',
        'En la orilla este, el complejo de Karnak se fue ampliando durante casi dos mil años y su sala hipóstila tiene 134 columnas. A unos tres kilómetros al sur, el templo de Luxor se une a Karnak por la avenida de las Esfinges, abierta de nuevo al paseo en 2021.',
        'Para cruzar a la orilla oeste puedes tomar el ferry local, una lancha o ir por el puente al sur de la ciudad. Allí están el Valle de los Reyes, con las tumbas excavadas de los faraones del Imperio Nuevo, el templo de Hatshepsut en Deir el-Bahari, los Colosos de Memnón y el Valle de las Reinas.',
        'Conviene hacer las visitas a primera hora de la mañana, sobre todo en la orilla oeste. Las tardes se pueden dedicar al templo de Luxor, que se ilumina al caer el sol, o a un paseo en faluca.',
        'Con dos o tres días ves lo esencial de las dos orillas. Luxor es además el punto de partida habitual de los cruceros por el Nilo hacia Asuán, que se detienen en Edfu y Kom Ombo.',
      ],
      en: [
        'Luxor stands on the site of ancient Thebes, Egypt\'s religious capital for much of the New Kingdom. The Nile splits the city in two: the east bank, associated with the living, holds the great temples of Amun; the west bank, associated with the dead, holds the royal necropolis and the mortuary temples.',
        'On the east bank, the Karnak complex grew over almost two thousand years, and its hypostyle hall has 134 columns. About three kilometres south, Luxor Temple is linked to Karnak by the Avenue of Sphinxes, reopened to visitors in 2021.',
        'To reach the west bank, take the local ferry, a motorboat or the bridge south of town. There you will find the Valley of the Kings, with the rock-cut tombs of New Kingdom pharaohs, Hatshepsut\'s temple at Deir el-Bahari, the Colossi of Memnon and the Valley of the Queens.',
        'Early morning is a comfortable time for sightseeing, especially on the west bank. Keep the late afternoon for Luxor Temple, which is lit up after sunset, or for a felucca ride.',
        'Two or three days cover the essentials of both banks. Luxor is also the usual starting point for Nile cruises to Aswan, which stop at Edfu and Kom Ombo on the way.',
      ],
    },
    region: 'alto-egipto',
    tagline: {
      es: 'Templos y tumbas reales a las dos orillas del Nilo',
      en: 'Temples and royal tombs on both banks of the Nile',
    },
    best_months: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr'],
    days_recommended: 3,
    how_to_get_there: {
      es: 'El aeropuerto internacional de Luxor está a unos 6 km del centro, con vuelos internos desde El Cairo de algo más de una hora y algunos vuelos internacionales [verificar]. Desde El Cairo también hay trenes diurnos y nocturnos [verificar]. Desde Hurghada se llega por carretera en unas 4 horas, y desde Asuán en unas 3 horas por carretera o en crucero por el Nilo.',
      en: 'Luxor International Airport is about 6 km from the centre, with domestic flights from Cairo of just over an hour and some international routes [verify]. Day and overnight trains also run from Cairo [verify]. From Hurghada it is about 4 hours by road, and from Aswan about 3 hours by road or a few days by Nile cruise.',
    },
    nearest_airport: {
      es: 'Aeropuerto Internacional de Luxor (LXR)',
      en: 'Luxor International Airport (LXR)',
    },
    top_sights: {
      es: [
        {
          name: 'Templo de Karnak',
          image: 'sight-karnak',
          text: 'En la orilla este, el gran recinto de Amón reúne obeliscos, pilonos y la sala hipóstila de 134 columnas, levantados por faraones de muchas dinastías.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Karnak+Temple+Luxor',
        },
        {
          name: 'Templo de Luxor',
          image: 'sight-luxor-temple',
          text: 'En pleno centro y en la orilla este, construido sobre todo por Amenhotep III y Ramsés II. Al anochecer se ilumina y se recorre con calma.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Luxor+Temple',
        },
        {
          name: 'Valle de los Reyes',
          image: 'sight-valley-kings',
          text: 'En la orilla oeste, las tumbas excavadas en la roca de los faraones del Imperio Nuevo, entre ellas la de Tutankamón. La entrada general incluye varias tumbas y otras tienen billete aparte [verificar].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Valley+of+the+Kings+Luxor',
        },
        {
          name: 'Templo de Hatshepsut',
          image: 'sight-hatshepsut',
          text: 'En Deir el-Bahari, en la orilla oeste: tres terrazas al pie de los acantilados, construidas para la reina faraón Hatshepsut en la XVIII dinastía.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Temple+of+Hatshepsut+Deir+el-Bahari',
        },
      ],
      en: [
        {
          name: 'Karnak Temple',
          image: 'sight-karnak',
          text: 'On the east bank, the great precinct of Amun, with obelisks, pylons and a hypostyle hall of 134 columns built by pharaohs across many dynasties.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Karnak+Temple+Luxor',
        },
        {
          name: 'Luxor Temple',
          image: 'sight-luxor-temple',
          text: 'In the town centre on the east bank, built mainly by Amenhotep III and Ramesses II. It is lit up after dark and easy to explore at a slow pace.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Luxor+Temple',
        },
        {
          name: 'Valley of the Kings',
          image: 'sight-valley-kings',
          text: 'On the west bank, the rock-cut tombs of New Kingdom pharaohs, including Tutankhamun. The general ticket covers several tombs and some need a separate ticket [verify].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Valley+of+the+Kings+Luxor',
        },
        {
          name: 'Temple of Hatshepsut',
          image: 'sight-hatshepsut',
          text: 'At Deir el-Bahari on the west bank: three terraces at the foot of the cliffs, built for the female pharaoh Hatshepsut in the Eighteenth Dynasty.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Temple+of+Hatshepsut+Deir+el-Bahari',
        },
      ],
    },
    lat: 25.6872,
    lng: 32.6396,
    nearby: ['dest-aswan', 'dest-hurghada'],
    featured_image: 'dest-luxor',
  },
  {
    key: 'dest-aswan',
    title: { es: 'Asuán', en: 'Aswan' },
    slug: { es: 'asuan', en: 'aswan' },
    excerpt: {
      es: 'El Nilo entre islas de granito, el templo de Filé, las canteras del obelisco inacabado y los pueblos nubios de la orilla oeste.',
      en: 'The Nile among granite islands, Philae Temple, the quarry of the unfinished obelisk and the Nubian villages of the west bank.',
    },
    content: {
      es: [
        'Asuán es la ciudad más meridional del valle del Nilo antes del lago Nasser. Aquí el río corre entre islas de granito y dunas doradas, y el ritmo es más tranquilo que en Luxor o El Cairo. Fue frontera sur del Egipto faraónico y puerta de entrada a Nubia.',
        'Las canteras de granito rosa de Asuán abastecieron obeliscos y estatuas de todo el país. En la cantera norte sigue tendido el obelisco inacabado, que se agrietó durante la talla y nunca llegó a levantarse.',
        'El templo de Filé, dedicado a Isis, se trasladó piedra a piedra a la isla de Agilkia durante la campaña internacional de la UNESCO, antes de que las aguas de la presa lo cubrieran. Se llega en lancha desde el embarcadero.',
        'Por la tarde, un paseo en faluca alrededor de la isla Elefantina y la isla Kitchener, con su jardín botánico, muestra la ciudad desde el agua. En la orilla oeste puedes visitar un pueblo nubio, con casas pintadas de colores, y probar su cocina.',
        'Con dos días tienes tiempo para la ciudad. Desde Asuán salen las excursiones a Abu Simbel y los cruceros hacia Luxor, que paran en Kom Ombo y Edfu.',
      ],
      en: [
        'Aswan is the southernmost city of the Nile Valley before Lake Nasser. Here the river flows between granite islands and golden dunes, and life moves at a slower pace than in Luxor or Cairo. It was the southern frontier of pharaonic Egypt and the gateway to Nubia.',
        'Aswan\'s pink granite quarries supplied obelisks and statues across the country. In the northern quarry the unfinished obelisk still lies where it cracked during carving, never raised.',
        'Philae Temple, dedicated to Isis, was moved stone by stone to Agilkia Island during the UNESCO international campaign, before the dam waters covered its original site. You reach it by motorboat from the landing stage.',
        'In the late afternoon, a felucca sail around Elephantine Island and Kitchener\'s Island, with its botanical garden, shows the city from the water. On the west bank you can visit a Nubian village with brightly painted houses and try the local food.',
        'Two days are enough for the city itself. Aswan is also the base for trips to Abu Simbel and for cruises north to Luxor, which stop at Kom Ombo and Edfu.',
      ],
    },
    region: 'alto-egipto',
    tagline: {
      es: 'Islas de granito, faluca y cultura nubia',
      en: 'Granite islands, feluccas and Nubian culture',
    },
    best_months: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar'],
    days_recommended: 2,
    how_to_get_there: {
      es: 'El aeropuerto internacional de Asuán, a unos 25 km al suroeste de la ciudad, tiene vuelos internos desde El Cairo [verificar]. El tren une Asuán con Luxor y El Cairo, también con servicio nocturno [verificar]. Desde Luxor son unas 3 horas por carretera, o varios días en crucero por el Nilo.',
      en: 'Aswan International Airport, about 25 km southwest of the city, has domestic flights from Cairo [verify]. Trains connect Aswan with Luxor and Cairo, including an overnight service [verify]. From Luxor it is about 3 hours by road, or several days by Nile cruise.',
    },
    nearest_airport: {
      es: 'Aeropuerto Internacional de Asuán (ASW)',
      en: 'Aswan International Airport (ASW)',
    },
    top_sights: {
      es: [
        {
          name: 'Templo de Filé',
          image: 'sight-philae',
          text: 'Santuario de Isis de época ptolemaica y romana, trasladado a la isla de Agilkia para salvarlo de las aguas. Se llega en una lancha corta desde el embarcadero.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Philae+Temple+Aswan',
        },
        {
          name: 'Obelisco inacabado',
          image: 'sight-unfinished-obelisk',
          text: 'En la cantera norte de granito: habría medido unos 42 metros, pero se agrietó durante la talla. Muestra cómo trabajaban los canteros del antiguo Egipto.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Unfinished+Obelisk+Aswan',
        },
        {
          name: 'Pueblo nubio',
          image: 'sight-nubian-village',
          text: 'En la orilla oeste, con casas de colores y cúpulas de adobe. Se llega en barca y la visita suele incluir té, cocina local y artesanía.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Gharb+Soheil+Nubian+Village+Aswan',
        },
        {
          name: 'Templo de Kom Ombo',
          image: 'sight-kom-ombo',
          text: 'A unos 45 km al norte de Asuán, junto al Nilo: un templo doble dedicado a Sobek y a Haroeris, con un pequeño museo de cocodrilos momificados. Es parada habitual de los cruceros.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Kom+Ombo+Temple',
        },
      ],
      en: [
        {
          name: 'Philae Temple',
          image: 'sight-philae',
          text: 'A Ptolemaic and Roman sanctuary of Isis, moved to Agilkia Island to save it from the rising water. A short motorboat ride takes you there.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Philae+Temple+Aswan',
        },
        {
          name: 'Unfinished obelisk',
          image: 'sight-unfinished-obelisk',
          text: 'In the northern granite quarry: it would have stood about 42 metres tall, but it cracked during carving. A close look at how ancient stonemasons worked.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Unfinished+Obelisk+Aswan',
        },
        {
          name: 'Nubian village',
          image: 'sight-nubian-village',
          text: 'On the west bank, with colourful houses and mud-brick domes. You get there by boat, and the visit usually includes tea, local food and crafts.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Gharb+Soheil+Nubian+Village+Aswan',
        },
        {
          name: 'Kom Ombo Temple',
          image: 'sight-kom-ombo',
          text: 'About 45 km north of Aswan on the Nile: a double temple dedicated to Sobek and Haroeris, with a small museum of mummified crocodiles. A regular cruise stop.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Kom+Ombo+Temple',
        },
      ],
    },
    lat: 24.0889,
    lng: 32.8998,
    nearby: ['dest-abu-simbel', 'dest-luxor'],
    featured_image: 'dest-aswan',
  },
  {
    key: 'dest-abu-simbel',
    title: { es: 'Abu Simbel', en: 'Abu Simbel' },
    slug: { es: 'abu-simbel', en: 'abu-simbel' },
    excerpt: {
      es: 'Los dos templos de Ramsés II y Nefertari junto al lago Nasser, a unos 280 km al sur de Asuán, salvados de las aguas en los años sesenta.',
      en: 'The two temples of Ramesses II and Nefertari on Lake Nasser, about 280 km south of Aswan, rescued from the rising water in the 1960s.',
    },
    content: {
      es: [
        'Abu Simbel está en el sur de Egipto, a orillas del lago Nasser y a unos 280 km de Asuán por carretera. Ramsés II mandó excavar aquí dos templos en la roca, en el siglo XIII a. C., como afirmación de poder en la frontera con Nubia.',
        'El templo mayor está dedicado a Amón, Ra-Horajti, Ptah y al propio Ramsés divinizado. Su fachada tiene cuatro colosos sentados del faraón, de unos 20 metros de altura. El templo menor, dedicado a Hathor, honra a la reina Nefertari.',
        'Con la construcción de la presa alta de Asuán, los dos templos iban a quedar bajo el agua. Entre 1964 y 1968 una campaña internacional impulsada por la UNESCO los cortó en bloques y los volvió a montar unos 65 metros más arriba, sobre una colina artificial.',
        'Dos veces al año, hacia el 22 de febrero y el 22 de octubre, el sol del amanecer entra por el eje del templo mayor e ilumina las estatuas del santuario. Esos días el lugar recibe muchos visitantes, así que conviene planificar con tiempo.',
        'La mayoría de los viajeros lo visitan en una excursión de un día desde Asuán, saliendo de madrugada. También se puede dormir en Abu Simbel para ver los templos con menos gente y asistir al espectáculo de luz y sonido [verificar].',
      ],
      en: [
        'Abu Simbel lies in southern Egypt on the shore of Lake Nasser, about 280 km from Aswan by road. Ramesses II had two temples cut into the rock here in the thirteenth century BC, a statement of power on the border with Nubia.',
        'The Great Temple is dedicated to Amun, Ra-Horakhty, Ptah and the deified Ramesses himself. Its facade has four seated colossi of the pharaoh, each about 20 metres high. The Small Temple, dedicated to Hathor, honours Queen Nefertari.',
        'When the Aswan High Dam was built, both temples were going to be flooded. Between 1964 and 1968 an international campaign led by UNESCO cut them into blocks and rebuilt them about 65 metres higher, inside an artificial hill.',
        'Twice a year, around 22 February and 22 October, the rising sun shines along the axis of the Great Temple and lights up the statues in the sanctuary. Those days draw large crowds, so plan ahead.',
        'Most travellers visit on a day trip from Aswan, leaving before dawn. You can also stay overnight in Abu Simbel to see the temples with fewer people and catch the sound and light show [verify].',
      ],
    },
    region: 'alto-egipto',
    tagline: {
      es: 'Los templos de Ramsés II a orillas del lago Nasser',
      en: 'The temples of Ramesses II on Lake Nasser',
    },
    best_months: ['oct', 'nov', 'dec', 'jan', 'feb', 'mar'],
    days_recommended: 1,
    how_to_get_there: {
      es: 'Desde Asuán son unos 280 km por carretera a través del desierto, entre 3 y 4 horas en cada sentido; las excursiones suelen salir de madrugada. El pequeño aeropuerto de Abu Simbel tiene vuelos cortos desde Asuán y El Cairo en algunas temporadas [verificar]. Algunos cruceros por el lago Nasser terminan o empiezan aquí.',
      en: 'From Aswan it is about 280 km by desert road, 3 to 4 hours each way; day trips usually leave before dawn. The small Abu Simbel airport has short flights from Aswan and Cairo in some seasons [verify]. Some Lake Nasser cruises start or end here.',
    },
    nearest_airport: {
      es: 'Aeropuerto de Abu Simbel (ABS); vuelos internacionales vía Asuán (ASW)',
      en: 'Abu Simbel Airport (ABS); international connections via Aswan (ASW)',
    },
    top_sights: {
      es: [
        {
          name: 'Templo mayor de Ramsés II',
          image: 'sight-abu-simbel-great',
          text: 'Cuatro colosos sentados de unos 20 metros guardan la entrada. Dentro, las salas narran la batalla de Qadesh y conducen al santuario con cuatro estatuas sedentes.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Great+Temple+of+Abu+Simbel',
        },
        {
          name: 'Templo de Nefertari',
          image: 'sight-abu-simbel-small',
          text: 'Dedicado a Hathor y a la reina Nefertari. En su fachada, las estatuas de la reina tienen el mismo tamaño que las del rey, algo poco habitual.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Small+Temple+of+Abu+Simbel+Nefertari',
        },
        {
          name: 'Lago Nasser',
          image: 'sight-lake-nasser',
          text: 'Embalse formado por la presa alta de Asuán, terminada en 1970. Se extiende cientos de kilómetros hacia el sur, hasta Sudán, y bordea los templos.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Lake+Nasser+Abu+Simbel',
        },
        {
          name: 'Festival del sol',
          image: 'nile-sunset',
          text: 'Hacia el 22 de febrero y el 22 de octubre, la luz del amanecer recorre el templo mayor e ilumina el santuario. Las fechas exactas y los accesos pueden variar [verificar].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Abu+Simbel+Temples',
        },
      ],
      en: [
        {
          name: 'Great Temple of Ramesses II',
          image: 'sight-abu-simbel-great',
          text: 'Four seated colossi about 20 metres tall guard the entrance. Inside, the halls tell the story of the Battle of Kadesh and lead to a sanctuary with four seated statues.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Great+Temple+of+Abu+Simbel',
        },
        {
          name: 'Temple of Nefertari',
          image: 'sight-abu-simbel-small',
          text: 'Dedicated to Hathor and Queen Nefertari. On its facade the queen\'s statues are the same height as the king\'s, which is unusual in Egyptian art.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Small+Temple+of+Abu+Simbel+Nefertari',
        },
        {
          name: 'Lake Nasser',
          image: 'sight-lake-nasser',
          text: 'The reservoir created by the Aswan High Dam, completed in 1970. It stretches hundreds of kilometres south into Sudan and lies right beside the temples.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Lake+Nasser+Abu+Simbel',
        },
        {
          name: 'Sun festival',
          image: 'nile-sunset',
          text: 'Around 22 February and 22 October, the dawn light travels through the Great Temple and lights up the sanctuary. Exact dates and access can change [verify].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Abu+Simbel+Temples',
        },
      ],
    },
    lat: 22.3372,
    lng: 31.6258,
    nearby: ['dest-aswan'],
    featured_image: 'dest-abu-simbel',
  },
  {
    key: 'dest-hurghada',
    title: { es: 'Hurghada', en: 'Hurghada' },
    slug: { es: 'hurghada', en: 'hurghada' },
    excerpt: {
      es: 'Playas y arrecifes del Mar Rojo, las islas Giftun y El Gouna, a unas 4 horas por carretera de los templos de Luxor.',
      en: 'Red Sea beaches and reefs, the Giftun Islands and El Gouna, about 4 hours by road from the temples of Luxor.',
    },
    content: {
      es: [
        'Hurghada se extiende a lo largo de la costa oeste del Mar Rojo, con el desierto oriental a la espalda. Pasó de pueblo de pescadores a centro turístico en pocas décadas, y hoy ofrece playas, hoteles de todas las categorías y un acceso muy cómodo a los arrecifes.',
        'El agua es clara y templada buena parte del año, y los arrecifes de coral empiezan a pocos metros de muchas playas. Para hacer esnórquel o tus primeras inmersiones, los barcos salen cada mañana del puerto deportivo hacia las islas y los arrecifes cercanos.',
        'Frente a la costa están las islas Giftun, dentro de un área protegida, con playas de arena blanca y aguas poco profundas. Al norte, a unos 25 km, El Gouna es una localidad construida en torno a lagunas, con canales, kitesurf y un ambiente tranquilo.',
        'Hurghada combina bien con el valle del Nilo: Luxor está a unas 4 horas por carretera, y muchos viajeros hacen una excursión de un día a los templos o reservan unos días de playa al final de un circuito.',
        'Con cinco días tienes tiempo para descansar, salir en barco a las islas y hacer una excursión al desierto o a Luxor.',
      ],
      en: [
        'Hurghada runs along the western shore of the Red Sea, with the Eastern Desert behind it. Within a few decades it grew from a fishing village into a resort town, and today it offers beaches, hotels in every category and easy access to the reefs.',
        'The water is clear and mild for much of the year, and coral reefs start a few metres from many beaches. For snorkelling or a first dive, boats leave the marina every morning for the nearby islands and reefs.',
        'Offshore lie the Giftun Islands, within a protected area, with white sand and shallow water. About 25 km to the north, El Gouna is a lagoon town built around canals, popular for kitesurfing and quieter evenings.',
        'Hurghada pairs well with the Nile Valley: Luxor is about 4 hours by road, so many travellers take a day trip to the temples or add a few beach days at the end of a tour.',
        'Five days give you time to relax, take a boat to the islands and add a desert outing or a trip to Luxor.',
      ],
    },
    region: 'mar-rojo',
    tagline: {
      es: 'Arrecifes de coral, islas y playas del Mar Rojo',
      en: 'Coral reefs, islands and Red Sea beaches',
    },
    best_months: ['mar', 'apr', 'may', 'jun', 'sep', 'oct', 'nov'],
    days_recommended: 5,
    how_to_get_there: {
      es: 'El aeropuerto internacional de Hurghada, a unos 5 km del centro, recibe vuelos directos desde muchas ciudades europeas y vuelos internos desde El Cairo [verificar]. Desde Luxor son unas 4 horas por carretera, y hasta Marsa Alam unas 3 o 4 horas hacia el sur.',
      en: 'Hurghada International Airport, about 5 km from the centre, has direct flights from many European cities and domestic flights from Cairo [verify]. Luxor is about 4 hours away by road, and Marsa Alam 3 to 4 hours to the south.',
    },
    nearest_airport: {
      es: 'Aeropuerto Internacional de Hurghada (HRG)',
      en: 'Hurghada International Airport (HRG)',
    },
    top_sights: {
      es: [
        {
          name: 'Islas Giftun',
          image: 'sight-giftun',
          text: 'Islas frente a Hurghada dentro de un área protegida del Mar Rojo. Las excursiones en barco combinan paradas de esnórquel en el arrecife con tiempo de playa.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Giftun+Island+Hurghada',
        },
        {
          name: 'Puerto deportivo de Hurghada',
          image: 'sight-hurghada-marina',
          text: 'Paseo junto al mar con cafés y restaurantes, punto de salida de muchos barcos de excursión. Por la tarde es un buen sitio para pasear y cenar.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Hurghada+Marina',
        },
        {
          name: 'El Gouna',
          image: 'sight-el-gouna',
          text: 'A unos 25 km al norte, una localidad construida sobre lagunas y canales, con playas tranquilas, kitesurf y un pequeño centro con restaurantes.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=El+Gouna',
        },
        {
          name: 'Arrecifes de coral',
          image: 'reef-fish',
          text: 'Corales duros y blandos, peces loro, peces payaso y bancos de peces de colores, a poca profundidad. Usa protector solar respetuoso con el arrecife y no toques el coral.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Coral+reef+Hurghada',
        },
      ],
      en: [
        {
          name: 'Giftun Islands',
          image: 'sight-giftun',
          text: 'Islands off Hurghada within a Red Sea protected area. Boat trips combine snorkelling stops on the reef with time on the beach.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Giftun+Island+Hurghada',
        },
        {
          name: 'Hurghada Marina',
          image: 'sight-hurghada-marina',
          text: 'A waterfront promenade with cafes and restaurants, and the departure point for many excursion boats. A pleasant place for an evening walk and dinner.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Hurghada+Marina',
        },
        {
          name: 'El Gouna',
          image: 'sight-el-gouna',
          text: 'About 25 km north, a town built on lagoons and canals, with calm beaches, kitesurfing and a small centre full of restaurants.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=El+Gouna',
        },
        {
          name: 'Coral reefs',
          image: 'reef-fish',
          text: 'Hard and soft corals, parrotfish, clownfish and shoals of colourful fish in shallow water. Use reef-friendly sunscreen and never touch the coral.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Coral+reef+Hurghada',
        },
      ],
    },
    lat: 27.2579,
    lng: 33.8116,
    nearby: ['dest-marsa-alam', 'dest-luxor'],
    featured_image: 'dest-hurghada',
  },
  {
    key: 'dest-marsa-alam',
    title: { es: 'Marsa Alam', en: 'Marsa Alam' },
    slug: { es: 'marsa-alam', en: 'marsa-alam' },
    excerpt: {
      es: 'Costa tranquila del sur del Mar Rojo: tortugas verdes en Abu Dabbab, delfines en Samadai y el parque nacional de Wadi el Gemal.',
      en: 'The quiet southern Red Sea coast: green turtles at Abu Dabbab, dolphins at Samadai and Wadi el Gemal National Park.',
    },
    content: {
      es: [
        'Marsa Alam está en la costa sur del Mar Rojo, a unos 270 km de Hurghada. Es una zona menos urbanizada, con resorts repartidos a lo largo de la costa, bahías abiertas y arrecifes en buen estado que atraen a quienes buscan bucear o hacer esnórquel con calma.',
        'Al norte de Marsa Alam, la bahía de Abu Dabbab es conocida por sus praderas de fanerógamas marinas, donde se alimentan las tortugas verdes. Con suerte, también se ha visto algún dugongo, aunque es cada vez más raro.',
        'Al sur, el arrecife de Samadai, conocido como la Casa de los Delfines, es una zona protegida donde descansan delfines de hocico largo. El acceso está regulado, con zonas de baño delimitadas y un número limitado de visitantes [verificar].',
        'Tierra adentro y hacia el sur se extiende el parque nacional de Wadi el Gemal, con valles de acacias, gacelas y antiguas rutas mineras. Es un buen complemento a los días de mar, sobre todo al atardecer.',
        'Con cinco días tienes tiempo para varias salidas al mar y una excursión al desierto. Si vienes de un circuito por el Nilo, Marsa Alam está a unas 4 o 5 horas por carretera de Luxor y Asuán [verificar].',
      ],
      en: [
        'Marsa Alam sits on the southern Red Sea coast, about 270 km from Hurghada. It is less built up, with resorts spread along the shore, open bays and healthy reefs that draw people who want to dive or snorkel at a slower pace.',
        'North of Marsa Alam, Abu Dabbab bay is known for its seagrass meadows, where green turtles come to feed. Dugongs have also been seen here, although sightings have become rare.',
        'To the south, Samadai Reef, known as Dolphin House, is a protected area where spinner dolphins rest. Access is regulated, with roped-off swimming zones and a cap on daily visitors [verify].',
        'Inland and further south lies Wadi el Gemal National Park, with acacia valleys, gazelles and ancient mining routes. It makes a good contrast to days at sea, especially around sunset.',
        'Five days leave room for several boat trips and a desert outing. If you are coming from a Nile tour, Marsa Alam is about 4 to 5 hours by road from Luxor and Aswan [verify].',
      ],
    },
    region: 'mar-rojo',
    tagline: {
      es: 'Tortugas, delfines y arrecifes en el sur del Mar Rojo',
      en: 'Turtles, dolphins and reefs on the southern Red Sea',
    },
    best_months: ['mar', 'apr', 'may', 'jun', 'sep', 'oct', 'nov'],
    days_recommended: 5,
    how_to_get_there: {
      es: 'El aeropuerto internacional de Marsa Alam, a unos 60 km al norte de la ciudad, recibe vuelos directos desde varias ciudades europeas, sobre todo en temporada [verificar]. Desde Hurghada son unos 270 km por la carretera de la costa, entre 3 y 4 horas.',
      en: 'Marsa Alam International Airport, about 60 km north of town, has direct flights from several European cities, mainly in season [verify]. From Hurghada it is about 270 km along the coast road, 3 to 4 hours.',
    },
    nearest_airport: {
      es: 'Aeropuerto Internacional de Marsa Alam (RMF)',
      en: 'Marsa Alam International Airport (RMF)',
    },
    top_sights: {
      es: [
        {
          name: 'Bahía de Abu Dabbab',
          image: 'sight-abu-dabbab',
          text: 'Al norte de Marsa Alam, una bahía de arena con praderas marinas donde se alimentan las tortugas verdes. Se entra a pie desde la playa.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Abu+Dabbab+Bay+Marsa+Alam',
        },
        {
          name: 'Arrecife de Samadai',
          image: 'sight-samadai',
          text: 'La Casa de los Delfines: un arrecife en herradura donde descansan delfines de hocico largo. Se visita en barco, con zonas de baño y aforo regulados [verificar].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Samadai+Reef+Dolphin+House+Marsa+Alam',
        },
        {
          name: 'Parque nacional de Wadi el Gemal',
          image: 'sight-wadi-gimal',
          text: 'Área protegida al sur de Marsa Alam con valles de acacias, manglares en la costa y fauna del desierto. Se recorre en 4x4 con guía local.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Wadi+El+Gemal+National+Park',
        },
        {
          name: 'Tortugas verdes',
          image: 'sight-turtle',
          text: 'Se ven sobre todo en las praderas marinas de las bahías. Guarda la distancia, no las toques ni las persigas y deja que suban a respirar sin obstáculos.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Marsa+Mubarak+Marsa+Alam',
        },
      ],
      en: [
        {
          name: 'Abu Dabbab Bay',
          image: 'sight-abu-dabbab',
          text: 'North of Marsa Alam, a sandy bay with seagrass meadows where green turtles feed. You can walk in from the beach.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Abu+Dabbab+Bay+Marsa+Alam',
        },
        {
          name: 'Samadai Reef',
          image: 'sight-samadai',
          text: 'Dolphin House: a horseshoe-shaped reef where spinner dolphins rest. Visits are by boat, with regulated swimming zones and visitor numbers [verify].',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Samadai+Reef+Dolphin+House+Marsa+Alam',
        },
        {
          name: 'Wadi el Gemal National Park',
          image: 'sight-wadi-gimal',
          text: 'A protected area south of Marsa Alam with acacia valleys, coastal mangroves and desert wildlife. Explored by 4x4 with a local guide.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Wadi+El+Gemal+National+Park',
        },
        {
          name: 'Green turtles',
          image: 'sight-turtle',
          text: 'Most often seen grazing the seagrass in sheltered bays. Keep your distance, never touch or chase them, and leave them a clear path to the surface.',
          map_link: 'https://www.google.com/maps/search/?api=1&query=Marsa+Mubarak+Marsa+Alam',
        },
      ],
    },
    lat: 25.0676,
    lng: 34.879,
    nearby: ['dest-hurghada'],
    featured_image: 'dest-marsa-alam',
  },
]
