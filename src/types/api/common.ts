/**
 * Cross-cutting API types shared across domains. `UserRole` mirrors the backend
 * `UserRole` enum (info.md §2). The UI is in Spanish but the data is in English.
 */
export type UserRole = 'ADMIN' | 'MEMBER' | 'PRODUCER'
