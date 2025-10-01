// Common JavaScript utilities for LUXBYTE
// This file is loaded on all pages

// Normalize internal links to .html (static routing)
document.addEventListener('DOMContentLoaded', () => {
  const HTML_ROUTES = new Set(['', 'index', 'choose-role', 'unified-signup', 'auth', 'contact', 'contact-us', 'about', 'privacy', 'terms']);
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // ignore external/anchors/tel/mailto
    if (/^(https?:)?\/\//.test(href) || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // keep query/hash
    const [path, queryHash] = href.split('?');
    const clean = path.replace(/^\//,'').replace(/\/$/,'');
    if (!path.endsWith('.html') && HTML_ROUTES.has(clean)) {
      const name = clean || 'index';
      a.setAttribute('href', '/' + name + '.html' + (queryHash ? '?' + queryHash : ''));
    }
  });
});

// Export for module usage
export {};
