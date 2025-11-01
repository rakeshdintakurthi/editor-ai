# Test Examples for Multi-Language Support

Use these code snippets to test each language after starting both servers.

## JavaScript Test
```javascript
console.log("=== JavaScript Test ===");
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Numbers:", numbers);
console.log("Sum:", sum);
console.log("Average:", sum / numbers.length);
```

## TypeScript Test
```typescript
console.log("=== TypeScript Test ===");

interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "Alice",
  age: 30
};

console.log(`Name: ${person.name}`);
console.log(`Age: ${person.age}`);

function greet(p: Person): string {
  return `Hello, ${p.name}! You are ${p.age} years old.`;
}

console.log(greet(person));
```

## Python Test
```python
print("=== Python Test ===")

# List operations
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum: {sum(numbers)}")
print(f"Average: {sum(numbers) / len(numbers)}")

# Dictionary
person = {"name": "Alice", "age": 30}
print(f"Name: {person['name']}")
print(f"Age: {person['age']}")
```

## C# Test
```csharp
using System;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("=== C# Test ===");
        
        int[] numbers = { 1, 2, 3, 4, 5 };
        Console.WriteLine("Numbers: " + string.Join(", ", numbers));
        Console.WriteLine("Sum: " + numbers.Sum());
        Console.WriteLine("Average: " + numbers.Average());
        
        var person = new { Name = "Alice", Age = 30 };
        Console.WriteLine($"Name: {person.Name}");
        Console.WriteLine($"Age: {person.Age}");
    }
}
```

## Java Test
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Java Test ===");
        
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        
        System.out.println("Numbers: 1, 2, 3, 4, 5");
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + (sum / (double) numbers.length));
        
        System.out.println("Name: Alice");
        System.out.println("Age: 30");
    }
}
```

## Go Test
```go
package main

import "fmt"

func main() {
    fmt.Println("=== Go Test ===")
    
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    
    fmt.Println("Numbers:", numbers)
    fmt.Printf("Sum: %d\n", sum)
    fmt.Printf("Average: %.2f\n", float64(sum)/float64(len(numbers)))
    
    person := map[string]interface{}{
        "name": "Alice",
        "age":  30,
    }
    fmt.Printf("Name: %v\n", person["name"])
    fmt.Printf("Age: %v\n", person["age"])
}
```

## Quick Start Commands

### Terminal 1 (Frontend):
```bash
npm run dev
```

### Terminal 2 (Backend):
```bash
npm run server
```

Then open http://localhost:5173 in your browser and test each language!
