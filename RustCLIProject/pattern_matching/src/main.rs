enum Light {
    Red,
    Yellow,
    Green,
}


fn action (light:Light) -> &static str {
    match light {
        Light::Red =>"stop",
        Light::Yellow => "wait",
        Light::Green => "go"
}


}
fn main() {
    println!("Hello, world!");
}


/*
This code designs on how to use Rust to make things happen
Non exhaustive patterns. The Rust Compiler
will check all the exhaustive patterns needed
and that those cases have been handled before
 */