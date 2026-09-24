CREATE TABLE `checkins` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`snapshot` text NOT NULL,
	`submitted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `class_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`join_code` text NOT NULL
);
