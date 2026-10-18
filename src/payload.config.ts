import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Destinations } from './collections/Destinations'
import { Guides } from './collections/Guides'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { CruiseTypes, Departures, Durations, GuideTopics, Regions, TripStyles } from './collections/taxonomies'
import { Cruises, Excursions, Tours } from './collections/trips'
import { Users } from './collections/Users'
import { holaEmailAdapter } from './lib/email-adapter'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: '· Hola Egipto' },
  },
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: 'es',
  },
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'es',
    fallback: false,
  },
  collections: [
    Tours,
    Cruises,
    Excursions,
    Destinations,
    Guides,
    Pages,
    Media,
    Durations,
    TripStyles,
    CruiseTypes,
    Departures,
    Regions,
    GuideTopics,
    Inquiries,
    Users,
  ],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  email: holaEmailAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false,
    disableCreateDatabase: true,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  // Logs go to stderr so the `pnpm hola:*` scripts print only their JSON on stdout.
  logger: { options: { level: process.env.PAYLOAD_LOG_LEVEL || 'info' }, destination: process.stderr },
  plugins: [],
})
