import type { L } from './types'

/** Launch taxonomy terms (contracts §4). Real launch data, never holaSample. Landing copy is draft. */
export interface TermSeed {
  name: L
  slug?: L // defaults to slugified names; fixed for durations
  sort: number
  min_days?: number
  max_days?: number
  destination?: string // departures → destination key (set by samples create)
  landing?: { h1: L; intro: L; seo_text: L; faq: L<{ q: string; a: string }[]> }
}

const faqPlan = (topicEs: string, topicEn: string): L<{ q: string; a: string }[]> => ({
  es: [
    { q: `¿Puedo adaptar ${topicEs}?`, a: 'Sí. Todos nuestros viajes se pueden ajustar en fechas, ritmo y tipo de alojamiento. Cuéntanos qué buscas y te proponemos una ruta.' },
    { q: '¿Cómo pido presupuesto?', a: 'Rellena el formulario «Planifica tu viaje» o escríbenos. Te respondemos en persona con una propuesta concreta.' },
  ],
  en: [
    { q: `Can I adapt ${topicEn}?`, a: 'Yes. Dates, pace and accommodation can all be adjusted. Tell us what you are after and we will suggest a route.' },
    { q: 'How do I get a quote?', a: 'Fill in the “Plan my trip” form or message us. We reply personally with a concrete proposal.' },
  ],
})

const landing = (h1: L, intro: L, seo: L, topic: L): TermSeed['landing'] => ({ h1, intro, seo_text: seo, faq: faqPlan(topic.es, topic.en) })

export const TERMS: Record<string, TermSeed[]> = {
  durations: [
    {
      name: { es: 'Hasta 6 días', en: 'Up to 6 days' },
      slug: { es: 'hasta-6-dias', en: 'up-to-6-days' },
      sort: 1, min_days: 1, max_days: 6,
      landing: landing(
        { es: 'Viajes cortos a Egipto: hasta 6 días', en: 'Short Egypt trips: up to 6 days' },
        { es: 'Rutas de pocos días para ver lo esencial de El Cairo y Luxor sin prisas innecesarias.', en: 'Short routes that cover the essentials of Cairo and Luxor at a sensible pace.' },
        { es: 'Con cinco o seis días puedes combinar las pirámides de Guiza con los templos de Luxor si eliges bien los traslados. Te ayudamos a decidir qué dejar para otro viaje.', en: 'Five or six days are enough to pair the Giza pyramids with the temples of Luxor if the transfers are planned well. We help you decide what to save for another trip.' },
        { es: 'un viaje corto', en: 'a short trip' },
      ),
    },
    {
      name: { es: '7–9 días', en: '7–9 days' },
      slug: { es: '7-9-dias', en: '7-9-days' },
      sort: 2, min_days: 7, max_days: 9,
      landing: landing(
        { es: 'Viajes a Egipto de 7 a 9 días', en: 'Egypt tours of 7 to 9 days' },
        { es: 'La duración más habitual para un primer viaje: El Cairo, crucero por el Nilo y Abu Simbel.', en: 'The usual length for a first trip: Cairo, a Nile cruise and Abu Simbel.' },
        { es: 'Entre siete y nueve días caben El Cairo, tres o cuatro noches de crucero entre Luxor y Asuán y la visita a Abu Simbel. Es el equilibrio que más recomendamos para una primera vez.', en: 'Seven to nine days fit Cairo, three or four nights cruising between Luxor and Aswan and a visit to Abu Simbel. It is the balance we suggest most often for a first visit.' },
        { es: 'un viaje de una semana', en: 'a one-week trip' },
      ),
    },
    {
      name: { es: '10–12 días', en: '10–12 days' },
      slug: { es: '10-12-dias', en: '10-12-days' },
      sort: 3, min_days: 10, max_days: 12,
      landing: landing(
        { es: 'Viajes a Egipto de 10 a 12 días', en: 'Egypt tours of 10 to 12 days' },
        { es: 'Tiempo para el Nilo y para unos días de mar en Hurghada o Marsa Alam.', en: 'Time for the Nile and for a few days by the sea in Hurghada or Marsa Alam.' },
        { es: 'Con diez a doce días puedes sumar al circuito clásico unos días de playa y snorkel en el Mar Rojo, o un ritmo más tranquilo en Luxor y Asuán.', en: 'Ten to twelve days let you add beach and snorkelling days on the Red Sea to the classic circuit, or a slower pace in Luxor and Aswan.' },
        { es: 'un viaje de diez días', en: 'a ten-day trip' },
      ),
    },
    {
      name: { es: '13 días o más', en: '13 days or more' },
      slug: { es: '13-dias-o-mas', en: '13-days-or-more' },
      sort: 4, min_days: 13, max_days: 60,
      landing: landing(
        { es: 'Viajes largos a Egipto: 13 días o más', en: 'Long Egypt trips: 13 days or more' },
        { es: 'Rutas largas para quien quiere ver Egipto con calma.', en: 'Long routes for travellers who want to see Egypt slowly.' },
        { es: 'Dos semanas permiten añadir el desierto occidental, Alejandría o más días en el Mar Rojo.', en: 'Two weeks leave room for the Western Desert, Alexandria or more days on the Red Sea.' },
        { es: 'un viaje largo', en: 'a long trip' },
      ),
    },
  ],
  'trip-styles': [
    { name: { es: 'Clásico', en: 'Classic' }, sort: 1, landing: landing(
      { es: 'Viajes clásicos por Egipto', en: 'Classic Egypt tours' },
      { es: 'El Cairo, Luxor, Asuán y Abu Simbel: la ruta que lleva siglos atrayendo viajeros.', en: 'Cairo, Luxor, Aswan and Abu Simbel: the route that has drawn travellers for centuries.' },
      { es: 'Un viaje clásico combina las pirámides, el Museo Egipcio, los templos de Luxor y un crucero por el Nilo hasta Asuán.', en: 'A classic trip combines the pyramids, the Egyptian Museum, the temples of Luxor and a Nile cruise to Aswan.' },
      { es: 'un viaje clásico', en: 'a classic tour' }) },
    { name: { es: 'Egipto y Mar Rojo', en: 'Egypt & Red Sea' }, sort: 2, landing: landing(
      { es: 'Viajes por Egipto con días en el Mar Rojo', en: 'Egypt tours with Red Sea days' },
      { es: 'Templos por la mañana y arrecifes al final del viaje.', en: 'Temples first, coral reefs to finish the trip.' },
      { es: 'Estos viajes terminan en Hurghada o Marsa Alam, donde vive nuestro equipo, con tiempo para el snorkel y la playa.', en: 'These trips end in Hurghada or Marsa Alam, where our team lives, with time for snorkelling and the beach.' },
      { es: 'un viaje con playa', en: 'a trip with beach days' }) },
    { name: { es: 'Privado', en: 'Private' }, sort: 3, landing: landing(
      { es: 'Viajes privados por Egipto', en: 'Private Egypt tours' },
      { es: 'Solo tu grupo, con guía y vehículo para ustedes.', en: 'Just your group, with your own guide and vehicle.' },
      { es: 'En un viaje privado los horarios se adaptan a ustedes y el guía acompaña solo a tu grupo.', en: 'On a private trip the schedule fits you and the guide travels with your group only.' },
      { es: 'un viaje privado', en: 'a private tour' }) },
    { name: { es: 'En familia', en: 'Family' }, sort: 4 },
    { name: { es: 'Luna de miel', en: 'Honeymoon' }, sort: 5 },
    { name: { es: 'Desierto y aventura', en: 'Desert & adventure' }, sort: 6 },
  ],
  'cruise-types': [
    { name: { es: 'Crucero Luxor–Asuán', en: 'Luxor–Aswan cruise' }, sort: 1, landing: landing(
      { es: 'Cruceros por el Nilo entre Luxor y Asuán', en: 'Nile cruises between Luxor and Aswan' },
      { es: 'Tres o cuatro noches a bordo con visitas a Edfu y Kom Ombo.', en: 'Three or four nights on board with visits to Edfu and Kom Ombo.' },
      { es: 'La ruta entre Luxor y Asuán es la más navegada del Nilo: los templos quedan a pocos minutos del muelle y el barco es tu hotel.', en: 'Luxor to Aswan is the most sailed stretch of the Nile: the temples are a short walk from the quay and the boat is your hotel.' },
      { es: 'un crucero', en: 'a cruise' }) },
    { name: { es: 'Dahabiya', en: 'Dahabiya' }, sort: 2, landing: landing(
      { es: 'Cruceros en dahabiya por el Nilo', en: 'Dahabiya cruises on the Nile' },
      { es: 'Veleros tradicionales con pocos camarotes y paradas donde no llegan los barcos grandes.', en: 'Traditional sailing boats with few cabins and stops the large ships cannot reach.' },
      { es: 'Una dahabiya navega a vela y amarra en orillas tranquilas. Es una forma más lenta y cercana de recorrer el Nilo.', en: 'A dahabiya sails under canvas and moors on quiet banks. It is a slower, closer way to travel the Nile.' },
      { es: 'una dahabiya', en: 'a dahabiya trip' }) },
    { name: { es: 'Lago Nasser', en: 'Lake Nasser' }, sort: 3 },
  ],
  departures: [
    { name: { es: 'Hurghada', en: 'Hurghada' }, sort: 1, destination: 'dest-hurghada', landing: landing(
      { es: 'Excursiones desde Hurghada', en: 'Excursions from Hurghada' },
      { es: 'Snorkel en las islas Giftun, Luxor en un día y más salidas con recogida en tu hotel.', en: 'Snorkelling at the Giftun Islands, Luxor in a day and more trips with hotel pickup.' },
      { es: 'Desde Hurghada salen barcos hacia los arrecifes de Giftun y carreteras hacia Luxor. Te ayudamos a elegir según tus días y tu nivel en el agua.', en: 'Boats leave Hurghada for the Giftun reefs and roads lead to Luxor. We help you choose by days available and comfort in the water.' },
      { es: 'una excursión desde Hurghada', en: 'an excursion from Hurghada' }) },
    { name: { es: 'El Gouna', en: 'El Gouna' }, sort: 2 },
    { name: { es: 'Marsa Alam', en: 'Marsa Alam' }, sort: 3, destination: 'dest-marsa-alam', landing: landing(
      { es: 'Excursiones desde Marsa Alam', en: 'Excursions from Marsa Alam' },
      { es: 'Bahías con praderas marinas, arrecifes de coral y el parque de Wadi el Gemal.', en: 'Seagrass bays, coral reefs and Wadi el Gemal National Park.' },
      { es: 'Marsa Alam es la zona más tranquila del Mar Rojo egipcio, con arrecifes cerca de la orilla.', en: 'Marsa Alam is the quietest part of Egypt’s Red Sea coast, with reefs close to shore.' },
      { es: 'una excursión desde Marsa Alam', en: 'an excursion from Marsa Alam' }) },
    { name: { es: 'Sharm el Sheikh', en: 'Sharm el Sheikh' }, sort: 4 },
    { name: { es: 'El Cairo', en: 'Cairo' }, sort: 5, destination: 'dest-cairo', landing: landing(
      { es: 'Excursiones desde El Cairo', en: 'Excursions from Cairo' },
      { es: 'Las pirámides de Guiza, la Esfinge y el Cairo histórico con guía en español o inglés.', en: 'The Giza pyramids, the Sphinx and historic Cairo with a Spanish- or English-speaking guide.' },
      { es: 'Desde El Cairo se visitan Guiza, Saqqara y Dahshur en el día. Te recomendamos empezar temprano.', en: 'Giza, Saqqara and Dahshur are all day trips from Cairo. We suggest an early start.' },
      { es: 'una excursión desde El Cairo', en: 'an excursion from Cairo' }) },
    { name: { es: 'Luxor', en: 'Luxor' }, sort: 6, destination: 'dest-luxor' },
    { name: { es: 'Asuán', en: 'Aswan' }, sort: 7, destination: 'dest-aswan' },
  ],
  regions: [
    { name: { es: 'El Cairo y el Norte', en: 'Cairo & the North' }, sort: 1, landing: landing(
      { es: 'El Cairo y el norte de Egipto', en: 'Cairo and northern Egypt' },
      { es: 'Pirámides, museos y la ciudad más grande de África.', en: 'Pyramids, museums and Africa’s largest city.' },
      { es: 'El norte reúne Guiza, Saqqara, El Cairo histórico y Alejandría junto al Mediterráneo.', en: 'The north brings together Giza, Saqqara, historic Cairo and Alexandria on the Mediterranean.' },
      { es: 'una visita al norte', en: 'a visit to the north' }) },
    { name: { es: 'Alto Egipto', en: 'Upper Egypt' }, sort: 2, landing: landing(
      { es: 'Alto Egipto: Luxor, Asuán y Abu Simbel', en: 'Upper Egypt: Luxor, Aswan and Abu Simbel' },
      { es: 'El valle del Nilo al sur, con la mayor concentración de templos del país.', en: 'The southern Nile valley, with the country’s densest concentration of temples.' },
      { es: 'El Alto Egipto se recorre en crucero o por carretera entre Luxor y Asuán, con Abu Simbel cerca de la frontera con Sudán.', en: 'Upper Egypt is travelled by boat or road between Luxor and Aswan, with Abu Simbel near the Sudanese border.' },
      { es: 'una ruta por el Alto Egipto', en: 'an Upper Egypt route' }) },
    { name: { es: 'Mar Rojo', en: 'Red Sea' }, sort: 3, landing: landing(
      { es: 'La costa del Mar Rojo', en: 'The Red Sea coast' },
      { es: 'Arrecifes de coral, desierto y pueblos de costa entre Hurghada y Marsa Alam.', en: 'Coral reefs, desert and coastal towns between Hurghada and Marsa Alam.' },
      { es: 'Nuestro equipo vive en el Mar Rojo. Desde aquí organizamos snorkel, buceo y excursiones al valle del Nilo.', en: 'Our team lives on the Red Sea. From here we organise snorkelling, diving and trips to the Nile valley.' },
      { es: 'unos días en el Mar Rojo', en: 'a few days on the Red Sea' }) },
    { name: { es: 'Sinaí', en: 'Sinai' }, sort: 4 },
    { name: { es: 'Desierto Occidental', en: 'Western Desert' }, sort: 5 },
  ],
  'guide-topics': [
    { name: { es: 'Planificar el viaje', en: 'Planning' }, sort: 1, landing: landing(
      { es: 'Planificar un viaje a Egipto', en: 'Planning a trip to Egypt' },
      { es: 'Cuándo ir, cuántos días reservar y qué tener en cuenta antes de salir.', en: 'When to go, how many days to allow and what to sort out before you leave.' },
      { es: 'Guías prácticas escritas por gente que vive en Egipto. Los datos que cambian a menudo están marcados para verificar.', en: 'Practical guides written by people who live in Egypt. Facts that change often are marked for checking.' },
      { es: 'estas recomendaciones', en: 'this advice' }) },
    { name: { es: 'Qué ver', en: 'What to see' }, sort: 2, landing: landing(
      { es: 'Qué ver en Egipto', en: 'What to see in Egypt' },
      { es: 'Templos, tumbas, museos y barrios, con el tiempo que necesita cada visita.', en: 'Temples, tombs, museums and neighbourhoods, with the time each visit needs.' },
      { es: 'Guías por destino para organizar tus días sin perder lo esencial.', en: 'Destination guides to plan your days without missing the essentials.' },
      { es: 'estas rutas', en: 'these routes' }) },
    { name: { es: 'Cultura y gastronomía', en: 'Culture & food' }, sort: 3 },
    { name: { es: 'Mar Rojo y buceo', en: 'Red Sea & diving' }, sort: 4, landing: landing(
      { es: 'Mar Rojo, snorkel y buceo', en: 'Red Sea, snorkelling and diving' },
      { es: 'Lo que conviene saber antes de meterte en el agua.', en: 'What to know before you get in the water.' },
      { es: 'Consejos desde la costa donde trabajamos: arrecifes, temporadas y cómo cuidar el coral.', en: 'Advice from the coast where we work: reefs, seasons and how to look after the coral.' },
      { es: 'estas salidas', en: 'these trips' }) },
    { name: { es: 'Itinerarios', en: 'Itineraries' }, sort: 5 },
  ],
}
