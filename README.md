# QR-Based Multi-Event Registration & Ticketing System

A production-ready full-stack QR-based ticketing system with offline support, multi-event management, and comprehensive admin controls.

## Features

### User Features

- Registration with Razorpay payment integration
- Unique QR code generation
- Email delivery of tickets
- User dashboard (view tickets, download, entry history)
- Responsive design for all devices

### Admin Features

- Secure admin login with 2FA (OTP)
- QR scanner using native device camera
- Offline scanning with sync capability
- Entry device naming (Gate A, Gate B, etc.)
- User management (add, edit, remove, reset QR status)
- Real-time dashboard metrics
- Entry timeline tracking
- Activity logs

### Super Admin Features

- Multi-event creation and management
- Admin assignment to events
- Cross-event analytics
- Complete system control

### Technical Features

- Offline-first architecture
- Real-time synchronization
- Conflict resolution for offline scans
- Theme toggle (light/dark mode)
- Performance optimized
- Security best practices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Payment**: Razorpay
- **QR**: qrcode, html5-qrcode
- **Deployment**: Vercel

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example` and add your credentials

4. Run development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required variables.

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Routes

- `/` - Home page
- `/register` - User registration
- `/login` - User login
- `/dashboard` - User dashboard
- `/admin` - Admin login & dashboard
- `/admin/scanner` - QR scanner
- `/super-admin` - Super admin panel

## Default Super Admin Credentials

Email: `nk10nikhil@gmail.com`
Password: `nk10nikhil`

**Change these after first login!**

## License

MIT
