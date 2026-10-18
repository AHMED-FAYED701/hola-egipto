import type { Field, GlobalConfig } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { faqField, l } from '../fields/common'
import { revalidateGlobal } from '../hooks/revalidate'

const archiveIntro = (name: string, label: { es: string; en: string }): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'h1', type: 'text', label: 'H1' },
    { name: 'intro', type: 'textarea', label: l('Introducción', 'Intro') },
    { name: 'hero', type: 'upload', relationTo: 'media', label: l('Imagen', 'Hero image') },
    { name: 'seo_text', type: 'textarea', label: l('Texto SEO inferior', 'Bottom SEO text') },
    faqField(),
  ],
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: l('Ajustes del sitio', 'Site settings'),
  admin: { group: l('Ajustes', 'Settings') },
  access: { read: publicRead, update: isLoggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: l('Contacto y empresa', 'Contact and company'),
          fields: [
            {
              name: 'whatsapp_number',
              type: 'text',
              label: l('Número de WhatsApp Business', 'WhatsApp Business number'),
              admin: { description: l('Solo dígitos, con prefijo de país, sin «+» (p. ej. 201001234567)', 'Digits only, country code included, no "+" (e.g. 201001234567)') },
              validate: (v: unknown) => !v || /^\d{8,15}$/.test(String(v)) || 'Digits only (8–15), country code included, no "+"',
            },
            { name: 'whatsapp_message_default', type: 'text', localized: true, label: l('Mensaje de WhatsApp por defecto', 'Default WhatsApp message') },
            { name: 'contact_email', type: 'email', label: l('Email de contacto', 'Contact email') },
            { name: 'phone', type: 'text', label: l('Teléfono', 'Phone') },
            { name: 'address', type: 'textarea', label: l('Dirección', 'Address') },
            { name: 'reply_hours', type: 'text', localized: true, label: l('Horario de respuesta (hora de El Cairo)', 'Reply hours (Cairo time)') },
            { name: 'legal_name', type: 'text', label: l('Razón social', 'Legal name') },
            { name: 'licence_number', type: 'text', label: l('Licencia del Ministerio de Turismo', 'Tourism licence number') },
            {
              name: 'social',
              type: 'array',
              label: l('Redes sociales', 'Social links'),
              fields: [
                {
                  name: 'network',
                  type: 'select',
                  required: true,
                  options: ['instagram', 'facebook', 'tiktok', 'youtube', 'x', 'linkedin'].map((v) => ({ label: v, value: v })),
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: l('Bloques de inicio', 'Home blocks'),
          fields: [
            {
              name: 'booking_band',
              type: 'group',
              localized: true,
              label: l('Banda de reservas', 'Booking band'),
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true, label: l('Activada', 'Enabled') },
                { name: 'badge', type: 'text' },
                { name: 'title', type: 'text' },
                { name: 'text', type: 'textarea' },
                { name: 'primary_label', type: 'text' },
                { name: 'secondary_label', type: 'text' },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              localized: true,
              label: l('Cifras', 'Stats strip'),
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              name: 'trust_items',
              type: 'array',
              localized: true,
              label: l('Barra de confianza (solo afirmaciones ciertas)', 'Trust bar (true claims only)'),
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'languages',
                  options: ['languages', 'map-pin', 'calendar-check', 'message-circle', 'compass', 'shield-check'].map((v) => ({ label: v, value: v })),
                },
                { name: 'text', type: 'text', required: true },
                { name: 'enabled', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
        {
          label: l('Intros de archivos', 'Archive intros'),
          fields: [
            {
              name: 'archive_intros',
              type: 'group',
              localized: true,
              label: l('Intros de archivos', 'Archive intros'),
              fields: [
                archiveIntro('tours', l('Viajes', 'Tours')),
                archiveIntro('cruises', l('Cruceros', 'Cruises')),
                archiveIntro('excursions', l('Excursiones', 'Excursions')),
                archiveIntro('destinations', l('Destinos', 'Destinations')),
                archiveIntro('guides', l('Guía de viaje', 'Travel guide')),
              ],
            },
          ],
        },
        {
          label: l('Políticas y valores por defecto', 'Policies and defaults'),
          fields: [
            {
              name: 'cancellation_policies',
              type: 'array',
              label: l('Políticas de cancelación', 'Cancellation policies'),
              fields: [
                { name: 'key', type: 'text', required: true, label: l('Clave', 'Key') },
                { name: 'name', type: 'text', localized: true, label: l('Nombre', 'Name') },
                { name: 'text', type: 'textarea', localized: true, label: l('Texto', 'Text') },
              ],
            },
            { name: 'og_default', type: 'upload', relationTo: 'media', localized: true, label: l('Imagen OG por defecto', 'Default OG image') },
            { name: 'gtm_id', type: 'text', label: l('ID de contenedor de GTM', 'GTM container ID'), admin: { description: 'GTM-XXXXXXX' } },
          ],
        },
      ],
    },
  ],
}
