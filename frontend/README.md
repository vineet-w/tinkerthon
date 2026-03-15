# TINKERTHON '26 — The Matrix Has You

Welcome to the official digital entry for **TINKERTHON '26**. This project is a futuristic, Matrix-inspired web application designed to take participants on a digital journey through the event's different sectors.

![Matrix Theme](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## 🕶️ The Experience

Tinkerthon '26 is not just a hackathon; it's a descent into the system. The landing page features a terminal-style interface with:
- **Matrix Rain**: A high-performance canvas-based binary rain effect.
- **Portal Navigation**: Interactive "doors" that transition users into different event dimensions.
- **CRT Aesthetics**: Scanlines, flicker effects, and glitch typography for that authentic cyberpunk feel.
- **Morpheus Silhouette**: A 3D-inspired silhouette transition (planned/integrated).

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.9.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tinkerthon/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create local environment file:
   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

To open from another device on the same network, run:
```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the system initializing.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Orbitron, Share Tech Mono (loaded via @fontsource)

## 📂 Project Structure

- `app/`: Next.js pages and global styles.
- `components/ui/`: Core UI components including the `PortalHallway`, `TimelineSection`, and `AboutSection`.
- `lib/`: Utility functions and static data (e.g., `portals` metadata).
- `public/`: Assets including custom glitch fonts (`Hacked.ttf`).

## 📜 Event Timeline

The "The Descent" section outlines the roadmap for Tinkerthon '26:
- **Registration**: Starts 16/03/2026
- **PS Release**: 20/03/2026
- **Final Presentation**: 23/03/2026

---

*Made with 💚 for the rebels and the dreamers.*
> "Every exit is an entry somewhere else."
