# CIDCO Mitra Admin Panel - Deployment Guide

## 🚀 Deployment Options

### Option 1: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Configure Environment Variables**
- Go to Site Settings > Build & Deploy > Environment
- Add `VITE_API_URL` with your production API URL

### Option 2: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure Environment Variables**
- Go to Project Settings > Environment Variables
- Add `VITE_API_URL`

### Option 3: AWS S3 + CloudFront

1. **Build the project**
```bash
npm run build
```

2. **Create S3 Bucket**
- Enable static website hosting
- Set bucket policy for public read access

3. **Upload files**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Create CloudFront Distribution**
- Origin: Your S3 bucket
- Default Root Object: index.html
- Error Pages: Redirect 404 to /index.html (for SPA routing)

5. **Configure Environment Variables**
- Use AWS Systems Manager Parameter Store
- Or build with environment variables

### Option 4: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Build and Run**
```bash
docker build -t cidco-mitra-admin .
docker run -p 80:80 cidco-mitra-admin
```

## 🔐 Environment Variables

### Required Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Optional Variables

```env
VITE_APP_NAME=CIDCO Mitra Admin
VITE_APP_VERSION=1.0.0
```

## ✅ Pre-Deployment Checklist

- [ ] Update API URL in environment variables
- [ ] Test all features in production build
- [ ] Verify authentication flow
- [ ] Check all routes are accessible
- [ ] Test responsive design on mobile
- [ ] Verify all images and assets load
- [ ] Test form validations
- [ ] Check console for errors
- [ ] Verify CORS settings on API
- [ ] Test with different user roles
- [ ] Backup current production (if updating)

## 🔧 Post-Deployment Steps

1. **Verify Deployment**
   - Access the deployed URL
   - Test login functionality
   - Navigate through all pages
   - Test CRUD operations

2. **Monitor Performance**
   - Check page load times
   - Monitor API response times
   - Check for console errors

3. **Setup Monitoring**
   - Configure error tracking (Sentry, etc.)
   - Setup uptime monitoring
   - Configure analytics

## 🐛 Common Issues

### Issue: White screen after deployment
**Solution**: Check browser console for errors. Usually caused by incorrect base URL or missing environment variables.

### Issue: 404 on page refresh
**Solution**: Configure your hosting to redirect all routes to index.html for SPA routing.

### Issue: API calls failing
**Solution**: 
- Verify CORS settings on API
- Check API URL in environment variables
- Ensure API is accessible from production domain

### Issue: Assets not loading
**Solution**: Check base path in vite.config.js if deploying to subdirectory.

## 📊 Performance Optimization

### 1. Enable Compression
Configure your server to enable gzip/brotli compression.

### 2. Cache Static Assets
Set appropriate cache headers for static files.

### 3. CDN Integration
Use a CDN for faster asset delivery globally.

### 4. Image Optimization
Optimize all images before deployment.

## 🔒 Security Considerations

1. **HTTPS Only**
   - Always use HTTPS in production
   - Configure HSTS headers

2. **Environment Variables**
   - Never commit .env files
   - Use secure methods to inject variables

3. **API Security**
   - Implement rate limiting
   - Use secure authentication tokens
   - Validate all inputs

4. **Content Security Policy**
   - Configure CSP headers
   - Restrict resource loading

## 📱 Mobile Considerations

- Test on real devices
- Verify touch interactions
- Check responsive breakpoints
- Test on different browsers

## 🔄 Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Support

For deployment issues, contact the DevOps team.

## 📄 Version History

- v1.0.0 - Initial release
