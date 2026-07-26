# Project Architectural Rules & Guidelines

## 1. Environment & SDK
- **Framework**: Expo SDK 54 (`react-native` with Expo Router).

## 2. Component Design & Modular Architecture
- **Keep Components Small & Focused**: Avoid monolithic, oversized component files. Split screens into small, single-responsibility sub-components.
- **High Reusability**: Extract dedicated UI elements (cards, headers, list items, badge pills, bottom sheet bodies) into modular components under `components/<domain>/`.
- **Clean File Sizes**: Keep individual component files under ~150–200 lines whenever possible for maximum readability and maintainability.

## 3. Single Source of Truth (SSOT)
- **State Management**: Use central Zustand stores (`useProfileStore`, `useRecordsStore`, `useBookingStore`, `useAddressStore`) for all application state. Never duplicate global state in component `useState`.
- **Master Data Registries**: Derive domain objects from central registries (`constants/package-data.ts`, `constants/directory-data.ts`, `constants/discovery.ts`).
- **Design Tokens**: Derive colors, fonts, margins, and elevations from `hooks/useTheme` and `constants/theme.ts`.
- **Date & Time Formatting**: Use central helper functions in `utils/dateFormatter.ts` (`formatDisplayDate`, `formatShortDate`, `formatTime`, `formatDOB`, `getUpcomingDates`).

## 4. Crash-Proof & Defensive Resilience
- **Defensive Guarding**: Always use optional chaining (`?.`) and nullish coalescing (`??`) for dynamic API data.
- **Image Fallbacks**: Handle image load errors gracefully with default fallbacks.
- **Error Handling**: Use error boundaries around critical layout blocks to prevent app crashes.