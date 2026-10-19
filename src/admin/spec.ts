/**
 * Field specs for the admin editors (contracts §18): one generic form renders every entity, settings and
 * navigation from these definitions. Names are physical columns (main / _i18n) or join names (§4).
 * Shared by the client form and the server-side validation, so it holds plain data only.
 */
import type { Ent } from '@/lib/content/tables'

export type L = { es: string; en: string }
const l = (es: string, en: string): L => ({ es, en })
export type Opt = { value: string; label: L }

export type Field =
  | { kind: 'text' | 'textarea' | 'url' | 'email' | 'date' | 'time'; name: string; label: L; required?: boolean; max?: number; help?: L }
  | { kind: 'slug'; name: string; label: L; from: string }
  | { kind: 'markdown'; name: string; label: L; help?: L }
  | { kind: 'number'; name: string; label: L; required?: boolean; min?: number; max?: number; step?: number }
  | { kind: 'bool'; name: string; label: L }
  | { kind: 'select'; name: string; label: L; options: Opt[]; required?: boolean }
  | { kind: 'multiselect'; name: string; label: L; options: Opt[] }
  | { kind: 'image'; name: string; label: L }
  | { kind: 'images'; name: string; label: L; max?: number }
  | { kind: 'ref'; name: string; label: L; target: Ent }
  | { kind: 'refs'; name: string; label: L; target: Ent; max?: number }
  | { kind: 'trips'; name: string; label: L; max?: number }
  | { kind: 'trip'; name: string; label: L }
  | { kind: 'strings'; name: string; label: L; min?: number; max?: number }
  | { kind: 'list'; name: string; label: L; fields: Field[]; max?: number }
  | { kind: 'group'; name: string; label: L; fields: Field[] }
  | { kind: 'blocks'; name: string; label: L; blocks: Record<string, { label: L; fields: Field[] }> }
  | { kind: 'readonly'; name: string; label: L; help?: L }

/** A form: fields stored on the main row (or joins), and fields per language. */
export interface FormSpec {
  shared: (Field & { join?: boolean })[]
  localized: Field[]
}

const opts = (pairs: [string, string, string][]): Opt[] => pairs.map(([value, es, en]) => ({ value, label: l(es, en) }))

export const FAQ: Field = {
  kind: 'list',
  name: 'faq',
  label: l('Preguntas frecuentes', 'FAQ'),
  fields: [
    { kind: 'text', name: 'q', label: l('Pregunta', 'Question'), required: true },
    { kind: 'textarea', name: 'a', label: l('Respuesta', 'Answer'), required: true },
  ],
}

const commonLocalized = (titleLabel = l('Título', 'Title')): Field[] => [
  { kind: 'bool', name: 'available', label: l('Publicado en este idioma', 'Published in this language') },
  { kind: 'text', name: 'title', label: titleLabel, max: 255 },
  { kind: 'slug', name: 'slug', label: l('Slug (minúsculas-con-guiones)', 'Slug (lowercase-with-hyphens)'), from: 'title' },
  { kind: 'textarea', name: 'excerpt', label: l('Extracto (máx. 155)', 'Excerpt (max 155)'), max: 155 },
]

const seoLocalized: Field[] = [
  { kind: 'text', name: 'seo_meta_title', label: l('SEO: meta título', 'SEO: meta title'), max: 255 },
  { kind: 'textarea', name: 'seo_meta_description', label: l('SEO: meta descripción (máx. 160)', 'SEO: meta description (max 160)'), max: 160 },
]

const commonShared: Field[] = [
  { kind: 'image', name: 'featured_image_id', label: l('Imagen destacada', 'Featured image') },
  { kind: 'image', name: 'seo_og_image_id', label: l('SEO: imagen OG', 'SEO: OG image') },
  { kind: 'bool', name: 'hola_sample', label: l('Contenido de muestra', 'Sample content') },
]

const WEEKDAYS = opts([
  ['mon', 'Lunes', 'Monday'],
  ['tue', 'Martes', 'Tuesday'],
  ['wed', 'Miércoles', 'Wednesday'],
  ['thu', 'Jueves', 'Thursday'],
  ['fri', 'Viernes', 'Friday'],
  ['sat', 'Sábado', 'Saturday'],
  ['sun', 'Domingo', 'Sunday'],
])
export const MONTH_OPTS = opts([
  ['jan', 'Enero', 'January'],
  ['feb', 'Febrero', 'February'],
  ['mar', 'Marzo', 'March'],
  ['apr', 'Abril', 'April'],
  ['may', 'Mayo', 'May'],
  ['jun', 'Junio', 'June'],
  ['jul', 'Julio', 'July'],
  ['aug', 'Agosto', 'August'],
  ['sep', 'Septiembre', 'September'],
  ['oct', 'Octubre', 'October'],
  ['nov', 'Noviembre', 'November'],
  ['dec', 'Diciembre', 'December'],
])

const tripShared = (): (Field & { join?: boolean })[] => [
  ...commonShared,
  { kind: 'number', name: 'price_from_eur', label: l('Precio desde (EUR)', 'Price from (EUR)'), min: 0 },
  { kind: 'number', name: 'price_from_usd', label: l('Precio desde (USD)', 'Price from (USD)'), min: 0 },
  {
    kind: 'select',
    name: 'price_basis',
    required: true,
    label: l('Base del precio', 'Price basis'),
    options: opts([
      ['per_person_double', 'Por persona en habitación doble', 'Per person in a double room'],
      ['per_person', 'Por persona', 'Per person'],
      ['per_group', 'Por grupo', 'Per group'],
    ]),
  },
  { kind: 'select', name: 'group_type', required: true, label: l('Tipo de grupo', 'Group type'), options: opts([['private', 'Privado', 'Private'], ['small', 'Grupo reducido', 'Small group'], ['shared', 'Compartido', 'Shared']]) },
  { kind: 'number', name: 'group_min', label: l('Mínimo de personas', 'Group min'), min: 1 },
  { kind: 'number', name: 'group_max', label: l('Máximo de personas', 'Group max'), min: 1 },
  { kind: 'multiselect', name: 'guide_languages', label: l('Idiomas del guía', 'Guide languages'), options: opts([['es', 'Español', 'Spanish'], ['en', 'Inglés', 'English']]) },
  { kind: 'multiselect', name: 'availability_days', label: l('Días disponibles', 'Availability days'), options: WEEKDAYS },
  { kind: 'text', name: 'cancellation_policy', label: l('Política de cancelación (clave de Ajustes)', 'Cancellation policy (key from Settings)'), max: 64 },
  { kind: 'select', name: 'booking_mode', required: true, label: l('Modo de reserva', 'Booking mode'), options: opts([['inquiry', 'Solicitud', 'Inquiry'], ['external', 'Enlace externo', 'External link'], ['bookable', 'Reservable (fase 2)', 'Bookable (phase 2)']]) },
  { kind: 'url', name: 'booking_url', label: l('URL de reserva', 'Booking URL'), max: 500 },
  { kind: 'date', name: 'last_reviewed', label: l('Última revisión', 'Last reviewed') },
  { kind: 'bool', name: 'featured', label: l('Destacado', 'Featured') },
  { kind: 'images', name: 'gallery', label: l('Galería (5–15 imágenes)', 'Gallery (5–15 images)'), max: 15 },
  { kind: 'refs', name: 'destinations', label: l('Destinos (en orden de ruta)', 'Destinations (route order)'), target: 'destinations', join: true },
  { kind: 'trips', name: 'related_trips', label: l('Viajes relacionados (máx. 3)', 'Related trips (max 3)'), max: 3, join: true },
]

const tripLocalized = (): Field[] => [
  ...commonLocalized(),
  { kind: 'text', name: 'subtitle', label: l('Subtítulo (máx. 90)', 'Subtitle (max 90)'), max: 90 },
  { kind: 'markdown', name: 'overview', label: l('Resumen', 'Overview') },
  { kind: 'text', name: 'price_note', label: l('Nota de precio', 'Price note') },
  { kind: 'strings', name: 'highlights', label: l('Lo más destacado (3–8)', 'Highlights (3–8)'), min: 3, max: 8 },
  {
    kind: 'list',
    name: 'itinerary',
    label: l('Itinerario', 'Itinerary'),
    fields: [
      { kind: 'text', name: 'label', label: l('Etiqueta (Día 1 / 08:00)', 'Label (Day 1 / 08:00)'), required: true },
      { kind: 'text', name: 'title', label: l('Título', 'Title'), required: true },
      { kind: 'textarea', name: 'description', label: l('Descripción', 'Description') },
      { kind: 'refs', name: 'places', label: l('Lugares', 'Places'), target: 'destinations' },
      { kind: 'multiselect', name: 'meals', label: l('Comidas', 'Meals'), options: opts([['B', 'Desayuno', 'Breakfast'], ['L', 'Almuerzo', 'Lunch'], ['D', 'Cena', 'Dinner']]) },
      { kind: 'text', name: 'overnight', label: l('Noche en', 'Overnight') },
    ],
  },
  { kind: 'strings', name: 'includes', label: l('Incluye', 'Includes') },
  { kind: 'strings', name: 'excludes', label: l('No incluye', 'Excludes') },
  { kind: 'strings', name: 'what_to_bring', label: l('Qué llevar', 'What to bring') },
  { kind: 'text', name: 'season_note', label: l('Nota de temporada', 'Season note') },
  { kind: 'textarea', name: 'cancellation_override', label: l('Texto de cancelación propio (opcional)', 'Cancellation text override (optional)') },
  FAQ,
  ...seoLocalized,
]

const taxonomy = (extra: (Field & { join?: boolean })[] = []): FormSpec => ({
  shared: [{ kind: 'number', name: 'sort', label: l('Orden', 'Sort order') }, { kind: 'image', name: 'hero_id', label: l('Imagen de cabecera', 'Hero image') }, ...extra],
  localized: [
    { kind: 'bool', name: 'available', label: l('Publicado en este idioma', 'Published in this language') },
    { kind: 'text', name: 'name', label: l('Nombre', 'Name'), max: 255 },
    { kind: 'slug', name: 'slug', label: l('Slug (minúsculas-con-guiones)', 'Slug (lowercase-with-hyphens)'), from: 'name' },
    { kind: 'text', name: 'h1', label: l('H1 (opcional)', 'H1 override'), max: 255 },
    { kind: 'textarea', name: 'intro', label: l('Introducción', 'Intro') },
    { kind: 'textarea', name: 'seo_text', label: l('Texto SEO inferior', 'Bottom SEO text') },
    FAQ,
  ],
})

export const PAGE_TEMPLATES = ['home', 'default', 'about', 'contact', 'faq', 'plan-my-trip', 'thank-you', 'legal'] as const

export const PAGE_BLOCKS: Record<string, { label: L; fields: Field[] }> = {
  text: {
    label: l('Texto', 'Text'),
    fields: [
      { kind: 'text', name: 'eyebrow', label: l('Antetítulo', 'Eyebrow') },
      { kind: 'text', name: 'title', label: l('Título', 'Title') },
      { kind: 'markdown', name: 'body', label: l('Texto', 'Body') },
      { kind: 'bool', name: 'draft', label: l('Texto provisional (revisar)', 'Draft copy (to review)') },
    ],
  },
  team: {
    label: l('Equipo', 'Team'),
    fields: [
      { kind: 'text', name: 'eyebrow', label: l('Antetítulo', 'Eyebrow') },
      { kind: 'text', name: 'title', label: l('Título', 'Title') },
      {
        kind: 'list',
        name: 'members',
        label: l('Personas', 'Members'),
        fields: [
          { kind: 'text', name: 'name', label: l('Nombre', 'Name'), required: true },
          { kind: 'text', name: 'role', label: l('Rol', 'Role') },
          { kind: 'text', name: 'languages', label: l('Idiomas', 'Languages') },
          { kind: 'image', name: 'photo', label: l('Foto', 'Photo') },
        ],
      },
    ],
  },
  steps: {
    label: l('Pasos', 'Steps'),
    fields: [
      { kind: 'text', name: 'eyebrow', label: l('Antetítulo', 'Eyebrow') },
      { kind: 'text', name: 'title', label: l('Título', 'Title') },
      { kind: 'list', name: 'items', label: l('Pasos', 'Steps'), fields: [{ kind: 'text', name: 'title', label: l('Título', 'Title'), required: true }, { kind: 'textarea', name: 'text', label: l('Texto', 'Text') }] },
      { kind: 'bool', name: 'draft', label: l('Texto provisional (revisar)', 'Draft copy (to review)') },
    ],
  },
  licence: { label: l('Licencia', 'Licence'), fields: [{ kind: 'text', name: 'title', label: l('Título', 'Title') }, { kind: 'textarea', name: 'text', label: l('Texto', 'Text') }] },
  'cta-band': { label: l('Banda de llamada', 'CTA band'), fields: [{ kind: 'text', name: 'title', label: l('Título', 'Title') }, { kind: 'textarea', name: 'text', label: l('Texto', 'Text') }] },
}

export const ENTITY_SPECS: Record<Ent, FormSpec> = {
  tours: {
    shared: [
      { kind: 'number', name: 'duration_days', label: l('Duración (días)', 'Duration (days)'), required: true, min: 1 },
      { kind: 'readonly', name: 'duration_label', label: l('Duración (automática)', 'Duration (automatic)') },
      { kind: 'refs', name: 'trip_style', label: l('Estilo', 'Style'), target: 'trip-styles', join: true },
      { kind: 'refs', name: 'guides', label: l('Guías relacionadas', 'Related guides'), target: 'guides', join: true },
      ...tripShared(),
    ],
    localized: tripLocalized(),
  },
  cruises: {
    shared: [
      { kind: 'number', name: 'nights', label: l('Noches', 'Nights'), required: true, min: 1 },
      { kind: 'ref', name: 'cruise_type_id', label: l('Tipo de crucero', 'Cruise type'), target: 'cruise-types' },
      { kind: 'refs', name: 'trip_style', label: l('Estilo', 'Style'), target: 'trip-styles', join: true },
      { kind: 'select', name: 'ship_category', label: l('Categoría del barco', 'Ship category'), options: opts([['4star', '4★', '4★'], ['5star', '5★', '5★'], ['deluxe', 'Deluxe', 'Deluxe'], ['dahabiya', 'Dahabiya', 'Dahabiya']]) },
      { kind: 'ref', name: 'embark_id', label: l('Embarque', 'Embark'), target: 'destinations' },
      { kind: 'ref', name: 'disembark_id', label: l('Desembarque', 'Disembark'), target: 'destinations' },
      {
        kind: 'multiselect',
        name: 'ship_facilities',
        label: l('Instalaciones', 'Ship facilities'),
        options: opts([
          ['pool', 'Piscina', 'Pool'],
          ['sun_deck', 'Cubierta solárium', 'Sun deck'],
          ['restaurant', 'Restaurante', 'Restaurant'],
          ['bar', 'Bar', 'Bar'],
          ['air_conditioning', 'Aire acondicionado', 'Air conditioning'],
          ['wifi', 'Wifi', 'Wi-Fi'],
          ['spa', 'Spa', 'Spa'],
          ['gym', 'Gimnasio', 'Gym'],
        ]),
      },
      { kind: 'image', name: 'deck_plan_id', label: l('Plano de cubiertas', 'Deck plan') },
      ...tripShared(),
    ],
    localized: [
      ...tripLocalized(),
      { kind: 'text', name: 'ship_name', label: l('Barco', 'Ship name') },
      { kind: 'list', name: 'start_dates', label: l('Fechas de salida', 'Start dates'), fields: [{ kind: 'date', name: 'date', label: l('Fecha', 'Date'), required: true }, { kind: 'text', name: 'note', label: l('Nota', 'Note') }] },
      {
        kind: 'list',
        name: 'cabins',
        label: l('Camarotes', 'Cabins'),
        fields: [
          { kind: 'text', name: 'type', label: l('Tipo', 'Type') },
          { kind: 'number', name: 'size_m2', label: l('m²', 'm²'), min: 0 },
          { kind: 'text', name: 'beds', label: l('Camas', 'Beds') },
          { kind: 'number', name: 'price_from_eur', label: l('Desde (EUR)', 'From (EUR)'), min: 0 },
          { kind: 'number', name: 'price_from_usd', label: l('Desde (USD)', 'From (USD)'), min: 0 },
        ],
      },
    ],
  },
  excursions: {
    shared: [
      { kind: 'number', name: 'duration_hours', label: l('Duración (horas)', 'Duration (hours)'), required: true, min: 1 },
      { kind: 'refs', name: 'departure', label: l('Salida desde', 'Departs from'), target: 'departures', join: true },
      { kind: 'number', name: 'child_price_eur', label: l('Precio niño (EUR)', 'Child price (EUR)'), min: 0 },
      { kind: 'number', name: 'child_price_usd', label: l('Precio niño (USD)', 'Child price (USD)'), min: 0 },
      { kind: 'number', name: 'min_age', label: l('Edad mínima', 'Minimum age'), min: 0 },
      { kind: 'select', name: 'activity_level', label: l('Nivel de actividad', 'Activity level'), options: opts([['easy', 'Fácil', 'Easy'], ['moderate', 'Moderado', 'Moderate'], ['demanding', 'Exigente', 'Demanding']]) },
      ...tripShared(),
    ],
    localized: [
      ...tripLocalized(),
      { kind: 'list', name: 'start_times', label: l('Horarios de salida', 'Start times'), fields: [{ kind: 'time', name: 'time', label: l('Hora', 'Time'), required: true }, { kind: 'text', name: 'label', label: l('Nota', 'Note') }] },
      { kind: 'strings', name: 'pickup_areas', label: l('Zonas de recogida', 'Pickup areas') },
    ],
  },
  destinations: {
    shared: [
      { kind: 'ref', name: 'region_id', label: l('Región', 'Region'), target: 'regions' },
      { kind: 'multiselect', name: 'best_months', label: l('Mejores meses', 'Best months'), options: MONTH_OPTS },
      { kind: 'number', name: 'days_recommended', label: l('Días recomendados', 'Days recommended'), min: 1 },
      { kind: 'number', name: 'lat', label: l('Latitud', 'Latitude'), min: -90, max: 90, step: 0.000001 },
      { kind: 'number', name: 'lng', label: l('Longitud', 'Longitude'), min: -180, max: 180, step: 0.000001 },
      { kind: 'refs', name: 'nearby', label: l('Destinos cercanos', 'Nearby destinations'), target: 'destinations', join: true },
      ...commonShared,
    ],
    localized: [
      ...commonLocalized(),
      { kind: 'text', name: 'tagline', label: l('Lema', 'Tagline') },
      { kind: 'markdown', name: 'content', label: l('Contenido', 'Content') },
      { kind: 'textarea', name: 'how_to_get_there', label: l('Cómo llegar', 'How to get there') },
      { kind: 'text', name: 'nearest_airport', label: l('Aeropuerto más cercano', 'Nearest airport') },
      {
        kind: 'list',
        name: 'top_sights',
        label: l('Imprescindibles', 'Top sights'),
        fields: [
          { kind: 'text', name: 'name', label: l('Nombre', 'Name'), required: true },
          { kind: 'image', name: 'image', label: l('Imagen', 'Image') },
          { kind: 'textarea', name: 'text', label: l('Texto', 'Text') },
          { kind: 'url', name: 'map_link', label: l('Enlace al mapa', 'Map link') },
        ],
      },
      ...seoLocalized,
    ],
  },
  guides: {
    shared: [
      { kind: 'refs', name: 'guide_topic', label: l('Tema (máx. 2)', 'Topic (max 2)'), target: 'guide-topics', max: 2, join: true },
      { kind: 'date', name: 'last_updated', label: l('Actualizado', 'Last updated') },
      { kind: 'bool', name: 'toc', label: l('Índice de contenidos', 'Table of contents') },
      { kind: 'refs', name: 'related_destinations', label: l('Destinos relacionados', 'Related destinations'), target: 'destinations', join: true },
      { kind: 'trips', name: 'related_trips', label: l('Viajes relacionados (máx. 3)', 'Related trips (max 3)'), max: 3, join: true },
      ...commonShared,
    ],
    localized: [
      ...commonLocalized(),
      { kind: 'markdown', name: 'content', label: l('Artículo', 'Article') },
      { kind: 'text', name: 'author_name', label: l('Autor', 'Author') },
      ...seoLocalized,
    ],
  },
  pages: {
    shared: [
      { kind: 'select', name: 'template', label: l('Plantilla', 'Template'), options: PAGE_TEMPLATES.map((t) => ({ value: t, label: l(t, t) })), required: true },
      { kind: 'date', name: 'last_updated', label: l('Actualizado', 'Last updated') },
      ...commonShared,
    ],
    localized: [
      ...commonLocalized(),
      { kind: 'markdown', name: 'content', label: l('Contenido', 'Content') },
      { kind: 'blocks', name: 'sections', label: l('Secciones (Sobre nosotros)', 'Sections (About)'), blocks: PAGE_BLOCKS },
      {
        kind: 'list',
        name: 'faq_groups',
        label: l('Grupos de preguntas (FAQ)', 'FAQ groups'),
        fields: [{ kind: 'text', name: 'title', label: l('Título', 'Title'), required: true }, { ...FAQ, name: 'items', label: l('Preguntas', 'Questions') } as Field],
      },
      ...seoLocalized,
    ],
  },
  durations: taxonomy([
    { kind: 'number', name: 'min_days', label: l('Días mínimos', 'Min days') },
    { kind: 'number', name: 'max_days', label: l('Días máximos', 'Max days') },
  ]),
  'trip-styles': taxonomy(),
  'cruise-types': taxonomy(),
  departures: taxonomy([{ kind: 'ref', name: 'destination_id', label: l('Destino', 'Destination'), target: 'destinations' }]),
  regions: taxonomy(),
  'guide-topics': taxonomy(),
}

// ------------------------------------------------------------ settings (§4)
const archiveIntro = (name: string, label: L): Field => ({
  kind: 'group',
  name,
  label,
  fields: [
    { kind: 'text', name: 'h1', label: l('H1', 'H1') },
    { kind: 'textarea', name: 'intro', label: l('Introducción', 'Intro') },
    { kind: 'image', name: 'hero', label: l('Imagen', 'Hero image') },
    { kind: 'textarea', name: 'seo_text', label: l('Texto SEO inferior', 'Bottom SEO text') },
    FAQ,
  ],
})

const sectionHead = (name: string, label: L, extra: Field[] = []): Field => ({
  kind: 'group',
  name,
  label,
  fields: [
    { kind: 'text', name: 'eyebrow', label: l('Antetítulo', 'Eyebrow') },
    { kind: 'text', name: 'title', label: l('Título', 'Title') },
    { kind: 'textarea', name: 'intro', label: l('Introducción', 'Intro') },
    ...extra,
  ],
})

export const SETTINGS_SPEC: FormSpec = {
  shared: [
    { kind: 'text', name: 'whatsapp_number', label: l('Número de WhatsApp Business (solo dígitos, con prefijo, sin +)', 'WhatsApp Business number (digits only, country code, no +)'), max: 15 },
    { kind: 'email', name: 'contact_email', label: l('Email de contacto', 'Contact email') },
    { kind: 'text', name: 'phone', label: l('Teléfono', 'Phone') },
    { kind: 'textarea', name: 'address', label: l('Dirección', 'Address') },
    { kind: 'text', name: 'legal_name', label: l('Razón social', 'Legal name') },
    { kind: 'text', name: 'licence_number', label: l('Licencia del Ministerio de Turismo', 'Tourism licence number') },
    { kind: 'text', name: 'gtm_id', label: l('ID de contenedor de GTM (GTM-XXXXXXX)', 'GTM container ID (GTM-XXXXXXX)') },
    {
      kind: 'list',
      name: 'social',
      label: l('Redes sociales', 'Social links'),
      fields: [
        { kind: 'select', name: 'network', label: l('Red', 'Network'), options: ['instagram', 'facebook', 'tiktok', 'youtube', 'x', 'linkedin'].map((v) => ({ value: v, label: l(v, v) })), required: true },
        { kind: 'url', name: 'url', label: l('URL', 'URL') },
      ],
    },
  ],
  localized: [
    { kind: 'text', name: 'whatsapp_message_default', label: l('Mensaje de WhatsApp por defecto', 'Default WhatsApp message') },
    { kind: 'text', name: 'reply_hours', label: l('Horario de respuesta (hora de El Cairo)', 'Reply hours (Cairo time)') },
    { kind: 'image', name: 'og_default_id', label: l('Imagen OG por defecto', 'Default OG image') },
    {
      kind: 'group',
      name: 'home',
      label: l('Inicio', 'Home'),
      fields: [
        {
          kind: 'group',
          name: 'hero',
          label: l('Portada', 'Hero'),
          fields: [
            { kind: 'text', name: 'heading', label: l('H1', 'H1') },
            { kind: 'textarea', name: 'lead', label: l('Entradilla', 'Lead') },
            { kind: 'image', name: 'image', label: l('Imagen', 'Image') },
            { kind: 'bool', name: 'show_stats', label: l('Mostrar cifras', 'Show stats') },
            { kind: 'bool', name: 'draft', label: l('Texto provisional', 'Draft copy') },
          ],
        },
        sectionHead('destinations', l('Destinos', 'Destinations'), [{ kind: 'number', name: 'limit', label: l('Número de elementos', 'Number of items'), min: 1, max: 12 }]),
        sectionHead('trips', l('Viajes destacados', 'Featured trips'), [{ kind: 'number', name: 'limit', label: l('Número de elementos', 'Number of items'), min: 1, max: 12 }]),
        sectionHead('cruises', l('Cruceros', 'Cruises'), [{ kind: 'image', name: 'image', label: l('Imagen', 'Image') }]),
        sectionHead('excursions', l('Excursiones por ciudad', 'Excursions by city'), [{ kind: 'refs', name: 'cities', label: l('Ciudades (en orden)', 'Cities (in order)'), target: 'departures' }]),
        {
          kind: 'group',
          name: 'why',
          label: l('Por qué Hola Egipto', 'Why Hola Egipto'),
          fields: [
            { kind: 'text', name: 'eyebrow', label: l('Antetítulo', 'Eyebrow') },
            { kind: 'text', name: 'title', label: l('Título', 'Title') },
            { kind: 'bool', name: 'draft', label: l('Texto provisional', 'Draft copy') },
            {
              kind: 'list',
              name: 'columns',
              label: l('Columnas', 'Columns'),
              max: 3,
              fields: [
                { kind: 'select', name: 'icon', label: l('Icono', 'Icon'), options: ['map-pin', 'languages', 'compass', 'message-circle', 'calendar-check', 'sun'].map((v) => ({ value: v, label: l(v, v) })) },
                { kind: 'text', name: 'title', label: l('Título', 'Title'), required: true },
                { kind: 'textarea', name: 'text', label: l('Texto', 'Text'), required: true },
              ],
            },
          ],
        },
        sectionHead('guides', l('Guía de viaje', 'Travel guide'), [{ kind: 'number', name: 'limit', label: l('Número de elementos', 'Number of items'), min: 1, max: 12 }]),
        { kind: 'group', name: 'cta', label: l('Banda de llamada', 'CTA band'), fields: [{ kind: 'text', name: 'title', label: l('Título', 'Title') }, { kind: 'textarea', name: 'text', label: l('Texto', 'Text') }] },
      ],
    },
    {
      kind: 'group',
      name: 'booking_band',
      label: l('Banda de reservas', 'Booking band'),
      fields: [
        { kind: 'bool', name: 'enabled', label: l('Activada', 'Enabled') },
        { kind: 'text', name: 'badge', label: l('Etiqueta', 'Badge') },
        { kind: 'text', name: 'title', label: l('Título', 'Title') },
        { kind: 'textarea', name: 'text', label: l('Texto', 'Text') },
        { kind: 'text', name: 'primary_label', label: l('Botón principal', 'Primary button') },
        { kind: 'text', name: 'secondary_label', label: l('Botón secundario', 'Secondary button') },
      ],
    },
    { kind: 'list', name: 'stats', label: l('Cifras', 'Stats strip'), fields: [{ kind: 'text', name: 'value', label: l('Valor', 'Value'), required: true }, { kind: 'text', name: 'label', label: l('Texto', 'Label'), required: true }] },
    {
      kind: 'list',
      name: 'trust_items',
      label: l('Barra de confianza (solo afirmaciones ciertas)', 'Trust bar (true claims only)'),
      fields: [
        { kind: 'select', name: 'icon', label: l('Icono', 'Icon'), options: ['languages', 'map-pin', 'calendar-check', 'message-circle', 'compass', 'shield-check'].map((v) => ({ value: v, label: l(v, v) })) },
        { kind: 'text', name: 'text', label: l('Texto', 'Text'), required: true },
        { kind: 'bool', name: 'enabled', label: l('Visible', 'Visible') },
      ],
    },
    {
      kind: 'group',
      name: 'archive_intros',
      label: l('Intros de archivos', 'Archive intros'),
      fields: [
        archiveIntro('tours', l('Viajes', 'Tours')),
        archiveIntro('cruises', l('Cruceros', 'Cruises')),
        archiveIntro('excursions', l('Excursiones', 'Excursions')),
        archiveIntro('destinations', l('Destinos', 'Destinations')),
        archiveIntro('guides', l('Guía de viaje', 'Travel guide')),
      ],
    },
    {
      kind: 'list',
      name: 'cancellation_policies',
      label: l('Políticas de cancelación', 'Cancellation policies'),
      fields: [{ kind: 'text', name: 'key', label: l('Clave', 'Key'), required: true }, { kind: 'text', name: 'name', label: l('Nombre', 'Name') }, { kind: 'textarea', name: 'text', label: l('Texto', 'Text') }],
    },
  ],
}

// ---------------------------------------------------------- navigation (§4)
const LINKS = (name: string, label: L): Field => ({
  kind: 'list',
  name,
  label,
  fields: [
    { kind: 'text', name: 'label', label: l('Texto', 'Label'), required: true },
    { kind: 'text', name: 'href', label: l('Enlace (ruta con barra final)', 'Link (path with trailing slash)'), required: true },
  ],
})

export const NAVIGATION_SPEC: FormSpec = {
  shared: [],
  localized: [
    {
      kind: 'list',
      name: 'header',
      label: l('Menú principal', 'Header menu'),
      fields: [
        { kind: 'text', name: 'label', label: l('Texto', 'Label'), required: true },
        { kind: 'text', name: 'href', label: l('Enlace', 'Link'), required: true },
        { kind: 'list', name: 'columns', label: l('Columnas del panel', 'Panel columns'), max: 2, fields: [{ kind: 'text', name: 'heading', label: l('Encabezado', 'Heading') }, LINKS('links', l('Enlaces', 'Links'))] },
        { kind: 'select', name: 'panel_extra', label: l('Tercera columna', 'Third column'), options: opts([['featured', 'Viaje destacado', 'Featured trip'], ['map', 'Mapa de regiones', 'Region map'], ['latest_guides', 'Últimos artículos', 'Latest articles'], ['none', 'Nada', 'None']]) },
        { kind: 'trip', name: 'featured', label: l('Viaje destacado', 'Featured trip') },
      ],
    },
    { kind: 'list', name: 'footer_columns', label: l('Columnas del pie (2–4)', 'Footer columns (2–4)'), max: 3, fields: [{ kind: 'text', name: 'heading', label: l('Encabezado', 'Heading'), required: true }, LINKS('links', l('Enlaces', 'Links'))] },
    { kind: 'textarea', name: 'footer_description', label: l('Descripción del pie', 'Footer description') },
    LINKS('legal_links', l('Enlaces legales', 'Legal links')),
  ],
}
