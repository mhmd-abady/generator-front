# Generator Frontend

A modern, responsive React application for utility management built with TypeScript, Vite, and Material-UI. This application provides a comprehensive dashboard for managing subscribers, meters, invoices, payments, and reports with professional design and responsive layout.

## ✨ Features

- **🎨 Professional Design**: Modern UI with customizable themes (Teal & Gold, Black & Gold)
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop screens
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🔧 Type-Safe**: Full TypeScript support for better development experience
- **🎯 Material-UI**: Professional component library with extensive customization
- **📊 Interactive Dashboard**: Real-time analytics and insights
- **💳 Payment Management**: Comprehensive billing and payment tracking
- **📈 Reports & Analytics**: Detailed reporting with interactive charts
- **👥 Subscriber Management**: Complete customer lifecycle management
- **⚙️ Settings & Configuration**: Flexible system configuration

## 🚀 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Material-UI (MUI) v7
- **State Management**: React Query for server state
- **Routing**: React Router v7
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios for API communication
- **Styling**: Emotion for CSS-in-JS
- **Icons**: Material-UI Icons

## 🏗️ Architecture

### Project Structure
```
src/
├── api/                 # API service functions
├── auth/               # Authentication components
├── components/         # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard pages
│   ├── Invoices/       # Invoice management
│   ├── Locations/      # Location management
│   ├── MeterReadings/  # Meter reading functionality
│   ├── Meters/         # Meter management
│   ├── Payments/       # Payment processing
│   ├── Reports/        # Reporting system
│   ├── Settings/       # Application settings
│   └── Subscribers/    # Subscriber management
├── utils/              # Utility functions and constants
└── assets/             # Static assets
```

### Key Components

- **Theme System**: Advanced theming with responsive utilities
- **Layout System**: Flexible, responsive layout components
- **Navigation**: Professional sidebar with mobile optimization
- **Dashboard**: Comprehensive analytics dashboard
- **Forms**: Type-safe form components with validation
- **Tables**: Sortable, filterable data tables
- **Charts**: Interactive data visualizations

## 🎨 Design System

### Themes
- **Teal & Gold**: Professional blue-green and gold color scheme
- **Black & Gold**: Elegant dark theme with gold accents

### Responsive Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Typography Scale
Responsive typography with fluid scaling across all screen sizes.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-First Approach**: Optimized for mobile devices first
- **Tablet Optimization**: Dedicated tablet layouts and interactions
- **Desktop Enhancement**: Advanced features for larger screens
- **Touch-Friendly**: Large touch targets and gestures
- **Performance**: Optimized loading and rendering across devices

### Responsive Features
- Adaptive navigation (sidebar on desktop, drawer on mobile)
- Fluid typography and spacing
- Responsive grid layouts
- Mobile-optimized forms and tables
- Touch-friendly interactions

## 🎯 Professional Features

- **Advanced Theming**: Dynamic theme switching with persistent storage
- **Professional Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant components and interactions
- **Performance**: Optimized bundle size and loading times
- **SEO Ready**: Proper meta tags and semantic HTML
- **PWA Ready**: Service worker and manifest configuration

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Generator Frontend
```

### Theme Customization
Modify `src/utils/colors.ts` to customize color schemes.

### Build Configuration
Update `vite.config.ts` for build customization.

## 📈 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic image optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Intelligent caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- Vite for the blazing fast build tool
- React Query for powerful data fetching
- Recharts for beautiful data visualizations
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
