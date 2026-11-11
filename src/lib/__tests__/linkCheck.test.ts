import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Validates that no JSX/TSX file links to an unbuilt page or non-existent route.
 */
describe("Automated Internal Link Checker", () => {
  const projectRoot = path.resolve(__dirname, "../../../");
  const appDir = path.join(projectRoot, "src/app");
  const componentsDir = path.join(projectRoot, "src/components");

  const unbuiltRoutes = [
    "/lab",
    "/beats",
    "/daily",
    "/learn",
    "/about",
    "/data-credits",
    "/submit-beat",
  ];

  function collectFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFiles(fullPath, fileList);
      } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name) && !entry.name.includes(".test.")) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  function resolveInternalRoute(route: string): boolean {
    const cleanRoute = route.split("?")[0].split("#")[0];
    if (cleanRoute === "/") {
      return fs.existsSync(path.join(appDir, "page.tsx"));
    }

    const segments = cleanRoute.replace(/^\//, "").split("/");

    // Direct folder match (e.g. src/app/play/classic/page.tsx)
    const directPath = path.join(appDir, ...segments, "page.tsx");
    if (fs.existsSync(directPath)) return true;

    // Dynamic param match (e.g. src/app/play/[mode]/page.tsx)
    if (segments.length === 2 && segments[0] === "play") {
      const dynamicPath = path.join(appDir, "play", "[mode]", "page.tsx");
      if (fs.existsSync(dynamicPath)) return true;
    }

    return false;
  }

  it("should not contain any links to unbuilt / missing pages", () => {
    const files = [...collectFiles(appDir), ...collectFiles(componentsDir)];
    const detectedLinks: { file: string; href: string }[] = [];

    const linkRegex = /href=["'](\/[^"']*)["']/g;

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, "utf-8");
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1];
        detectedLinks.push({
          file: path.relative(projectRoot, filePath),
          href,
        });
      }
    }

    // Verify unbuilt routes specifically
    for (const link of detectedLinks) {
      expect(
        unbuiltRoutes.includes(link.href),
        `Found link to unbuilt page '${link.href}' in ${link.file}`
      ).toBe(false);
    }

    // Verify all internal links resolve to valid App Router pages
    for (const link of detectedLinks) {
      const exists = resolveInternalRoute(link.href);
      expect(
        exists,
        `Link '${link.href}' in ${link.file} does not resolve to an existing page in src/app/`
      ).toBe(true);
    }
  });
});
