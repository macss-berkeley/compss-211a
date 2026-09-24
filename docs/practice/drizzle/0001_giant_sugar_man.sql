CREATE TABLE `activity_events` (
	`id` text PRIMARY KEY NOT NULL,
	`browser_hash` text NOT NULL,
	`skill` text NOT NULL,
	`kind` text NOT NULL,
	`value` text NOT NULL,
	`variant` text NOT NULL,
	`received_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_activity_received` ON `activity_events` (`received_at`);