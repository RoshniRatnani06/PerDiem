/**
 * Vitest / Testing Library global setup.
 * This file is referenced by vite.config.ts → test.setupFiles.
 * It extends vitest's `expect` with jest-dom matchers like
 * `toBeInTheDocument`, `toHaveTextContent`, etc.
 */
import '@testing-library/jest-dom';
