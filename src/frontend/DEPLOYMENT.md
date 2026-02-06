# Deployment Notes

## Production Build Fix (February 2026)

### Issue
The production deployment was failing due to missing build configuration files and browser-incompatible environment variable access:

1. **Missing Build Configuration**: The project was missing essential Vite and TypeScript configuration files (`vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`) required for production builds.

2. **Environment Variable Access**: The `useInternetIdentity.ts` hook uses Node.js-style `process.env.II_URL` which is not natively available in browser builds.

### Solution

Since `frontend/src/hooks/useInternetIdentity.ts` is in an immutable path and cannot be modified, we shim `process.env.II_URL` at build time using Vite's `define` option.

### Changes Made

1. **frontend/vite.config.ts** (created)
   - Configured React plugin and path alias `@/*` → `src/*`
   - Added `define` block to shim `process.env.II_URL` with `import.meta.env.VITE_II_URL` or fallback to `https://identity.ic0.app`
   - Configured build optimizations and code splitting

2. **frontend/tsconfig.json** (created)
   - Configured TypeScript compiler for React + Vite
   - Set up path mapping for `@/*` alias
   - Enabled strict type checking

3. **frontend/tsconfig.node.json** (created)
   - Node-oriented TypeScript config for Vite tooling
   - Ensures `vite.config.ts` type-checks correctly

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
   - No errors about missing `process` or configuration files

3. **Test locally:**
   ```bash
   npm run start
   ```
   - Navigate to `http://localhost:3000`
   - Verify the app loads without blank screen
   - Test Internet Identity login flow

4. **Deploy:**
   ```bash
   dfx deploy
   ```
   - Verify deployed frontend loads in browser
   - Test authentication works in production

### Technical Details

The Vite `define` option performs compile-time string replacement, converting:
