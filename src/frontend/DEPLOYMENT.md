# Deployment Notes

## Production Build Fix (February 2026)

### Issue
The production deployment was failing due to frontend build-time incompatibilities:

1. **Environment Variable Access**: The `useInternetIdentity.ts` hook was using Node.js-style `process.env.II_URL` which is not available in browser builds. Vite requires `import.meta.env.VITE_*` for environment variables.

2. **Missing Build Configuration**: The project was missing essential Vite and TypeScript configuration files (`vite.config.ts`, `tsconfig.json`) that are required by the build template.

3. **Type Declarations**: Missing `vite-env.d.ts` for proper TypeScript support of Vite's `import.meta.env`.

### Changes Made

1. **frontend/src/hooks/useInternetIdentity.ts**
   - Changed `process.env.II_URL` to `import.meta.env.VITE_II_URL`
   - Added fallback to `https://identity.ic0.app` for production builds

2. **frontend/src/vite-env.d.ts** (new)
   - Added TypeScript declarations for Vite environment variables

3. **frontend/vite.config.ts** (restored)
   - Configured path alias `@/*` → `frontend/src/*`
   - Set up React plugin and build options

4. **frontend/tsconfig.json** (restored)
   - Configured TypeScript compiler options
   - Added path mapping for `@/*` alias

### Validation

To verify the fix works:

