import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { holaSampleField, l } from '../fields/common'

/** Stored inquiries (contracts §7). Admin-only; no revalidation hooks (§16). */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: l('Solicitud', 'Inquiry'), plural: l('Solicitudes', 'Inquiries') },
  admin: {
    group: l('Solicitudes', 'Inquiries'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'lang', 'form', 'createdAt'],
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    { name: 'title', type: 'text', label: l('Título', 'Title'), admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      label: l('Estado', 'Status'),
      admin: { position: 'sidebar' },
      options: [
        { label: l('Nueva', 'New'), value: 'new' },
        { label: l('Respondida', 'Replied'), value: 'replied' },
        { label: l('Ganada', 'Won'), value: 'won' },
        { label: l('Perdida', 'Lost'), value: 'lost' },
      ],
    },
    {
      name: 'form',
      type: 'select',
      defaultValue: 'plan_my_trip',
      label: l('Formulario', 'Form'),
      options: [
        { label: l('Planifica tu viaje', 'Plan my trip'), value: 'plan_my_trip' },
        { label: l('Contacto', 'Contact'), value: 'contact' },
      ],
    },
    { name: 'trip', type: 'relationship', relationTo: ['tours', 'cruises', 'excursions'], label: l('Viaje', 'Trip') },
    { name: 'interests', type: 'text', hasMany: true, label: l('Intereses', 'Interests') },
    { name: 'length', type: 'text', label: l('Duración', 'Trip length') },
    {
      name: 'date_mode',
      type: 'select',
      label: l('Fechas', 'Dates'),
      options: [
        { label: l('Exactas', 'Exact'), value: 'exact' },
        { label: l('Mes', 'Month'), value: 'month' },
        { label: l('Flexibles', 'Flexible'), value: 'flexible' },
      ],
    },
    { name: 'date_from', type: 'date', label: l('Desde', 'From') },
    { name: 'date_to', type: 'date', label: l('Hasta', 'To') },
    { name: 'month', type: 'text', label: l('Mes', 'Month') },
    { name: 'adults', type: 'number', label: l('Adultos', 'Adults') },
    { name: 'children', type: 'number', label: l('Niños', 'Children') },
    { name: 'children_ages', type: 'text', label: l('Edades de los niños', 'Children ages') },
    { name: 'budget', type: 'text', label: l('Presupuesto', 'Budget') },
    { name: 'hotel', type: 'text', label: l('Hotel', 'Hotel') },
    { name: 'group_type', type: 'text', label: l('Privado o grupo', 'Private or group') },
    { name: 'name', type: 'text', required: true, label: l('Nombre', 'Name') },
    { name: 'email', type: 'email', required: true, label: l('Email', 'Email') },
    { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
    {
      name: 'channel',
      type: 'select',
      label: l('Canal preferido', 'Preferred channel'),
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Email', value: 'email' },
      ],
    },
    { name: 'message', type: 'textarea', maxLength: 2000, label: l('Mensaje', 'Message') },
    { name: 'consent_at', type: 'date', label: l('Consentimiento', 'Consent at'), admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'marketing', type: 'checkbox', defaultValue: false, label: l('Acepta marketing', 'Marketing opt-in') },
    {
      name: 'lang',
      type: 'select',
      required: true,
      label: l('Idioma', 'Language'),
      options: [
        { label: 'ES', value: 'es' },
        { label: 'EN', value: 'en' },
      ],
    },
    { name: 'page_url', type: 'text', label: l('Página', 'Page URL') },
    {
      name: 'utm',
      type: 'group',
      label: 'UTM',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },
    { name: 'gclid', type: 'text' },
    { name: 'fbclid', type: 'text' },
    { name: 'landing', type: 'text', label: l('Primera página', 'Landing page') },
    { name: 'tracked', type: 'checkbox', defaultValue: false, label: l('Conversión registrada', 'Conversion tracked'), admin: { position: 'sidebar' } },
    { name: 'ip_hash', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    holaSampleField,
  ],
}
