# Development Environment & Repository Configuration

## 1. Environment Requirements

- **Node.js**: `v24.15.0` (or `v20.x+`)
- **pnpm**: `v11.10.0` (pnpm v10+)
- **OS**: Linux / POSIX

---

## 2. Workspace Commands

### Package Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```
Starts the Next.js web application dev server (`/apps/web`).

### Build Command
```bash
pnpm build
```
Compiles all workspace packages (`@vedica/*`) via TypeScript `tsc` and builds the Next.js web application (`next build`).

---

## 3. Test Suite Execution & Discovery Architecture

The test suite enforces a strict separation between **Vitest** (unit and engine integration testing) and **Playwright** (browser end-to-end testing):

### Unit & Engine Integration Tests (Vitest)
```bash
pnpm test
```
- **Engine**: Vitest (`v3.0.5`)
- **Configuration**: Root `vitest.config.ts`
- **Included Paths**: `packages/**/*.test.ts`, `validation/**/*.test.ts`, `apps/**/*.test.ts`
- **Excluded Paths**: `**/node_modules/**`, `**/dist/**`, `**/e2e/**`, `apps/**/e2e/**`, `apps/**/tests/e2e/**`, `**/*.spec.ts`

### End-to-End Browser Tests (Playwright)
```bash
pnpm test:e2e
```
- **Engine**: Playwright (`v1.50.1`)
- **Configuration**: `apps/web/playwright.config.ts`
- **Target Directory**: `apps/web/tests/e2e/*.spec.ts`

---

## 4. Native Dependencies & Build Approvals

The project relies on C/C++ native addons:
1. **`sweph`**: C bindings for Swiss Ephemeris ephemeris calculations (`@vedica/astrology-core`).
2. **`better-sqlite3`**: SQLite native database binding (used by LibSQL / Drizzle ORM client).

### Repository-Level pnpm Configuration (`pnpm-workspace.yaml`)
Starting with pnpm v10+, the `pnpm.onlyBuiltDependencies` key in `package.json` was deprecated and is ignored. Native build approvals are configured at the repository workspace root in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'validation'
allowBuilds:
  better-sqlite3: true
  esbuild: true
  sweph: true
```
This guarantees zero deprecation warnings during `pnpm install`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`.
