# TailorMade Resume Enhancement

TailorMade is an application that helps users optimize their LaTeX resumes for specific job applications using AI-powered analysis.

## Getting Started

### Environment Setup

Before running the application, you need to set up your environment variables. Create a `.env.local` file in the root directory of the project with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=your-supabase-auth-callback-url
```

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon/public key
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL`: The URL for OAuth callback, typically `https://your-supabase-project-id.supabase.co/auth/v1/callback`

### Google Authentication Setup

To enable Google authentication:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Set up a Google Cloud project and obtain OAuth credentials
5. Add the redirect URL to the allowed redirect URLs in Google Cloud Console
6. Add your Google client ID and secret to Supabase

### Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

## Features

- **LaTeX Resume Upload**: Upload LaTeX resumes to tailor for job applications
- **Job Posting Analysis**: Analyze job postings to extract key requirements
- **AI-Powered Enhancement**: Optimize resumes for specific job applications
- **Authentication**: Secure user authentication with email/password and Google Sign-In
- **Resume Management**: Manage and view all your original and tailored resumes

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Authentication**: Email/Password and Google OAuth