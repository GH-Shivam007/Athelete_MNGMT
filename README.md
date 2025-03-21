# 🏃‍♂️ Athlete Hub

A comprehensive athlete management system built with React, Supabase, and TailwindCSS. Track athletes' performance, manage training plans, monitor injuries, and organize events all in one place.

![Athlete Hub Dashboard](https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&auto=format&fit=crop&q=80)

## ✨ Features

- **🏃‍♂️ Athlete Management**
  - Create and manage athlete profiles
  - Track personal information and sports categories
  - Monitor progress over time

- **📊 Performance Tracking**
  - Record and visualize performance metrics
  - Track progress with detailed analytics
  - Customizable metric types

- **📋 Training Plans**
  - Create structured training programs
  - Set goals and milestones
  - Track completion status

- **🎯 Event Management**
  - Schedule and manage sporting events
  - Track event details and locations
  - Manage participant information

- **🏥 Injury Tracking**
  - Record and monitor injuries
  - Track recovery progress
  - Maintain injury history

- **🌓 Dark Mode Support**
  - Seamless dark/light mode switching
  - System preference detection
  - Persistent theme selection

- **🔐 Secure Authentication**
  - Email verification
  - Secure password authentication
  - Protected routes and data

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/athlete-hub.git
   cd athlete-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Type Checking**: TypeScript
- **Code Quality**: ESLint

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🔒 Security Features

- Row Level Security (RLS) policies
- Secure authentication flow
- Email verification
- Protected API endpoints
- Data access control

## 🗄️ Database Schema

The application uses the following main tables:
- `athletes`
- `performance_metrics`
- `training_plans`
- `events`
- `injury_reports`

Each table has appropriate RLS policies and relationships.

## 🎨 UI/UX Features

- Intuitive navigation
- Clean, modern design
- Smooth transitions
- Interactive components
- Consistent styling
- Accessible components
- Loading states
- Error handling
- Success notifications

## 📦 Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Deploy to your preferred hosting platform (e.g., Netlify, Vercel)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.io/) for backend services
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [React](https://reactjs.org/) for the UI framework