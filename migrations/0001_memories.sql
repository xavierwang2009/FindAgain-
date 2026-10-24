CREATE TABLE `memories` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`name_key` text NOT NULL,
	`location` text NOT NULL,
	`photo_key` text,
	`updated` integer NOT NULL
);

CREATE UNIQUE INDEX `memories_owner_name` ON `memories` (`owner`,`name_key`);