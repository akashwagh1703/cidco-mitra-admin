# CIDCO Mitra Admin Panel - Setup Guide

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your API URL:

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## 🔐 Default Login Credentials

```
Email: admin@cidcomitra.gov.in
Password: admin123
```

## 📁 Project Structure

```
cidco-mitra-admin/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components (Button, Input, etc.)
│   │   ├── forms/        # Form components
│   │   ├── tables/       # Table components
│   │   └── common/       # Common components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard
│   │   ├── leads/        # Lead management
│   │   ├── notifications/# Notifications
│   │   ├── users/        # User management
│   │   ├── roles/        # Role management
│   │   └── settings/     # Settings pages
│   ├── router/           # Routing configuration
│   ├── store/            # Zustand stores
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   └── constants/        # Constants
├── .env.example          # Environment variables example
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🎨 Features

### ✅ Authentication Module
- Login with email/password
- Protected routes
- Session management
- Logout functionality

### ✅ Role & Permission Management
- User management (Add, Edit, Delete)
- Role management with custom permissions
- Permission-based UI rendering
- Route protection based on roles

### ✅ Lead Management
- Lead list with filters and search
- Lead detail view
- Status management
- Activity timeline
- Notes system

### ✅ Notification System
- Real-time notifications
- Notification center
- Read/unread status
- Notification bell in topbar

### ✅ Email Configuration
- SMTP settings
- Test email functionality
- Email templates

### ✅ Website Settings
- General settings
- Branding (logo, colors, fonts)
- Homepage content
- SEO settings

### ✅ UI Components
- Buttons, Inputs, Selects, Textareas
- Modals, Drawers, Tabs
- Tables with sorting and pagination
- Cards, Badges, Breadcrumbs
- Toast notifications
- Confirm dialogs
- Empty states

## 🔧 Configuration

### Tailwind Theme

The theme uses a government-style color palette:
- Primary: Blue (#3b82f6)
- Secondary: Gray (#64748b)

Customize in `tailwind.config.js`

### API Integration

All API calls are configured in `src/services/` directory.
Update the base URL in `.env` file.

### State Management

Using Zustand for state management:
- `authStore` - Authentication state
- `notificationStore` - Notifications
- `toastStore` - Toast messages
- `uiStore` - UI state (sidebar, etc.)

## 🔒 Security Features

- Protected routes with AuthGuard
- Role-based access control
- Permission-based UI rendering
- Secure token storage
- API request interceptors

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎯 Production Deployment

### Build Optimization
- Code splitting
- Lazy loading
- Tree shaking
- Minification

### Deployment Steps

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

3. Configure environment variables on your hosting platform

## 🐛 Troubleshooting

### Port Already in Use
Change the port in `vite.config.js`:
```js
server: {
  port: 3002
}
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

Proprietary - CIDCO Mitra
