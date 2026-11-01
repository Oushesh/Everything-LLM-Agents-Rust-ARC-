## Key Concepts


## Example


```rust
   fn max<T: PartialOrd+Copy (xs:&[T])> -> T {
    // let the best or max to be the first one and then 
    // you iterate and get the things
    let mut best = xs[0];
    for &x in xs {
    if xs >best {best=xs;}

}   
best
}
```
