ALTER TABLE `contactSubmissions` ADD `status` enum('unread','read','replied') DEFAULT 'unread' NOT NULL;--> statement-breakpoint
ALTER TABLE `contactSubmissions` ADD `reply` text;--> statement-breakpoint
ALTER TABLE `contactSubmissions` ADD `repliedAt` timestamp;