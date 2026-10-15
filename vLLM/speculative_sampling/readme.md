## speculative_sampling
   * Cargo.toml
   * src/
   * lib.rs   
   * tests/
   * test_sampler.rs 


## ## Comparison: `src/` Unit Tests vs. `tests/` Integration Tests

| Feature | Unit Tests (`src/lib.rs` / `#[cfg(test)]`) | Integration Tests (`tests/*.rs`) |
| :--- | :--- | :--- |
| **Location** | Inside source files under `src/` | Dedicated files under root `tests/` directory (e.g., `tests/test_sampler.rs`) |
| **Visibility** | Can access private and internal functions (`fn`, internal modules) | Can only access the public API (`pub` items exposed by `lib.rs`) |
| **Compilation** | Compiled directly into the library/binary test harness | Compiled as separate, standalone executable crates linking to your library |
| **Execution** | Runs alongside unit test suites via `cargo test` | Discovered and executed automatically by `cargo test` |
| **Target Filtering** | `cargo test --lib` | `cargo test --test <filename_without_rs>` |
| **Primary Goal** | Fine-grained internal logic, corner cases, and private helper functions | End-to-end API verification from an external consumer's perspective |

---


## Running test:
   - # Run all unit tests and integration tests
    cargo test

     # Run only the integration tests in tests/test_sampler.rs
    cargo test --test test_sampler