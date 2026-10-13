# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. These rules are **mandatory**: follow them for every change, and fix any violation you touch.

## Stack

- **React 19** + **TypeScript** (strict bundler mode, `verbatimModuleSyntax`)
- **Vite** for dev server and build
- **oxlint** for linting
- **pnpm** as package manager — never use `npm` or `yarn`
- **Vitest** + **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`) for tests

## Commands

```sh
pnpm install      # install dependencies
pnpm dev          # start dev server
pnpm build        # type-check (tsc -b) and build
pnpm lint         # run oxlint
pnpm test         # run the test suite once (vitest)
pnpm test:watch   # run tests in watch mode
```

Before considering any task done, run `pnpm lint`, `pnpm test` and `pnpm build`. All three must pass.

## Folder structure

The project is organized **by feature**. This structure is enforced; do not create top-level folders under `src/` other than `app/` and `features/`.

```
src/
├── main.tsx                 # entry point: mounts <App />, nothing else
├── app/
│   ├── styles/
│   │   └── globals.css      # global styles, CSS reset, design tokens
│   └── app.tsx              # root component: providers, router, global layout
└── features/
    ├── common/              # code shared by two or more features
    │   ├── utils/
    │   ├── components/
    │   └── layout/
    └── <feature-name>/      # one folder per feature, e.g. `invoices`, `auth`
        ├── hooks/
        ├── screens/
        ├── components/
        └── layouts/
```

### What goes where

| Folder | Contents |
| --- | --- |
| `app/` | App-wide wiring only: root component, providers, routing, global styles. No business logic. |
| `features/common/utils/` | Pure, framework-agnostic helpers used by multiple features. |
| `features/common/components/` | Generic, reusable UI (buttons, inputs, modals). No feature-specific logic. |
| `features/common/layout/` | Layout shells shared across features (page shell, header, sidebar). |
| `features/<name>/hooks/` | Custom hooks owned by the feature (data fetching, state, side effects). |
| `features/<name>/screens/` | Top-level route/page components. Compose components and hooks; keep them thin. |
| `features/<name>/components/` | UI components used only inside this feature. |
| `features/<name>/layouts/` | Layouts used only inside this feature. |

Only create the subfolders a feature actually needs. If a feature needs a new kind of module (e.g. `utils/`, `types/`, `api/`), add it inside the feature folder, never at the top level of `src/`.

### Feature boundaries

- **A feature must not import from another feature.** Features may only import from `features/common/` and from their own folder.
- If code is needed by a second feature, **move it to `features/common/`** instead of importing across features.
- `features/common/` must never import from a specific feature.
- `app/` may import from any feature (to register screens/routes), but features must not import from `app/`.

## One unit per folder, test alongside

Every unit of code (component, hook, util, screen, layout) lives in **its own folder**, named after the unit, together with its test file:

```
features/common/components/
└── button/
    ├── button.tsx
    └── button.spec.tsx

features/invoices/hooks/
└── use-invoices/
    ├── use-invoices.ts
    └── use-invoices.spec.ts

features/common/utils/
└── format-currency/
    ├── format-currency.ts
    └── format-currency.spec.ts
```

Rules:

- The folder name, the source file name and the test file name share the same base name.
- Test files use the `.spec.ts` / `.spec.tsx` suffix (not `.test.*`) and sit **next to** the file they test — no `__tests__/` folders.
- Files only used by that unit (styles, sub-components, constants) may live in the same folder, e.g. `button/button.module.css`. A sub-component that has its own logic gets its own test.
- Do not create `index.ts` barrel files; import from the file directly (`.../button/button`).

## Naming conventions

- **Files and folders:** `kebab-case` (`user-card.tsx`, `use-user-list.ts`).
- **Components:** `PascalCase` named exports (`export function UserCard() {}`). Avoid default exports.
- **Hooks:** start with `use` (`useUserList`), file `use-user-list.ts`.
- **Screens:** suffix with `Screen` (`InvoiceListScreen` in `invoice-list-screen.tsx`).
- **Layouts:** suffix with `Layout` (`DashboardLayout` in `dashboard-layout.tsx`).
- **Types/interfaces:** `PascalCase`; component props are named `<Component>Props`.

## Testing

**Every testable piece of code must be tested.** A change that adds or modifies a component, hook, util, screen or layout without a corresponding test is incomplete.

- Each source file has a sibling `.spec` file (see above). The only exemptions are files with no runtime behavior: type-only files (`*.types.ts`), `main.tsx`, and plain CSS.
- Test **behavior, not implementation**: query by role, label or text (`getByRole`, `getByLabelText`) as a user would; avoid `getByTestId` unless there is no accessible alternative; never assert on internal state or private functions.
- Use `@testing-library/user-event` for interactions instead of `fireEvent`.
- Test hooks with `renderHook` from `@testing-library/react`.
- Utils are pure functions: cover the happy path, edge cases and error cases.
- Cover every branch you write: loading, empty, error and success states for data-driven UI.
- Mock only at the boundaries (network, timers, browser APIs). Do not mock child components or the module under test.
- Keep tests deterministic: no real network calls, no reliance on test order, use fake timers for time-based logic.
- When fixing a bug, first add a test that reproduces it.

## React best practices

- **Function components and hooks only.** No class components.
- **Keep components small and focused.** If a component grows beyond one responsibility, extract sub-components or a custom hook.
- **Separate logic from presentation:** put data fetching, side effects and non-trivial state in hooks; keep components mostly declarative.
- **Follow the Rules of Hooks** (enforced by `react/rules-of-hooks`). Call hooks at the top level only.
- **Avoid unnecessary effects.** Derive values during render instead of syncing state with `useEffect`; handle user events in event handlers, not effects. Use effects only to synchronize with external systems, and always clean up subscriptions, timers and listeners.
- **State:** keep state as local as possible; lift it only when needed. Do not duplicate derived data in state. Use `useReducer` for complex state transitions.
- **Don't memoize by default.** Reach for `useMemo` / `useCallback` / `memo` only to fix a measured performance problem or to keep a stable reference that a dependency requires.
- **Keys:** use stable, unique ids as list keys, never array indexes for dynamic lists.
- **Props:** type every component's props explicitly; prefer composition (`children`) over deep prop drilling; use context for truly cross-cutting state, not as a general store.
- **Accessibility:** use semantic HTML (`button`, `nav`, `main`, `label`), give every interactive element an accessible name, and make everything keyboard-operable. Accessible markup also makes components testable with Testing Library.
- **Side-effect-free modules:** no logic runs at import time. The only exception is the router instance in `src/app/routes/routes.tsx` (see [Routing](#routing)).

## Routing

We use **React Router in data mode** (`createBrowserRouter` + `RouterProvider`).

- All routes are defined in `src/app/routes/routes.tsx`, which exports both the `routes` array and the `router` instance created from it:

  ```tsx
  export const routes: RouteObject[] = [
    {
      path: '/',
      Component: HomeScreen,
    },
  ]

  export const router = createBrowserRouter(routes)
  ```

- Use the route's **`Component`** property (not `element`) to render screens, layouts and error boundaries (`Component`, `ErrorBoundary`).
- Route components are **screens** from `features/<name>/screens/` (or layouts from `layouts/`); keep routing config out of features.
- `app.tsx` renders the exported router with `RouterProvider` from `react-router/dom`.
- Test routes with `createMemoryRouter(routes, { initialEntries: [path] })`, never with the exported browser `router`.

## TypeScript

- No `any`. Use `unknown` and narrow it, or write a proper type.
- Avoid non-null assertions (`!`) and type casts (`as`) unless unavoidable; prefer narrowing.
- Use `import type` for type-only imports (required by `verbatimModuleSyntax`).
- Do not use TypeScript-only runtime syntax such as `enum` or parameter properties (`erasableSyntaxOnly` is on); use union types or `as const` objects instead.

## Styling

- Global styles, resets and design tokens (CSS custom properties) live only in `src/app/styles/globals.css`, imported once from `app.tsx` or `main.tsx`.
- Component styles live in the component's folder and are scoped to it (e.g. CSS Modules: `button.module.css`).

## Checklist for every change

1. Code is placed in the correct feature folder, one unit per folder.
2. No cross-feature imports; shared code is in `features/common/`.
3. Files and folders follow the naming conventions.
4. Every new or changed unit has a sibling `.spec` file covering its behavior.
5. `pnpm lint`, `pnpm test` and `pnpm build` pass.
