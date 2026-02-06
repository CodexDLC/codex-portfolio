# Data Strategy: Cache-First Architecture

## Overview
This document outlines the data storage and retrieval strategy for the Codex Portfolio backend. The primary goal is to maximize read performance while minimizing cloud infrastructure costs (specifically Serverless DB compute time).

## Architecture Stack
*   **Primary Storage (Cold):** Neon (Serverless PostgreSQL).
*   **Hot Storage (Cache):** Redis.
*   **Application:** Django.

## The "Cache-First" Pattern
Given the nature of a portfolio application (High Read / Low Write ratio), we implement an aggressive caching strategy.

### 1. Cache Warming (On Startup)
When the Django application starts (or via a management command), it performs a "Warm Up":
1.  Connects to Neon (PostgreSQL).
2.  Fetches **all** public data (Projects, Experience, Profile info).
3.  Serializes this data.
4.  Populates Redis with these objects.
5.  Neon database goes to sleep (Scale to Zero).

### 2. Read Operations (Public Users)
*   All `GET` requests for public content are served directly from **Redis**.
*   **No connection** is made to PostgreSQL during normal browsing.
*   **Latency:** Microseconds (In-Memory).
*   **Cost:** Zero DB Compute.

### 3. Write Operations (Admin)
When the owner updates content via Django Admin:
1.  Django writes changes to Neon (PostgreSQL wakes up).
2.  **Signal (`post_save`, `post_delete`)** triggers.
3.  The signal handler updates the corresponding keys in Redis immediately.
4.  Neon goes back to sleep after the transaction.

## Implementation Details

### TTL (Time To Live)
*   **Standard Content:** 24 Hours (or Infinite with manual invalidation).
*   **Dynamic Data:** Shorter TTL if needed.

### Fallback
If Redis is empty (e.g., after a crash) or a key is missing:
1.  Application falls back to PostgreSQL.
2.  Fetches data.
3.  Writes to Redis (Lazy Loading).
4.  Returns data to user.

## Benefits
1.  **Performance:** Static-site-like speed for dynamic content.
2.  **Cost Efficiency:** Minimizes "Active Time" for Serverless DBs.
3.  **Scalability:** Redis handles high traffic loads effortlessly.
