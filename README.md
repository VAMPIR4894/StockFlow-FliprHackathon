# StockFlow AI Insights

## Overview

StockFlow AI Insights is a powerful financial analytics platform that leverages artificial intelligence to provide personalized stock market insights, trend analysis, and investment recommendations. The platform combines real-time market data with advanced AI algorithms to help investors make informed decisions.

## Team AI-gineers

Our team consists of passionate developers and data scientists working together to revolutionize stock market analysis:

- **Abhay A Rao**
  - Led the backend development and database architecture
  - Implemented RESTful APIs using Express.js
  - Designed and implemented MongoDB schemas and data models
  - Set up authentication and authorization systems
  - Integrated real-time data processing pipelines
  - Optimized database queries and performance

- **Aditya CP**
  - Spearheaded frontend development using React and TypeScript
  - Designed and implemented responsive UI components
  - Created interactive dashboards and data visualizations
  - Integrated real-time data updates and WebSocket connections
  - Implemented state management and data fetching logic
  - Built user authentication flows and protected routes

- **Abhay Raghavendra Revankar**
  - Curated and processed financial datasets
  - Developed and integrated the AI-powered chatbot system
  - Implemented data preprocessing pipelines
  - Created training datasets for AI models
  - Integrated Google Gemini API for natural language processing
  - Developed data validation and cleaning scripts

## Features

- **AI-Powered Stock Analysis**: Get intelligent insights on stocks, market trends, and investment opportunities
- **Personalized Recommendations**: Receive tailored investment suggestions based on your portfolio and preferences
- **Real-Time Market Data**: Access up-to-date information on stocks, indices, and market movements
- **Interactive Dashboards**: Visualize market trends and portfolio performance with intuitive charts
- **Multi-Agent AI System**: 
  - **Stock Agent**: Specialized financial advisor for market analysis and investment strategies
  - **Support Agent**: Dedicated assistant for account management and platform support
- **Secure Authentication**: Robust user authentication and data protection

## Tech Stack

### Frontend
- **React**: Modern UI framework for building responsive interfaces
- **TypeScript**: Type-safe JavaScript for enhanced code quality
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible UI components
- **Recharts**: Composable charting library for data visualization
- **React Query**: Data fetching and state management
- **React Router**: Client-side routing for single-page applications

### Backend
- **Node.js**: JavaScript runtime for server-side operations
- **Express**: Web framework for building RESTful APIs
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: Secure authentication with JSON Web Tokens
- **Google Gemini API**: Advanced AI for natural language processing and insights generation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stockflow-ai-insights.git
   cd stockflow-ai-insights
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**
   - Create a `.env` file in the server directory with the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run start
   ```

## Project Structure

```
stockflow-ai-insights/
├── public/              # Static assets
├── server/              # Backend server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── index.ts         # Server entry point
├── src/                 # Frontend source code
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API clients
│   ├── pages/           # Application pages
│   └── App.tsx          # Main application component
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for providing the AI capabilities
- [MongoDB](https://www.mongodb.com/) for the database
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
