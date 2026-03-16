<h2>
  <samp>Summary</samp>
</h2>

<samp>A Vite plugin that exposes class names from inline-imported CSS Modules without polluting the global CSS scope.</samp>

```ts
import { inline, module } from "./foo.module.css?isolate"

module // Equivalent to `import "./foo.module.css"`
inline // Equivalent to `import "./foo.module.css?inline"`
```

<br />
<br />
<br />

<h2>
  <samp>Getting Started</samp>
</h2>

<samp>Step 1: Install</samp>

```
pnpm i -D @jynxio/vite-css-modules
```

<br />

<samp>Step 2: Configure</samp>

```ts
// vite.config.ts
import cssModules from "./dist/index.mjs"

defineConfig({ plugins: [cssModules()] })
```

<br />

<samp>Step 3: TypeScript</samp>

> <samp>Import the type declarations if you are using TypeScript.</samp>

```ts
// vite-env.d.ts
import '@jynxio/vite-css-modules/types'
```
