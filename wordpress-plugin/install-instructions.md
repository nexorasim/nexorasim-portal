# WordPress Installation Instructions

## Server Setup

1. **Upload Plugin**
```bash
# Upload to WordPress plugins directory
wp-content/plugins/nexorasim/
```

2. **Database Configuration**
```sql
-- Create database
CREATE DATABASE nexorasim_db;
CREATE USER 'nexorasim'@'localhost' IDENTIFIED BY 'Melilite7%';
GRANT ALL PRIVILEGES ON nexorasim_db.* TO 'nexorasim'@'localhost';
FLUSH PRIVILEGES;
```

3. **WordPress Configuration**
Add to wp-config.php:
```php
define('DB_NAME', 'nexorasim_db');
define('DB_USER', 'nexorasim');
define('DB_PASSWORD', 'Melilite7%');
define('WP_HOME', 'https://app.nexorasim.com');
define('WP_SITEURL', 'https://app.nexorasim.com');
```

4. **Activate Plugin**
- Login to WordPress admin: https://app.nexorasim.com/wp-admin
- Email: nexorasim@gmail.com
- Password: Melilite7%
- Go to Plugins > Activate "NexoraSIM eSIM Management"

5. **Configure Settings**
- Navigate to NexoraSIM > Settings
- Add payment gateway API keys
- Configure eSIM plans

## API Endpoints
Base URL: https://app.nexorasim.com/wp-json/nexorasim/v1

## Test Connection
```bash
curl https://app.nexorasim.com/wp-json/nexorasim/v1/esim/plans
```