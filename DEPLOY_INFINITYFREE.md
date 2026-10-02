# Deploying the portfolio and admin on InfinityFree

1. Build the site with `pnpm build`. Upload **the contents** of `dist/` to your InfinityFree `htdocs` folder. Keep the `.htaccess` files; enable “show hidden files” in the file manager if needed.
2. Keep `htdocs/admin/config.php` private and writable by PHP so the studio can change its password hashes. The local ignored `public/admin/config.php`, when present, is copied into `dist/admin/config.php`. Otherwise copy `config.php.example` and set both the admin and document password hashes. Generate hashes with PHP's `password_hash()`; never put plaintext passwords in frontend files or a public repository.
3. Ensure PHP can write to `htdocs/admin/data`, `htdocs/admin/uploads`, and `htdocs/admin/private-documents`. The private folder's `.htaccess` denies direct web access; do not remove it. Keep the `admin/config.php` deny rule, uploads hardening, HTTPS redirect, and root security headers in their `.htaccess` files.
4. Visit `/studio`, sign in, and use **Certificates & docs**, **Passwords**, and **Contact & links**. Public certificate files go in `admin/uploads`; private documents are delivered only through the authenticated PHP API. The admin session expires after two hours of inactivity.

The public site uses the checked-in content until the first admin save, then automatically loads the saved hosted portfolio. For large videos, use YouTube, Cloudinary, or another video host instead of shared-host uploads. The PHP endpoints and `.htaccess` protections must both be deployed for private-document access controls to apply.

InfinityFree must be configured to serve the Vite SPA fallback for `/studio` and `/projects/...`. If those routes return 404, use `/studio/` only after adding your host's standard `.htaccess` SPA rewrite rule.
