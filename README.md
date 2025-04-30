# Event Registration System with QR Code Check-in

A full-stack Next.js application for event registration with QR code generation and scanning functionality.

## Features

- User registration with payment integration (Razorpay)
- QR code generation for successful registrations
- Admin dashboard with registration management
- QR code scanner for event check-in
- Offline mode for scanning without internet connection
- Analytics and reporting

## Tech Stack

- **Frontend & Backend**: Next.js (App Router)
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **Payment Gateway**: Razorpay
- **QR Code**: qrcode (Node.js package)
- **QR Scanning**: qr-scanner
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Razorpay account for payment integration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`
4. Seed the database with an admin user:
   \`\`\`
   npm run seed:admin
   \`\`\`
5. (Optional) Seed the database with sample data:
   \`\`\`
   npm run seed:data
   \`\`\`

### Admin Access

After running the seed script, you can log in with:
- Email: admin@techfest.com
- Password: Admin@123

## Usage

### User Registration Flow

1. Users visit the landing page and click "Register Now"
2. They fill in their details in the registration form
3. After submission, they're redirected to the payment page
4. Upon successful payment, a QR code is generated for event entry

### Admin Dashboard

1. Admins log in at `/login`
2. The dashboard shows registration statistics and a list of all registrations
3. The QR scanner page allows checking in attendees by scanning their QR codes
4. Offline mode enables scanning without internet connection

## Deployment

This project can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables
4. Deploy

## License

This project is licensed under the MIT License.
