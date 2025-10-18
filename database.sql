CREATE DATABASE guild_cache;
CREATE TABLE `guild_cache`.`data` (
  `data_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `uuid` VARCHAR(255) NOT NULL,
  `discord_id` VARCHAR(255) NOT NULL,
  `tag` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) NOT NULL,
  `guild_id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `cached_at` DATETIME NOT NULL,
  PRIMARY KEY (`data_id`),
  UNIQUE INDEX `uq_data_uuid` (`uuid` ASC) VISIBLE,
  UNIQUE INDEX `uq_data_discord_id` (`discord_id` ASC) VISIBLE);