import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tours_guide_languages" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_tours_itinerary_meals" AS ENUM('B', 'L', 'D');
  CREATE TYPE "public"."enum_tours_availability_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_tours_price_basis" AS ENUM('per_person_double', 'per_person', 'per_group');
  CREATE TYPE "public"."enum_tours_group_type" AS ENUM('private', 'small', 'shared');
  CREATE TYPE "public"."enum_tours_booking_mode" AS ENUM('inquiry', 'external', 'bookable');
  CREATE TYPE "public"."enum_cruises_ship_facilities" AS ENUM('pool', 'sun_deck', 'restaurant', 'bar', 'air_conditioning', 'wifi', 'spa', 'gym');
  CREATE TYPE "public"."enum_cruises_guide_languages" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_cruises_itinerary_meals" AS ENUM('B', 'L', 'D');
  CREATE TYPE "public"."enum_cruises_availability_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_cruises_ship_category" AS ENUM('4star', '5star', 'deluxe', 'dahabiya');
  CREATE TYPE "public"."enum_cruises_price_basis" AS ENUM('per_person_double', 'per_person', 'per_group');
  CREATE TYPE "public"."enum_cruises_group_type" AS ENUM('private', 'small', 'shared');
  CREATE TYPE "public"."enum_cruises_booking_mode" AS ENUM('inquiry', 'external', 'bookable');
  CREATE TYPE "public"."enum_excursions_guide_languages" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_excursions_itinerary_meals" AS ENUM('B', 'L', 'D');
  CREATE TYPE "public"."enum_excursions_availability_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_excursions_activity_level" AS ENUM('easy', 'moderate', 'demanding');
  CREATE TYPE "public"."enum_excursions_price_basis" AS ENUM('per_person_double', 'per_person', 'per_group');
  CREATE TYPE "public"."enum_excursions_group_type" AS ENUM('private', 'small', 'shared');
  CREATE TYPE "public"."enum_excursions_booking_mode" AS ENUM('inquiry', 'external', 'bookable');
  CREATE TYPE "public"."enum_destinations_best_months" AS ENUM('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec');
  CREATE TYPE "public"."enum_pages_blocks_why_columns_icon" AS ENUM('map-pin', 'languages', 'compass', 'message-circle', 'calendar-check', 'sun');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('home', 'default', 'about', 'contact', 'faq', 'plan-my-trip', 'thank-you', 'legal');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'replied', 'won', 'lost');
  CREATE TYPE "public"."enum_inquiries_form" AS ENUM('plan_my_trip', 'contact');
  CREATE TYPE "public"."enum_inquiries_date_mode" AS ENUM('exact', 'month', 'flexible');
  CREATE TYPE "public"."enum_inquiries_channel" AS ENUM('whatsapp', 'email');
  CREATE TYPE "public"."enum_inquiries_lang" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_site_settings_social_network" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'x', 'linkedin');
  CREATE TYPE "public"."enum_site_settings_trust_items_icon" AS ENUM('languages', 'map-pin', 'calendar-check', 'message-circle', 'compass', 'shield-check');
  CREATE TYPE "public"."enum_navigation_header_panel_extra" AS ENUM('featured', 'map', 'latest_guides', 'none');
  CREATE TABLE "tours_guide_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tours_guide_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "tours_itinerary_meals" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_tours_itinerary_meals",
  	"locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"overnight" varchar
  );
  
  CREATE TABLE "tours_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "tours_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "tours_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "tours_availability_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tours_availability_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tours_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"duration_days" numeric NOT NULL,
  	"duration_id" integer,
  	"price_from_eur" numeric,
  	"price_from_usd" numeric,
  	"price_basis" "enum_tours_price_basis" DEFAULT 'per_person_double',
  	"group_type" "enum_tours_group_type" DEFAULT 'small',
  	"group_min" numeric,
  	"group_max" numeric,
  	"cancellation_policy" varchar,
  	"booking_mode" "enum_tours_booking_mode" DEFAULT 'inquiry',
  	"booking_url" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tours_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"subtitle" varchar,
  	"overview" jsonb,
  	"price_note" varchar,
  	"season_note" varchar,
  	"cancellation_override" varchar,
  	"last_reviewed" timestamp(3) with time zone,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tours_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"trip_styles_id" integer,
  	"guides_id" integer,
  	"destinations_id" integer,
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  CREATE TABLE "cruises_start_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cruises_start_dates_locales" (
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_cabins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size_m2" numeric,
  	"price_from_eur" numeric,
  	"price_from_usd" numeric
  );
  
  CREATE TABLE "cruises_cabins_locales" (
  	"type" varchar NOT NULL,
  	"beds" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_ship_facilities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cruises_ship_facilities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cruises_guide_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cruises_guide_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cruises_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_itinerary_meals" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_cruises_itinerary_meals",
  	"locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cruises_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"overnight" varchar
  );
  
  CREATE TABLE "cruises_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cruises_availability_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cruises_availability_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cruises_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "cruises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"nights" numeric NOT NULL,
  	"cruise_type_id" integer,
  	"ship_category" "enum_cruises_ship_category",
  	"embark_id" integer,
  	"disembark_id" integer,
  	"deck_plan_id" integer,
  	"price_from_eur" numeric,
  	"price_from_usd" numeric,
  	"price_basis" "enum_cruises_price_basis" DEFAULT 'per_person_double',
  	"group_type" "enum_cruises_group_type" DEFAULT 'small',
  	"group_min" numeric,
  	"group_max" numeric,
  	"cancellation_policy" varchar,
  	"booking_mode" "enum_cruises_booking_mode" DEFAULT 'inquiry',
  	"booking_url" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cruises_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"subtitle" varchar,
  	"overview" jsonb,
  	"ship_name" varchar,
  	"price_note" varchar,
  	"season_note" varchar,
  	"cancellation_override" varchar,
  	"last_reviewed" timestamp(3) with time zone,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cruises_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"trip_styles_id" integer,
  	"destinations_id" integer,
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  CREATE TABLE "excursions_start_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_start_times_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_pickup_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_guide_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_excursions_guide_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "excursions_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_itinerary_meals" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_excursions_itinerary_meals",
  	"locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "excursions_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"overnight" varchar
  );
  
  CREATE TABLE "excursions_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_excludes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "excursions_availability_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_excursions_availability_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "excursions_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "excursions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"duration_hours" numeric NOT NULL,
  	"child_price_eur" numeric,
  	"child_price_usd" numeric,
  	"min_age" numeric,
  	"activity_level" "enum_excursions_activity_level",
  	"price_from_eur" numeric,
  	"price_from_usd" numeric,
  	"price_basis" "enum_excursions_price_basis" DEFAULT 'per_person_double',
  	"group_type" "enum_excursions_group_type" DEFAULT 'small',
  	"group_min" numeric,
  	"group_max" numeric,
  	"cancellation_policy" varchar,
  	"booking_mode" "enum_excursions_booking_mode" DEFAULT 'inquiry',
  	"booking_url" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "excursions_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"subtitle" varchar,
  	"overview" jsonb,
  	"price_note" varchar,
  	"season_note" varchar,
  	"cancellation_override" varchar,
  	"last_reviewed" timestamp(3) with time zone,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "excursions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"departures_id" integer,
  	"destinations_id" integer,
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  CREATE TABLE "destinations_best_months" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_destinations_best_months",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destinations_top_sights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"text" varchar,
  	"map_link" varchar
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"region_id" integer,
  	"days_recommended" numeric,
  	"lat" numeric,
  	"lng" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "destinations_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"tagline" varchar,
  	"how_to_get_there" varchar,
  	"nearest_airport" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "destinations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer
  );
  
  CREATE TABLE "guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"toc" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "guides_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"last_updated" timestamp(3) with time zone,
  	"author_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "guides_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"guide_topics_id" integer,
  	"destinations_id" integer,
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"lead" varchar,
  	"image_id" integer,
  	"show_stats" boolean DEFAULT true,
  	"draft" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_booking_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trust_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_destinations_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_trips_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"limit" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cruises_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_excursions_by_city" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_why_columns_icon" DEFAULT 'map-pin',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"draft" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_guides_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"draft" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"languages" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"draft" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_licence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_faq_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "pages_faq_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"hola_sample" boolean DEFAULT false,
  	"template" "enum_pages_template" DEFAULT 'default' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"available" boolean DEFAULT false,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"last_updated" timestamp(3) with time zone,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"departures_id" integer
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "durations_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "durations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"min_days" numeric,
  	"max_days" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "durations_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "trip_styles_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "trip_styles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trip_styles_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cruise_types_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "cruise_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cruise_types_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "departures_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "departures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"destination_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departures_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "regions_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "guide_topics_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "guide_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_id" integer,
  	"sort" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "guide_topics_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"h1" varchar,
  	"intro" varchar,
  	"seo_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"form" "enum_inquiries_form" DEFAULT 'plan_my_trip',
  	"length" varchar,
  	"date_mode" "enum_inquiries_date_mode",
  	"date_from" timestamp(3) with time zone,
  	"date_to" timestamp(3) with time zone,
  	"month" varchar,
  	"adults" numeric,
  	"children" numeric,
  	"children_ages" varchar,
  	"budget" varchar,
  	"hotel" varchar,
  	"group_type" varchar,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"whatsapp" varchar,
  	"channel" "enum_inquiries_channel",
  	"message" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"marketing" boolean DEFAULT false,
  	"lang" "enum_inquiries_lang" NOT NULL,
  	"page_url" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"gclid" varchar,
  	"fbclid" varchar,
  	"landing" varchar,
  	"tracked" boolean DEFAULT false,
  	"ip_hash" varchar,
  	"hola_sample" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_site_settings_social_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_trust_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_site_settings_trust_items_icon" DEFAULT 'languages',
  	"text" varchar NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_archive_intros_tours_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_archive_intros_cruises_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_archive_intros_excursions_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_archive_intros_destinations_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_archive_intros_guides_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_cancellation_policies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_cancellation_policies_locales" (
  	"name" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp_number" varchar,
  	"contact_email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"legal_name" varchar,
  	"licence_number" varchar,
  	"gtm_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"whatsapp_message_default" varchar,
  	"reply_hours" varchar,
  	"booking_band_enabled" boolean DEFAULT true,
  	"booking_band_badge" varchar,
  	"booking_band_title" varchar,
  	"booking_band_text" varchar,
  	"booking_band_primary_label" varchar,
  	"booking_band_secondary_label" varchar,
  	"archive_intros_tours_h1" varchar,
  	"archive_intros_tours_intro" varchar,
  	"archive_intros_tours_hero_id" integer,
  	"archive_intros_tours_seo_text" varchar,
  	"archive_intros_cruises_h1" varchar,
  	"archive_intros_cruises_intro" varchar,
  	"archive_intros_cruises_hero_id" integer,
  	"archive_intros_cruises_seo_text" varchar,
  	"archive_intros_excursions_h1" varchar,
  	"archive_intros_excursions_intro" varchar,
  	"archive_intros_excursions_hero_id" integer,
  	"archive_intros_excursions_seo_text" varchar,
  	"archive_intros_destinations_h1" varchar,
  	"archive_intros_destinations_intro" varchar,
  	"archive_intros_destinations_hero_id" integer,
  	"archive_intros_destinations_seo_text" varchar,
  	"archive_intros_guides_h1" varchar,
  	"archive_intros_guides_intro" varchar,
  	"archive_intros_guides_hero_id" integer,
  	"archive_intros_guides_seo_text" varchar,
  	"og_default_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_header_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"panel_extra" "enum_navigation_header_panel_extra" DEFAULT 'featured'
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"footer_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"tours_id" integer,
  	"cruises_id" integer,
  	"excursions_id" integer
  );
  
  ALTER TABLE "media" ADD COLUMN "hola_sample" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_tile_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_hero_mobile_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_gallery_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tours_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cruises_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "excursions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "destinations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guides_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "durations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "trip_styles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cruise_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "departures_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "guide_topics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  ALTER TABLE "tours_guide_languages" ADD CONSTRAINT "tours_guide_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_highlights" ADD CONSTRAINT "tours_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary_meals" ADD CONSTRAINT "tours_itinerary_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_itinerary" ADD CONSTRAINT "tours_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_includes" ADD CONSTRAINT "tours_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_excludes" ADD CONSTRAINT "tours_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_what_to_bring" ADD CONSTRAINT "tours_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_availability_days" ADD CONSTRAINT "tours_availability_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_faq" ADD CONSTRAINT "tours_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours" ADD CONSTRAINT "tours_duration_id_durations_id_fk" FOREIGN KEY ("duration_id") REFERENCES "public"."durations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tours_locales" ADD CONSTRAINT "tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_trip_styles_fk" FOREIGN KEY ("trip_styles_id") REFERENCES "public"."trip_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tours_rels" ADD CONSTRAINT "tours_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_start_dates" ADD CONSTRAINT "cruises_start_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_start_dates_locales" ADD CONSTRAINT "cruises_start_dates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises_start_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_cabins" ADD CONSTRAINT "cruises_cabins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_cabins_locales" ADD CONSTRAINT "cruises_cabins_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises_cabins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_ship_facilities" ADD CONSTRAINT "cruises_ship_facilities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_guide_languages" ADD CONSTRAINT "cruises_guide_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_highlights" ADD CONSTRAINT "cruises_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_itinerary_meals" ADD CONSTRAINT "cruises_itinerary_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_itinerary" ADD CONSTRAINT "cruises_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_includes" ADD CONSTRAINT "cruises_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_excludes" ADD CONSTRAINT "cruises_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_what_to_bring" ADD CONSTRAINT "cruises_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_availability_days" ADD CONSTRAINT "cruises_availability_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_faq" ADD CONSTRAINT "cruises_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises" ADD CONSTRAINT "cruises_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises" ADD CONSTRAINT "cruises_cruise_type_id_cruise_types_id_fk" FOREIGN KEY ("cruise_type_id") REFERENCES "public"."cruise_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises" ADD CONSTRAINT "cruises_embark_id_destinations_id_fk" FOREIGN KEY ("embark_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises" ADD CONSTRAINT "cruises_disembark_id_destinations_id_fk" FOREIGN KEY ("disembark_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises" ADD CONSTRAINT "cruises_deck_plan_id_media_id_fk" FOREIGN KEY ("deck_plan_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises_locales" ADD CONSTRAINT "cruises_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruises_locales" ADD CONSTRAINT "cruises_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_trip_styles_fk" FOREIGN KEY ("trip_styles_id") REFERENCES "public"."trip_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_start_times" ADD CONSTRAINT "excursions_start_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_start_times_locales" ADD CONSTRAINT "excursions_start_times_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions_start_times"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_pickup_areas" ADD CONSTRAINT "excursions_pickup_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_guide_languages" ADD CONSTRAINT "excursions_guide_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_highlights" ADD CONSTRAINT "excursions_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_itinerary_meals" ADD CONSTRAINT "excursions_itinerary_meals_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."excursions_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_itinerary" ADD CONSTRAINT "excursions_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_includes" ADD CONSTRAINT "excursions_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_excludes" ADD CONSTRAINT "excursions_excludes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_what_to_bring" ADD CONSTRAINT "excursions_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_availability_days" ADD CONSTRAINT "excursions_availability_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_faq" ADD CONSTRAINT "excursions_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions" ADD CONSTRAINT "excursions_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "excursions_locales" ADD CONSTRAINT "excursions_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "excursions_locales" ADD CONSTRAINT "excursions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_departures_fk" FOREIGN KEY ("departures_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "excursions_rels" ADD CONSTRAINT "excursions_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_best_months" ADD CONSTRAINT "destinations_best_months_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_top_sights" ADD CONSTRAINT "destinations_top_sights_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_top_sights" ADD CONSTRAINT "destinations_top_sights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_locales" ADD CONSTRAINT "guides_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guides_locales" ADD CONSTRAINT "guides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_guide_topics_fk" FOREIGN KEY ("guide_topics_id") REFERENCES "public"."guide_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides_rels" ADD CONSTRAINT "guides_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band" ADD CONSTRAINT "pages_blocks_booking_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trust_bar" ADD CONSTRAINT "pages_blocks_trust_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_destinations_grid" ADD CONSTRAINT "pages_blocks_destinations_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_trips_grid" ADD CONSTRAINT "pages_blocks_trips_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cruises_split" ADD CONSTRAINT "pages_blocks_cruises_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cruises_split" ADD CONSTRAINT "pages_blocks_cruises_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_excursions_by_city" ADD CONSTRAINT "pages_blocks_excursions_by_city_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_columns" ADD CONSTRAINT "pages_blocks_why_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why" ADD CONSTRAINT "pages_blocks_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_guides_grid" ADD CONSTRAINT "pages_blocks_guides_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_licence" ADD CONSTRAINT "pages_blocks_licence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_faq_groups_items" ADD CONSTRAINT "pages_faq_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_faq_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_faq_groups" ADD CONSTRAINT "pages_faq_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_departures_fk" FOREIGN KEY ("departures_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "durations_faq" ADD CONSTRAINT "durations_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."durations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "durations" ADD CONSTRAINT "durations_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "durations_locales" ADD CONSTRAINT "durations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."durations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trip_styles_faq" ADD CONSTRAINT "trip_styles_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trip_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trip_styles" ADD CONSTRAINT "trip_styles_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trip_styles_locales" ADD CONSTRAINT "trip_styles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trip_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruise_types_faq" ADD CONSTRAINT "cruise_types_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruise_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cruise_types" ADD CONSTRAINT "cruise_types_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cruise_types_locales" ADD CONSTRAINT "cruise_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cruise_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departures_faq" ADD CONSTRAINT "departures_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departures" ADD CONSTRAINT "departures_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departures" ADD CONSTRAINT "departures_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departures_locales" ADD CONSTRAINT "departures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions_faq" ADD CONSTRAINT "regions_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "regions" ADD CONSTRAINT "regions_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guide_topics_faq" ADD CONSTRAINT "guide_topics_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guide_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guide_topics" ADD CONSTRAINT "guide_topics_hero_id_media_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "guide_topics_locales" ADD CONSTRAINT "guide_topics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."guide_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_texts" ADD CONSTRAINT "inquiries_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_stats" ADD CONSTRAINT "site_settings_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_trust_items" ADD CONSTRAINT "site_settings_trust_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_archive_intros_tours_faq" ADD CONSTRAINT "site_settings_archive_intros_tours_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_archive_intros_cruises_faq" ADD CONSTRAINT "site_settings_archive_intros_cruises_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_archive_intros_excursions_faq" ADD CONSTRAINT "site_settings_archive_intros_excursions_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_archive_intros_destinations_faq" ADD CONSTRAINT "site_settings_archive_intros_destinations_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_archive_intros_guides_faq" ADD CONSTRAINT "site_settings_archive_intros_guides_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_cancellation_policies" ADD CONSTRAINT "site_settings_cancellation_policies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_cancellation_policies_locales" ADD CONSTRAINT "site_settings_cancellation_policies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_cancellation_policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_archive_intros_tours_hero_id_media_id_fk" FOREIGN KEY ("archive_intros_tours_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_archive_intros_cruises_hero_id_media_id_fk" FOREIGN KEY ("archive_intros_cruises_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_archive_intros_excursions_hero_id_media_id_fk" FOREIGN KEY ("archive_intros_excursions_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_archive_intros_destinations_hero_id_media_id_fk" FOREIGN KEY ("archive_intros_destinations_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_archive_intros_guides_hero_id_media_id_fk" FOREIGN KEY ("archive_intros_guides_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_og_default_id_media_id_fk" FOREIGN KEY ("og_default_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_columns_links" ADD CONSTRAINT "navigation_header_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_columns" ADD CONSTRAINT "navigation_header_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_legal_links" ADD CONSTRAINT "navigation_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tours_guide_languages_order_idx" ON "tours_guide_languages" USING btree ("order");
  CREATE INDEX "tours_guide_languages_parent_idx" ON "tours_guide_languages" USING btree ("parent_id");
  CREATE INDEX "tours_highlights_order_idx" ON "tours_highlights" USING btree ("_order");
  CREATE INDEX "tours_highlights_parent_id_idx" ON "tours_highlights" USING btree ("_parent_id");
  CREATE INDEX "tours_highlights_locale_idx" ON "tours_highlights" USING btree ("_locale");
  CREATE INDEX "tours_itinerary_meals_order_idx" ON "tours_itinerary_meals" USING btree ("order");
  CREATE INDEX "tours_itinerary_meals_parent_idx" ON "tours_itinerary_meals" USING btree ("parent_id");
  CREATE INDEX "tours_itinerary_meals_locale_idx" ON "tours_itinerary_meals" USING btree ("locale");
  CREATE INDEX "tours_itinerary_order_idx" ON "tours_itinerary" USING btree ("_order");
  CREATE INDEX "tours_itinerary_parent_id_idx" ON "tours_itinerary" USING btree ("_parent_id");
  CREATE INDEX "tours_itinerary_locale_idx" ON "tours_itinerary" USING btree ("_locale");
  CREATE INDEX "tours_includes_order_idx" ON "tours_includes" USING btree ("_order");
  CREATE INDEX "tours_includes_parent_id_idx" ON "tours_includes" USING btree ("_parent_id");
  CREATE INDEX "tours_includes_locale_idx" ON "tours_includes" USING btree ("_locale");
  CREATE INDEX "tours_excludes_order_idx" ON "tours_excludes" USING btree ("_order");
  CREATE INDEX "tours_excludes_parent_id_idx" ON "tours_excludes" USING btree ("_parent_id");
  CREATE INDEX "tours_excludes_locale_idx" ON "tours_excludes" USING btree ("_locale");
  CREATE INDEX "tours_what_to_bring_order_idx" ON "tours_what_to_bring" USING btree ("_order");
  CREATE INDEX "tours_what_to_bring_parent_id_idx" ON "tours_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "tours_what_to_bring_locale_idx" ON "tours_what_to_bring" USING btree ("_locale");
  CREATE INDEX "tours_availability_days_order_idx" ON "tours_availability_days" USING btree ("order");
  CREATE INDEX "tours_availability_days_parent_idx" ON "tours_availability_days" USING btree ("parent_id");
  CREATE INDEX "tours_faq_order_idx" ON "tours_faq" USING btree ("_order");
  CREATE INDEX "tours_faq_parent_id_idx" ON "tours_faq" USING btree ("_parent_id");
  CREATE INDEX "tours_faq_locale_idx" ON "tours_faq" USING btree ("_locale");
  CREATE INDEX "tours_featured_image_idx" ON "tours" USING btree ("featured_image_id");
  CREATE INDEX "tours_duration_idx" ON "tours" USING btree ("duration_id");
  CREATE INDEX "tours_updated_at_idx" ON "tours" USING btree ("updated_at");
  CREATE INDEX "tours_created_at_idx" ON "tours" USING btree ("created_at");
  CREATE UNIQUE INDEX "tours_slug_idx" ON "tours_locales" USING btree ("slug","_locale");
  CREATE INDEX "tours_seo_seo_og_image_idx" ON "tours_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "tours_locales_locale_parent_id_unique" ON "tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tours_locales_parent_id_idx" ON "tours_locales" USING btree ("_parent_id");
  CREATE INDEX "tours_rels_order_idx" ON "tours_rels" USING btree ("order");
  CREATE INDEX "tours_rels_parent_idx" ON "tours_rels" USING btree ("parent_id");
  CREATE INDEX "tours_rels_path_idx" ON "tours_rels" USING btree ("path");
  CREATE INDEX "tours_rels_locale_idx" ON "tours_rels" USING btree ("locale");
  CREATE INDEX "tours_rels_media_id_idx" ON "tours_rels" USING btree ("media_id","locale");
  CREATE INDEX "tours_rels_trip_styles_id_idx" ON "tours_rels" USING btree ("trip_styles_id","locale");
  CREATE INDEX "tours_rels_guides_id_idx" ON "tours_rels" USING btree ("guides_id","locale");
  CREATE INDEX "tours_rels_destinations_id_idx" ON "tours_rels" USING btree ("destinations_id","locale");
  CREATE INDEX "tours_rels_tours_id_idx" ON "tours_rels" USING btree ("tours_id","locale");
  CREATE INDEX "tours_rels_cruises_id_idx" ON "tours_rels" USING btree ("cruises_id","locale");
  CREATE INDEX "tours_rels_excursions_id_idx" ON "tours_rels" USING btree ("excursions_id","locale");
  CREATE INDEX "cruises_start_dates_order_idx" ON "cruises_start_dates" USING btree ("_order");
  CREATE INDEX "cruises_start_dates_parent_id_idx" ON "cruises_start_dates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cruises_start_dates_locales_locale_parent_id_unique" ON "cruises_start_dates_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cruises_start_dates_locales_parent_id_idx" ON "cruises_start_dates_locales" USING btree ("_parent_id");
  CREATE INDEX "cruises_cabins_order_idx" ON "cruises_cabins" USING btree ("_order");
  CREATE INDEX "cruises_cabins_parent_id_idx" ON "cruises_cabins" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cruises_cabins_locales_locale_parent_id_unique" ON "cruises_cabins_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cruises_cabins_locales_parent_id_idx" ON "cruises_cabins_locales" USING btree ("_parent_id");
  CREATE INDEX "cruises_ship_facilities_order_idx" ON "cruises_ship_facilities" USING btree ("order");
  CREATE INDEX "cruises_ship_facilities_parent_idx" ON "cruises_ship_facilities" USING btree ("parent_id");
  CREATE INDEX "cruises_guide_languages_order_idx" ON "cruises_guide_languages" USING btree ("order");
  CREATE INDEX "cruises_guide_languages_parent_idx" ON "cruises_guide_languages" USING btree ("parent_id");
  CREATE INDEX "cruises_highlights_order_idx" ON "cruises_highlights" USING btree ("_order");
  CREATE INDEX "cruises_highlights_parent_id_idx" ON "cruises_highlights" USING btree ("_parent_id");
  CREATE INDEX "cruises_highlights_locale_idx" ON "cruises_highlights" USING btree ("_locale");
  CREATE INDEX "cruises_itinerary_meals_order_idx" ON "cruises_itinerary_meals" USING btree ("order");
  CREATE INDEX "cruises_itinerary_meals_parent_idx" ON "cruises_itinerary_meals" USING btree ("parent_id");
  CREATE INDEX "cruises_itinerary_meals_locale_idx" ON "cruises_itinerary_meals" USING btree ("locale");
  CREATE INDEX "cruises_itinerary_order_idx" ON "cruises_itinerary" USING btree ("_order");
  CREATE INDEX "cruises_itinerary_parent_id_idx" ON "cruises_itinerary" USING btree ("_parent_id");
  CREATE INDEX "cruises_itinerary_locale_idx" ON "cruises_itinerary" USING btree ("_locale");
  CREATE INDEX "cruises_includes_order_idx" ON "cruises_includes" USING btree ("_order");
  CREATE INDEX "cruises_includes_parent_id_idx" ON "cruises_includes" USING btree ("_parent_id");
  CREATE INDEX "cruises_includes_locale_idx" ON "cruises_includes" USING btree ("_locale");
  CREATE INDEX "cruises_excludes_order_idx" ON "cruises_excludes" USING btree ("_order");
  CREATE INDEX "cruises_excludes_parent_id_idx" ON "cruises_excludes" USING btree ("_parent_id");
  CREATE INDEX "cruises_excludes_locale_idx" ON "cruises_excludes" USING btree ("_locale");
  CREATE INDEX "cruises_what_to_bring_order_idx" ON "cruises_what_to_bring" USING btree ("_order");
  CREATE INDEX "cruises_what_to_bring_parent_id_idx" ON "cruises_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "cruises_what_to_bring_locale_idx" ON "cruises_what_to_bring" USING btree ("_locale");
  CREATE INDEX "cruises_availability_days_order_idx" ON "cruises_availability_days" USING btree ("order");
  CREATE INDEX "cruises_availability_days_parent_idx" ON "cruises_availability_days" USING btree ("parent_id");
  CREATE INDEX "cruises_faq_order_idx" ON "cruises_faq" USING btree ("_order");
  CREATE INDEX "cruises_faq_parent_id_idx" ON "cruises_faq" USING btree ("_parent_id");
  CREATE INDEX "cruises_faq_locale_idx" ON "cruises_faq" USING btree ("_locale");
  CREATE INDEX "cruises_featured_image_idx" ON "cruises" USING btree ("featured_image_id");
  CREATE INDEX "cruises_cruise_type_idx" ON "cruises" USING btree ("cruise_type_id");
  CREATE INDEX "cruises_embark_idx" ON "cruises" USING btree ("embark_id");
  CREATE INDEX "cruises_disembark_idx" ON "cruises" USING btree ("disembark_id");
  CREATE INDEX "cruises_deck_plan_idx" ON "cruises" USING btree ("deck_plan_id");
  CREATE INDEX "cruises_updated_at_idx" ON "cruises" USING btree ("updated_at");
  CREATE INDEX "cruises_created_at_idx" ON "cruises" USING btree ("created_at");
  CREATE UNIQUE INDEX "cruises_slug_idx" ON "cruises_locales" USING btree ("slug","_locale");
  CREATE INDEX "cruises_seo_seo_og_image_idx" ON "cruises_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "cruises_locales_locale_parent_id_unique" ON "cruises_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cruises_locales_parent_id_idx" ON "cruises_locales" USING btree ("_parent_id");
  CREATE INDEX "cruises_rels_order_idx" ON "cruises_rels" USING btree ("order");
  CREATE INDEX "cruises_rels_parent_idx" ON "cruises_rels" USING btree ("parent_id");
  CREATE INDEX "cruises_rels_path_idx" ON "cruises_rels" USING btree ("path");
  CREATE INDEX "cruises_rels_locale_idx" ON "cruises_rels" USING btree ("locale");
  CREATE INDEX "cruises_rels_media_id_idx" ON "cruises_rels" USING btree ("media_id","locale");
  CREATE INDEX "cruises_rels_trip_styles_id_idx" ON "cruises_rels" USING btree ("trip_styles_id","locale");
  CREATE INDEX "cruises_rels_destinations_id_idx" ON "cruises_rels" USING btree ("destinations_id","locale");
  CREATE INDEX "cruises_rels_tours_id_idx" ON "cruises_rels" USING btree ("tours_id","locale");
  CREATE INDEX "cruises_rels_cruises_id_idx" ON "cruises_rels" USING btree ("cruises_id","locale");
  CREATE INDEX "cruises_rels_excursions_id_idx" ON "cruises_rels" USING btree ("excursions_id","locale");
  CREATE INDEX "excursions_start_times_order_idx" ON "excursions_start_times" USING btree ("_order");
  CREATE INDEX "excursions_start_times_parent_id_idx" ON "excursions_start_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "excursions_start_times_locales_locale_parent_id_unique" ON "excursions_start_times_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "excursions_start_times_locales_parent_id_idx" ON "excursions_start_times_locales" USING btree ("_parent_id");
  CREATE INDEX "excursions_pickup_areas_order_idx" ON "excursions_pickup_areas" USING btree ("_order");
  CREATE INDEX "excursions_pickup_areas_parent_id_idx" ON "excursions_pickup_areas" USING btree ("_parent_id");
  CREATE INDEX "excursions_pickup_areas_locale_idx" ON "excursions_pickup_areas" USING btree ("_locale");
  CREATE INDEX "excursions_guide_languages_order_idx" ON "excursions_guide_languages" USING btree ("order");
  CREATE INDEX "excursions_guide_languages_parent_idx" ON "excursions_guide_languages" USING btree ("parent_id");
  CREATE INDEX "excursions_highlights_order_idx" ON "excursions_highlights" USING btree ("_order");
  CREATE INDEX "excursions_highlights_parent_id_idx" ON "excursions_highlights" USING btree ("_parent_id");
  CREATE INDEX "excursions_highlights_locale_idx" ON "excursions_highlights" USING btree ("_locale");
  CREATE INDEX "excursions_itinerary_meals_order_idx" ON "excursions_itinerary_meals" USING btree ("order");
  CREATE INDEX "excursions_itinerary_meals_parent_idx" ON "excursions_itinerary_meals" USING btree ("parent_id");
  CREATE INDEX "excursions_itinerary_meals_locale_idx" ON "excursions_itinerary_meals" USING btree ("locale");
  CREATE INDEX "excursions_itinerary_order_idx" ON "excursions_itinerary" USING btree ("_order");
  CREATE INDEX "excursions_itinerary_parent_id_idx" ON "excursions_itinerary" USING btree ("_parent_id");
  CREATE INDEX "excursions_itinerary_locale_idx" ON "excursions_itinerary" USING btree ("_locale");
  CREATE INDEX "excursions_includes_order_idx" ON "excursions_includes" USING btree ("_order");
  CREATE INDEX "excursions_includes_parent_id_idx" ON "excursions_includes" USING btree ("_parent_id");
  CREATE INDEX "excursions_includes_locale_idx" ON "excursions_includes" USING btree ("_locale");
  CREATE INDEX "excursions_excludes_order_idx" ON "excursions_excludes" USING btree ("_order");
  CREATE INDEX "excursions_excludes_parent_id_idx" ON "excursions_excludes" USING btree ("_parent_id");
  CREATE INDEX "excursions_excludes_locale_idx" ON "excursions_excludes" USING btree ("_locale");
  CREATE INDEX "excursions_what_to_bring_order_idx" ON "excursions_what_to_bring" USING btree ("_order");
  CREATE INDEX "excursions_what_to_bring_parent_id_idx" ON "excursions_what_to_bring" USING btree ("_parent_id");
  CREATE INDEX "excursions_what_to_bring_locale_idx" ON "excursions_what_to_bring" USING btree ("_locale");
  CREATE INDEX "excursions_availability_days_order_idx" ON "excursions_availability_days" USING btree ("order");
  CREATE INDEX "excursions_availability_days_parent_idx" ON "excursions_availability_days" USING btree ("parent_id");
  CREATE INDEX "excursions_faq_order_idx" ON "excursions_faq" USING btree ("_order");
  CREATE INDEX "excursions_faq_parent_id_idx" ON "excursions_faq" USING btree ("_parent_id");
  CREATE INDEX "excursions_faq_locale_idx" ON "excursions_faq" USING btree ("_locale");
  CREATE INDEX "excursions_featured_image_idx" ON "excursions" USING btree ("featured_image_id");
  CREATE INDEX "excursions_updated_at_idx" ON "excursions" USING btree ("updated_at");
  CREATE INDEX "excursions_created_at_idx" ON "excursions" USING btree ("created_at");
  CREATE UNIQUE INDEX "excursions_slug_idx" ON "excursions_locales" USING btree ("slug","_locale");
  CREATE INDEX "excursions_seo_seo_og_image_idx" ON "excursions_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "excursions_locales_locale_parent_id_unique" ON "excursions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "excursions_locales_parent_id_idx" ON "excursions_locales" USING btree ("_parent_id");
  CREATE INDEX "excursions_rels_order_idx" ON "excursions_rels" USING btree ("order");
  CREATE INDEX "excursions_rels_parent_idx" ON "excursions_rels" USING btree ("parent_id");
  CREATE INDEX "excursions_rels_path_idx" ON "excursions_rels" USING btree ("path");
  CREATE INDEX "excursions_rels_locale_idx" ON "excursions_rels" USING btree ("locale");
  CREATE INDEX "excursions_rels_media_id_idx" ON "excursions_rels" USING btree ("media_id","locale");
  CREATE INDEX "excursions_rels_departures_id_idx" ON "excursions_rels" USING btree ("departures_id","locale");
  CREATE INDEX "excursions_rels_destinations_id_idx" ON "excursions_rels" USING btree ("destinations_id","locale");
  CREATE INDEX "excursions_rels_tours_id_idx" ON "excursions_rels" USING btree ("tours_id","locale");
  CREATE INDEX "excursions_rels_cruises_id_idx" ON "excursions_rels" USING btree ("cruises_id","locale");
  CREATE INDEX "excursions_rels_excursions_id_idx" ON "excursions_rels" USING btree ("excursions_id","locale");
  CREATE INDEX "destinations_best_months_order_idx" ON "destinations_best_months" USING btree ("order");
  CREATE INDEX "destinations_best_months_parent_idx" ON "destinations_best_months" USING btree ("parent_id");
  CREATE INDEX "destinations_top_sights_order_idx" ON "destinations_top_sights" USING btree ("_order");
  CREATE INDEX "destinations_top_sights_parent_id_idx" ON "destinations_top_sights" USING btree ("_parent_id");
  CREATE INDEX "destinations_top_sights_locale_idx" ON "destinations_top_sights" USING btree ("_locale");
  CREATE INDEX "destinations_top_sights_image_idx" ON "destinations_top_sights" USING btree ("image_id");
  CREATE INDEX "destinations_featured_image_idx" ON "destinations" USING btree ("featured_image_id");
  CREATE INDEX "destinations_region_idx" ON "destinations" USING btree ("region_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations_locales" USING btree ("slug","_locale");
  CREATE INDEX "destinations_seo_seo_og_image_idx" ON "destinations_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "destinations_locales_locale_parent_id_unique" ON "destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "destinations_locales_parent_id_idx" ON "destinations_locales" USING btree ("_parent_id");
  CREATE INDEX "destinations_rels_order_idx" ON "destinations_rels" USING btree ("order");
  CREATE INDEX "destinations_rels_parent_idx" ON "destinations_rels" USING btree ("parent_id");
  CREATE INDEX "destinations_rels_path_idx" ON "destinations_rels" USING btree ("path");
  CREATE INDEX "destinations_rels_destinations_id_idx" ON "destinations_rels" USING btree ("destinations_id");
  CREATE INDEX "guides_featured_image_idx" ON "guides" USING btree ("featured_image_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides_locales" USING btree ("slug","_locale");
  CREATE INDEX "guides_seo_seo_og_image_idx" ON "guides_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "guides_locales_locale_parent_id_unique" ON "guides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "guides_locales_parent_id_idx" ON "guides_locales" USING btree ("_parent_id");
  CREATE INDEX "guides_rels_order_idx" ON "guides_rels" USING btree ("order");
  CREATE INDEX "guides_rels_parent_idx" ON "guides_rels" USING btree ("parent_id");
  CREATE INDEX "guides_rels_path_idx" ON "guides_rels" USING btree ("path");
  CREATE INDEX "guides_rels_guide_topics_id_idx" ON "guides_rels" USING btree ("guide_topics_id");
  CREATE INDEX "guides_rels_destinations_id_idx" ON "guides_rels" USING btree ("destinations_id");
  CREATE INDEX "guides_rels_tours_id_idx" ON "guides_rels" USING btree ("tours_id");
  CREATE INDEX "guides_rels_cruises_id_idx" ON "guides_rels" USING btree ("cruises_id");
  CREATE INDEX "guides_rels_excursions_id_idx" ON "guides_rels" USING btree ("excursions_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_booking_band_order_idx" ON "pages_blocks_booking_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_band_parent_id_idx" ON "pages_blocks_booking_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_band_path_idx" ON "pages_blocks_booking_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_band_locale_idx" ON "pages_blocks_booking_band" USING btree ("_locale");
  CREATE INDEX "pages_blocks_trust_bar_order_idx" ON "pages_blocks_trust_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_trust_bar_parent_id_idx" ON "pages_blocks_trust_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trust_bar_path_idx" ON "pages_blocks_trust_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_trust_bar_locale_idx" ON "pages_blocks_trust_bar" USING btree ("_locale");
  CREATE INDEX "pages_blocks_destinations_grid_order_idx" ON "pages_blocks_destinations_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_destinations_grid_parent_id_idx" ON "pages_blocks_destinations_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_destinations_grid_path_idx" ON "pages_blocks_destinations_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_destinations_grid_locale_idx" ON "pages_blocks_destinations_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_trips_grid_order_idx" ON "pages_blocks_trips_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_trips_grid_parent_id_idx" ON "pages_blocks_trips_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_trips_grid_path_idx" ON "pages_blocks_trips_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_trips_grid_locale_idx" ON "pages_blocks_trips_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cruises_split_order_idx" ON "pages_blocks_cruises_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_cruises_split_parent_id_idx" ON "pages_blocks_cruises_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cruises_split_path_idx" ON "pages_blocks_cruises_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_cruises_split_locale_idx" ON "pages_blocks_cruises_split" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cruises_split_image_idx" ON "pages_blocks_cruises_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_excursions_by_city_order_idx" ON "pages_blocks_excursions_by_city" USING btree ("_order");
  CREATE INDEX "pages_blocks_excursions_by_city_parent_id_idx" ON "pages_blocks_excursions_by_city" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_excursions_by_city_path_idx" ON "pages_blocks_excursions_by_city" USING btree ("_path");
  CREATE INDEX "pages_blocks_excursions_by_city_locale_idx" ON "pages_blocks_excursions_by_city" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_columns_order_idx" ON "pages_blocks_why_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_columns_parent_id_idx" ON "pages_blocks_why_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_columns_locale_idx" ON "pages_blocks_why_columns" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_order_idx" ON "pages_blocks_why" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_parent_id_idx" ON "pages_blocks_why" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_path_idx" ON "pages_blocks_why" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_locale_idx" ON "pages_blocks_why" USING btree ("_locale");
  CREATE INDEX "pages_blocks_guides_grid_order_idx" ON "pages_blocks_guides_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_guides_grid_parent_id_idx" ON "pages_blocks_guides_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_guides_grid_path_idx" ON "pages_blocks_guides_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_guides_grid_locale_idx" ON "pages_blocks_guides_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_locale_idx" ON "pages_blocks_cta_band" USING btree ("_locale");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_locale_idx" ON "pages_blocks_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_team_members_order_idx" ON "pages_blocks_team_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_members_parent_id_idx" ON "pages_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_members_locale_idx" ON "pages_blocks_team_members" USING btree ("_locale");
  CREATE INDEX "pages_blocks_team_members_photo_idx" ON "pages_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_locale_idx" ON "pages_blocks_team" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_items_locale_idx" ON "pages_blocks_steps_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_locale_idx" ON "pages_blocks_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_licence_order_idx" ON "pages_blocks_licence" USING btree ("_order");
  CREATE INDEX "pages_blocks_licence_parent_id_idx" ON "pages_blocks_licence" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_licence_path_idx" ON "pages_blocks_licence" USING btree ("_path");
  CREATE INDEX "pages_blocks_licence_locale_idx" ON "pages_blocks_licence" USING btree ("_locale");
  CREATE INDEX "pages_faq_groups_items_order_idx" ON "pages_faq_groups_items" USING btree ("_order");
  CREATE INDEX "pages_faq_groups_items_parent_id_idx" ON "pages_faq_groups_items" USING btree ("_parent_id");
  CREATE INDEX "pages_faq_groups_items_locale_idx" ON "pages_faq_groups_items" USING btree ("_locale");
  CREATE INDEX "pages_faq_groups_order_idx" ON "pages_faq_groups" USING btree ("_order");
  CREATE INDEX "pages_faq_groups_parent_id_idx" ON "pages_faq_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_faq_groups_locale_idx" ON "pages_faq_groups" USING btree ("_locale");
  CREATE INDEX "pages_featured_image_idx" ON "pages" USING btree ("featured_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages_locales" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_departures_id_idx" ON "pages_rels" USING btree ("departures_id","locale");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "durations_faq_order_idx" ON "durations_faq" USING btree ("_order");
  CREATE INDEX "durations_faq_parent_id_idx" ON "durations_faq" USING btree ("_parent_id");
  CREATE INDEX "durations_faq_locale_idx" ON "durations_faq" USING btree ("_locale");
  CREATE INDEX "durations_hero_idx" ON "durations" USING btree ("hero_id");
  CREATE INDEX "durations_updated_at_idx" ON "durations" USING btree ("updated_at");
  CREATE INDEX "durations_created_at_idx" ON "durations" USING btree ("created_at");
  CREATE UNIQUE INDEX "durations_slug_idx" ON "durations_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "durations_locales_locale_parent_id_unique" ON "durations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "durations_locales_parent_id_idx" ON "durations_locales" USING btree ("_parent_id");
  CREATE INDEX "trip_styles_faq_order_idx" ON "trip_styles_faq" USING btree ("_order");
  CREATE INDEX "trip_styles_faq_parent_id_idx" ON "trip_styles_faq" USING btree ("_parent_id");
  CREATE INDEX "trip_styles_faq_locale_idx" ON "trip_styles_faq" USING btree ("_locale");
  CREATE INDEX "trip_styles_hero_idx" ON "trip_styles" USING btree ("hero_id");
  CREATE INDEX "trip_styles_updated_at_idx" ON "trip_styles" USING btree ("updated_at");
  CREATE INDEX "trip_styles_created_at_idx" ON "trip_styles" USING btree ("created_at");
  CREATE UNIQUE INDEX "trip_styles_slug_idx" ON "trip_styles_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "trip_styles_locales_locale_parent_id_unique" ON "trip_styles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "trip_styles_locales_parent_id_idx" ON "trip_styles_locales" USING btree ("_parent_id");
  CREATE INDEX "cruise_types_faq_order_idx" ON "cruise_types_faq" USING btree ("_order");
  CREATE INDEX "cruise_types_faq_parent_id_idx" ON "cruise_types_faq" USING btree ("_parent_id");
  CREATE INDEX "cruise_types_faq_locale_idx" ON "cruise_types_faq" USING btree ("_locale");
  CREATE INDEX "cruise_types_hero_idx" ON "cruise_types" USING btree ("hero_id");
  CREATE INDEX "cruise_types_updated_at_idx" ON "cruise_types" USING btree ("updated_at");
  CREATE INDEX "cruise_types_created_at_idx" ON "cruise_types" USING btree ("created_at");
  CREATE UNIQUE INDEX "cruise_types_slug_idx" ON "cruise_types_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "cruise_types_locales_locale_parent_id_unique" ON "cruise_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cruise_types_locales_parent_id_idx" ON "cruise_types_locales" USING btree ("_parent_id");
  CREATE INDEX "departures_faq_order_idx" ON "departures_faq" USING btree ("_order");
  CREATE INDEX "departures_faq_parent_id_idx" ON "departures_faq" USING btree ("_parent_id");
  CREATE INDEX "departures_faq_locale_idx" ON "departures_faq" USING btree ("_locale");
  CREATE INDEX "departures_hero_idx" ON "departures" USING btree ("hero_id");
  CREATE INDEX "departures_destination_idx" ON "departures" USING btree ("destination_id");
  CREATE INDEX "departures_updated_at_idx" ON "departures" USING btree ("updated_at");
  CREATE INDEX "departures_created_at_idx" ON "departures" USING btree ("created_at");
  CREATE UNIQUE INDEX "departures_slug_idx" ON "departures_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "departures_locales_locale_parent_id_unique" ON "departures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "departures_locales_parent_id_idx" ON "departures_locales" USING btree ("_parent_id");
  CREATE INDEX "regions_faq_order_idx" ON "regions_faq" USING btree ("_order");
  CREATE INDEX "regions_faq_parent_id_idx" ON "regions_faq" USING btree ("_parent_id");
  CREATE INDEX "regions_faq_locale_idx" ON "regions_faq" USING btree ("_locale");
  CREATE INDEX "regions_hero_idx" ON "regions" USING btree ("hero_id");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "regions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "regions_locales_parent_id_idx" ON "regions_locales" USING btree ("_parent_id");
  CREATE INDEX "guide_topics_faq_order_idx" ON "guide_topics_faq" USING btree ("_order");
  CREATE INDEX "guide_topics_faq_parent_id_idx" ON "guide_topics_faq" USING btree ("_parent_id");
  CREATE INDEX "guide_topics_faq_locale_idx" ON "guide_topics_faq" USING btree ("_locale");
  CREATE INDEX "guide_topics_hero_idx" ON "guide_topics" USING btree ("hero_id");
  CREATE INDEX "guide_topics_updated_at_idx" ON "guide_topics" USING btree ("updated_at");
  CREATE INDEX "guide_topics_created_at_idx" ON "guide_topics" USING btree ("created_at");
  CREATE UNIQUE INDEX "guide_topics_slug_idx" ON "guide_topics_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "guide_topics_locales_locale_parent_id_unique" ON "guide_topics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "guide_topics_locales_parent_id_idx" ON "guide_topics_locales" USING btree ("_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_texts_order_parent" ON "inquiries_texts" USING btree ("order","parent_id");
  CREATE INDEX "inquiries_rels_order_idx" ON "inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_tours_id_idx" ON "inquiries_rels" USING btree ("tours_id");
  CREATE INDEX "inquiries_rels_cruises_id_idx" ON "inquiries_rels" USING btree ("cruises_id");
  CREATE INDEX "inquiries_rels_excursions_id_idx" ON "inquiries_rels" USING btree ("excursions_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_order_idx" ON "site_settings_stats" USING btree ("_order");
  CREATE INDEX "site_settings_stats_parent_id_idx" ON "site_settings_stats" USING btree ("_parent_id");
  CREATE INDEX "site_settings_stats_locale_idx" ON "site_settings_stats" USING btree ("_locale");
  CREATE INDEX "site_settings_trust_items_order_idx" ON "site_settings_trust_items" USING btree ("_order");
  CREATE INDEX "site_settings_trust_items_parent_id_idx" ON "site_settings_trust_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_trust_items_locale_idx" ON "site_settings_trust_items" USING btree ("_locale");
  CREATE INDEX "site_settings_archive_intros_tours_faq_order_idx" ON "site_settings_archive_intros_tours_faq" USING btree ("_order");
  CREATE INDEX "site_settings_archive_intros_tours_faq_parent_id_idx" ON "site_settings_archive_intros_tours_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_tours_faq_locale_idx" ON "site_settings_archive_intros_tours_faq" USING btree ("_locale");
  CREATE INDEX "site_settings_archive_intros_cruises_faq_order_idx" ON "site_settings_archive_intros_cruises_faq" USING btree ("_order");
  CREATE INDEX "site_settings_archive_intros_cruises_faq_parent_id_idx" ON "site_settings_archive_intros_cruises_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_cruises_faq_locale_idx" ON "site_settings_archive_intros_cruises_faq" USING btree ("_locale");
  CREATE INDEX "site_settings_archive_intros_excursions_faq_order_idx" ON "site_settings_archive_intros_excursions_faq" USING btree ("_order");
  CREATE INDEX "site_settings_archive_intros_excursions_faq_parent_id_idx" ON "site_settings_archive_intros_excursions_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_excursions_faq_locale_idx" ON "site_settings_archive_intros_excursions_faq" USING btree ("_locale");
  CREATE INDEX "site_settings_archive_intros_destinations_faq_order_idx" ON "site_settings_archive_intros_destinations_faq" USING btree ("_order");
  CREATE INDEX "site_settings_archive_intros_destinations_faq_parent_id_idx" ON "site_settings_archive_intros_destinations_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_destinations_faq_locale_idx" ON "site_settings_archive_intros_destinations_faq" USING btree ("_locale");
  CREATE INDEX "site_settings_archive_intros_guides_faq_order_idx" ON "site_settings_archive_intros_guides_faq" USING btree ("_order");
  CREATE INDEX "site_settings_archive_intros_guides_faq_parent_id_idx" ON "site_settings_archive_intros_guides_faq" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_guides_faq_locale_idx" ON "site_settings_archive_intros_guides_faq" USING btree ("_locale");
  CREATE INDEX "site_settings_cancellation_policies_order_idx" ON "site_settings_cancellation_policies" USING btree ("_order");
  CREATE INDEX "site_settings_cancellation_policies_parent_id_idx" ON "site_settings_cancellation_policies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_cancellation_policies_locales_locale_parent_id" ON "site_settings_cancellation_policies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_cancellation_policies_locales_parent_id_idx" ON "site_settings_cancellation_policies_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_archive_intros_tours_archive_intros_tours__idx" ON "site_settings_locales" USING btree ("archive_intros_tours_hero_id");
  CREATE INDEX "site_settings_archive_intros_cruises_archive_intros_crui_idx" ON "site_settings_locales" USING btree ("archive_intros_cruises_hero_id");
  CREATE INDEX "site_settings_archive_intros_excursions_archive_intros_e_idx" ON "site_settings_locales" USING btree ("archive_intros_excursions_hero_id");
  CREATE INDEX "site_settings_archive_intros_destinations_archive_intros_idx" ON "site_settings_locales" USING btree ("archive_intros_destinations_hero_id");
  CREATE INDEX "site_settings_archive_intros_guides_archive_intros_guide_idx" ON "site_settings_locales" USING btree ("archive_intros_guides_hero_id");
  CREATE INDEX "site_settings_og_default_idx" ON "site_settings_locales" USING btree ("og_default_id","_locale");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_columns_links_order_idx" ON "navigation_header_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_header_columns_links_parent_id_idx" ON "navigation_header_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_columns_links_locale_idx" ON "navigation_header_columns_links" USING btree ("_locale");
  CREATE INDEX "navigation_header_columns_order_idx" ON "navigation_header_columns" USING btree ("_order");
  CREATE INDEX "navigation_header_columns_parent_id_idx" ON "navigation_header_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_columns_locale_idx" ON "navigation_header_columns" USING btree ("_locale");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_locale_idx" ON "navigation_header" USING btree ("_locale");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_locale_idx" ON "navigation_footer_columns_links" USING btree ("_locale");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_locale_idx" ON "navigation_footer_columns" USING btree ("_locale");
  CREATE INDEX "navigation_legal_links_order_idx" ON "navigation_legal_links" USING btree ("_order");
  CREATE INDEX "navigation_legal_links_parent_id_idx" ON "navigation_legal_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_legal_links_locale_idx" ON "navigation_legal_links" USING btree ("_locale");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_locales_parent_id_idx" ON "navigation_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_locale_idx" ON "navigation_rels" USING btree ("locale");
  CREATE INDEX "navigation_rels_tours_id_idx" ON "navigation_rels" USING btree ("tours_id","locale");
  CREATE INDEX "navigation_rels_cruises_id_idx" ON "navigation_rels" USING btree ("cruises_id","locale");
  CREATE INDEX "navigation_rels_excursions_id_idx" ON "navigation_rels" USING btree ("excursions_id","locale");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tours_fk" FOREIGN KEY ("tours_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_excursions_fk" FOREIGN KEY ("excursions_id") REFERENCES "public"."excursions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_durations_fk" FOREIGN KEY ("durations_id") REFERENCES "public"."durations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trip_styles_fk" FOREIGN KEY ("trip_styles_id") REFERENCES "public"."trip_styles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cruise_types_fk" FOREIGN KEY ("cruise_types_id") REFERENCES "public"."cruise_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departures_fk" FOREIGN KEY ("departures_id") REFERENCES "public"."departures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guide_topics_fk" FOREIGN KEY ("guide_topics_id") REFERENCES "public"."guide_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tile_sizes_tile_filename_idx" ON "media" USING btree ("sizes_tile_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_hero_mobile_sizes_hero_mobile_filename_idx" ON "media" USING btree ("sizes_hero_mobile_filename");
  CREATE INDEX "media_sizes_gallery_sizes_gallery_filename_idx" ON "media" USING btree ("sizes_gallery_filename");
  CREATE INDEX "payload_locked_documents_rels_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("tours_id");
  CREATE INDEX "payload_locked_documents_rels_cruises_id_idx" ON "payload_locked_documents_rels" USING btree ("cruises_id");
  CREATE INDEX "payload_locked_documents_rels_excursions_id_idx" ON "payload_locked_documents_rels" USING btree ("excursions_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_durations_id_idx" ON "payload_locked_documents_rels" USING btree ("durations_id");
  CREATE INDEX "payload_locked_documents_rels_trip_styles_id_idx" ON "payload_locked_documents_rels" USING btree ("trip_styles_id");
  CREATE INDEX "payload_locked_documents_rels_cruise_types_id_idx" ON "payload_locked_documents_rels" USING btree ("cruise_types_id");
  CREATE INDEX "payload_locked_documents_rels_departures_id_idx" ON "payload_locked_documents_rels" USING btree ("departures_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_guide_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("guide_topics_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  ALTER TABLE "media" DROP COLUMN "alt";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tours_guide_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_itinerary_meals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_itinerary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_excludes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_what_to_bring" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_availability_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tours_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_start_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_start_dates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_cabins" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_cabins_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_ship_facilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_guide_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_itinerary_meals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_itinerary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_excludes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_what_to_bring" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_availability_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_start_times" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_start_times_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_pickup_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_guide_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_itinerary_meals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_itinerary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_excludes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_what_to_bring" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_availability_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "excursions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_best_months" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_top_sights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guides_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_band" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_trust_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_destinations_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_trips_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cruises_split" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_excursions_by_city" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_why_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_why" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_guides_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_band" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_licence" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_faq_groups_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_faq_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "durations_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "durations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "durations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trip_styles_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trip_styles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "trip_styles_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruise_types_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruise_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruise_types_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departures_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departures_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regions_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "regions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guide_topics_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guide_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "guide_topics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inquiries_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inquiries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_trust_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_archive_intros_tours_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_archive_intros_cruises_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_archive_intros_excursions_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_archive_intros_destinations_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_archive_intros_guides_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_cancellation_policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_cancellation_policies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tours_guide_languages" CASCADE;
  DROP TABLE "tours_highlights" CASCADE;
  DROP TABLE "tours_itinerary_meals" CASCADE;
  DROP TABLE "tours_itinerary" CASCADE;
  DROP TABLE "tours_includes" CASCADE;
  DROP TABLE "tours_excludes" CASCADE;
  DROP TABLE "tours_what_to_bring" CASCADE;
  DROP TABLE "tours_availability_days" CASCADE;
  DROP TABLE "tours_faq" CASCADE;
  DROP TABLE "tours" CASCADE;
  DROP TABLE "tours_locales" CASCADE;
  DROP TABLE "tours_rels" CASCADE;
  DROP TABLE "cruises_start_dates" CASCADE;
  DROP TABLE "cruises_start_dates_locales" CASCADE;
  DROP TABLE "cruises_cabins" CASCADE;
  DROP TABLE "cruises_cabins_locales" CASCADE;
  DROP TABLE "cruises_ship_facilities" CASCADE;
  DROP TABLE "cruises_guide_languages" CASCADE;
  DROP TABLE "cruises_highlights" CASCADE;
  DROP TABLE "cruises_itinerary_meals" CASCADE;
  DROP TABLE "cruises_itinerary" CASCADE;
  DROP TABLE "cruises_includes" CASCADE;
  DROP TABLE "cruises_excludes" CASCADE;
  DROP TABLE "cruises_what_to_bring" CASCADE;
  DROP TABLE "cruises_availability_days" CASCADE;
  DROP TABLE "cruises_faq" CASCADE;
  DROP TABLE "cruises" CASCADE;
  DROP TABLE "cruises_locales" CASCADE;
  DROP TABLE "cruises_rels" CASCADE;
  DROP TABLE "excursions_start_times" CASCADE;
  DROP TABLE "excursions_start_times_locales" CASCADE;
  DROP TABLE "excursions_pickup_areas" CASCADE;
  DROP TABLE "excursions_guide_languages" CASCADE;
  DROP TABLE "excursions_highlights" CASCADE;
  DROP TABLE "excursions_itinerary_meals" CASCADE;
  DROP TABLE "excursions_itinerary" CASCADE;
  DROP TABLE "excursions_includes" CASCADE;
  DROP TABLE "excursions_excludes" CASCADE;
  DROP TABLE "excursions_what_to_bring" CASCADE;
  DROP TABLE "excursions_availability_days" CASCADE;
  DROP TABLE "excursions_faq" CASCADE;
  DROP TABLE "excursions" CASCADE;
  DROP TABLE "excursions_locales" CASCADE;
  DROP TABLE "excursions_rels" CASCADE;
  DROP TABLE "destinations_best_months" CASCADE;
  DROP TABLE "destinations_top_sights" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_locales" CASCADE;
  DROP TABLE "destinations_rels" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "guides_locales" CASCADE;
  DROP TABLE "guides_rels" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_booking_band" CASCADE;
  DROP TABLE "pages_blocks_trust_bar" CASCADE;
  DROP TABLE "pages_blocks_destinations_grid" CASCADE;
  DROP TABLE "pages_blocks_trips_grid" CASCADE;
  DROP TABLE "pages_blocks_cruises_split" CASCADE;
  DROP TABLE "pages_blocks_excursions_by_city" CASCADE;
  DROP TABLE "pages_blocks_why_columns" CASCADE;
  DROP TABLE "pages_blocks_why" CASCADE;
  DROP TABLE "pages_blocks_guides_grid" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_team_members" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_steps_items" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_licence" CASCADE;
  DROP TABLE "pages_faq_groups_items" CASCADE;
  DROP TABLE "pages_faq_groups" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "durations_faq" CASCADE;
  DROP TABLE "durations" CASCADE;
  DROP TABLE "durations_locales" CASCADE;
  DROP TABLE "trip_styles_faq" CASCADE;
  DROP TABLE "trip_styles" CASCADE;
  DROP TABLE "trip_styles_locales" CASCADE;
  DROP TABLE "cruise_types_faq" CASCADE;
  DROP TABLE "cruise_types" CASCADE;
  DROP TABLE "cruise_types_locales" CASCADE;
  DROP TABLE "departures_faq" CASCADE;
  DROP TABLE "departures" CASCADE;
  DROP TABLE "departures_locales" CASCADE;
  DROP TABLE "regions_faq" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "regions_locales" CASCADE;
  DROP TABLE "guide_topics_faq" CASCADE;
  DROP TABLE "guide_topics" CASCADE;
  DROP TABLE "guide_topics_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "inquiries_texts" CASCADE;
  DROP TABLE "inquiries_rels" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings_stats" CASCADE;
  DROP TABLE "site_settings_trust_items" CASCADE;
  DROP TABLE "site_settings_archive_intros_tours_faq" CASCADE;
  DROP TABLE "site_settings_archive_intros_cruises_faq" CASCADE;
  DROP TABLE "site_settings_archive_intros_excursions_faq" CASCADE;
  DROP TABLE "site_settings_archive_intros_destinations_faq" CASCADE;
  DROP TABLE "site_settings_archive_intros_guides_faq" CASCADE;
  DROP TABLE "site_settings_cancellation_policies" CASCADE;
  DROP TABLE "site_settings_cancellation_policies_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_header_columns_links" CASCADE;
  DROP TABLE "navigation_header_columns" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation_legal_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tours_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cruises_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_excursions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_destinations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guides_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_durations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_trip_styles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cruise_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_departures_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_regions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_guide_topics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_tile_sizes_tile_filename_idx";
  DROP INDEX "media_sizes_hero_sizes_hero_filename_idx";
  DROP INDEX "media_sizes_hero_mobile_sizes_hero_mobile_filename_idx";
  DROP INDEX "media_sizes_gallery_sizes_gallery_filename_idx";
  DROP INDEX "payload_locked_documents_rels_tours_id_idx";
  DROP INDEX "payload_locked_documents_rels_cruises_id_idx";
  DROP INDEX "payload_locked_documents_rels_excursions_id_idx";
  DROP INDEX "payload_locked_documents_rels_destinations_id_idx";
  DROP INDEX "payload_locked_documents_rels_guides_id_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_durations_id_idx";
  DROP INDEX "payload_locked_documents_rels_trip_styles_id_idx";
  DROP INDEX "payload_locked_documents_rels_cruise_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_departures_id_idx";
  DROP INDEX "payload_locked_documents_rels_regions_id_idx";
  DROP INDEX "payload_locked_documents_rels_guide_topics_id_idx";
  DROP INDEX "payload_locked_documents_rels_inquiries_id_idx";
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "media" DROP COLUMN "hola_sample";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_url";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_width";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_height";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_tile_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_url";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_width";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_height";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_url";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_width";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_height";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_hero_mobile_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_url";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_width";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_height";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_gallery_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tours_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cruises_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "excursions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "destinations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "guides_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "durations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "trip_styles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cruise_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "departures_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "regions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "guide_topics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  DROP TYPE "public"."enum_tours_guide_languages";
  DROP TYPE "public"."enum_tours_itinerary_meals";
  DROP TYPE "public"."enum_tours_availability_days";
  DROP TYPE "public"."enum_tours_price_basis";
  DROP TYPE "public"."enum_tours_group_type";
  DROP TYPE "public"."enum_tours_booking_mode";
  DROP TYPE "public"."enum_cruises_ship_facilities";
  DROP TYPE "public"."enum_cruises_guide_languages";
  DROP TYPE "public"."enum_cruises_itinerary_meals";
  DROP TYPE "public"."enum_cruises_availability_days";
  DROP TYPE "public"."enum_cruises_ship_category";
  DROP TYPE "public"."enum_cruises_price_basis";
  DROP TYPE "public"."enum_cruises_group_type";
  DROP TYPE "public"."enum_cruises_booking_mode";
  DROP TYPE "public"."enum_excursions_guide_languages";
  DROP TYPE "public"."enum_excursions_itinerary_meals";
  DROP TYPE "public"."enum_excursions_availability_days";
  DROP TYPE "public"."enum_excursions_activity_level";
  DROP TYPE "public"."enum_excursions_price_basis";
  DROP TYPE "public"."enum_excursions_group_type";
  DROP TYPE "public"."enum_excursions_booking_mode";
  DROP TYPE "public"."enum_destinations_best_months";
  DROP TYPE "public"."enum_pages_blocks_why_columns_icon";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_form";
  DROP TYPE "public"."enum_inquiries_date_mode";
  DROP TYPE "public"."enum_inquiries_channel";
  DROP TYPE "public"."enum_inquiries_lang";
  DROP TYPE "public"."enum_site_settings_social_network";
  DROP TYPE "public"."enum_site_settings_trust_items_icon";
  DROP TYPE "public"."enum_navigation_header_panel_extra";`)
}
