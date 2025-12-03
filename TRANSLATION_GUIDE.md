# Translation Guide

## Overview

This dashboard now supports multi-language functionality with English and Arabic translations. The implementation includes:

- ✅ **Complete Arabic Translation** - All dashboard text translated to Arabic
- ✅ **RTL Support** - Automatic right-to-left layout for Arabic
- ✅ **Arabic Font Support** - Noto Sans Arabic font integration
- ✅ **Language Switcher** - Easy language toggle in the header
- ✅ **Persistent Language Selection** - Language preference saved in cookies

## Features

### Supported Languages

1. **English (en)** - Default language
2. **Arabic (ar)** - Includes RTL layout support

### What's Translated

- Dashboard titles and headers
- Navigation menu items
- Statistics cards
- Analytics section
- Profile dropdown menu
- Settings menu
- Search placeholder
- Error pages
- Authentication pages references

## Usage

### Switching Languages

Click the language switcher icon (🌐) in the header and select your preferred language:
- **English** - Left-to-right layout
- **العربية (Arabic)** - Right-to-left layout

### How It Works

The translation system automatically:
1. Changes all text to the selected language
2. Switches layout direction (LTR/RTL)
3. Updates the HTML `lang` attribute
4. Saves your preference in a cookie

## For Developers

### Adding New Translations

To add new translated text:

1. **Add to English translations** (`src/locales/en.ts`):
```typescript
export const en = {
  // ... existing translations
  newSection: {
    title: 'New Title',
    description: 'New Description',
  },
}
```

2. **Add to Arabic translations** (`src/locales/ar.ts`):
```typescript
export const ar: Translation = {
  // ... existing translations
  newSection: {
    title: 'عنوان جديد',
    description: 'وصف جديد',
  },
}
```

3. **Use in components**:
```typescript
import { useLanguage } from '@/context/language-provider'

function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t.newSection.title}</h1>
      <p>{t.newSection.description}</p>
    </div>
  )
}
```

### Adding New Languages

To add a new language (e.g., French):

1. Create `src/locales/fr.ts`:
```typescript
import { Translation } from './en'

export const fr: Translation = {
  // Add French translations
}
```

2. Update `src/locales/index.ts`:
```typescript
export { en } from './en'
export { ar } from './ar'
export { fr } from './fr'
```

3. Update `src/context/language-provider.tsx`:
```typescript
export type Language = 'en' | 'ar' | 'fr'

const translations: Record<Language, Translation> = {
  en,
  ar,
  fr,
}
```

4. Update the language switcher in `src/components/language-switch.tsx`

### RTL Support

The project uses:
- Radix UI's `DirectionProvider` for component-level RTL support
- Tailwind CSS logical properties (`start`, `end`, `ms`, `me`)
- Automatic direction switching based on language

### Font Support

Arabic font (Noto Sans Arabic) is loaded from Google Fonts:
- Configured in `index.html`
- Applied in `src/styles/theme.css`
- Automatically used when Arabic is selected

## File Structure

```
src/
├── locales/
│   ├── en.ts          # English translations
│   ├── ar.ts          # Arabic translations
│   └── index.ts       # Export all translations
├── context/
│   ├── language-provider.tsx  # Language context and hook
│   └── direction-provider.tsx # RTL/LTR direction handling
├── components/
│   └── language-switch.tsx    # Language switcher UI
└── styles/
    └── theme.css      # Font configuration
```

## API Reference

### `useLanguage()` Hook

```typescript
const { language, setLanguage, t, resetLanguage } = useLanguage()

// language: Current language code ('en' | 'ar')
// setLanguage: Function to change language
// t: Translation object with all translated strings
// resetLanguage: Reset to default language (English)
```

### Example Usage

```typescript
import { useLanguage } from '@/context/language-provider'

function MyComponent() {
  const { language, setLanguage, t } = useLanguage()
  
  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <button onClick={() => setLanguage('ar')}>
        Switch to Arabic
      </button>
      <p>Current language: {language}</p>
    </div>
  )
}
```

## Notes

- Language preference is stored in cookies for 1 year
- Direction (RTL/LTR) is automatically set based on language
- All Tailwind classes use logical properties for RTL compatibility
- The system is fully type-safe with TypeScript

