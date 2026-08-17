---
name: pudado-seo-audit
description: Perform a repeatable read-only SEO audit of Pudado static pages, including titles, descriptions, canonicals, sitemap coverage, heading structure, Open Graph/Twitter metadata, internal links, alt text, JSON-LD, and factually justified Article or Breadcrumb schema. Use before launch, after new content pages, when SEO problems are suspected, or when asked to review metadata/schema. Never invent dates, authors, reviews, claims, or structured data.
---

# Pudado SEO audit

Read `AGENTS.md`, the SEO rules in `CLAUDE.md`, and
`.claude/agents/seo-page-auditor.md`. Remain read-only unless the user separately
requests implementation.

## Audit

1. Run `node .claude/scripts/release-check.js` first. Record its mechanical
   results and do not repeat them as newly discovered qualitative findings.
2. Limit scope to public root HTML, `blog/*.html`, and `situations/*.html`.
   Exclude rollback directories. Respect deliberate exceptions:
   `404.html` has no canonical; legal pages and 404 are not in the sitemap.
3. Check each relevant page for:
   - unique, relevant title and description with sensible search-result length;
   - canonical matching the public `https://pudado.de/` URL;
   - consistent `og:title`, `og:description`, `og:image`, `og:url`, locale, and
     Twitter equivalents;
   - exactly one `h1` and logical `h2`/`h3` nesting without skipped levels;
   - valid JSON-LD whose visible facts match the page;
   - incoming internal links and valid relative outbound internal paths;
   - contextual alt text rather than filenames or filler.
4. Parse JSON-LD before assessing it. Recommend `Article` or `BreadcrumbList`
   only when the page and available facts support the fields. Do not infer or
   fabricate publication/modification dates, author identity, ratings,
   availability, certifications, medical effects, or organization claims.
5. Do not flag missing `hreflang` while language variants share one URL and are
   switched client-side. Mention language-specific URLs only as an optional
   strategy, not an implementation defect.

## Report

Group evidence-backed findings as critical, important, and polish. Include file
and line, why it matters, and a concrete safe correction. Separate current
defects from opportunities. Say explicitly when a category is clean; do not
manufacture findings.
