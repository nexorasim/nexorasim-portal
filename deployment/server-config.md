# Server Configuration

## Hosting Details
- **URL**: https://app.nexorasim.com
- **IP**: 46.202.186.232
- **Location**: Asia (Indonesia)
- **Disk**: 50 GB
- **RAM**: 1536 MB
- **CPU**: 2 Cores

## FTP Access
- **Host**: ftp://app.nexorasim.com
- **Username**: u755220709.app.nexorasim.com
- **Password**: Melilite7%
- **Path**: public_html

## Database
- **Host**: localhost
- **Database**: nexorasim_db
- **Username**: u755220709_nexorasim
- **Password**: Melilite7%

## WordPress Admin
- **URL**: https://app.nexorasim.com/wp-admin
- **Username**: nexorasim@gmail.com
- **Password**: Melilite7%

## Deployment Commands
```bash
# Upload plugin via FTP
lftp ftp://u755220709.app.nexorasim.com:Melilite7%@app.nexorasim.com
cd public_html/wp-content/plugins
put -r nexorasim/
```