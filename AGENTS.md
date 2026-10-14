# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. These rules are **mandatory**: follow them for every change, and fix any violation you touch.

## Stack

- **React 19** + **TypeScript** (strict bundler mode, `verbatimModuleSyntax`)
- **Vite** for dev server and build
- **oxlint** for linting, **oxfmt** for formatting (config in `.oxfmtrc.json`)
- **pnpm** as package manager — never use `npm` or `yarn`
- **Vitest** + **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`) for tests
- **Tailwind CSS v4** + **shadcn/ui** on **Base UI** primitives (`@base-ui/react`), icons from `lucide-react`

## Commands

```sh
pnpm install      # install dependencies
pnpm dev          # start dev server
pnpm build        # type-check (tsc -b) and build
pnpm lint         # run oxlint
pnpm format       # format the project with oxfmt
pnpm format:check # check formatting without writing
pnpm test         # run the test suite once (vitest)
pnpm test:watch   # run tests in watch mode
```

Before considering any task done, run `pnpm format`, then `pnpm lint`, `pnpm test` and `pnpm build`. All three must pass.

## Folder structure

The project is organized **by feature**. This structure is enforced; do not create top-level folders under `src/` other than `app/` and `features/`.

```
src/
├── main.tsx                 # entry point: initTheme() + mounts <App />, nothing else
├── app/
│   ├── styles/
│   │   └── globals.css      # global styles, CSS reset, design tokens
│   ├── app.tsx              # root component: providers, router, global layout
│   └── routes.tsx           # `routes` array + `router` instance (see Routing)
└── features/
    ├── common/              # code shared by two or more features
    │   ├── utils/
    │   ├── components/
    │   │   └── ui/          # shadcn-generated components (CLI-managed)
    │   └── layout/
    └── <feature-name>/      # one folder per feature, e.g. `invoices`, `auth`
        ├── hooks/
        ├── screens/
        ├── components/
        ├── layouts/
        ├── models/
        └── services/
```

### What goes where

| Folder                        | Contents                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `app/`                        | App-wide wiring only: root component, providers, routing, global styles, and the service composition root. No business logic. |
| `features/common/utils/`      | Pure, framework-agnostic helpers used by multiple features.                                                                   |
| `features/common/components/` | Generic, reusable UI (buttons, inputs, modals). No feature-specific logic.                                                    |
| `features/common/layout/`     | Layout shells shared across features (page shell, header, sidebar).                                                           |
| `features/<name>/hooks/`      | Custom hooks owned by the feature (queries, state, side effects).                                                             |
| `features/<name>/screens/`    | Top-level route/page components. Compose components and hooks; keep them thin.                                                |
| `features/<name>/components/` | UI components used only inside this feature.                                                                                  |
| `features/<name>/layouts/`    | Layouts used only inside this feature.                                                                                        |
| `features/<name>/models/`     | Types the feature returns, and the parsers that produce them from `unknown`.                                                  |
| `features/<name>/services/`   | Ports and adapters owned by this feature.                                                                                     |

Only create the subfolders a feature actually needs. If a feature needs a new kind of module (e.g. `utils/`, `types/`, `api/`), add it inside the feature folder, never at the top level of `src/`.

### Feature boundaries

- **A feature must not import from another feature.** Features may only import from `features/common/` and from their own folder.
- If code is needed by a second feature, **move it to `features/common/`** instead of importing across features.
- `features/common/` must never import from a specific feature.
- `app/` may import from any feature (to register screens/routes), but features must not import from `app/`.

## One unit per folder, test alongside

A unit that has a spec or another associated file lives in **its own folder**, named after the unit, together with those files. A file that has no spec and no associated file sits directly in its parent folder.

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

- When a unit has a folder, the folder name, the source file name and the test file name share the same base name.
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

- Each source file has a sibling `.spec` file (see above). The only exemptions are files with no runtime behavior: type-only files (`*.types.ts`), a service or client port that only exports types, `main.tsx`, route config (`src/app/routes.tsx`), and plain CSS.
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
- **Side-effect-free modules:** no logic runs at import time. The only exception is the router instance in `src/app/routes.tsx` (see [Routing](#routing)).

## Routing

We use **React Router in data mode** (`createBrowserRouter` + `RouterProvider`).

- All routes are defined in `src/app/routes.tsx`, which exports both the typed `routes` array and the `router` instance created from it:

  ```tsx
  import { createBrowserRouter, type RouteObject } from 'react-router'
  import { AppLayout } from '@/features/common/layout/app-layout/app-layout.tsx'
  import { HomeScreen } from '@/features/home/screens/home-screen/home-screen.tsx'

  export const routes: RouteObject[] = [
    {
      path: '/',
      Component: AppLayout,
      children: [
        {
          index: true,
          Component: HomeScreen,
        },
      ],
    },
  ]

  export const router = createBrowserRouter(routes)
  ```

- **Always render route UI with the capitalized `Component` property**, passing the component reference itself (`Component: HomeScreen`). Never use `element` (`element: <HomeScreen />`) or a lowercase `component` key. The same applies to error boundaries: use `ErrorBoundary`, never `errorElement`.
- **Nest routes under layouts:** a layout route sets `Component` to a layout (which renders `<Outlet />`) and declares its pages in `children`. The default page of a layout is an `index: true` child; other children use relative paths (`path: 'invoices'`, no leading `/`).
- Route components are **screens** from `features/<name>/screens/` or layouts from `features/common/layout/` / `features/<name>/layouts/`; keep routing config out of features.
- `app.tsx` renders the exported router with `RouterProvider` from `react-router/dom`.
- Routes are **not tested**: do not add a `routes.spec.tsx`. Test the screens and layouts they render instead.

## TypeScript

- No `any`. Use `unknown` and narrow it, or write a proper type.
- Avoid non-null assertions (`!`) and type casts (`as`) unless unavoidable; prefer narrowing.
- Use `import type` for type-only imports (required by `verbatimModuleSyntax`).
- Do not use TypeScript-only runtime syntax such as `enum` or parameter properties (`erasableSyntaxOnly` is on); use union types or `as const` objects instead.

## App errors

An expected failure is an `AppError`. The error exposes a `code`, and that code is the i18next translation key. Callers react to `code`. The component that presents the failure passes the key and `params` to i18next. `error.message` and text supplied by a remote system are not user-facing copy.

The implementation lives in `features/common/errors/app-error/`:

```
features/common/errors/
└── app-error/
    ├── app-error.ts
    └── app-error.spec.ts
```

`app-error.ts` exports `errorCodes`, the `ErrorCode` type, `AppError`, and `isAppError`.

### Creating an error

- Throw `AppError` for every expected failure (authentication, permissions, validation, not found, network, unavailable, invalid data, and feature-specific business rules). Do not throw a bare `Error`, a string, or a custom error class for these cases.
- `error.message` is the code. Do not put a sentence in it, and do not call i18next at the throw site.
- Set `cause` when wrapping an underlying failure.
- A cancellation stays a cancellation. Do not wrap an abort error in `AppError`.
- Add a code to `errorCodes` only when more than one feature can throw or react to it. A feature-only code lives in that feature (`taskErrorCodes.duplicateTitle` is `'tasks.duplicateTitle'`). Reuse a common code when the meaning is the same.
- A small factory may set a fixed code (`authenticationError()`, `notEnoughPermissionsError()`). Callers still branch on `code`, not on the factory or on `instanceof` subclasses.

```ts
export const errorCodes = {
  unauthenticated: 'auth.unauthenticated',
  forbidden: 'auth.forbidden',
  notFound: 'common.notFound',
  validation: 'common.validation',
  network: 'common.network',
  unavailable: 'common.unavailable',
  invalidResponse: 'common.invalidResponse',
  unknown: 'common.unknown',
} as const

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes]

export class AppError extends Error {
  readonly code: string
  readonly params: Readonly<Record<string, string | number>>

  constructor(
    code: string,
    params: Readonly<Record<string, string | number>> = {},
    options?: { cause?: unknown },
  ) {
    super(code)
    this.name = 'AppError'
    this.code = code
    this.params = params
    this.cause = options?.cause
  }
}
```

Cross-cutting codes:

| Code                     | Use when                                                   |
| ------------------------ | ---------------------------------------------------------- |
| `auth.unauthenticated`   | The caller has no valid session.                           |
| `auth.forbidden`         | The caller is authenticated and is not allowed to do this. |
| `common.notFound`        | The target does not exist.                                 |
| `common.validation`      | The input is unacceptable.                                 |
| `common.network`         | The operation could not reach its dependency.              |
| `common.unavailable`     | The dependency cannot complete the operation right now.    |
| `common.invalidResponse` | Data came back in an unexpected shape.                     |
| `common.unknown`         | The failure has no matching code.                          |

`params` carries interpolation values only (`{ name: taskTitle }`). It does not carry sentences. The keys match the placeholders in the i18next message, for example `Task {{name}} does not exist.`

### Handling an error

- Narrow with `isAppError` before reading `code`.
- Decide what to do from `code`. Do not compare `error.message` to a sentence.
- The component that needs the sentence passes `code` to i18next as the translation key and passes `params` as the interpolation values. That component chooses how the `t` call is written. Do not add a helper that translates an `AppError`.
- Each code has one i18next message per supported locale. Messages for a shared code live with the common resources. Messages for a feature-only code live with that feature. Adding a code means adding that message, placeholders included, to every locale in the same change. A failure with no matching code uses the `common.unknown` key.

## Data fetching

The UI does not fetch. A feature hook owns the TanStack Query call and talks to a service port. The service has no React and no TanStack Query. `app/create-services/` is the composition root: it constructs the graph with `new` and is the only place that chooses concrete adapters. There is no dependency-injection container.

```
src/features/common/service-options.ts
src/features/common/key-value-storage/key-value-storage.ts
src/features/common/key-value-storage/local-storage.ts
src/features/common/http/http-client/http-client.ts
src/features/common/http/http-client/fetch-http-client.ts

src/features/auth/browser-session/browser-session.ts
src/features/auth/services/auth-service/auth-service.ts
src/features/auth/services/auth-service/http-auth-service.ts

src/features/tasks/models/task/task.ts
src/features/tasks/services/tasks-service/tasks-service.ts
src/features/tasks/services/tasks-service/http-tasks-service.ts
src/features/tasks/services/tasks-service-provider/tasks-service-provider.tsx
src/features/tasks/hooks/use-project-tasks/use-project-tasks.ts

src/app/create-services/create-services.ts
```

A port and the adapter that implements it share the port's folder. The port file exports a type and has no spec. The adapter keeps its own file name and a sibling spec (`http-client/fetch-http-client.ts`). A second adapter gets its own folder and imports the port. Every parser, provider, hook, and `createServices` has a sibling spec.

### Models

A service method returns a model from its own feature. The model unit exports the types and the parser that narrows `unknown` into them. Status fields are unions. Properties are `readonly`. An input whose shape differs from the model is a separate type in the same file.

```ts
export type TaskStatus = 'open' | 'done'

export type Task = {
  readonly id: string
  readonly projectId: string
  readonly title: string
  readonly status: TaskStatus
}

export function parseTaskList(value: unknown): readonly Task[] {
  // narrow `unknown`, then return Task[]
}
```

The parser's spec covers a valid payload and a payload it must reject. When the wire shape differs from the model, the conversion stays inside the parser. Screens, hooks, and the port import the model. They do not describe a response inline. A model moves to `features/common/` when a second feature needs it.

### Services

The port is the interface the hook depends on. The HTTP class is the adapter. The last parameter of every service method is `options`. `ServiceOptions` lives in `features/common/service-options.ts`. It exports only that type, so it has no spec and no folder of its own.

```ts
export type ServiceOptions = {
  readonly signal: AbortSignal
}

export interface TasksService {
  getTasksByProjectId(
    projectId: string,
    options: ServiceOptions,
  ): Promise<readonly Task[]>
  createTask(input: CreateTaskInput, options: ServiceOptions): Promise<Task>
}

export class HttpTasksService implements TasksService {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async getTasksByProjectId(
    projectId: string,
    options: ServiceOptions,
  ): Promise<readonly Task[]> {
    const body = await this.http.request({
      method: 'GET',
      path: `/projects/${projectId}/tasks`,
      signal: options.signal,
    })
    return parseTaskList(body)
  }
}
```

- `options` is required and has no default. `options.signal` is required. Every call passes an options object. Per-call settings belong on `options`, not as further positional parameters.
- The method forwards `options.signal` to the client and to any collaborator it calls for the same operation. The refresh request is the exception: `refresh` still takes `options`, and the refresh HTTP call uses its own `AbortController`.
- Collaborators arrive through the constructor. Assign them in the constructor body. The feature imports a port, never another feature's concrete class. A port used by a second feature moves to `features/common/`.
- The adapter is the only caller of the parser. `HttpClient.request` returns `Promise<unknown>`.
- Expected failures throw `AppError` (see [App errors](#app-errors)). The model parser throws `common.invalidResponse`. A service throws a feature code for a business rule. An aborted request stays an abort error.
- A feature exports the class, not a singleton. Nothing in this graph runs at import time.
- Test a service by constructing it with a fake collaborator and passing `{ signal }`.

The feature exposes the already-built instance through its own provider and hook (`TasksServiceProvider`, `useTasksService()`). `useTasksService()` throws when the provider is missing. A single global registry cannot be typed in `features/common/` (it would have to import features) and a feature cannot import one from `app/`.

### HTTP and authentication

`HttpClient` lives in `features/common`. `BrowserSession` and `HttpAuthService` live in `features/auth`. Resource services never see a token, a storage key, or the base URL.

```ts
export interface HttpClient {
  request(request: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    path: string
    body?: unknown
    signal: AbortSignal
  }): Promise<unknown>
}
```

The request type has no headers field. Paths are relative (`/projects/${projectId}/tasks`). `FetchHttpClient` is the only code that sets `Authorization: Bearer <token>`.

`createServices()` builds two clients from one session:

- The anonymous client never sends a bearer token and never refreshes. Login and refresh go through it.
- The authenticated client sends the bearer token on every request. A missing token throws `auth.unauthenticated` before `fetch`. A `401` refreshes once and retries the original request once. A `403` throws `auth.forbidden` and leaves the session in place. Other failed responses map to the cross-cutting codes in [App errors](#app-errors).

Refresh is single-flight inside `HttpAuthService`, so parallel `401`s share one refresh call. That refresh uses its own `AbortController`. Cancelling one query does not cancel a refresh another query is waiting on. The retried request still uses the caller's signal.

`BrowserSession` receives a `KeyValueStorage` and reads and writes tokens through it. `LocalStorage` is the adapter that touches `localStorage`. `HttpAuthService` takes a `BrowserSession` and writes tokens into it after login and refresh. Resource services receive the authenticated client and do not receive the session.

A non-HTTP transport follows the same split. The composition root passes the session, and that transport reads `getAccessToken()` when it opens the connection. The feature service receives the transport already configured.

### Composition root

```ts
export function createServices(): Services {
  const session = new BrowserSession(new LocalStorage())
  const publicHttp = new FetchHttpClient({ baseUrl })
  const auth = new HttpAuthService(publicHttp, session)
  const http = new FetchHttpClient({
    baseUrl,
    getAccessToken: () => session.getAccessToken(),
    refresh: (signal) => auth.refresh({ signal }),
  })

  // Resource services are constructed here and added to the return value.
  return { session, auth, http }
}
```

`App` holds one graph for the lifetime of the page with `useState(createServices)` and passes each service into its provider. The same `session` instance is provided to screens that need to know whether someone is signed in. Data hooks do not read the session. `QueryClientProvider` is mounted here. Services do not import the query client.

The base URL is read in `createServices()` (`import.meta.env.VITE_API_URL`) and passed into the clients. Pass `fetch` into the clients from tests so specs do not touch the network.

### Hooks

The hook owns the query key, the cache, and cancellation. The screen calls the hook.

```ts
export function useProjectTasks(projectId: string) {
  const tasksService = useTasksService()

  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: ({ signal }) =>
      tasksService.getTasksByProjectId(projectId, { signal }),
  })
}
```

The query key names the resource and the parameters that identify the result. A query passes `{ signal }` from `queryFn`. A mutation passes `{ signal }` from the mutation context, then invalidates the related queries. Any other caller creates an `AbortController` and passes `{ signal }`. The service does not invalidate.

## Browser storage

Values that persist in the browser go through the `KeyValueStorage` port in `features/common/key-value-storage/key-value-storage.ts`.

- Only `LocalStorage` (`features/common/key-value-storage/local-storage.ts`) touches `localStorage`. No other code calls `localStorage` or `sessionStorage` directly.
- Code that persists values depends on `KeyValueStorage` and receives an instance through its constructor (`new BrowserSession(new LocalStorage())`). A module-level util with no constructor, such as `theme.ts`, creates its own `LocalStorage`.
- A spec for code that receives a `KeyValueStorage` passes a `MemoryStorage` (`features/common/key-value-storage/memory-storage/`). Specs that cannot inject storage, because the code under test creates its own `LocalStorage` (`LocalStorage` itself, `theme.ts` and `useTheme`, `createServices`), use jsdom's `localStorage` and clear it in `beforeEach`.
- A storage key belongs to the module that owns it: `theme` belongs to `theme.ts`, and the token keys belong to `BrowserSession`. Other code reads or writes that value only through the owning module.

## Styling

- Style with **Tailwind utility classes**. Use semantic theme tokens (`bg-background`, `text-muted-foreground`, `bg-primary`), never raw palette colors (`bg-blue-500`) or manual `dark:` color overrides.
- Global styles and design tokens (shadcn CSS variables) live only in `src/app/styles/globals.css`, imported once from `app.tsx`.
- Merge conditional classes with `cn()` from `@/features/common/utils/cn/cn`.

### Dark mode

- Themes are `'light' | 'dark' | 'system'` (default `system`), persisted in `localStorage` under `theme`. Dark mode is the `.dark` class on `<html>`, which switches the shadcn CSS variables.
- Read or change the theme in components with `useTheme()` from `@/features/common/hooks/use-theme/use-theme` (`{ theme, setTheme }`). Never toggle the `.dark` class or touch the `theme` storage key directly.
- The theme logic lives in `@/features/common/utils/theme/theme`; `initTheme()` is called once in `main.tsx`.
- Components must work in both themes: use semantic tokens so they adapt automatically.

## UI components (shadcn/ui)

- shadcn is configured in `components.json` with the `base-nova` style on **Base UI** (not Radix). Base UI uses the `render` prop for custom triggers, not `asChild`.
- Add components with the CLI only: `pnpm dlx shadcn@latest add <component>`. They are written to `src/features/common/components/ui/`.
- **Use an existing shadcn component before writing custom markup** (`Button`, `Card`, `Dialog`, `Field`, `Badge`, `Alert`, `Skeleton`, `Separator`, …), and prefer built-in variants (`variant`, `size`) over custom classes.
- **Exception to the folder/test rules:** `components/ui/` holds CLI-generated files in shadcn's flat layout (`ui/button.tsx`). Do not wrap them in folders and do not add tests for unmodified generated files. If you customize a generated component's behavior, add a spec for it.
- Do not edit generated components for one-off needs; compose them in your own component (one unit per folder, with tests) instead.

## Imports

- Use the `@/` alias (maps to `src/`) for imports across folders, e.g. `@/features/common/components/ui/button`. Use relative imports only within the same unit folder.

## Commits

We use **[Conventional Commits](https://www.conventionalcommits.org/)**. Every commit message must follow this format:

```
<type>(<optional scope>): <description>

<optional body>

<optional footer(s)>
```

- **Types:** `feat` (new feature), `fix` (bug fix), `refactor` (no behavior change), `test` (tests only), `docs` (documentation, including `AGENTS.md`), `style` (formatting only), `perf`, `build` (build system, dependencies), `ci`, `chore` (anything else, e.g. tooling config).
- **Scope** is optional and names the area touched, usually the feature folder (`feat(invoices): …`, `fix(common): …`).
- **Description:** imperative mood, lowercase, no trailing period, at most ~72 characters (`feat: add invoice list screen`, not `Added invoice list screen.`).
- **Breaking changes:** add `!` after the type/scope (`feat!: …`) and a `BREAKING CHANGE:` footer describing the change.
- Keep one logical change per commit; do not mix unrelated changes under a single type.

## Checklist for every change

1. Code is placed in the correct feature folder. A unit with a spec or associated files has its own folder. A file with neither sits directly in its parent folder.
2. No cross-feature imports; shared code is in `features/common/`.
3. Files and folders follow the naming conventions.
4. Every new or changed unit has a sibling `.spec` file covering its behavior.
5. `pnpm format` has run (`pnpm format:check` passes), and `pnpm lint`, `pnpm test` and `pnpm build` pass.
6. Commit messages follow Conventional Commits.
7. Expected failures throw `AppError` with a catalog code. A component that needs the sentence passes that code and `params` to i18next.
8. Data access goes through a service port. Hooks own TanStack Query, every service call passes `options` with a required `signal`, and services return models.
9. Browser storage goes through `KeyValueStorage`; only `LocalStorage` touches `localStorage`.
