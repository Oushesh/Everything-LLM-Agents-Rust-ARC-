
//Task: Representation of high dimensional vector index

use std::sync::{Arc,RwLock};
use std::thread;

struct VectorStore {
    dimension: usize, //m
    //Flattened dimension //m*n
    embeddings: Vec<f32>,
}


//Now we implement a method that extends VectorStore
// impl implements the trait and its also the constructor here.
impl VectorStore {
    fn new(dim:usize)-> Self {
        Self{dimension:dim,embeddings:Vec::new()}
    }

    fn add_vector(&mut self, vec: &[f32]) {
        assert_eq!(vec.len(), self.dimension, "Vector size must match store dimension");
        self.embeddings.extend_from_slice(vec);
    }

    // Takes &self (read-only), the index of vector A, and the query slice for vector B
    fn dot_product_traditional(&self, idx: usize, query: &[f32]) -> f32 {
        assert_eq!(query.len(), self.dimension, "Query dimension mismatch");

        // 1. Locate where Vector A starts and ends in the flat Vec
        let start = idx * self.dimension;
        let end = start + self.dimension;
        let a = &self.embeddings[start..end];

        // 2. Manual pairwise multiply and sum
        let mut sum = 0.0;
        for i in 0..self.dimension {
            sum += a[i] * query[i];
        }

        sum
    }
}


fn main() {
    // Constructor called only ONCE for the whole store
    let mut store = VectorStore::new(3);

    // Add vectors into the store (flat buffer)
    store.add_vector(&[1.0, 2.0, 3.0]); // Vector at idx 0
    store.add_vector(&[4.0, 5.0, 6.0]); // Vector at idx 1

    // A query vector from outside
    let query = [2.0, 0.0, 1.0];

    // Compute dot product of Vector 0 with query:
    // (1.0 * 2.0) + (2.0 * 0.0) + (3.0 * 1.0) = 5.0
    let score_0 = store.dot_product_traditional(0, &query);
    println!("Dot product with Vector 0: {}", score_0);

    // Compute dot product of Vector 1 with query:
    // (4.0 * 2.0) + (5.0 * 0.0) + (6.0 * 1.0) = 14.0
    let score_1 = store.dot_product_traditional(1, &query);
    println!("Dot product with Vector 1: {}", score_1);
}

//extend this code to add tests to the code.
//<add tests to be done here. TODO:add tests to keep checking.>

