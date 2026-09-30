import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // public/embed: artefato distribuído para os sites dos clientes (JS clássico,
  // sem build, com convenções próprias).
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "public/embed/**",
    "integracoes/**",
  ]),
]);
