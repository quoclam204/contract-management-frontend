# Contract Management System (CLM) — Frontend

> Hệ thống Quản lý Vòng đời Hợp đồng Doanh nghiệp — Giao diện người dùng.
> Coding rules gốc từ https://github.com/maxart/React-with-AI, đã tùy chỉnh cho dự án CLM.

## Project Context

Đây là frontend của hệ thống CLM — quản lý vòng đời hợp đồng doanh nghiệp: soạn thảo, phê duyệt nhiều cấp, ký điện tử, theo dõi hiệu lực, cảnh báo hết hạn, và AI phân tích hợp đồng.

### Tech Stack

- **React 19** (Vite) + **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives) — component library chính
- **TanStack Query v5** (React Query) — server state management
- **Recharts** — Dashboard & báo cáo
- **React Router v7** — routing
- **Zustand** — client-side global state (khi cần)
- **Vitest** + **React Testing Library** — unit/integration test
- **Playwright** — E2E test

### Backend API

- Base URL: `VITE_API_BASE_URL` (environment variable)
- Authentication: JWT Bearer token trong `Authorization` header
- API trả về JSON, phân trang qua query params `?page=1&pageSize=20`
- Mọi API call đi qua `src/api/client.ts` — wrapper fetch với JWT auto-attach và error handling

### Vai trò người dùng (RBAC)

- **Admin**: Toàn quyền hệ thống
- **Manager** (Trưởng phòng): Duyệt hợp đồng, quản lý nhân viên
- **Staff** (Nhân viên): Soạn thảo, trình duyệt hợp đồng
- **Approver** (Người phê duyệt): Duyệt/từ chối hợp đồng theo workflow

### Nguyên tắc nhóm

- **1 flow demo mỗi sprint**: mỗi sprint (2 tuần) phải có ít nhất 1 flow end-to-end chạy được thật
- **UI tối thiểu trước, polish sau**: ưu tiên flow chạy được, giao diện đẹp làm sau
- Mỗi người code trong thư mục feature của mình (`src/features/[module]/`)

## Identity

You are working on the CLM (Contract Lifecycle Management) frontend application.
Follow modern React best practices (2025+). Write clean, maintainable, type-safe
code. Prioritize correctness, readability, and accessibility. Do not over-engineer.

---

## Output and Efficiency

- Return code first. Explanation after, only if non-obvious.
- No sycophantic openers, closing fluff, or restating the question.
- No unsolicited suggestions or boilerplate beyond the requested scope.
- Read before writing. One focused pass — avoid write-delete-rewrite cycles.
- If unsure, say so. Never guess or invent file paths.
- Code output is ASCII only (plain hyphens, straight quotes) — copy-paste safe.
- Code review: state the bug, show the fix, stop.
- Debugging: read the code first. State what you found, where, and the fix.
- User instructions always override this file.

---

## Code Quality Rules

### General

- Write the simplest code that solves the problem. No speculative abstractions.
- **Minimal runtime cost.** When choosing between libraries of equivalent functionality, prefer the lighter option. A 3 KB dependency that covers your use case beats a 30 KB one with features you will never use. Check `bundlephobia.com` before adding any dependency.
- One component per file. Name the file the same as the component (PascalCase).
- Keep files under 200 lines. If a file exceeds this, split by responsibility.
- Do not add comments that restate the code. Only comment non-obvious "why".
- Do not add JSDoc to every function. Only document public APIs and complex logic.
- Remove dead code. Do not comment it out or keep it "for reference."
- Use `const` by default. Only use `let` when reassignment is required.
- Prefer early returns over nested conditionals.
- Do not use `var`. Ever.
- Do not use `enum`. Use `as const` objects or union types instead.

### Naming

- Components: `PascalCase` (`UserProfile.tsx`)
- Hooks: `camelCase` starting with `use` (`useAuth.ts`)
- Utilities: `camelCase` (`formatDate.ts` or `date.utils.ts`)
- Types/Interfaces: `PascalCase` (`UserProfile`, `ApiResponse`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_RETRY_COUNT`)
- Boolean props/state: prefix with `is`, `has`, `should`, `can` (`isLoading`, `hasError`)
- Event handlers: prefix with `handle` (`handleSubmit`, `handleClick`)
- Event handler props: prefix with `on` (`onSubmit`, `onClick`)

---

## TypeScript Rules

### Strictness

- **Always** use `strict: true` in tsconfig. Never disable it.
- **Never** use `any` unless interfacing with an untyped third-party library. If you must, add a `// eslint-disable-next-line` with a comment explaining why.
- Use `unknown` instead of `any` when the type is genuinely unknown.
- Enable and respect `noImplicitAny`, `strictNullChecks`, `noUnusedParameters`.

### Types and Interfaces

- Use `interface` for component props (extensible by consumers).
- Use `type` for unions, intersections, and computed types.
- Do not use `React.FC` or `React.FunctionComponent`. Type props directly on the function signature.
- Use `React.ReactNode` for children props (broad — accepts strings, elements, fragments).
- Use discriminated unions (`{ status: 'idle' } | { status: 'success'; data: User }`) for state that can be in distinct modes.
- Implement exhaustive switch guards for union types via a `never`-typed helper.
- Leverage type inference. Do not annotate what TypeScript can infer.

### Event Types

- Use proper React event types:
  - `React.FormEvent<HTMLFormElement>` for form submission
  - `React.ChangeEvent<HTMLInputElement>` for input changes
  - `React.MouseEvent<HTMLButtonElement>` for click events
  - `React.KeyboardEvent<HTMLElement>` for keyboard events

---

## Component Rules

### Structure

- Keep components focused on a single responsibility.
- Prefer composition over configuration — pass `children` or element props instead of complex config objects. Let consumers control layout rather than anticipating every variation in a parent component's props.
- Extract logic into custom hooks when a component does too much. A component should orchestrate and render; data-fetching, transforms, and business logic belong in hooks.
- Place derived/computed values inline (during render), not in state or effects.

### Props

- Do not pass more than 5-7 props. If more are needed, group related props into an object or split the component.
- Always destructure props in the function signature.
- Provide default values via destructuring, not `defaultProps`.
- Never spread unknown props (`{...rest}`) onto DOM elements unless building a design system primitive.

### Conditional Rendering

- Use early returns for loading/error states at the top of the component instead of nested ternaries.
- Use `&&` for simple conditionals, ternary for if/else.
- For complex conditions with 3+ branches, use a lookup object or helper function.
- **Never** render `{count && <Component />}` when `count` can be `0` — it renders `0`. Use `{count > 0 && ...}` instead.

### Lists

- **Always** use a unique, stable `key` (usually `item.id`).
- **Never** use array index as `key` for dynamic lists (lists that can be reordered, filtered, or modified). Index keys cause state-preservation bugs when the list changes.
- Index as key is acceptable only for static lists that never change.

---

## State Management Rules

### Decision Tree (follow this order)

1. **Server data** (API responses) → Use SWR or TanStack Query. **NEVER** copy server data into `useState`, `useReducer`, or Redux.
2. **Local UI state** (one component: toggle, input value) → `useState`
3. **Complex local state** (related values, state machine) → `useReducer`
4. **Shared state** (2+ components need it) → Lift state to closest common parent first. If prop drilling exceeds 2 levels, use React Context.
5. **App-wide complex state** → Zustand (preferred) or Redux Toolkit
6. **Persistent state** (localStorage) → Custom `useLocalStorage` hook

### State Principles

- Keep state as local as possible. Only lift when necessary.
- Never store derived/computed values in state. Calculate during render, or wrap in `useMemo` if the computation is expensive.
- When updating state based on previous value, always use the function form (`setCount(prev => prev + 1)`).
- Use discriminated unions instead of multiple boolean flags for state modes.

### Context Rules

- **Always** wrap Context consumption in a custom hook with a null-check that throws if the provider is missing.
- Memoize context values with `useMemo` to prevent unnecessary re-renders of consumers.
- Scope providers as narrowly as possible. Do not wrap the entire app in every provider.

---

## Hooks Rules

### useEffect

- **Only use for synchronizing with external systems** (APIs, event listeners, timers, third-party libraries, DOM manipulation).
- **NEVER** use useEffect for:
  - Deriving state from props or other state (calculate during render)
  - Transforming data for rendering (calculate during render or useMemo)
  - Handling user events (use event handlers)
  - Chaining effects that trigger each other
- **Always** return a cleanup function when setting up subscriptions, timers, or event listeners.
- **Always** handle async operations safely to prevent state updates after unmount (use a `cancelled` flag or `AbortController`).
- Include all dependencies in the dependency array. Do not suppress the ESLint rule. If the effect runs too often, restructure the code.
- Be aware that useEffect fires twice in StrictMode (development). If your effect breaks, you are missing cleanup.

### useMemo and useCallback

- Use `useMemo` for expensive computations (filtering large arrays, complex calculations).
- Use `useCallback` for function references passed to memoized children.
- Do NOT wrap every value in useMemo or every function in useCallback. Only optimize when there is a measurable benefit or when passing to React.memo'd components.
- If the project uses React 19+ with the React Compiler, manual memoization is unnecessary — the compiler handles it.

### Custom Hooks

- Extract custom hooks when:
  - The same logic appears in 2+ components
  - A component is too complex and a hook improves readability
  - Logic needs to be tested independently of UI
- Each custom hook should have a single, clear responsibility.
- Name hooks descriptively: `useUserPermissions`, not `useData`.
- When creating 3+ data-fetching hooks with the same structure, extract a factory.

---

## Data Fetching Rules

- **Always** use **TanStack Query v5** for data fetching. Never fetch in raw useEffect + useState — you lose caching, deduplication, background refresh, and it is race-condition prone.
- Configure sensible defaults:
  - `staleTime`: 5 minutes for most data
  - `retry`: false for deterministic errors (404, 403)
  - Enable `refetchOnWindowFocus` in production
- Use `enabled` option to prevent requests with incomplete parameters.
- Create typed wrapper hooks for every API endpoint in `src/hooks/data/` — do not call TanStack Query directly in components.
- Handle loading, error, and empty states explicitly in every component that fetches data.
- Example pattern:
  ```typescript
  // src/hooks/data/useContracts.ts
  export function useContracts(params: ContractListParams) {
    return useQuery({
      queryKey: ['contracts', params],
      queryFn: () => contractApi.getList(params),
      staleTime: 5 * 60 * 1000,
    });
  }
  ```

---

## Error Handling Rules

- **Always** add Error Boundaries via the `react-error-boundary` package. This is non-negotiable for production apps.
  - App-level: catches catastrophic failures
  - Feature-level: isolates crashes (e.g., sidebar crash does not kill main content)
  - List-item-level: one bad item does not collapse the list
- Provide recovery actions in error fallbacks (retry button, reload, navigate home).
- Log errors to a monitoring service (Sentry, DataDog) in the `onError` callback.
- Use try/catch in event handlers and async functions (error boundaries do not catch these). Surface errors to the user via toast notifications.
- Create a custom `ApiError` class that includes status code, endpoint, and parsed error messages.
- Show user-friendly error messages. Never expose raw error objects or stack traces.

---

## Performance Rules

### Mandatory

- **Route-level code splitting** with `React.lazy` and `Suspense`. Every route-level page component should be lazily loaded.

### Apply When Relevant

- `React.memo` on list item components and components that re-render due to parent context changes they do not consume.
- `useMemo` for expensive array filtering/sorting/transforming.
- Debounce rapid user inputs (search, resize, scroll) — 200-500ms.
- Use `useTransition` for non-urgent state updates that should not block the UI.

### Do NOT

- Wrap every component in React.memo, or every value in useMemo/useCallback by default. Only optimize measured bottlenecks.
- Prematurely optimize. Make it correct first, then fast.

---

## Styling Rules

### Tailwind CSS + shadcn/ui (Bắt buộc cho dự án này)

- Dự án này dùng **Tailwind CSS** + **shadcn/ui** (built on Radix UI primitives). KHÔNG dùng CSS Modules hay CSS-in-JS.
- Use `clsx` + `tailwind-merge` (đã có utility `cn()` trong `src/lib/utils.ts`) cho conditional class composition.
- Keep class strings on a single line when under ~80 characters. Break to multiple lines for longer strings.
- Use Tailwind's `@apply` sparingly — only for truly reusable base styles.
- Sort classes with `prettier-plugin-tailwindcss`.
- Ưu tiên dùng shadcn/ui components (`Button`, `Card`, `Dialog`, `Table`, `Input`, `Select`...) thay vì tự viết.
- Khi cần component chưa có trong shadcn/ui, dùng Radix UI primitives trực tiếp.

### General

- Do not use runtime CSS-in-JS (styled-components, Emotion). This project uses Tailwind CSS.
- Do not use inline styles except for truly dynamic values (e.g., a computed width percentage).
- Use CSS custom properties (variables) for theme values, not JS constants.

---

## Accessibility Rules (Non-Negotiable)

- Use **semantic HTML**: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>` for structure.
- **Never** use `<div onClick>` or `<span onClick>` for interactive elements — they are not focusable, keyboard accessible, or announced by screen readers.
- Every `<img>` must have an `alt` attribute. Use `alt=""` for decorative images; informative text for meaningful ones.
- Every interactive element must be **keyboard accessible** (Tab, Enter, Escape, Arrow keys).
- Every icon-only button must have `aria-label` describing its action.
- Every form input must have an associated `<label>` (via `htmlFor`) or `aria-label`.
- Use a headless/unstyled component library for complex interactive components (modals, dropdowns, comboboxes, tabs). Do not build these from scratch.

  | Library | Style | Best For |
  |---|---|---|
  | **Headless UI** | Unstyled (hooks + components) | Tailwind projects, minimal footprint |
  | **Radix UI** | Unstyled primitives | Maximum flexibility, excellent docs |
  | **Ark UI** | Unstyled (state machines) | Framework-agnostic, Chakra successor |
  | **React Aria** | Hooks only | Most comprehensive a11y, Adobe-backed |
  | **shadcn/ui** | Pre-styled (Tailwind + Radix) | Rapid development, copy-paste components |
- Install and enforce `eslint-plugin-jsx-a11y` with the recommended config.
- Use `useId()` for generating unique IDs linking labels to inputs.

---

## Security Rules (Non-Negotiable)

- **NEVER** use `dangerouslySetInnerHTML` with user-provided content. If you must render HTML, sanitize with DOMPurify first.
- Enforce `react/no-danger: 'error'` in ESLint.
- Use `react-markdown` for rendering user-generated rich text.
- Validate and constrain all user inputs (max length, allowed characters).
- **Never** store auth tokens in `localStorage` for public-facing apps. Use HttpOnly cookies or in-memory storage.
- **Never** put secrets, API keys, or credentials in frontend code.
- **Never** interpolate user input into `href` attributes (prevents `javascript:` URL attacks).
- Run `npm audit` regularly. Address critical and high vulnerabilities.
- Use Content Security Policy headers in production.

---

## Project Structure Rules

### Directory Layout

Organize `src/` as: `api/` (client, error classes), `components/` (shared UI), `content/` (i18n strings), `contexts/` (domain-scoped providers), `hooks/` (shared hooks, with `hooks/data/` for SWR/Query wrappers), `pages/` (route components with feature-specific `components/` and `hooks/` subfolders), `router/` (routes, loaders, guards), `typings/` (shared types), and `utils/` (pure functions).

### Organization Principles

- **Colocate** feature-specific code within its page/feature directory.
- **Promote** to top-level (`src/hooks/`, `src/components/`) only when shared by 2+ features.
- One component per file. One hook per file (unless tightly coupled).
- Keep barrel files (`index.ts`) small (under 15 exports). Prefer direct imports for large projects.
- Enforce `import/no-cycle: 'error'` to prevent circular dependencies.
- Use `simple-import-sort` for consistent import ordering.
- Use path aliases (`@/components`, `@/hooks`) for clean imports.

---

## Testing Rules

### Requirements

- Every project must have tests. `passWithNoTests: true` is a red flag, not a feature.
- Use **Vitest** (for Vite projects) or **Jest** as the test runner.
- Use **React Testing Library** for component tests.
- Use **Playwright** for E2E tests of critical user flows.

### What to Test

1. **Integration tests** for critical user flows (highest value):
   - User can log in
   - User can complete the primary action (purchase, submit, join meeting, etc.)
   - Error states display correctly
2. **Unit tests** for:
   - Custom hooks
   - Utility functions
   - Complex business logic
3. **E2E tests** for:
   - The critical path (the one flow that must never break)
   - Cross-page flows involving navigation

### How to Test

- Test **behavior**, not implementation. Assert what the user sees, not internal state.
- Query elements by **role** first (`getByRole`), then **label** (`getByLabelText`), then **text** (`getByText`). Use `getByTestId` as a last resort.
- Use `userEvent` (not `fireEvent`) for interaction simulation.
- Use `screen` object for all queries.
- Do not test styled output, CSS classes, or component internal state.
- Do not write snapshot tests unless for very stable UI (icons, static content).

---

## Tooling Rules

### Required

- **TypeScript** in strict mode
- **ESLint** with these plugins:
  - `typescript-eslint/recommendedTypeChecked`
  - `eslint-plugin-react`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-jsx-a11y` (recommended config)
  - `eslint-plugin-simple-import-sort`
  - `eslint-plugin-import` (with `no-cycle: 'error'`)
- **Prettier** for formatting
- **Husky** + **lint-staged** for pre-commit quality gates

### ESLint Rules to Enforce

- `react/no-danger: error`
- `react/jsx-no-bind: error` (or warn; disable if using React Compiler)
- `import/no-cycle: error`
- `simple-import-sort/imports: error`
- `no-console: [warn, { allow: [warn, error] }]`

### Recommended

- `vite-plugin-checker` for real-time TS/ESLint overlay in dev
- `prettier-plugin-tailwindcss` for consistent class ordering
- React DevTools and SWR/Query DevTools during development

---

## Build and Deployment Rules

### Environment Variables

- **Never** hardcode API URLs, keys, or environment-specific values in source code. Use environment variables.
- Prefix client-exposed env vars correctly per framework (`VITE_` for Vite, `NEXT_PUBLIC_` for Next.js). Non-prefixed vars are server-only and will not be bundled.
- **Never** commit `.env` files with real secrets. Commit a `.env.example` with placeholder values as documentation.
- Use distinct `.env.development`, `.env.production`, `.env.staging` files when build-time configuration differs per environment.

### Build Output

- **Never** ship source maps to production unless behind authentication. They expose your source code.
- **Never** publish source maps to NPM. Use the `files` field in `package.json` or `.npmignore` to exclude `*.map` files.
- Enable bundle analysis periodically (`vite-bundle-visualizer`, `@next/bundle-analyzer`) to catch unexpected size growth.
- Set a **bundle size budget** and fail the build if exceeded (e.g., `chunkSizeWarningLimit` in Vite).
- Verify the production build locally before deploying (`npm run build && npm run preview`).

### CI/CD Guardrails

- **Do not modify** CI/CD pipeline files (`.github/workflows/`, `Jenkinsfile`, `buildspec.yml`, etc.) without explicit user approval. These affect every developer and every deployment.
- **Do not add** `--no-verify`, `--force`, or skip flags to CI scripts.
- The CI pipeline should run, at minimum:
  1. `npx tsc --noEmit` (type check)
  2. `npx eslint .` (lint)
  3. `npm test` (unit/integration tests)
  4. `npm run build` (verify production build succeeds)
- For production deployments, add E2E tests (`npx playwright test`) as a gate.

### Preview and Staging

- When the project supports preview deployments (Vercel, Netlify, AWS Amplify), every PR should get a preview URL.
- Do not merge to the main branch without passing CI checks.
- Test against the staging/preview environment, not just localhost — environment differences (CORS, auth, API endpoints) cause real bugs.

---

## Large Project Maintenance Rules

### Dependency Management

- Run `npm audit` monthly (or in CI). Fix **critical** and **high** severity vulnerabilities immediately.
- Update dependencies incrementally, not all at once. One major version bump per PR so regressions are traceable.
- Pin major versions in `package.json` (e.g., `"react": "^19.0.0"`). Use a lockfile (`package-lock.json`) and commit it.
- Remove unused dependencies (`npx depcheck`). They add attack surface and slow installs.

### Dead Code Removal

- Delete unused components, hooks, utilities, types, and feature flags whose rollout is complete. Do not comment them out.
- Use `noUnusedLocals` / `noUnusedParameters` and periodically run `npx ts-unused-exports tsconfig.json` to find stale exports.

### Refactoring

- **Only refactor when explicitly asked** or when a refactor is required to complete the task safely.
- **Scope refactors tightly.** A refactor PR should do one thing: rename, extract, restructure, or migrate. Never mix refactoring with feature work.
- When refactoring, ensure tests exist *before* starting. If they don't, write them first.
- When identifying tech debt during a task, **flag it to the user** with a specific description. Do not silently fix it — the user decides priority.

### Incremental Migration

When migrating patterns (class → hooks, Redux → Zustand, CSS-in-JS → Tailwind):

- **Never** do a big-bang migration. Migrate incrementally, one feature/module at a time. Old and new patterns can coexist temporarily.
- Document which pattern is canonical (in this CLAUDE.md) so new code uses it. Example: "New code MUST use Zustand; do not add new Redux slices."
- Each migration PR should be self-contained: migrate one module, update its tests, verify nothing broke.

### Performance Budgets

- Set and enforce bundle size limits. Track them in CI using [size-limit](https://github.com/ai/size-limit).
- Monitor Core Web Vitals (LCP, INP, CLS) in production. Performance degrades gradually — without monitoring, you won't notice until users complain.
- When adding a new dependency, check its size impact on [bundlephobia.com](https://bundlephobia.com) before installing.
- Prefer smaller alternatives when functionality is equivalent:

  | Category | Instead of | Consider | Approx. size saving |
  |---|---|---|---|
  | **Dates** | `moment` (300 KB) | `date-fns` (tree-shakeable) or `dayjs` (2 KB) | ~95% smaller |
  | **Utilities** | `lodash` (70 KB) | Native JS or `lodash-es` (tree-shakeable) | ~90% smaller |
  | **HTTP** | `axios` (13 KB) | Native `fetch` + tiny wrapper | ~100% smaller |
  | **IDs** | `uuid` (3 KB) | `crypto.randomUUID()` (native) | Zero dependency |
  | **IDs (Node <19)** | `uuid` (3 KB) | `nanoid` (~130 bytes) | ~96% smaller |
  | **State mgmt** | MobX (~16 KB) | Valtio (~3 KB) or Zustand (~1 KB) | ~80-95% smaller |
  | **Data fetching** | Apollo Client (~33 KB) | SWR (~4 KB) or TanStack Query (~12 KB) | ~60-88% smaller |
  | **Deep equality** | `lodash.isEqual` (~18 KB with lodash) | `fast-deep-equal` (~1.5 KB) | ~92% smaller |
  | **Classnames** | `classnames` (1 KB) | `clsx` (239 bytes) | ~76% smaller |

### Monorepo Considerations

If the project is a monorepo (Turborepo, Nx, pnpm workspaces):

- Shared packages should have clear ownership and versioning.
- Do not import directly from another app's `src/`. Import from the shared package's public API.
- Changes to shared packages affect all consumers — run all downstream tests before merging.
- Keep `tsconfig` inheritance clean: base config at root, app-specific overrides in each package.

---

## When Creating a New React Project

Follow this setup checklist:

1. Scaffold with `npm create vite@latest -- --template react-ts`
2. Enable `strict: true` in `tsconfig.json`
3. Install and configure ESLint with all plugins listed above
4. Install Prettier + `prettier-plugin-tailwindcss`
5. Set up Husky + lint-staged for pre-commit hooks
6. Install a data-fetching library (SWR or TanStack Query)
7. Install `react-error-boundary`
8. Install a headless UI library (Headless UI, Radix, Ark UI, or shadcn/ui)
9. Create the directory structure outlined above
10. Create a `cn()` utility for class composition (if using Tailwind)
11. Create `useContextHook` wrapper with null-check pattern
12. Set up `React.lazy` code splitting for routes
13. Add at least one integration test for the critical path
14. Add Error Boundaries at app and feature levels
15. Create `.env.example` with placeholder values for all required env vars
16. Set up CI pipeline: type check, lint, test, build

---

## When Working on an Existing React Project

Before making changes:

1. **Read** the relevant files first. Understand existing patterns before modifying.
2. **Follow** existing conventions in the codebase, even if they differ from these rules. Consistency within a project beats theoretical best practices.
3. **Do not refactor** code unrelated to your task. A bug fix does not need surrounding code cleaned up.
4. **Do not add** types, comments, or documentation to code you did not change.
5. **Do not introduce** new patterns or libraries without explicit user approval.
6. **Match** the existing naming conventions, file organization, and code style.
7. **Test** your changes. Run existing tests to verify you have not broken anything.

---

## Checklist Before Completing Any Task

Before declaring work complete, verify:

- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] ESLint passes with zero errors (`npx eslint .`)
- [ ] All existing tests pass (`npm test`)
- [ ] New code has error handling (try/catch for async, error boundaries for render)
- [ ] New interactive elements are keyboard accessible
- [ ] New images have alt text
- [ ] No `any` types added without justification
- [ ] No commented-out code left behind
- [ ] No `console.log` left in production code
- [ ] No hardcoded strings in JSX (externalize to content/i18n files if project uses them)
- [ ] List items use stable, unique keys
- [ ] No hardcoded API URLs or secrets — environment variables used correctly
- [ ] No CI/CD pipeline files modified without explicit approval
- [ ] New dependencies justified (checked size impact, no smaller alternative available)

---

## Project-Specific Overrides (CLM)

### State Management
- Server state: **TanStack Query v5** với `staleTime: 5 * 60 * 1000` (5 phút)
- Client global state: **Zustand** (auth state, sidebar state, theme)
- KHÔNG dùng Redux, MobX, hay Recoil

### Styling
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- Mọi component UI mới ưu tiên shadcn/ui trước khi tự viết
- Dùng `cn()` utility từ `src/lib/utils.ts`

### API
- Mọi API call đi qua `src/api/client.ts` — wrapper fetch tự động gắn JWT token
- Tạo typed hooks trong `src/hooks/data/` cho mỗi API endpoint
- Base URL từ `VITE_API_BASE_URL` environment variable
- Xác thực: JWT Bearer token

### Dashboard & Báo cáo
- Dùng **Recharts** cho biểu đồ (thống kê hợp đồng theo trạng thái, giá trị, phòng ban, đối tác)

### Directory Structure (Phân công theo module)

```
src/
  api/                    # API client, error classes
  components/             # Shared UI components (Layout, Sidebar, Header...)
  features/
    identity/             # Người 1: Login, User management, Department
    contracts/            # Người 2: Contract CRUD, Template, State Machine
    partners/             # Người 3: Partner management
    payments/             # Người 3: Payment tracking
    attachments/          # Người 3: File upload, versioning
    workflows/            # Người 4: Workflow config, Approval flow, Signature
    notifications/        # Người 5: Notification list, preferences
    ai-analysis/          # Người 5: AI analysis results, risk flags
    dashboard/            # Người 5: Dashboard, reports, charts
  hooks/
    data/                 # TanStack Query wrapper hooks
  lib/
    utils.ts              # cn(), formatDate(), formatCurrency()...
  router/                 # Route definitions, guards, lazy loading
  types/                  # Shared TypeScript types
```

### Vòng đời hợp đồng (các trạng thái cần hiển thị trên UI)

```
Draft → PendingApproval → Approved → Signed → Active → Expiring → Renewed/Terminated
```

Mỗi trạng thái cần badge/tag với màu riêng biệt trên UI.

### Testing
- Vitest + React Testing Library cho unit/integration tests
- Playwright cho E2E test
- Ưu tiên test: luồng đăng nhập, tạo hợp đồng, trình duyệt, approval flow

### Environment Variables

```env
VITE_API_BASE_URL=https://localhost:7xxx
```

### Deployment
- Không sửa file CI/CD pipeline nếu chưa được Lead duyệt
- Mọi PR cần passing checks trước khi merge

---

## 📌 Git Commit Convention

This project strictly adheres to the **Conventional Commits** specification for all commit messages across both the **.NET API backend** and **React frontend**.

### 1. Commit Message Format
The standard commit message format is:
```text
<type>: <description>
```
Or optionally with an explicit scope:
```text
<type>(<scope>): <description>
```

#### Allowed Scopes (Frontend):
`auth`, `contract`, `workflow`, `partner`, `payment`, `attachment`, `dashboard`, `notification`, `ai`, `components`, `hooks`, `ui`, `router`

### 2. Allowed Commit Types
| Type | Purpose | When to Use |
| :--- | :--- | :--- |
| `feat` | Add a new feature | Introducing a new UI component, page, hook, or feature flow. |
| `fix` | Fix a bug | Patching UI glitches, state errors, routing issues, or broken behavior. |
| `refactor` | Restructure or improve code | Refactoring components/hooks without altering UI behavior. |
| `docs` | Documentation changes | Updating README, specs, user guides, or component docstrings. |
| `test` | Add or modify tests | Adding or updating Vitest, React Testing Library, or Playwright tests. |
| `chore` | Configuration & maintenance | Updating packages, Vite/Tailwind configs, or repo maintenance. |
| `style` | Code formatting & style | Formatting, linting, whitespace, or CSS styling tweaks without logic changes. |

### 3. Commit Message Rules & Quality Standards
- **Imperative Mood**: Write in the imperative mood (e.g., `add`, `implement`, `fix`, `refactor` — NOT `added`, `fixing`, `fixes`).
- **Language**: All commit messages must be written in **English**.
- **Short & Concise**: Keep the subject line short, clear, and meaningful (aim for ≤ 72 characters).
- **Descriptive**: Accurately describe what changed and why in the codebase.
- **Lowercase**: Use lowercase for type and starting character of description (e.g., `feat: implement ...`).

### 4. 🚫 Strictly Forbidden Vague Messages
Do NOT write vague, lazy, or ambiguous commit messages, such as:
- ❌ `update code`
- ❌ `fix`
- ❌ `changes`
- ❌ `done`
- ❌ `update`
- ❌ `final`
- ❌ `modified files`
- ❌ `fix bug`
- ❌ `test`

### 5. 🤖 Rules for AI Assistants
- Whenever an AI assistant creates, suggests, or executes a Git commit, it **MUST** read and strictly follow the Git Commit Convention defined in this `CLAUDE.md`.
- AI must inspect the staged changes (`git diff --staged`) to formulate a precise `<type>: <description>` or `<type>(<scope>): <description>`.
- AI must NEVER use or suggest any of the forbidden vague commit messages listed above.

### 6. Practical Frontend Examples
- `feat(contract): add contract creation form with template selector`
- `feat(dashboard): integrate Recharts for contract status analytics`
- `feat(workflow): implement approval timeline and action buttons component`
- `fix(auth): handle refresh token race condition on 401 response`
- `fix(contract): correct date validation for contract expiry`
- `refactor(components): extract reusable Modal dialog with Shadcn UI`
- `refactor(hooks): simplify useContractApproval hook state logic`
- `docs: update component usage instructions in README`
- `test(hooks): add unit tests for useContractApproval custom hook`
- `test(e2e): add Playwright test for contract draft creation flow`
- `chore: update TanStack Query to version 5.x`
- `style: adjust sidebar layout padding and mobile responsiveness`

