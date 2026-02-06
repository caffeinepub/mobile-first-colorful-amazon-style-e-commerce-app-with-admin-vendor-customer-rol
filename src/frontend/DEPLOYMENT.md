# Deployment Notes

## Production Build Fix (February 2026)

### Issue
The production deployment was failing due to missing build configuration files and browser-incompatible environment variable access:

1. **Missing TypeScript Configuration**: The project was missing the root `frontend/tsconfig.json` file required for TypeScript compilation and path alias resolution during production builds.

2. **Environment Variable Access**: The `useInternetIdentity.ts` hook uses Node.js-style `process.env.II_URL` which is not natively available in browser builds.

### Solution

Since `frontend/src/hooks/useInternetIdentity.ts` is in an immutable path and cannot be modified, we shim `process.env.II_URL` and other `process` references at build time using Vite's `define` option.

### Changes Made

1. **frontend/tsconfig.json** (created)
   - Root TypeScript configuration for the frontend
   - Configured React JSX support with `react-jsx` transform
   - Set up path mapping for `@/*` alias to resolve to `src/*`
   - Enabled strict type checking and modern ES2020 target
   - Configured bundler module resolution for Vite compatibility
   - References `tsconfig.node.json` for Vite tooling

2. **frontend/vite.config.ts** (updated)
   - Configured React plugin and path alias `@/*` → `src/*`
   - Added comprehensive `define` block to shim:
     - `process.env.II_URL` with `VITE_II_URL` or fallback to `https://identity.ic0.app`
     - `process.env` as empty object `{}`
     - `process` as minimal object `{ env: {} }`
   - Configured build optimizations and code splitting
   - Set global to globalThis for browser compatibility

3. **frontend/tsconfig.node.json** (updated)
   - Node-oriented TypeScript config for Vite tooling
   - Ensures `vite.config.ts` type-checks correctly
   - Added `noEmit: true` to prevent output generation

4. **frontend/src/vite-env.d.ts** (existing)
   - TypeScript declarations for Vite environment variables
   - Defines `VITE_II_URL` type

### Environment Variables

**Optional:**
- `VITE_II_URL`: Custom Internet Identity provider URL
  - Default: `https://identity.ic0.app` (production II)
  - Example: `VITE_II_URL=http://localhost:4943/?canisterId=...` (local development)

### Build & Deploy Verification

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Verify build output:**
   - Check that `frontend/dist/` contains compiled assets
   - No errors about missing `process`, `tsconfig.json`, or configuration files
   - TypeScript compilation succeeds without errors

3. **Test locally:**
   ```bash
   npm run start
   ```
   - Navigate to `http://localhost:3000`
   - Verify the app loads without blank screen
   - Check browser console for no `process is not defined` errors
   - Test Internet Identity login flow

4. **Deploy:**
   ```bash
   dfx deploy
   ```
   - Verify both backend and frontend canisters deploy successfully
   - Verify deployed frontend loads in browser without errors
   - Test authentication works in production
   - Verify no console errors related to `process` or environment variables

### Technical Details

The Vite `define` option performs compile-time string replacement:

**Before (in source code):**
