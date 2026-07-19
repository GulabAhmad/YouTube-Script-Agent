# YouTube Script Agent Frontend

A modern web application for generating YouTube video scripts using AI, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🤖 AI-Powered Script Generation
- Analyze YouTube videos and extract transcripts
- Research topics using AI
- Generate comprehensive script outlines
- Create complete video scripts with AI assistance

### 💾 Smart Sidebar Management (ChatGPT-like)
- **Automatic Session Saving**: Topics are automatically saved to the sidebar when users research them
- **Real-time Updates**: Sidebar updates immediately without page refresh
- **Persistent Storage**: All scripts and research are saved in the database
- **Session History**: Access all previous work from the sidebar

### 🔄 Workflow
1. **Enter YouTube URL**: Paste a YouTube URL to analyze
2. **Video Analysis**: AI extracts and analyzes the video transcript
3. **Research Topic**: Research any related topic with AI assistance
4. **Generate Outline**: Create a structured script outline
5. **Create Script**: Generate the final video script
6. **Save & Access**: All work is automatically saved and accessible from the sidebar

### 🎨 Modern UI/UX
- Dark/Light theme support
- Responsive design
- Smooth animations and transitions
- Intuitive navigation

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with Tailwind
- **API Integration**: RESTful API calls
- **Authentication**: JWT-based auth system

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file with your API configuration:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## Sidebar Functionality

The sidebar works similar to ChatGPT's conversation history:

### Automatic Saving
- When a user researches a topic, it's automatically saved to the sidebar
- The topic title appears immediately without requiring a page refresh
- All research data, outlines, and scripts are persisted

### Real-time Updates
- Uses Redux for state management
- Sidebar updates instantly when new content is created
- No manual refresh required

### Session Management
- Each script session is saved with a unique ID
- Users can click on any saved session to continue working
- All session data is preserved and can be accessed later

## Project Structure

```
youtubescriptagent-frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (defaults)/        # Main application pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── layouts/           # Layout components
│   ├── script-analyse/    # Script analysis components
│   └── ui/               # UI components
├── store/                # Redux store configuration
├── lib/                  # Utility functions and API
└── styles/               # Global styles
```

## API Endpoints

The application integrates with a backend API for:
- User authentication
- YouTube video analysis
- AI-powered research and script generation
- Script storage and retrieval

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
