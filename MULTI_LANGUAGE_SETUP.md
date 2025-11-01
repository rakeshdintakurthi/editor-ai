# Multi-Language Code Execution Setup

This AI Code Editor now supports running code in multiple languages:
- **JavaScript** (runs in browser)
- **TypeScript** (runs on server)
- **Python** (runs on server)
- **C#** (runs on server)
- **Java** (runs on server)
- **Go** (runs on server)

## Prerequisites

To run code in different languages, you need to have the following installed on your system:

### For TypeScript:
- Node.js (already installed)
- ts-node will be installed automatically via npx

### For Python:
1. Install Python from https://www.python.org/downloads/
2. Make sure Python is added to your system PATH
3. Verify installation: `python --version`

### For C#:
1. Install .NET SDK from https://dotnet.microsoft.com/download
2. The C# compiler (`csc`) comes with .NET SDK
3. Verify installation: `csc` (should show compiler version)

### For Java:
1. Install JDK (Java Development Kit) from https://www.oracle.com/java/technologies/downloads/
2. Make sure Java is added to your system PATH
3. Verify installation: `javac -version` and `java -version`

### For Go:
1. Install Go from https://go.dev/dl/
2. Make sure Go is added to your system PATH
3. Verify installation: `go version`

## Running the Application

You need to run **TWO** servers:

### Terminal 1 - Frontend (Vite):
```bash
npm run dev
```
This runs the React frontend on http://localhost:5173

### Terminal 2 - Backend (Code Execution Server):
```bash
npm run server
```
This runs the code execution API on http://localhost:3001

## How to Use

1. Start both servers (frontend and backend)
2. Open the application in your browser
3. Select your desired language from the dropdown
4. Write your code
5. Click the "Run" button to execute

## Example Code Snippets

### JavaScript:
```javascript
console.log("Hello from JavaScript!");
const sum = 5 + 3;
console.log("Sum:", sum);
```

### TypeScript:
```typescript
const greeting: string = "Hello from TypeScript!";
console.log(greeting);

function add(a: number, b: number): number {
  return a + b;
}
console.log("Sum:", add(5, 3));
```

### Python:
```python
print("Hello from Python!")
sum = 5 + 3
print(f"Sum: {sum}")
```

### C#:
```csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        int sum = 5 + 3;
        Console.WriteLine($"Sum: {sum}");
    }
}
```

### Java:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int sum = 5 + 3;
        System.out.println("Sum: " + sum);
    }
}
```

### Go:
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    sum := 5 + 3
    fmt.Printf("Sum: %d\n", sum)
}
```

## Notes

- JavaScript runs directly in the browser for better performance
- TypeScript, Python, C#, Java, and Go run on the backend server for security
- Code execution has a 10-second timeout
- Temporary files are automatically cleaned up after execution
- Make sure the backend server is running before trying to execute TypeScript, Python, C#, Java, or Go code
- For Java, make sure your code has a `public class` with the same name as you want to use
- For Go, make sure your code has `package main` and a `main()` function
