# Job Application Tracker

A modern web application for tracking job applications, interviews, and resumes. Built with React, TypeScript, Express, MongoDB, and Docker.

## Features

- **Track Applications**: Record job applications with company details, roles, and status
- **Manage Interview Stages**: Add and track different interview stages (HR screening, technical interview, fit interview, final interview)
- **File Upload**: Upload resumes (PDF, DOCX) up to 3MB
- **Advanced Search**: Full-text search across companies, roles, comments, and vacancy descriptions
- **CV Enhance**: AI-powered resume evaluation and ATS optimization using DeepSeek Reasoner
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Dockerized**: Easy deployment with Docker Compose
- **Type Safety**: Full TypeScript support on both frontend and backend

## Tech Stack

### Frontend

- React 19 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

### Backend

- Express.js with TypeScript
- MongoDB with Mongoose ODM
- Joi for request validation
- Multer for file uploads
- Winston for logging (planned)

### Infrastructure

- Docker & Docker Compose
- MongoDB with persistence volumes
- Nginx for frontend serving
- Multi-stage Docker builds

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd job-tracker
```

2. Start the application:

```bash
docker-compose up --build
```

3. Open your browser:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017

## Development

### Local Development (without Docker)

1. Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

2. Backend setup:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. Frontend setup:
```bash
cd frontend
npm install
npm start
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/job_tracker
FRONTEND_URL=http://localhost:3000
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

#### Docker Compose (.env)
```env
NODE_ENV=development
MONGO_USER=admin
MONGO_PASSWORD=password
FRONTEND_URL=http://localhost:3000
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## API Documentation

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List applications with pagination |
| GET | `/api/applications/:id` | Get application details |
| POST | `/api/applications` | Create new application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/applications/search?q=query` | Search applications |

### Stages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:applicationId/stages` | Add stage to application |
| PUT | `/api/stages/:id` | Update stage |
| DELETE | `/api/stages/:id` | Delete stage |

### Health Check
- GET `/health` - Service health status

### CV Enhance
- POST `/api/cv-enhance/evaluate` - Evaluate work experience against job description
- POST `/api/cv-enhance/enhance` - Generate ATS-optimized work experience text

## Project Structure

```
job-tracker/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components (including CVEnhancePage)
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers (including cvEnhanceController)
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes (including cvEnhanceRoutes)
│   │   ├── middleware/    # Express middleware
│   │   └── validators/    # Request validators
│   ├── uploads/           # Uploaded files
│   └── Dockerfile
├── docker/                 # Docker related files
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # This file
```

## Development Features

### Code Quality
- ESLint with TypeScript support
- Prettier for code formatting
- Husky pre-commit hooks
- Lint-staged for staged files only

### Testing
- Jest for unit testing (planned)
- React Testing Library (planned)
- Supertest for API testing (planned)

### Security
- Helmet.js for security headers
- CORS configuration
- File type validation
- Rate limiting (planned)

## Deployment

### Production Build
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Backups
MongoDB data is persisted in a Docker volume. Backup scripts are located in `docker/mongo/backup/`.

### Monitoring
- Health checks via `/health` endpoint
- Docker container health checks
- MongoDB monitoring (planned)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

For issues and feature requests, please use the GitHub Issues page.