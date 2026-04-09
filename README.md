# RefLink - Get Referred. Get Hired. 🚀

A trusted, scalable **job referral platform** that connects job seekers with the right employees for seamless, privacy-conscious referrals.

## 🎯 Mission

Make job referrals accessible, trustworthy and scalable by connecting job seekers with the right employees — eliminating the informal and inefficient nature of today's referral ecosystem.

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite) - UI framework
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js + Express.js** - API server
- **MongoDB + Mongoose** - Database
- **JWT + bcrypt** - Authentication & security
- **Socket.io** - Real-time notifications
- **Redis** - Rate limiting & caching
- **Multer + Cloudinary** - File uploads
- **Helmet, CORS, Compression** - Security & optimization

## 📁 Project Structure

```
reflink/
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routes
    ├── controllers/        # Business logic
    ├── middleware/         # Express middleware
    ├── services/           # Utility services
    ├── utils/              # Helper functions
    ├── socket/             # Socket.io handlers
    ├── config/             # Configuration
    ├── server.js           # Entry point
    ├── app.js              # Express app
    ├── seed.js             # Database seeding
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account (for file uploads)
- Redis (optional, for rate limiting)

### 1. Clone Repository

```bash
cd reflink
```

### 2. Setup Environment Variables

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/reflink
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:3000
```

#### Client (`.env`)
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### 4. Seed Database (Optional)

To populate MongoDB with demo data:
```bash
cd server
npm run seed
```

**Demo Credentials:**
- Any email from seed data
- Password: `password123`

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email

### Profiles
- `GET /api/profiles/:id` - Get profile (masked)
- `PUT /api/profiles/:id` - Update profile
- `GET /api/profiles/search` - Search profiles
- `POST /api/profiles/reveal` - Consent to reveal profile

### Referrals
- `POST /api/referrals` - Create referral request
- `GET /api/referrals/:id` - Get referral details
- `PATCH /api/referrals/:id/status` - Update referral status
- `GET /api/referrals/my/sent` - Get sent referrals
- `GET /api/referrals/my/received` - Get received referrals
- `POST /api/referrals/:id/report` - Report referral

### Matching
- `GET /api/match/referrers` - Get matching referrers for candidate
- `GET /api/match/candidates` - Get matching candidates for referrer
- `POST /api/match/score` - Score a specific match

### Scores & Leaderboard
- `GET /api/scores/:userId` - Get user's trust score
- `GET /api/scores/leaderboard` - Get global leaderboard
- `POST /api/scores/event` - Record score event

## 🎮 Key Features

### For Job Seekers (Candidates)
✅ Discover referrers at target companies  
✅ Send personalized referral requests  
✅ Track application status in real-time  
✅ Anonymous profiles with optional reveal  
✅ Quality scoring system  
✅ Real-time notifications  

### For Employees (Referrers)
✅ Discover quality candidates to refer  
✅ Manage referrals sent and receive status updates  
✅ Earn referral points and tier badges  
✅ Response rate tracking  
✅ Featured leaderboards  
✅ Spam protection & quality filters  

### For Companies
✅ Company dashboard with analytics  
✅ Referrer leaderboards  
✅ ROI tracking  
✅ Referral pipeline management  

## 🔒 Privacy & Security

- **Anonymous by default**: Profiles masked until mutual consent
- **JWT authentication**: Secure token-based auth
- **bcrypt hashing**: Password encryption
- **Rate limiting**: Anti-spam protection (5 requests/day)
- **Content moderation**: AI-powered spam detection
- **Trust scoring**: Community-driven safety
- **Report system**: User moderation

## 💡 Business Logic

### Referral Status Flow
```
pending → accepted → referred → interviewing → hired
    ↓
declined ────────→ closed
```

### Trust Score Components
- Email verified: +20 pts
- LinkedIn connected: +25 pts
- Work email verified: +15 pts
- Successful referral: +10 pts each
- Flagged by users: -30 pts

### Referral Score Tiers
- **Bronze**: 0-99 points
- **Silver**: 100-299 points
- **Gold**: 300-599 points
- **Platinum**: 600+ points

### Quality Score Factors
- Skills listed: +5 pts each (max 25)
- Work experience: +5 pts each (max 15)
- Resume URL: +10 pts
- LinkedIn connected: +10 pts

## 🔄 Real-time Features (Socket.io)

- Real-time notifications for referral requests
- Status update notifications
- Typing indicators
- Online/offline status
- Live leaderboard updates
- Profile reveal consent sync

## 📊 Database Models

- **User** - Authentication & core identity
- **CandidateProfile** - Job seeker profile
- **ReferrerProfile** - Employee profile
- **ReferralRequest** - Referral tracking
- **TrustScore** - Trust reputation system
- **Notification** - User notifications
- **Report** - User reports & moderation

## 🧪 Testing

Demo accounts are available after seeding:

**Candidates:**
- alice@example.com / password123
- bob@example.com / password123

**Referrers:**
- referrer1@google.com / password123
- referrer2@meta.com / password123

## 📱 User Flows

### Candidate Journey
1. Register as candidate
2. Complete profile with skills & target companies
3. Discover matching referrers
4. Send personalized referral request
5. Track progress from request → hired
6. Build reputation with successful referrals

### Referrer Journey
1. Register as referrer
2. Complete company & role info
3. Discover matching candidates
4. Manage incoming referral requests
5. Move candidates through hiring pipeline
6. Earn points & climb leaderboard

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel deploy
```

### Backend (Render)
```bash
cd server
# Push to GitHub
# Connect to Render
# Deploy with environment variables
```

## 📞 Support

For issues or questions:
1. Check the GitHub issues
2. Review the documentation
3. Create a new issue with details

## 📜 License

MIT License - See LICENSE file for details

## 🙏 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ by RefLink Team**

*Get referred. Get hired. 🚀*
