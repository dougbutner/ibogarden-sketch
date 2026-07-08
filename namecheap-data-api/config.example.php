<?php
declare(strict_types=1);

// Copy to config.php and fill in real values.
const DB_HOST = "127.0.0.1";
const DB_PORT = 3306;
const DB_NAME = "your_cpanel_database_name";
const DB_USER = "your_cpanel_database_user";
const DB_PASSWORD = "your_database_password";

// Generate: openssl rand -hex 32
// Must match ADMIN_DATA_API_SECRET in Cloudflare.
const ADMIN_DATA_API_SECRET = "replace_with_long_random_secret";
