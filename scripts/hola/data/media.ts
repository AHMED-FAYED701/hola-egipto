/**
 * Branded placeholder images (content rules §4). key → file `hola-sample-<key>.jpg`.
 * subject: second line on the image; alt: localized alt text ("Foto de muestra: …" / "Sample photo: …").
 */
export type PlaceholderSize = 'hero' | 'card' | 'tile' | 'gallery'
export interface Placeholder {
  key: string
  size: PlaceholderSize
  bg: 'deep' | 'teal'
  subject: string
  alt: { es: string; en: string }
}

const p = (key: string, size: PlaceholderSize, subject: string, es: string, en: string, bg: 'deep' | 'teal' = 'deep'): Placeholder => ({
  key,
  size,
  bg,
  subject,
  alt: { es: `Foto de muestra: ${es}`, en: `Sample photo: ${en}` },
})

export const PLACEHOLDERS: Placeholder[] = [
  // Heroes (16:9)
  p('home-hero', 'hero', 'Guiza · Pirámides al amanecer', 'pirámides de Guiza al amanecer', 'Giza pyramids at sunrise'),
  p('hero-tours', 'hero', 'Egipto · Templo de Luxor', 'templo de Luxor al atardecer', 'Luxor Temple at sunset', 'teal'),
  p('hero-cruises', 'hero', 'Nilo · Crucero entre Luxor y Asuán', 'barco por el Nilo entre Luxor y Asuán', 'Nile boat between Luxor and Aswan', 'teal'),
  p('hero-excursions', 'hero', 'Mar Rojo · Arrecife de coral', 'arrecife de coral en el Mar Rojo', 'Red Sea coral reef', 'teal'),
  p('hero-destinations', 'hero', 'Egipto · Desierto y Nilo', 'el Nilo atravesando el desierto', 'the Nile crossing the desert'),
  p('hero-guides', 'hero', 'Guía de viaje · Mapa y cuaderno', 'mapa de Egipto y cuaderno de viaje', 'map of Egypt and travel notebook'),
  // Destination tiles (3:4)
  p('dest-cairo', 'tile', 'El Cairo · Pirámides de Guiza', 'pirámides de Guiza, El Cairo', 'Giza pyramids, Cairo'),
  p('dest-luxor', 'tile', 'Luxor · Templo de Karnak', 'Templo de Karnak, Luxor', 'Karnak Temple, Luxor'),
  p('dest-aswan', 'tile', 'Asuán · Falucas en el Nilo', 'falucas en el Nilo, Asuán', 'feluccas on the Nile, Aswan', 'teal'),
  p('dest-abu-simbel', 'tile', 'Abu Simbel · Templo de Ramsés II', 'templo de Ramsés II, Abu Simbel', 'Temple of Ramesses II, Abu Simbel'),
  p('dest-hurghada', 'tile', 'Hurghada · Playa y arrecife', 'playa y arrecife, Hurghada', 'beach and reef, Hurghada', 'teal'),
  p('dest-marsa-alam', 'tile', 'Marsa Alam · Bahía de Abu Dabbab', 'bahía de Abu Dabbab, Marsa Alam', 'Abu Dabbab Bay, Marsa Alam', 'teal'),
  // Trip cards (4:3)
  p('card-tour-classic', 'card', 'Egipto clásico · El Cairo, Nilo y Abu Simbel', 'El Cairo, el Nilo y Abu Simbel', 'Cairo, the Nile and Abu Simbel'),
  p('card-tour-redsea', 'card', 'Egipto y Mar Rojo · Templos y arrecifes', 'templos del Nilo y arrecifes del Mar Rojo', 'Nile temples and Red Sea reefs', 'teal'),
  p('card-tour-cairo-luxor', 'card', 'El Cairo y Luxor · Viaje privado', 'El Cairo y Luxor', 'Cairo and Luxor'),
  p('card-cruise-luxor-aswan', 'card', 'Crucero · De Luxor a Asuán', 'crucero por el Nilo de Luxor a Asuán', 'Nile cruise from Luxor to Aswan', 'teal'),
  p('card-cruise-dahabiya', 'card', 'Dahabiya · Velas en el Nilo', 'dahabiya navegando por el Nilo', 'dahabiya sailing on the Nile', 'teal'),
  p('card-exc-luxor-day', 'card', 'Luxor en un día · Desde Hurghada', 'excursión a Luxor desde Hurghada', 'Luxor day trip from Hurghada'),
  p('card-exc-giftun', 'card', 'Islas Giftun · Snorkel', 'snorkel en las islas Giftun', 'snorkelling at the Giftun Islands', 'teal'),
  p('card-exc-abu-dabbab', 'card', 'Abu Dabbab · Snorkel con tortugas', 'snorkel en Abu Dabbab', 'snorkelling at Abu Dabbab', 'teal'),
  p('card-exc-pyramids', 'card', 'Guiza · Pirámides y Esfinge', 'pirámides de Guiza y la Esfinge', 'Giza pyramids and the Sphinx'),
  // Guide cards (4:3)
  p('card-guide-weather', 'card', 'Guía · Cuándo viajar a Egipto', 'calendario y mapa de Egipto', 'calendar and map of Egypt'),
  p('card-guide-luxor', 'card', 'Guía · Luxor en dos días', 'columnas del templo de Karnak', 'columns of Karnak Temple'),
  p('card-guide-snorkel', 'card', 'Guía · Snorkel en el Mar Rojo', 'máscara de snorkel sobre un arrecife', 'snorkel mask over a reef', 'teal'),
  // Sights and galleries (3:2)
  p('sight-giza', 'gallery', 'Guiza · Gran Pirámide de Keops', 'Gran Pirámide de Keops, Guiza', 'Great Pyramid of Khufu, Giza'),
  p('sight-sphinx', 'gallery', 'Guiza · Gran Esfinge', 'Gran Esfinge de Guiza', 'Great Sphinx of Giza'),
  p('sight-egyptian-museum', 'gallery', 'El Cairo · Museo Egipcio', 'Museo Egipcio, El Cairo', 'Egyptian Museum, Cairo'),
  p('sight-khan', 'gallery', 'El Cairo · Jan el-Jalili', 'bazar de Jan el-Jalili, El Cairo', 'Khan el-Khalili bazaar, Cairo'),
  p('sight-karnak', 'gallery', 'Luxor · Templo de Karnak', 'Templo de Karnak, Luxor', 'Karnak Temple, Luxor'),
  p('sight-luxor-temple', 'gallery', 'Luxor · Templo de Luxor', 'Templo de Luxor', 'Luxor Temple'),
  p('sight-valley-kings', 'gallery', 'Luxor · Valle de los Reyes', 'Valle de los Reyes, Luxor', 'Valley of the Kings, Luxor'),
  p('sight-hatshepsut', 'gallery', 'Luxor · Templo de Hatshepsut', 'templo de Hatshepsut, Deir el-Bahari', 'Temple of Hatshepsut, Deir el-Bahari'),
  p('sight-philae', 'gallery', 'Asuán · Templo de Filae', 'templo de Filae, Asuán', 'Philae Temple, Aswan', 'teal'),
  p('sight-unfinished-obelisk', 'gallery', 'Asuán · Obelisco inacabado', 'obelisco inacabado, Asuán', 'Unfinished Obelisk, Aswan'),
  p('sight-nubian-village', 'gallery', 'Asuán · Aldea nubia', 'aldea nubia en la orilla del Nilo', 'Nubian village on the Nile bank', 'teal'),
  p('sight-kom-ombo', 'gallery', 'Kom Ombo · Templo de Sobek y Haroeris', 'templo de Kom Ombo', 'Kom Ombo Temple'),
  p('sight-abu-simbel-great', 'gallery', 'Abu Simbel · Gran templo', 'gran templo de Abu Simbel', 'Great Temple of Abu Simbel'),
  p('sight-abu-simbel-small', 'gallery', 'Abu Simbel · Templo de Nefertari', 'templo de Nefertari, Abu Simbel', 'Temple of Nefertari, Abu Simbel'),
  p('sight-lake-nasser', 'gallery', 'Abu Simbel · Lago Nasser', 'lago Nasser junto a Abu Simbel', 'Lake Nasser by Abu Simbel', 'teal'),
  p('sight-edfu', 'gallery', 'Edfu · Templo de Horus', 'templo de Horus, Edfu', 'Temple of Horus, Edfu'),
  p('sight-giftun', 'gallery', 'Hurghada · Islas Giftun', 'islas Giftun frente a Hurghada', 'Giftun Islands off Hurghada', 'teal'),
  p('sight-hurghada-marina', 'gallery', 'Hurghada · Puerto deportivo', 'puerto deportivo de Hurghada', 'Hurghada marina', 'teal'),
  p('sight-el-gouna', 'gallery', 'El Gouna · Lagunas', 'lagunas de El Gouna', 'El Gouna lagoons', 'teal'),
  p('sight-desert-road', 'gallery', 'Desierto Oriental · Carretera a Luxor', 'carretera del desierto hacia Luxor', 'desert road to Luxor'),
  p('sight-abu-dabbab', 'gallery', 'Marsa Alam · Bahía de Abu Dabbab', 'bahía de Abu Dabbab', 'Abu Dabbab Bay', 'teal'),
  p('sight-turtle', 'gallery', 'Marsa Alam · Tortuga verde', 'tortuga verde en una pradera marina', 'green turtle on a seagrass bed', 'teal'),
  p('sight-wadi-gimal', 'gallery', 'Marsa Alam · Wadi el Gemal', 'parque nacional Wadi el Gemal', 'Wadi el Gemal National Park'),
  p('sight-samadai', 'gallery', 'Marsa Alam · Arrecife de Samadai', 'arrecife de Samadai', 'Samadai reef', 'teal'),
  p('nile-deck', 'gallery', 'Nilo · Cubierta del barco', 'cubierta de un barco por el Nilo', 'deck of a Nile boat', 'teal'),
  p('nile-cabin', 'gallery', 'Nilo · Camarote con ventana al río', 'camarote con ventana al Nilo', 'cabin with a window onto the Nile'),
  p('dahabiya-sails', 'gallery', 'Dahabiya · Velas al viento', 'velas de una dahabiya', 'sails of a dahabiya', 'teal'),
  p('nile-sunset', 'gallery', 'Nilo · Atardecer desde la cubierta', 'atardecer en el Nilo', 'sunset on the Nile'),
  p('deck-plan', 'card', 'Plano de cubiertas · Muestra', 'plano de cubiertas de muestra', 'sample deck plan'),
  p('snorkel-gear', 'gallery', 'Mar Rojo · Equipo de snorkel', 'equipo de snorkel en la cubierta', 'snorkel gear on deck', 'teal'),
  p('reef-fish', 'gallery', 'Mar Rojo · Peces de arrecife', 'peces de arrecife en el Mar Rojo', 'reef fish in the Red Sea', 'teal'),
]
