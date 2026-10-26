enum Light {
    Red,
    Yellow,
    Green
}

fn action(light: Light) -> &'static str {
    match light {
        Light::Red => "stop",
        Light::Yellow => "wait",
        Light::Green => "go",
    }
}

fn main() {
    let current_light = Light::Red;
    println!("Action: {}", action(current_light));
}