# Crypto Tracker

A modern cryptocurrency tracking application built with Next.js, featuring real-time price updates, interactive charts, and detailed crypto analytics.

## Demo

[![Crypto Tracker Demo](https://www.loom.com/share/6bfd490772df4ffbbe09f26c4a778886?sid=f4f25cb4-8f84-4b19-8597-3741b81e3fa6)

## Features

- 📈 Real-time cryptocurrency price tracking
- 📊 Interactive candlestick charts for detailed price analysis
- ⚡ Sparkline charts for quick price trend visualization
- 🎨 Modern and responsive UI built with Tailwind CSS
- 🌓 Dark/Light theme support
- 📱 Mobile-responsive design
- ⚙️ Redux-based state management
- 🔄 Real-time data updates
- 🖼️ Crypto currency logos and visual assets
- 🎯 Modular component architecture

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Redux (with feature-based architecture)
- **UI Components**: Custom components with shadcn/ui
- **Type Safety**: TypeScript

## Project Structure

```
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── candlestick-chart
│   ├── crypto-modal
│   ├── crypto-table
│   ├── crypto-tracker
│   └── sparkline-chart
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API functions
│   └── features/       # Redux feature slices
├── public/             # Static assets
│   └── cryptologo/    # Cryptocurrency logos
└── styles/            # Global styles
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

The application uses several configuration files:

- `components.json` - UI component configurations
- `tailwind.config.ts` - Tailwind CSS settings
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
