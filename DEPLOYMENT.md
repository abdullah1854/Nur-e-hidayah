# Deployment Guide for Nur-e-Hidayah Web App

This guide will help you deploy the beautiful Nur-e-Hidayah web application to Hostinger.

## Prerequisites

1. Hostinger hosting account with PHP 7.4+ and MySQL
2. Domain name configured on Hostinger
3. SSL certificate installed (for HTTPS)
4. FTP/SFTP access to your hosting

## Step 1: Build the React Native Web App

```bash
# Install dependencies
npm install

# Build for production
npm run build:web
```

This will create a `web-build` directory with the optimized production files.

## Step 2: Prepare Backend Files

1. Update the configuration in `/backend/config.php`:
   ```php
   $db_host = 'localhost';
   $db_user = 'your_database_username';
   $db_pass = 'your_database_password';
   $db_name = 'your_database_name';
   $jwt_secret = 'your-strong-jwt-secret';
   $google_client_id = 'your-google-client-id';
   ```

2. Update the API endpoint in `/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-domain.com/api';
   ```

3. Update the Google Client ID in `/src/screens/web/WebLoginScreen.tsx`:
   ```typescript
   client_id: 'YOUR_GOOGLE_CLIENT_ID',
   ```

## Step 3: Database Setup

1. Log into your Hostinger control panel
2. Go to MySQL Databases
3. Create a new database
4. Import the `/backend/database.sql` file using phpMyAdmin

## Step 4: File Upload Structure

Upload files to your Hostinger hosting in this structure:

```
public_html/
├── index.html (from web-build/)
├── manifest.json
├── favicon-*.png
├── service-worker.js
├── styles.css
├── static/ (from web-build/static/)
├── api/
│   ├── .htaccess
│   ├── config.php
│   ├── includes/
│   │   └── cors.php
│   ├── auth/
│   │   ├── google-login.php
│   │   └── verify.php
│   ├── user/
│   │   ├── settings.php
│   │   ├── bookmarks.php
│   │   └── position.php
```

## Step 5: Upload Files

1. Connect to your hosting via FTP/SFTP
2. Upload the contents of `web-build/` to `public_html/`
3. Upload the `backend/` contents to `public_html/api/`
4. Ensure file permissions:
   - PHP files: 644
   - Directories: 755

## Step 6: Configure .htaccess

Create `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle API routes
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ api/$1 [L]
  
  # Handle React app routes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

## Step 7: Environment Variables

Create `.env` file in `public_html/api/`:

```env
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your-strong-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
APP_ENV=production
```

Update `config.php` to use environment variables:

```php
<?php
$db_host = $_ENV['DB_HOST'] ?? 'localhost';
$db_user = $_ENV['DB_USER'] ?? '';
$db_pass = $_ENV['DB_PASSWORD'] ?? '';
$db_name = $_ENV['DB_NAME'] ?? '';
$jwt_secret = $_ENV['JWT_SECRET'] ?? '';
$google_client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
```

## Step 8: Test the Deployment

1. Visit https://your-domain.com
2. Check the browser console for any errors
3. Test the Google login functionality
4. Verify database connections
5. Test all features:
   - Surah listing
   - Reading verses
   - Bookmarks
   - Settings
   - Dark mode

## Step 9: Monitoring and Maintenance

1. Set up error logging in PHP:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 0);
   ini_set('log_errors', 1);
   ini_set('error_log', '/path/to/error.log');
   ```

2. Monitor server logs regularly
3. Set up database backups
4. Keep dependencies updated

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check PHP error logs
   - Verify file permissions
   - Check .htaccess syntax

2. **Database Connection Failed**
   - Verify database credentials
   - Check if MySQL is running
   - Ensure database user has proper permissions

3. **CORS Issues**
   - Verify CORS headers in .htaccess
   - Check API endpoint URLs
   - Ensure HTTPS is properly configured

4. **Google Login Not Working**
   - Verify Google Client ID
   - Check authorized domains in Google Console
   - Ensure redirect URIs are correct

## Security Checklist

- [ ] SSL certificate installed and working
- [ ] Database passwords are strong
- [ ] JWT secret is unique and strong
- [ ] File permissions are correct
- [ ] Error display is disabled in production
- [ ] API endpoints are properly secured
- [ ] Input validation is implemented
- [ ] SQL injection prevention is in place

## Performance Optimization

1. Enable Gzip compression
2. Set up CDN for static assets
3. Optimize images
4. Enable browser caching
5. Minify CSS and JavaScript
6. Use database indexes appropriately

## Support

For issues specific to:
- Hostinger hosting: Contact Hostinger support
- Google OAuth: Check Google Cloud Console
- React Native Web: Consult React Native documentation

---

Your beautiful Nur-e-Hidayah web app is now ready to serve users worldwide! 🎉