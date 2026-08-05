import { globalIgnores } from "eslint/config";

export default [
  globalIgnores(["dist/**", "node_modules/**", ".enter/**"]),
];
