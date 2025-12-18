#!/bin/bash

echo "Deploying NexoraSIM WordPress Plugin"
echo "====================================="

# Create deployment package
cd wordpress-plugin
zip -r nexorasim-plugin.zip ./*

# Upload via FTP
lftp -c "
open ftp://app.nexorasim.com
user u755220709.app.nexorasim.com Melilite7%
cd public_html/wp-content/plugins
mkdir nexorasim
cd nexorasim
mput -r *
bye
"

echo "Plugin uploaded successfully"
echo "Activate at: https://app.nexorasim.com/wp-admin/plugins.php"