# Specification

## Summary
**Goal:** Fix the frontend production build/deployment by restoring missing Vite/TypeScript configuration and addressing a browser-bundle `process.env.II_URL` incompatibility, then verify the deployed app loads successfully.

**Planned changes:**
- Add missing frontend production build configuration files (including `frontend/vite.config.ts` and `frontend/tsconfig.json`) so the app compiles in the deployment environment.
- Update Vite configuration to safely define/shim `process.env.II_URL` at build time (using a safe default and/or `import.meta.env.VITE_II_URL`) without modifying immutable hook files.
- Verify end-to-end production build and deployment, and document any required environment variables (e.g., `VITE_II_URL`) in `frontend/DEPLOYMENT.md` if needed.

**User-visible outcome:** The app can be built and deployed successfully for production, and it loads in the browser without build-time `process` errors or immediate runtime failures; deployment prerequisites are documented if required.
