import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Scoped rule relaxations. These stay ON everywhere else so new code cannot
  // introduce the same problems — each entry lists only the files that already
  // violate the rule today.

  // Node CommonJS build script, not application code.
  {
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },

  // Pre-existing `any` usage. Prefer narrowing these types over widening the list.
  {
    files: [
      "app/api/proxy/**/route.ts",
      "components/site/Reveal.tsx",
      "features/experts/components/dashboard/tabs/ExperienceTab.tsx",
      "features/experts/components/dashboard/tabs/ExpertiseTab.tsx",
    ],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },

  // React correctness rules. These catch impure renders and render loops, so
  // they are disabled per-file rather than globally — the listed components
  // need refactoring, not a blanket exemption.
  {
    files: ["features/users/use-user-profile-picture.ts"],
    rules: { "react-hooks/purity": "off" },
  },
  {
    files: [
      "app/**/experts/account/page.tsx",
      "components/Navbar.tsx",
      "components/catalog/CatalogImage.tsx",
      "components/site/Reveal.tsx",
      "lib/contracts/contracts-store.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
]);

export default eslintConfig;
