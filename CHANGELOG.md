# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-09

### Added
- **Next.js 16 App Router Migration**: Full rewrite from legacy React/Firebase to Next.js 16 App Router.
- **Prisma & SQLite/PostgreSQL**: Completely new relational database schema with Turso edge-database readiness.
- **Enterprise CMS Architecture**: 14+ modules including Products, Blog, News, Team, Partners, Technologies, Solutions.
- **Google OAuth**: Secure admin authentication via Auth.js v5.
- **Media Library**: Headless Cloudinary integration for robust asset management.
- **SEO Manager**: Centralized database-driven SEO metadata for all dynamic routes.
- **Server Actions**: Secure, type-safe data mutations without API routes.
- **Graphify Integration**: Built-in knowledge graph architectural mapping for safe refactoring and zero regressions.
- **Hostinger Deployment Readiness**: Full PM2 and Node.js deployment configurations.

### Changed
- Refactored entire styling system to Tailwind CSS v4.
- Consolidated all dynamic content into the relational database.

### Removed
- Deprecated all legacy Firebase Firestore dependencies.
- Removed legacy client-side data fetching patterns.
