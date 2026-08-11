import type { StructureResolver } from 'sanity/structure'

/**
 * Studio sidebar structure.
 *
 *  - Singletons (`siteSettings`, `navigation`, `footerSettings`) are pinned
 *    to dedicated top-level items that always open the single document with
 *    that stable `_id`. This prevents the "I accidentally created three
 *    siteSettings docs" footgun.
 *  - Everything else is grouped under sensible lists.
 *  - Documents with no list yet (`post`, `author`, `category`, `legalPage`,
 *    `page`) live under their own group so editors see at a glance where
 *    new content goes.
 *
 * Pinned singletons use the convention that `documentId === type name`,
 * which is what the GROQ queries in Phase 4 will filter on
 * (`_id == "siteSettings"`).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- Singletons ---
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.listItem()
        .title('Footer settings')
        .id('footerSettings')
        .child(S.document().schemaType('footerSettings').documentId('footerSettings')),

      S.divider(),

      // --- Pages ---
      S.listItem()
        .title('Marketing pages')
        .schemaType('page')
        .child(
          S.documentTypeList('page')
            .title('Marketing pages')
            .defaultOrdering([{ field: 'slug.current', direction: 'asc' }]),
        ),

      S.divider(),

      // --- Blog ---
      S.listItem()
        .title('Blog posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Blog posts')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),

      S.divider(),

      // --- Legal ---
      S.listItem()
        .title('Legal pages')
        .schemaType('legalPage')
        .child(
          S.documentTypeList('legalPage')
            .title('Legal pages')
            .defaultOrdering([{ field: 'slug.current', direction: 'asc' }]),
        ),
    ])
