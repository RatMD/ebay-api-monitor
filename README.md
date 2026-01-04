<p align="center">
    <a href="http://nestjs.com" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
    <a href="https://nestjs.com" target="_blank">NestJS</a> is a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

---

# eBay API Monitor

> [!CAUTION]
> **This project is a work in progress.**
> Features are incomplete, things may break, and the codebase is subject to frequent changes. 
> Use at your own risk.

Monitors and aggregates release notes, API changes, and service updates across all eBay APIs, 
providing RSS feeds and notifications for developers.

## Endpoints

### core/health

Provides a simple health check endpoint to verify that the application is running and responsive.

```http
GET  /health
```

The endpoint returns a basic success response and can be used by load balancers, monitoring systems, 
or uptime checks.

### modules/release-notes

This module provides aggregated release note feeds for all eBay APIs. You can retrieve a feed 
containing all available APIs using one of the URLs below, depending on the desired output format:

```http
GET  /feed/feed.atom.xml
GET  /feed/feed.rss.xml
GET  /feed/feed.json
```

**Filtering by API category**  

If you only want release notes from specific API categories, you can filter the feed using the 
category query parameter. The supported categories are:

- `buy`
- `developer`
- `sell`

Multiple categories can be combined using a comma-separated list:

```http
GET  /feed/feed.[:format]
        ?category=buy,developer,sell
```

**Filtering by specific API sources**  

You may also limit the feed to specific APIs. Since API slugs are only unique within their category, 
each API must be referenced using the format `<category>/<api-slug>`. To retrieve a complete list of 
available API sources and their identifiers, use the `/api/sources` endpoint provided by the
`modules/sources` controller.

Again, multiple apis can be combined using a comma-separated list:

```http
GET  /feed/feed.[:format]
        ?api=developer/analytics-api,sell/analytics-api
```

### modules/sources

This module exposes all available eBay API sources known to the system. Each source represents a 
single eBay API and includes its category, identifier-path and additional details.

```http
GET  /api/sources
```

**Filtering by API category**  

You can limit the result set to a specific API category using the category query parameter.

```http
GET  /api/sources
        ?category=developer
```

### modules/subscriptions

This module manages newsletter subscriptions, including subscription creation, confirmation 
(double opt-in), and unsubscription.

**Subscribe to the newsletter**  

Creates a new newsletter subscription. The request body must be sent as `application/json` and must 
include at least an `email` address. An optional `name` may also be provided.

```http
POST /api/newsletter/subscribe
```

After a successful subscription request, a confirmation email is sent to the recipient.

**Confirm subscription (double opt-in)**  

Confirms a newsletter subscription using the `id` and `token` provided in the confirmation email.

```http
GET  /api/newsletter/confirm
        ?id=<id>
        &token=<token>
```

The subscription becomes active only after this step. The validation token is valid for 24 hours.

**Unsubscribe from the newsletter**  

Removes an existing subscription using the `id` and `token` included in each newsletter email.

```http
GET  /api/newsletter/unsubscribe
        ?id=<id>
        &token=<token>
```

## License

Published under MIT License  
Copyright © 2024 - 2026 Sam @ rat.md

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

This software is not an official eBay product and is not associated with, sponsored by, or endorsed 
by eBay Inc.
