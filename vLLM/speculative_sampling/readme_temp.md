# Rust Unit vs. Integration Testing

A reference guide for structuring unit tests and integration tests in Cargo projects.

## Comparison: `src/` Unit Tests vs. `tests/` Integration Tests

| Feature | Unit Tests (`src/lib.rs` / `#[cfg(test)]`) | Integration Tests (`tests/*.rs`) |
| :--- | :--- | :--- |
| **Location** | Inside source files under `src/` | Dedicated files under root `tests/` directory (e.g., `tests/test_sampler.rs`) |
| **Visibility** | Can access private and internal functions (`fn`, internal modules) | Can only access the public API (`pub` items exposed by `lib.rs`) |
| **Compilation** | Compiled directly into the library/binary test harness | Compiled as separate, standalone executable crates linking to your library |
| **Execution** | Runs alongside unit test suites via `cargo test` | Discovered and executed automatically by `cargo test` |
| **Target Filtering** | `cargo test --lib` | `cargo test --test <filename_without_rs>` |
| **Primary Goal** | Fine-grained internal logic, corner cases, and private helper functions | End-to-end API verification from an external consumer's perspective |

---

## Project Layout

```text
speculative_sampling/
├── Cargo.toml
├── src/
│   └── lib.rs             # Core implementation & unit tests
└── tests/
    └── test_sampler.rs    # External integration tests
```

---

## Test Execution Commands

```bash
# Run all tests (unit tests, integration tests, and doc tests)
cargo test

# Run only unit tests defined in src/
cargo test --lib

# Run only the specific integration test suite in tests/test_sampler.rs
cargo test --test test_sampler

# Run a specific test function by name filter
cargo test test_perfect_match_always_accepts
```