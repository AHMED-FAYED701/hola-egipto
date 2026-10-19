CREATE TABLE `cruise_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `cruise_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cruise_types_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `cruise_types_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `cruise_types_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `cruise_types_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `cruises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featured_image_id` int,
	`seo_og_image_id` int,
	`gallery` longtext,
	`price_from_eur` int,
	`price_from_usd` int,
	`price_basis` varchar(32) NOT NULL DEFAULT 'per_person_double',
	`group_type` varchar(16) NOT NULL DEFAULT 'small',
	`group_min` int,
	`group_max` int,
	`guide_languages` longtext,
	`availability_days` longtext,
	`cancellation_policy` varchar(64),
	`booking_mode` varchar(16) NOT NULL DEFAULT 'inquiry',
	`booking_url` varchar(500),
	`last_reviewed` date,
	`featured` boolean NOT NULL DEFAULT false,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`nights` int NOT NULL,
	`cruise_type_id` int,
	`ship_category` varchar(16),
	`embark_id` int,
	`disembark_id` int,
	`ship_facilities` longtext,
	`deck_plan_id` int,
	CONSTRAINT `cruises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cruises_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`subtitle` varchar(255),
	`overview` longtext,
	`price_note` text,
	`highlights` longtext,
	`itinerary` longtext,
	`includes` longtext,
	`excludes` longtext,
	`what_to_bring` longtext,
	`season_note` text,
	`cancellation_override` text,
	`faq` longtext,
	`ship_name` varchar(255),
	`start_dates` longtext,
	`cabins` longtext,
	CONSTRAINT `cruises_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `cruises_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `cruises_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `departures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`destination_id` int,
	CONSTRAINT `departures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departures_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `departures_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `departures_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `departures_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `destination_nearby` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destination_id` int NOT NULL,
	`nearby_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `destination_nearby_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featured_image_id` int,
	`seo_og_image_id` int,
	`region_id` int,
	`best_months` longtext,
	`days_recommended` int,
	`lat` double,
	`lng` double,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`content` longtext,
	`tagline` varchar(255),
	`how_to_get_there` text,
	`nearest_airport` varchar(255),
	`top_sights` longtext,
	CONSTRAINT `destinations_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `destinations_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `durations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`min_days` int,
	`max_days` int,
	CONSTRAINT `durations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `durations_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `durations_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `durations_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `durations_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `excursion_departures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`excursion_id` int NOT NULL,
	`departure_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `excursion_departures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `excursions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featured_image_id` int,
	`seo_og_image_id` int,
	`gallery` longtext,
	`price_from_eur` int,
	`price_from_usd` int,
	`price_basis` varchar(32) NOT NULL DEFAULT 'per_person_double',
	`group_type` varchar(16) NOT NULL DEFAULT 'small',
	`group_min` int,
	`group_max` int,
	`guide_languages` longtext,
	`availability_days` longtext,
	`cancellation_policy` varchar(64),
	`booking_mode` varchar(16) NOT NULL DEFAULT 'inquiry',
	`booking_url` varchar(500),
	`last_reviewed` date,
	`featured` boolean NOT NULL DEFAULT false,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`duration_hours` int NOT NULL,
	`child_price_eur` int,
	`child_price_usd` int,
	`min_age` int,
	`activity_level` varchar(16),
	CONSTRAINT `excursions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `excursions_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`subtitle` varchar(255),
	`overview` longtext,
	`price_note` text,
	`highlights` longtext,
	`itinerary` longtext,
	`includes` longtext,
	`excludes` longtext,
	`what_to_bring` longtext,
	`season_note` text,
	`cancellation_override` text,
	`faq` longtext,
	`start_times` longtext,
	`pickup_areas` longtext,
	CONSTRAINT `excursions_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `excursions_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `excursions_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `guide_destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guide_id` int NOT NULL,
	`destination_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `guide_destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guide_guide_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guide_id` int NOT NULL,
	`guide_topic_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `guide_guide_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guide_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `guide_topics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guide_topics_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `guide_topics_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `guide_topics_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `guide_topics_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featured_image_id` int,
	`seo_og_image_id` int,
	`last_updated` date,
	`toc` boolean NOT NULL DEFAULT true,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `guides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guides_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`content` longtext,
	`author_name` varchar(255),
	CONSTRAINT `guides_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `guides_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `guides_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`path` varchar(191) NOT NULL,
	`alt_es` varchar(500) NOT NULL,
	`alt_en` varchar(500) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `images_id` PRIMARY KEY(`id`),
	CONSTRAINT `images_path_unique` UNIQUE(`path`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`form` varchar(16) NOT NULL DEFAULT 'plan_my_trip',
	`trip_type` varchar(16),
	`trip_id` int,
	`interests` longtext,
	`length` varchar(64),
	`date_mode` varchar(16),
	`date_from` date,
	`date_to` date,
	`month` varchar(32),
	`adults` int,
	`children` int,
	`children_ages` varchar(100),
	`budget` varchar(64),
	`hotel` varchar(64),
	`group_type` varchar(64),
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`whatsapp` varchar(64),
	`channel` varchar(16),
	`message` text,
	`consent_at` datetime,
	`marketing` boolean NOT NULL DEFAULT false,
	`lang` varchar(2) NOT NULL,
	`page_url` varchar(500),
	`utm` longtext,
	`gclid` varchar(300),
	`fbclid` varchar(300),
	`landing` varchar(500),
	`status` varchar(16) NOT NULL DEFAULT 'new',
	`tracked` boolean NOT NULL DEFAULT false,
	`ip_hash` varchar(64),
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ip_hash` varchar(64) NOT NULL,
	`email` varchar(191) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `login_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `navigation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `navigation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `navigation_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`tree` longtext,
	CONSTRAINT `navigation_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `navigation_i18n_entity_locale` UNIQUE(`entity_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`template` varchar(32) NOT NULL DEFAULT 'default',
	`featured_image_id` int,
	`seo_og_image_id` int,
	`last_updated` date,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pages_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`content` longtext,
	`sections` longtext,
	`faq_groups` longtext,
	CONSTRAINT `pages_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `pages_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `regions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regions_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `regions_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `regions_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `regions_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `related_trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner_type` varchar(16) NOT NULL,
	`owner_id` int NOT NULL,
	`trip_type` varchar(16) NOT NULL,
	`trip_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `related_trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whatsapp_number` varchar(32),
	`contact_email` varchar(255),
	`phone` varchar(64),
	`address` text,
	`legal_name` varchar(255),
	`licence_number` varchar(128),
	`gtm_id` varchar(32),
	`social` longtext,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`whatsapp_message_default` varchar(500),
	`reply_hours` varchar(255),
	`home` longtext,
	`booking_band` longtext,
	`stats` longtext,
	`trust_items` longtext,
	`archive_intros` longtext,
	`cancellation_policies` longtext,
	`og_default_id` int,
	CONSTRAINT `site_settings_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_i18n_entity_locale` UNIQUE(`entity_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `tour_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tour_id` int NOT NULL,
	`guide_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `tour_guides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`featured_image_id` int,
	`seo_og_image_id` int,
	`gallery` longtext,
	`price_from_eur` int,
	`price_from_usd` int,
	`price_basis` varchar(32) NOT NULL DEFAULT 'per_person_double',
	`group_type` varchar(16) NOT NULL DEFAULT 'small',
	`group_min` int,
	`group_max` int,
	`guide_languages` longtext,
	`availability_days` longtext,
	`cancellation_policy` varchar(64),
	`booking_mode` varchar(16) NOT NULL DEFAULT 'inquiry',
	`booking_url` varchar(500),
	`last_reviewed` date,
	`featured` boolean NOT NULL DEFAULT false,
	`hola_sample` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`duration_days` int NOT NULL,
	`duration_id` int,
	CONSTRAINT `tours_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tours_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`title` varchar(255) NOT NULL,
	`slug` varchar(191),
	`excerpt` text,
	`seo_meta_title` varchar(255),
	`seo_meta_description` text,
	`subtitle` varchar(255),
	`overview` longtext,
	`price_note` text,
	`highlights` longtext,
	`itinerary` longtext,
	`includes` longtext,
	`excludes` longtext,
	`what_to_bring` longtext,
	`season_note` text,
	`cancellation_override` text,
	`faq` longtext,
	CONSTRAINT `tours_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `tours_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `tours_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `trip_destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trip_type` varchar(16) NOT NULL,
	`trip_id` int NOT NULL,
	`destination_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `trip_destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trip_styles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_id` int,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `trip_styles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trip_styles_i18n` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_id` int NOT NULL,
	`locale` varchar(2) NOT NULL,
	`available` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`slug` varchar(191),
	`h1` varchar(255),
	`intro` text,
	`seo_text` text,
	`faq` longtext,
	CONSTRAINT `trip_styles_i18n_id` PRIMARY KEY(`id`),
	CONSTRAINT `trip_styles_i18n_entity_locale` UNIQUE(`entity_id`,`locale`),
	CONSTRAINT `trip_styles_i18n_locale_slug` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `trip_trip_styles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trip_type` varchar(16) NOT NULL,
	`trip_id` int NOT NULL,
	`trip_style_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `trip_trip_styles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` varchar(16) NOT NULL DEFAULT 'editor',
	`session_version` int NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`last_login_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `cruise_types` ADD CONSTRAINT `cruise_types_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruise_types_i18n` ADD CONSTRAINT `cruise_types_i18n_entity_id_cruise_types_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `cruise_types`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_cruise_type_id_cruise_types_id_fk` FOREIGN KEY (`cruise_type_id`) REFERENCES `cruise_types`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_embark_id_destinations_id_fk` FOREIGN KEY (`embark_id`) REFERENCES `destinations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_disembark_id_destinations_id_fk` FOREIGN KEY (`disembark_id`) REFERENCES `destinations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises` ADD CONSTRAINT `cruises_deck_plan_id_images_id_fk` FOREIGN KEY (`deck_plan_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cruises_i18n` ADD CONSTRAINT `cruises_i18n_entity_id_cruises_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `cruises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departures` ADD CONSTRAINT `departures_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departures` ADD CONSTRAINT `departures_destination_id_destinations_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departures_i18n` ADD CONSTRAINT `departures_i18n_entity_id_departures_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `departures`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destination_nearby` ADD CONSTRAINT `destination_nearby_destination_id_destinations_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destination_nearby` ADD CONSTRAINT `destination_nearby_nearby_id_destinations_id_fk` FOREIGN KEY (`nearby_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destinations` ADD CONSTRAINT `destinations_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destinations` ADD CONSTRAINT `destinations_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destinations` ADD CONSTRAINT `destinations_region_id_regions_id_fk` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `destinations_i18n` ADD CONSTRAINT `destinations_i18n_entity_id_destinations_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `durations` ADD CONSTRAINT `durations_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `durations_i18n` ADD CONSTRAINT `durations_i18n_entity_id_durations_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `durations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `excursion_departures` ADD CONSTRAINT `excursion_departures_excursion_id_excursions_id_fk` FOREIGN KEY (`excursion_id`) REFERENCES `excursions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `excursion_departures` ADD CONSTRAINT `excursion_departures_departure_id_departures_id_fk` FOREIGN KEY (`departure_id`) REFERENCES `departures`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `excursions` ADD CONSTRAINT `excursions_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `excursions` ADD CONSTRAINT `excursions_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `excursions_i18n` ADD CONSTRAINT `excursions_i18n_entity_id_excursions_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `excursions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_destinations` ADD CONSTRAINT `guide_destinations_guide_id_guides_id_fk` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_destinations` ADD CONSTRAINT `guide_destinations_destination_id_destinations_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_guide_topics` ADD CONSTRAINT `guide_guide_topics_guide_id_guides_id_fk` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_guide_topics` ADD CONSTRAINT `guide_guide_topics_guide_topic_id_guide_topics_id_fk` FOREIGN KEY (`guide_topic_id`) REFERENCES `guide_topics`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_topics` ADD CONSTRAINT `guide_topics_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_topics_i18n` ADD CONSTRAINT `guide_topics_i18n_entity_id_guide_topics_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `guide_topics`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guides` ADD CONSTRAINT `guides_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guides` ADD CONSTRAINT `guides_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guides_i18n` ADD CONSTRAINT `guides_i18n_entity_id_guides_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `navigation_i18n` ADD CONSTRAINT `navigation_i18n_entity_id_navigation_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `navigation`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pages_i18n` ADD CONSTRAINT `pages_i18n_entity_id_pages_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `regions` ADD CONSTRAINT `regions_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `regions_i18n` ADD CONSTRAINT `regions_i18n_entity_id_regions_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `regions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_settings_i18n` ADD CONSTRAINT `site_settings_i18n_entity_id_site_settings_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `site_settings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_settings_i18n` ADD CONSTRAINT `site_settings_i18n_og_default_id_images_id_fk` FOREIGN KEY (`og_default_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_guides` ADD CONSTRAINT `tour_guides_tour_id_tours_id_fk` FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tour_guides` ADD CONSTRAINT `tour_guides_guide_id_guides_id_fk` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_featured_image_id_images_id_fk` FOREIGN KEY (`featured_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_seo_og_image_id_images_id_fk` FOREIGN KEY (`seo_og_image_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours` ADD CONSTRAINT `tours_duration_id_durations_id_fk` FOREIGN KEY (`duration_id`) REFERENCES `durations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tours_i18n` ADD CONSTRAINT `tours_i18n_entity_id_tours_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `tours`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trip_destinations` ADD CONSTRAINT `trip_destinations_destination_id_destinations_id_fk` FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trip_styles` ADD CONSTRAINT `trip_styles_hero_id_images_id_fk` FOREIGN KEY (`hero_id`) REFERENCES `images`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trip_styles_i18n` ADD CONSTRAINT `trip_styles_i18n_entity_id_trip_styles_id_fk` FOREIGN KEY (`entity_id`) REFERENCES `trip_styles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trip_trip_styles` ADD CONSTRAINT `trip_trip_styles_trip_style_id_trip_styles_id_fk` FOREIGN KEY (`trip_style_id`) REFERENCES `trip_styles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `cruises_cruise_type` ON `cruises` (`cruise_type_id`);--> statement-breakpoint
CREATE INDEX `destination_nearby_owner` ON `destination_nearby` (`destination_id`);--> statement-breakpoint
CREATE INDEX `destinations_region` ON `destinations` (`region_id`);--> statement-breakpoint
CREATE INDEX `excursion_departures_exc` ON `excursion_departures` (`excursion_id`);--> statement-breakpoint
CREATE INDEX `excursion_departures_dep` ON `excursion_departures` (`departure_id`);--> statement-breakpoint
CREATE INDEX `guide_destinations_guide` ON `guide_destinations` (`guide_id`);--> statement-breakpoint
CREATE INDEX `guide_destinations_dest` ON `guide_destinations` (`destination_id`);--> statement-breakpoint
CREATE INDEX `guide_guide_topics_guide` ON `guide_guide_topics` (`guide_id`);--> statement-breakpoint
CREATE INDEX `guide_guide_topics_topic` ON `guide_guide_topics` (`guide_topic_id`);--> statement-breakpoint
CREATE INDEX `inquiries_created` ON `inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `inquiries_ip` ON `inquiries` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `inquiries_status` ON `inquiries` (`status`);--> statement-breakpoint
CREATE INDEX `login_attempts_ip` ON `login_attempts` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `login_attempts_email` ON `login_attempts` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `related_trips_owner` ON `related_trips` (`owner_type`,`owner_id`);--> statement-breakpoint
CREATE INDEX `related_trips_trip` ON `related_trips` (`trip_type`,`trip_id`);--> statement-breakpoint
CREATE INDEX `tour_guides_tour` ON `tour_guides` (`tour_id`);--> statement-breakpoint
CREATE INDEX `tour_guides_guide` ON `tour_guides` (`guide_id`);--> statement-breakpoint
CREATE INDEX `tours_duration` ON `tours` (`duration_id`);--> statement-breakpoint
CREATE INDEX `trip_destinations_trip` ON `trip_destinations` (`trip_type`,`trip_id`);--> statement-breakpoint
CREATE INDEX `trip_destinations_dest` ON `trip_destinations` (`destination_id`);--> statement-breakpoint
CREATE INDEX `trip_trip_styles_trip` ON `trip_trip_styles` (`trip_type`,`trip_id`);--> statement-breakpoint
CREATE INDEX `trip_trip_styles_style` ON `trip_trip_styles` (`trip_style_id`);