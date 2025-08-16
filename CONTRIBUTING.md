# Contributing to Commend AI

We love your input! We want to make contributing to Commend AI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Code Style

#### Python (Backend)
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints where possible
- Write docstrings for all functions and classes
- Maximum line length: 88 characters (Black formatter)

#### JavaScript/React (Frontend)
- Use ESLint configuration provided in the project
- Follow React Hooks best practices
- Use functional components with hooks
- Prefer arrow functions for component definitions

### Commit Messages

Use clear and meaningful commit messages:

```
feat: add new comment style for professional tone
fix: resolve YouTube API rate limiting issue
docs: update installation instructions
refactor: optimize comment generation logic
test: add unit tests for AI service
```

### Testing

#### Backend Testing
```bash
cd backend
python -m pytest tests/
```

#### Frontend Testing
```bash
cd frontend
npm test
```

### Environment Setup

1. **Backend Development Environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

2. **Frontend Development Environment**
```bash
cd frontend
npm install
npm run dev
```

## Issue Reporting

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/hasanaltuntas/commend-ai/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Security Issues

Please do not report security vulnerabilities publicly. Instead, email us at security@commend-ai.com with details.

## Feature Requests

We welcome feature requests! Please provide:

- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any relevant examples or mockups

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Getting Help

- Check existing [Issues](https://github.com/hasanaltuntas/commend-ai/issues) and [Discussions](https://github.com/hasanaltuntas/commend-ai/discussions)
- Join our community discussions
- Reach out to maintainers if needed

## Development Workflow

### Setting Up Your Development Environment

1. **Clone and Setup**
```bash
git clone https://github.com/hasanaltuntas/commend-ai.git
cd commend-ai
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

3. **Frontend Setup**
```bash
cd frontend
npm install --legacy-peer-deps
```

4. **Run Development Servers**
```bash
# Terminal 1 - Backend
cd backend && python run.py

# Terminal 2 - Frontend  
cd frontend && npm start
```

### Making Changes

1. **Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**
- Write clean, well-documented code
- Follow the coding standards
- Add tests for new functionality

3. **Test Your Changes**
```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test

# Linting
cd backend && flake8 .
cd frontend && npm run lint
```

4. **Commit and Push**
```bash
git add .
git commit -m "feat: your descriptive commit message"
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Use the pull request template
- Link related issues
- Provide clear description of changes

### Project Structure

```
commend-ai/
├── backend/
│   ├── app/
│   │   ├── core/           # Core configuration and database
│   │   ├── modules/        # Feature modules (user, comment, admin, etc.)
│   │   ├── integrations/   # External API integrations
│   │   └── shared/         # Shared utilities
│   ├── tests/              # Backend tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # Stylesheets
│   ├── public/             # Static assets
│   └── package.json
└── docs/                   # Documentation
```

## Release Process

1. **Version Bumping**
```bash
# Update version in package.json and config.py
git tag v1.x.x
git push origin v1.x.x
```

2. **Deployment**
- Frontend automatically deploys to Vercel
- Backend automatically deploys to Render
- Both services are connected to GitHub

## Questions?

Don't hesitate to ask questions! You can:

- Open an issue for bugs or feature requests
- Start a discussion for general questions
- Contact maintainers directly

Thank you for contributing to Commend AI! 🚀