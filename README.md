# Nzonzing - AI Story Generation Platform

Transform short story summaries into rich narratives with AI-generated scenes and image prompts.

## 🚀 Features

- **Story Expansion**: Convert 200-word summaries into full narratives (5, 10, or 30 minutes)
- **Scene Generation**: Automatically break down stories into scenes with visual descriptions
- **Character Extraction**: AI identifies and profiles characters with visual anchor prompts
- **Series Creation**: Generate multi-episode series with plot threads and continuity
- **Multi-Angle Prompts**: Create diverse image prompts for each scene (main, close-up, wide-shot, etc.)
- **User Authentication**: Secure sign-up/sign-in with Clerk
- **Persistent Storage**: All stories saved to Supabase PostgreSQL database
- **Workflow Tracking**: Monitor AI generation progress and history

## 📁 Project Structure

```
nzonzing/
├── client/          # Next.js 15 frontend application
├── server/          # Express.js API server
├── storyteller/     # Mastra AI workflow library
└── supabase/        # Database migrations and schema
```

## 🆕 Database Integration (NEW!)

This project now includes **Supabase + Clerk** integration for persistent data storage and user authentication.

### Quick Start

**New to the integration?** Start here:
- 📘 [**Quick Start Guide**](./QUICK_START.md) - Get set up in 10 minutes
- 📖 [**Integration Guide**](./SUPABASE_CLERK_INTEGRATION.md) - Comprehensive documentation
- 📝 [**Integration Summary**](./INTEGRATION_SUMMARY.md) - Overview of changes

### What's Included

✅ **Clerk Authentication** - Secure user management
✅ **Supabase PostgreSQL** - Scalable database
✅ **Row Level Security** - User data protection
✅ **TypeScript Types** - Type-safe database operations
✅ **Migration Files** - Production-ready schema
✅ **API Endpoints** - RESTful data access

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 15.5.5 |
| UI Library | React | 19.1.0 |
| Backend | Express | 4.18.2 |
| AI Engine | Mastra | 0.17.0 |
| AI Model | Google Gemini | 2.0 Flash |
| Auth | Clerk | 6.33.7 |
| Database | Supabase/PostgreSQL | Latest |
| Styling | TailwindCSS | 4 |
| State | Zustand | 5.0.8 |
| Language | TypeScript | 5.9.3 |

## 📦 Installation

### Prerequisites

- Node.js 20.9.0+
- npm or yarn
- Clerk account ([clerk.com](https://clerk.com))
- Supabase account ([supabase.com](https://supabase.com))
- Google AI API key ([ai.google.dev](https://ai.google.dev))

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nzonzing
   ```

2. **Install dependencies**
   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install

   # Storyteller
   cd ../storyteller
   npm install
   ```

3. **Configure environment variables**

   See [QUICK_START.md](./QUICK_START.md) for detailed setup instructions.

   ```bash
   # Client - Create client/.env.local
   cp client/.env.example client/.env.local
   # Edit with your Clerk and Supabase keys

   # Server - Create server/.env
   cp server/.env.example server/.env
   # Edit with your credentials
   ```

4. **Set up database**

   Follow the migration steps in [QUICK_START.md](./QUICK_START.md#step-3-run-database-migrations-2-minutes)

5. **Start development servers**
   ```bash
   # Terminal 1: Server
   cd server
   npm run dev

   # Terminal 2: Client
   cd client
   npm run dev
   ```

6. **Visit the app**

   Open [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Creating a Story

1. Sign in with Clerk
2. Navigate to the Story Creator
3. Enter a 200-word story summary
4. Select duration (5, 10, or 30 minutes)
5. Generate your story
6. View full narrative, characters, and scenes

### Creating a Series

1. Navigate to Series Creator
2. Enter series summary
3. Specify number of episodes
4. Generate series structure
5. Write individual episodes
6. Access multi-angle scene prompts

### Viewing Your Creations

- **My Stories**: View all your generated stories
- **My Series**: Browse your series library
- **Workflow History**: Track AI generation runs

## 🔌 API Endpoints

### Workflow Endpoints

- `POST /api/story-to-scenes` - Complete story pipeline
- `POST /api/expand-story` - Expand summary only
- `POST /api/generate-scenes` - Generate scenes from story
- `POST /api/create-series` - Create series structure
- `POST /api/write-episode` - Write individual episode

### Data Endpoints (Authenticated)

- `GET /api/my-stories` - Get user's stories
- `GET /api/stories/:id` - Get specific story
- `GET /api/my-series` - Get user's series
- `GET /api/series/:id` - Get specific series
- `GET /api/my-workflow-runs` - Get workflow history
- `DELETE /api/stories/:id` - Delete story

See [SUPABASE_CLERK_INTEGRATION.md](./SUPABASE_CLERK_INTEGRATION.md#available-api-endpoints) for full API documentation.

## 🗄️ Database Schema

### Main Tables

- **users** - Clerk user profiles
- **stories** - Generated stories with metadata
- **scenes** - Story scenes with image prompts
- **series** - Multi-episode series
- **episodes** - Individual episodes
- **episode_scenes** - Episode scenes with multi-angle prompts
- **workflow_runs** - AI workflow execution tracking

See migration files in `/supabase/migrations/` for complete schema.

## 🔐 Authentication & Security

- **Clerk** handles user authentication
- **JWT tokens** connect Clerk to Supabase
- **Row Level Security (RLS)** enforces data isolation
- Users can only access their own data
- Service keys stored securely server-side

## 🚢 Deployment

### Client (Vercel)

```bash
cd client
vercel deploy
```

### Server (Railway, Render, or any Node.js host)

```bash
cd server
npm run build
npm start
```

### Database (Supabase)

Already hosted! Just configure your production URLs.

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - 10-minute setup
- [Integration Guide](./SUPABASE_CLERK_INTEGRATION.md) - Comprehensive docs
- [Integration Summary](./INTEGRATION_SUMMARY.md) - What changed
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production setup

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

- **Mastra** - AI workflow orchestration
- **Google Gemini** - AI model
- **Clerk** - Authentication platform
- **Supabase** - Database platform
- **Next.js** - React framework
- **Vercel** - Hosting platform

## 🐛 Troubleshooting

See the [Troubleshooting section](./SUPABASE_CLERK_INTEGRATION.md#troubleshooting) in the integration guide.

Common issues:
- JWT token validation failures
- RLS policy violations
- Environment variable configuration

## 📞 Support

For issues or questions:
- Check the documentation in this repo
- Review the [Integration Guide](./SUPABASE_CLERK_INTEGRATION.md)
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, Express, Mastra, Clerk, and Supabase**
