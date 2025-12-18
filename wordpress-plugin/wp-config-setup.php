<?php
/**
 * WordPress Configuration for NexoraSIM
 * Add to wp-config.php
 */

// Database Configuration
define('DB_NAME', 'u755220709_nexorasim');
define('DB_USER', 'u755220709_nexorasim');
define('DB_PASSWORD', 'Melilite7%');
define('DB_HOST', 'localhost');

// WordPress URLs
define('WP_HOME', 'https://app.nexorasim.com');
define('WP_SITEURL', 'https://app.nexorasim.com');

// Security Keys (generate new ones)
define('AUTH_KEY', 'put your unique phrase here');
define('SECURE_AUTH_KEY', 'put your unique phrase here');
define('LOGGED_IN_KEY', 'put your unique phrase here');
define('NONCE_KEY', 'put your unique phrase here');

// SSL Configuration
define('FORCE_SSL_ADMIN', true);

// NexoraSIM Plugin Settings
define('NEXORASIM_JWT_SECRET', 'nexorasim_secret_key_change_in_production');
define('NEXORASIM_API_VERSION', 'v1');

// Payment Gateway Settings
define('NEXORASIM_WAVEPAY_API_KEY', 'your_wavepay_key');
define('NEXORASIM_AYA_PAY_API_KEY', 'your_aya_pay_key');
define('NEXORASIM_KBZ_PAY_API_KEY', 'your_kbz_pay_key');
define('NEXORASIM_TRANSACT_EASE_API_KEY', 'your_transact_ease_key');

// Enable CORS for API
define('NEXORASIM_ENABLE_CORS', true);
?>