# Manual WordPress Plugin Upload

## Method 1: FTP Upload
1. **Connect via FTP client**
   - Host: ftp://app.nexorasim.com
   - Username: u755220709.app.nexorasim.com
   - Password: Melilite7%

2. **Upload plugin**
   - Navigate to: public_html/wp-content/plugins/
   - Create folder: nexorasim
   - Upload all files from wordpress-plugin/ directory

## Method 2: WordPress Admin Upload
1. **Zip the plugin**
   ```bash
   cd wordpress-plugin
   zip -r nexorasim.zip ./*
   ```

2. **Upload via WordPress**
   - Go to: https://app.nexorasim.com/wp-admin/plugin-install.php
   - Click "Upload Plugin"
   - Select nexorasim.zip
   - Click "Install Now"

## Method 3: File Manager (cPanel)
1. **Access File Manager**
   - Login to hosting control panel
   - Open File Manager
   - Navigate to: public_html/wp-content/plugins/

2. **Create nexorasim folder and upload files**

## Activation
After upload, activate at:
https://app.nexorasim.com/wp-admin/plugins.php

## API Test
Test endpoint:
https://app.nexorasim.com/wp-json/nexorasim/v1/esim/plans