# Security policy

This is a static site template with no backend, database or user accounts.

If you find a vulnerability (for example an XSS vector in content rendering or a misconfigured header),
please **do not open a public issue**. Use GitHub's private reporting: open the repository's **Security** tab
and choose **Report a vulnerability**. You can expect an acknowledgement within a few days.

Supported version: the latest commit on `main`.

If you run a site built from this template, `/.well-known/security.txt` is generated from `profile.email`
in `lib/data.ts`; set it to an address you monitor.
