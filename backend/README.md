# Nur-e-Hidayah Backend Setup

This directory contains the PHP backend for the Nur-e-Hidayah Quran application.

## Setup Instructions for Hostinger

### 1. Database Setup

1. Log in to your Hostinger control panel
2. Go to MySQL Databases
3. Create a new database named `nur_e_hidayah`
4. Create a new database user and grant all privileges
5. Import the `database.sql` file to create the necessary tables

### 2. File Upload

1. Upload all PHP files to your hosting directory
2. Maintain the folder structure as shown:
   ```
   public_html/
   ├── api/
   │   ├── auth/
   │   │   ├── google-login.php
   │   │   └── verify.php
   │   └── user/
   │       ├── settings.php
   │       ├── bookmarks.php
   │       └── position.php
   └── config.php
   ```

### 3. Configuration

1. Edit `config.php` and update the following:
   - `DB_HOST`: Usually 'localhost' on Hostinger
   - `DB_NAME`: Your database name (nur_e_hidayah)
   - `DB_USER`: Your database username
   - `DB_PASS`: Your database password
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `JWT_SECRET`: Generate a secure random string
   - `ALLOWED_ORIGINS`: Add your frontend URLs

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized JavaScript origins
6. Add callback URLs

### 5. HTTPS Configuration

Ensure your Hostinger account has SSL certificate enabled (usually free with Hostinger).

### 6. File Permissions

Set appropriate permissions:
```bash
chmod 644 *.php
chmod 755 api/
chmod 755 api/auth/
chmod 755 api/user/
```

### 7. Testing

Test the endpoints:
- `https://your-domain.com/api/auth/google-login.php`
- `https://your-domain.com/api/auth/verify.php`
- `https://your-domain.com/api/user/settings.php`

### 8. Security Considerations

1. Use HTTPS for all API calls
2. Keep JWT secret secure
3. Regularly update PHP version
4. Enable error logging but disable display_errors in production
5. Use prepared statements (already implemented)
6. Validate all input data

### 9. Frontend Configuration

Update the frontend to use your backend URL:

1. Edit `src/services/authService.ts`
2. Replace `API_BASE_URL` with your actual domain
3. Update Google Client ID in `WebLoginScreen.tsx`

## API Endpoints

### Authentication
- `POST /api/auth/google-login.php` - Login with Google
- `POST /api/auth/verify.php` - Verify JWT token

### User Data
- `GET /api/user/settings.php` - Get user settings
- `PUT /api/user/settings.php` - Update user settings
- `GET /api/user/bookmarks.php` - Get bookmarks
- `POST /api/user/bookmarks.php` - Add bookmark
- `DELETE /api/user/bookmarks.php` - Remove bookmark
- `GET /api/user/position.php` - Get reading position
- `PUT /api/user/position.php` - Update reading position

## Troubleshooting

1. **Database Connection Error**
   - Check database credentials in config.php
   - Ensure database user has proper permissions

2. **CORS Issues**
   - Add frontend URL to ALLOWED_ORIGINS in config.php
   - Check if headers are being sent correctly

3. **500 Server Error**
   - Check PHP error logs
   - Ensure all required PHP extensions are enabled
   - Verify file permissions

4. **Google Login Issues**
   - Verify Google Client ID is correct
   - Check authorized domains in Google Console
   - Ensure HTTPS is enabled

For support, check Hostinger documentation or contact their support team.