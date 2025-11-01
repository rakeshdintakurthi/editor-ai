# User Input Examples - Java vs Go

## Comparison: Java Scanner vs Go fmt.Scan

### Java with Scanner

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Read String
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        // Read Integer
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        // Read Double
        System.out.print("Enter your height: ");
        double height = scanner.nextDouble();
        
        // Output
        System.out.println("Hello, " + name + "!");
        System.out.println("You are " + age + " years old.");
        System.out.println("Your height is " + height + " cm.");
        
        scanner.close();
    }
}
```

### Go with fmt.Scan

```go
package main

import "fmt"

func main() {
    var name string
    var age int
    var height float64
    
    // Read String
    fmt.Print("Enter your name: ")
    fmt.Scan(&name)
    
    // Read Integer
    fmt.Print("Enter your age: ")
    fmt.Scan(&age)
    
    // Read Float
    fmt.Print("Enter your height: ")
    fmt.Scan(&height)
    
    // Output
    fmt.Printf("Hello, %s!\n", name)
    fmt.Printf("You are %d years old.\n", age)
    fmt.Printf("Your height is %.2f cm.\n", height)
}
```

---

## Side-by-Side Comparison

| Feature | Java (Scanner) | Go (fmt.Scan) |
|---------|---------------|---------------|
| **Import** | `import java.util.Scanner;` | `import "fmt"` |
| **Setup** | `Scanner scanner = new Scanner(System.in);` | No setup needed |
| **Read String** | `scanner.nextLine()` | `fmt.Scan(&name)` |
| **Read Int** | `scanner.nextInt()` | `fmt.Scan(&age)` |
| **Read Float** | `scanner.nextDouble()` | `fmt.Scan(&height)` |
| **Print** | `System.out.println()` | `fmt.Println()` |
| **Formatted Print** | `System.out.printf()` | `fmt.Printf()` |
| **Cleanup** | `scanner.close()` | Not needed |

---

## All Scanner Methods (Java)

### Reading Different Types

```java
import java.util.Scanner;

public class InputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // String (single word)
        String word = scanner.next();
        
        // String (full line)
        String line = scanner.nextLine();
        
        // Integer
        int number = scanner.nextInt();
        
        // Long
        long bigNumber = scanner.nextLong();
        
        // Float
        float decimal = scanner.nextFloat();
        
        // Double
        double bigDecimal = scanner.nextDouble();
        
        // Boolean
        boolean flag = scanner.nextBoolean();
        
        // Byte
        byte smallNumber = scanner.nextByte();
        
        scanner.close();
    }
}
```

### With Error Handling

```java
import java.util.Scanner;
import java.util.InputMismatchException;

public class SafeInput {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        try {
            System.out.print("Enter a number: ");
            int number = scanner.nextInt();
            System.out.println("You entered: " + number);
        } catch (InputMismatchException e) {
            System.out.println("Invalid input! Please enter a number.");
        } finally {
            scanner.close();
        }
    }
}
```

---

## All fmt Functions (Go)

### Reading Different Types

```go
package main

import "fmt"

func main() {
    var str string
    var num int
    var decimal float64
    var flag bool
    
    // Read single value
    fmt.Scan(&str)
    
    // Read multiple values (space-separated)
    fmt.Scan(&str, &num, &decimal)
    
    // Read with format
    fmt.Scanf("%s %d %f", &str, &num, &decimal)
    
    // Read entire line
    fmt.Scanln(&str)
    
    // Print
    fmt.Println("String:", str)
    fmt.Println("Number:", num)
    fmt.Println("Decimal:", decimal)
    
    // Formatted print
    fmt.Printf("String: %s, Number: %d, Decimal: %.2f\n", str, num, decimal)
}
```

### With Error Handling

```go
package main

import (
    "fmt"
    "bufio"
    "os"
    "strconv"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    
    fmt.Print("Enter a number: ")
    input, _ := reader.ReadString('\n')
    
    // Convert string to int
    number, err := strconv.Atoi(input[:len(input)-1])
    if err != nil {
        fmt.Println("Invalid input! Please enter a number.")
        return
    }
    
    fmt.Println("You entered:", number)
}
```

---

## Python Input (Bonus)

```python
# Read String
name = input("Enter your name: ")

# Read Integer
age = int(input("Enter your age: "))

# Read Float
height = float(input("Enter your height: "))

# Output
print(f"Hello, {name}!")
print(f"You are {age} years old.")
print(f"Your height is {height} cm.")
```

---

## C Input (Bonus)

```c
#include <stdio.h>

int main() {
    char name[50];
    int age;
    float height;
    
    // Read String
    printf("Enter your name: ");
    scanf("%s", name);
    
    // Read Integer
    printf("Enter your age: ");
    scanf("%d", &age);
    
    // Read Float
    printf("Enter your height: ");
    scanf("%f", &height);
    
    // Output
    printf("Hello, %s!\n", name);
    printf("You are %d years old.\n", age);
    printf("Your height is %.2f cm.\n", height);
    
    return 0;
}
```

---

## C# Input (Bonus)

```csharp
using System;

class Program {
    static void Main() {
        // Read String
        Console.Write("Enter your name: ");
        string name = Console.ReadLine();
        
        // Read Integer
        Console.Write("Enter your age: ");
        int age = int.Parse(Console.ReadLine());
        
        // Read Double
        Console.Write("Enter your height: ");
        double height = double.Parse(Console.ReadLine());
        
        // Output
        Console.WriteLine($"Hello, {name}!");
        Console.WriteLine($"You are {age} years old.");
        Console.WriteLine($"Your height is {height} cm.");
    }
}
```

---

## Quick Reference

### Java Scanner Methods
- `next()` - Read single word
- `nextLine()` - Read full line
- `nextInt()` - Read integer
- `nextDouble()` - Read double
- `nextBoolean()` - Read boolean
- `close()` - Close scanner

### Go fmt Functions
- `Scan(&var)` - Read value
- `Scanf(format, &var)` - Read with format
- `Scanln(&var)` - Read line
- `Print()` - Print without newline
- `Println()` - Print with newline
- `Printf(format, args)` - Formatted print

---

## Common Patterns

### Reading Multiple Values (Java)
```java
Scanner scanner = new Scanner(System.in);
System.out.print("Enter name and age: ");
String name = scanner.next();
int age = scanner.nextInt();
```

### Reading Multiple Values (Go)
```go
var name string
var age int
fmt.Print("Enter name and age: ")
fmt.Scan(&name, &age)
```

### Reading Until EOF (Java)
```java
Scanner scanner = new Scanner(System.in);
while (scanner.hasNext()) {
    String line = scanner.nextLine();
    System.out.println(line);
}
```

### Reading Until EOF (Go)
```go
scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {
    line := scanner.Text()
    fmt.Println(line)
}
```

---

## Important Notes

### Java Scanner
- ⚠️ `nextInt()` doesn't consume newline - use `nextLine()` after
- ⚠️ Always close scanner with `scanner.close()`
- ⚠️ Use try-catch for InputMismatchException

### Go fmt.Scan
- ⚠️ Use `&` (address operator) with Scan
- ⚠️ Scan stops at whitespace
- ⚠️ Use `bufio.Scanner` for line-by-line reading

---

Happy Coding! 🚀
