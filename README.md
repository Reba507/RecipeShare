
- The frontend communicates with the backend via REST API endpoints (`/api/recipes`).  
- The backend handles CRUD operations and business logic.  
- Data is temporarily stored in an in-memory database.

---

## **Setup Instructions**

### Prerequisites
- [.NET 7 SDK](https://dotnet.microsoft.com/download)
- [Node.js + npm](https://nodejs.org/)
- Optional: Visual Studio / VS Code

### Backend
1. Open terminal and navigate to `RecipeShare.API`:
    ```bash
    cd RecipeShare.API
    ```
2. Install dependencies (if any) and run the API:
    ```bash
    dotnet restore
    dotnet run
    ```
3. API will run on `http://localhost:5252` by default.

### Frontend
1. Open another terminal and navigate to `recipe-share-client`:
    ```bash
    cd recipe-share-client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the frontend:
    ```bash
    npm run dev
    ```
4. Open `http://localhost:5173` in your browser.

---

5. RecipeShare Solution
│
├── backend
│   ├── RecipeShare.API           # ASP.NET Core Web API (Controllers, REST endpoints)
│   ├── RecipeShare.Core          # Domain models, business logic, DTOs
│   ├── RecipeShare.Infrastructure # Data access, EF Core DbContext, repository layer
│   ├── RecipeShare.Benchmarks    # Performance testing utilities (BenchmarkDotNet)
│   └── RecipeShare.Tests         # Unit tests
│
├── frontend
│   └── recipe-share-client       # React + Vite frontend, UI components, CSS
│
└── RecipeShare.sln               # Solution file linking all projects


## **Tech Stack**
- Backend: ASP.NET Core, Entity Framework Core (In-Memory)
- Frontend: React, Vite, JSX
- Testing: xUnit

---

## **Features**
- Full CRUD operations for recipes
- Filtering by dietary
- Responsive UI with modern styling
- Unit testing for API endpoints
- Benchmark endpoint for performance testing
