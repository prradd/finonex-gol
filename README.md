## Conway&#39;s Game of Life

## Description
This project implements Conway's Game of Life using Next.js, TypeScript, and Tailwind CSS. The game includes features for evolving the board, navigating between states, and setting the board size.


## Installation

```bash
# Clone the project
git clone https://github.com/prradd/finonex-gol.git
# Install dependencies
npm install
# Run the project
npm run dev
```

Docker is also supported. To build the Docker image, run the following commands:

```bash
npm run docker:build
# then
npm run docker:up
# to close the containers
npm run docker:down
```

## Project Structure

```bash
/project-root
  /src
    /app
      page.tsx
    /components
      Cell.tsx
      GameBoard.tsx
    GameContext.tsx
  package.json
  tsconfig.json
  Dockerfile
```

## Requirements
- **Node.js** v20.0.0 or higher
- **npm** v10.7.0 or higher
- **Docker** (optional)

## License
This project is licensed under the MIT License.

