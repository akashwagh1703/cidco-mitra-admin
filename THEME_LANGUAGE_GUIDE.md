# Theme & Language Implementation Guide

## Overview
Light/Dark mode and multi-language support (English, Marathi, Hindi) has been added to CIDCO MITRA Admin Panel.

## Features Added

### 1. Dark Mode
- Toggle between light and dark themes
- Persistent theme selection (saved in localStorage)
- Smooth transitions between themes
- Applied across all components

### 2. Multi-Language Support
- English (en)
- Marathi (mr) - मराठी
- Hindi (hi) - हिंदी
- Persistent language selection
- Easy to extend with more languages

## Files Modified

### Core Files
1. **src/store/uiStore.js** - Added theme and language state
2. **src/App.jsx** - Theme class application
3. **tailwind.config.js** - Enabled dark mode
4. **src/layouts/Topbar.jsx** - Theme/language toggles
5. **src/layouts/Sidebar.jsx** - Dark mode styles + translations
6. **src/layouts/AdminLayout.jsx** - Dark mode backgrounds

### New Files
1. **src/locales/translations.js** - Translation strings

## Usage

### Using Translations in Components

```jsx
import { useTranslation } from '../locales/translations'
import useUIStore from '../store/uiStore'

function MyComponent() {
  const { language } = useUIStore()
  const t = useTranslation(language)
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <button>{t('save')}</button>
    </div>
  )
}
```

### Adding Dark Mode Styles

Use Tailwind's `dark:` prefix:

```jsx
<div className="bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white">
  Content
</div>
```

### Adding New Translations

Edit `src/locales/translations.js`:

```javascript
export const translations = {
  en: {
    myNewKey: 'My New Text'
  },
  mr: {
    myNewKey: 'माझा नवीन मजकूर'
  },
  hi: {
    myNewKey: 'मेरा नया पाठ'
  }
}
```

## UI Controls

### Theme Toggle
- Location: Top-right corner of Topbar
- Icon: Moon (light mode) / Sun (dark mode)
- Click to toggle between themes

### Language Selector
- Location: Top-right corner of Topbar (next to theme toggle)
- Icon: Globe
- Click to open dropdown with language options
- Options: English, मराठी, हिंदी

## Color Scheme

### Light Mode
- Background: White, Gray-50
- Text: Gray-900, Gray-700
- Primary: Blue-700
- Borders: Gray-200

### Dark Mode
- Background: Gray-800, Gray-900
- Text: White, Gray-300
- Primary: Blue-400
- Borders: Gray-700

## Extending

### Add More Languages

1. Add language to translations object:
```javascript
export const translations = {
  // ... existing languages
  gu: { // Gujarati
    dashboard: 'ડેશબોર્ડ',
    // ... more translations
  }
}
```

2. Add to language selector in Topbar.jsx:
```jsx
{['en', 'mr', 'hi', 'gu'].map((lang) => (
  // ... existing code
))}
```

### Add More Translation Keys

Simply add the key to all language objects in `translations.js`:

```javascript
export const translations = {
  en: {
    // ... existing keys
    newFeature: 'New Feature'
  },
  mr: {
    // ... existing keys
    newFeature: 'नवीन वैशिष्ट्य'
  },
  hi: {
    // ... existing keys
    newFeature: 'नई सुविधा'
  }
}
```

## Best Practices

1. **Always add dark mode styles** when creating new components
2. **Use translation keys** instead of hardcoded text
3. **Test in all themes** before deploying
4. **Keep translations consistent** across all languages
5. **Use semantic color classes** (primary, secondary) instead of specific colors

## Testing

1. Toggle theme and verify all components render correctly
2. Switch between languages and verify translations
3. Refresh page to ensure persistence works
4. Test on different screen sizes

## Browser Support

- Modern browsers with localStorage support
- CSS custom properties support
- Tailwind CSS dark mode (class strategy)

## Performance

- Theme changes are instant (CSS class toggle)
- Language changes require component re-render
- Both settings persist in localStorage
- No API calls required

---

**Built for CIDCO MITRA Admin Panel**
