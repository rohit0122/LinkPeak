Its time to upgrade the project architecture to a fully API-driven UI model.

Architecture Guidelines

The frontend must not execute any direct or custom database queries.

All data access must occur strictly through APIs.

Introduce a repository layer (e.g., UserRepository, SubscriptionRepository, etc.) where all database queries are centralized, function-wise, and are accessible only via APIs.

The frontend should consume data exclusively from APIs, ensuring strict separation of concerns.

State Management Upgrade

Upgrade the application to use a highly efficient Redux store.

Redux must act as the single source of truth.

Eliminate repeated API calls for the same data using proper caching and normalization.

Ensure all API mutations (create/update/delete) immediately sync with the Redux store.

The system should remain lightweight, fast, and highly responsive with minimal network usage.

Critical Constraints

Do NOT change any existing business logic or UI behavior.

This task is strictly a refactor and architectural optimization.

Performance & API Improvements

Identify and implement additional performance optimizations where applicable.

Improve API consistency, data normalization, and reusability.

Enforce a single source of truth via APIs and Redux for long-term scalability.

AI Execution & Stability Instructions

If a response or implementation becomes large or complex, do not break the execution flow.

When approaching AI consumption or token limits, ensure the system reaches a stable, usable state before limits are exhausted.

Prefer completing critical architectural steps first, then proceed with optimizations incrementally.

Avoid partial or unstable implementations that could leave the system in a broken state.

Goal: Deliver a clean, scalable, API-first architecture with improved performance, strong state consistency, and operational stability—without altering existing functionality or UI.