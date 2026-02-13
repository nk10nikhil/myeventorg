# Production Deployment Guide

## Prerequisites

1. MongoDB Atlas account and connection string
2. Razorpay account (Key ID and Secret)
3. Email service (Gmail or other SMTP)
4. Vercel account

## Step 1: Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_minimum_32_characters

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Super Admin
SUPER_ADMIN_EMAIL=superadmin@ticketing.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
```

## Step 2: MongoDB Atlas Setup

1. Create a new cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for serverless deployment
4. Copy the connection string and add to `.env`

## Step 3: Razorpay Setup

1. Sign up at https://razorpay.com/
2. Get your API keys from Dashboard > Settings > API Keys
3. Add to `.env` file
4. Enable required payment methods

## Step 4: Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Use this app password in the EMAIL_PASSWORD variable

## Step 5: Initialize Database

After deploying, run the initialization:

```bash
# Method 1: API endpoint
curl -X POST https://your-domain.vercel.app/api/init

# Method 2: Run script locally
npm run init-db
```

## Step 6: Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option B: GitHub Integration

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Step 7: Configure Custom Domain (Optional)

1. Add domain in Vercel dashboard
2. Update DNS records
3. Update NEXT_PUBLIC_APP_URL

## Step 8: Post-Deployment

1. Test super admin login
2. Create a test event
3. Test user registration and payment
4. Test admin QR scanning
5. Verify email notifications

## Security Checklist

- [ ] Change default super admin credentials
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Restrict MongoDB IP whitelist if possible
- [ ] Enable Razorpay webhooks for payment verification
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting for API routes
- [ ] Regular database backups

## Monitoring

### Vercel Analytics

Enable in Project Settings > Analytics

### MongoDB Monitoring

Use Atlas built-in monitoring

### Error Tracking

Consider adding:

- Sentry for error tracking
- LogRocket for session replay

## Scaling Considerations

1. **Database**: Use MongoDB Atlas auto-scaling
2. **Vercel**: Automatically scales with traffic
3. **Caching**: Implement Redis for session management
4. **CDN**: Vercel provides global CDN automatically

## Troubleshooting

### Common Issues

**Database Connection Failed**

- Check MongoDB Atlas whitelist
- Verify connection string format
- Ensure network access is configured

**Payment Not Working**

- Verify Razorpay keys are correct
- Check payment method is enabled
- Test in sandbox mode first

**Email Not Sending**

- Verify app password is correct
- Check Less Secure Apps settings
- Try different SMTP service

**QR Scanner Not Working**

- Ensure HTTPS is enabled
- Check camera permissions
- Test on different devices

## Support

For issues, check:

1. Vercel deployment logs
2. MongoDB Atlas logs
3. Browser console errors
4. Network tab for API failures

## Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Deploy
vercel --prod
```

## Backup Strategy

1. **Database**: Enable MongoDB Atlas continuous backup
2. **Code**: Use Git version control
3. **Environment Variables**: Keep secure backup of `.env`

## Performance Optimization

1. Enable Vercel Edge Caching
2. Optimize images with Next.js Image component
3. Implement lazy loading for components
4. Use React Server Components where possible
5. Minimize bundle size

## Cost Estimation

### Monthly costs (approximate):

- MongoDB Atlas: $0 - $57 (Shared tier is free)
- Vercel: $0 - $20 (Hobby tier is free)
- Razorpay: Transaction fees only
- Email: Free (Gmail) or $5-20 (SendGrid/AWS SES)

**Total: $0 - $100/month** depending on scale
