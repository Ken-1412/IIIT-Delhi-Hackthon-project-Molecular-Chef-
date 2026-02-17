# MolecularChef Backend

Node.js/Express backend for the MolecularChef application, providing API proxy to Foodoscope (FlavorDB + RecipeDB2), user authentication, and recipe management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Recipes (Protected)
- `GET /api/recipes` - Get user's recipes
- `POST /api/recipes` - Save recipe
- `DELETE /api/recipes/:id` - Delete recipe

### FlavorDB Proxy
- `GET /api/flavordb/compounds/:ingredient` - Get flavor compounds
- `GET /api/flavordb/pairings?ingredient1=X&ingredient2=Y` - Get pairings
- `GET /api/flavordb/substitutes/:ingredient` - Get substitutes
- `GET /api/flavordb/recipes/search?q=query` - Search recipes
- `GET /api/flavordb/health` - Check API health

### Health
- `GET /api/health` - Backend health check

## Environment Variables

See `.env` file for configuration.

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: SQLite (via Prisma)
- **Authentication**: JWT + bcrypt
- **API Client**: axios
