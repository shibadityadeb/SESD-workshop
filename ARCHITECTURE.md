# DevForge CLI - OOP Architecture Documentation

## 📐 Architecture Overview

DevForge CLI is built using **Object-Oriented Programming (OOP)** principles with TypeScript, following **SOLID principles** and **design patterns** for maintainability, extensibility, and testability.

---

## 🏗️ Project Structure

```
src/
├── commands/          # CLI command implementations
│   ├── BaseCommand.ts       # Abstract base class for all commands
│   ├── HelloCommand.ts      # Example: Simple greeting command
│   ├── InfoCommand.ts       # Example: Display CLI information
│   ├── GitHubUserCommand.ts # Example: API integration command
│   └── index.ts             # Commands exports
│
├── services/          # API service classes
│   ├── BaseApiService.ts     # Abstract base for API services
│   ├── GitHubApiService.ts   # GitHub API implementation
│   └── index.ts              # Services exports
│
├── utils/             # Utility classes
│   ├── Logger.ts             # Colored console logging
│   └── index.ts              # Utils exports
│
├── validators/        # Input validation layer
│   ├── Validator.ts          # Validation methods
│   └── index.ts              # Validators exports
│
├── errors/            # Custom error classes
│   ├── AppError.ts           # Base error class
│   ├── ValidationError.ts    # Validation errors
│   ├── ApiError.ts           # API errors
│   └── index.ts              # Errors exports
│
├── registry/          # Command registry
│   ├── CommandRegistry.ts    # Singleton command manager
│   └── index.ts              # Registry exports
│
├── config/            # Configuration files
│
└── index.ts           # CLI entry point
```

---

## 🎯 Core Components

### 1. BaseCommand (Abstract Class)

**Purpose**: Defines the structure and behavior for all CLI commands.

**Design Pattern**: Template Method Pattern

**Key Features**:
- Enforces consistent command structure
- Provides error handling
- Enables polymorphism
- Type-safe command options

**Implementation**:

```typescript
export abstract class BaseCommand {
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract execute(options: CommandOptions): Promise<void>;
  
  // Optional override methods
  public configure(command: Command): Command { }
  public async validate(): Promise<boolean> { }
  protected handleError(error: Error): void { }
}
```

**Creating a New Command**:

```typescript
import { BaseCommand, CommandOptions } from '@/commands';
import { Logger } from '@/utils';
import { Command } from 'commander';

export class MyCommand extends BaseCommand {
  public readonly name = 'my-command';
  public readonly description = 'Description of my command';
  
  // Optional: Add options/arguments
  public configure(command: Command): Command {
    return command
      .option('-f, --force', 'Force execution')
      .argument('<id>', 'Item ID');
  }
  
  // Optional: Validate prerequisites
  public async validate(): Promise<boolean> {
    // Check if required dependencies exist
    return true;
  }
  
  // Required: Implement command logic
  public async execute(options: CommandOptions): Promise<void> {
    const id = (options.args as string[])[0];
    const force = options.force as boolean;
    
    Logger.info(`Executing with ID: ${id}`);
    
    // Your command logic here
    Logger.success('Command completed!');
  }
}
```

**Register the Command**:

```typescript
// In src/index.ts
import { MyCommand } from '@/commands/MyCommand';

registry.register(new MyCommand());
```

---

### 2. CommandRegistry (Singleton)

**Purpose**: Centralized management of all CLI commands.

**Design Pattern**: Singleton + Registry Pattern

**Key Features**:
- Single instance across the application
- Automatic integration with Commander.js
- Prevents duplicate command registration
- Type-safe command management

**Usage**:

```typescript
import { getCommandRegistry } from '@/registry';

const registry = getCommandRegistry();

// Register single command
registry.register(new HelloCommand());

// Register multiple commands
registry.registerMultiple([
  new HelloCommand(),
  new InfoCommand(),
  new MyCommand()
]);

// Get command by name
const cmd = registry.getCommand('hello');

// Check if command exists
if (registry.hasCommand('my-command')) {
  // ...
}

// Integrate with Commander.js
registry.registerAll(program);
```

---

### 3. Logger (Static Utility)

**Purpose**: Consistent, colored logging throughout the application.

**Design Pattern**: Utility Class

**Methods**:

```typescript
Logger.info('Information message');
Logger.success('Success message');
Logger.warning('Warning message');
Logger.error('Error message', error);
Logger.debug('Debug message'); // Only in development

// Formatting helpers
Logger.newLine();
Logger.divider();
Logger.header('Section Title');
Logger.table({ key: 'value' });
Logger.step(1, 5, 'First step');
Logger.loading('Loading...');
```

**Example Output**:
- ℹ **Info** (blue)
- ✔ **Success** (green)
- ⚠ **Warning** (yellow)
- ✖ **Error** (red)
- 🐛 **Debug** (cyan)

---

### 4. Custom Error Hierarchy

**Purpose**: Type-safe, structured error handling.

**Design Pattern**: Error Hierarchy

**Error Classes**:

#### AppError (Base)
```typescript
throw new AppError('Something went wrong', 500, true);
```

#### ValidationError
```typescript
import { ValidationError } from '@/errors';

// Single field error
throw new ValidationError('Invalid email', 'email');

// Multiple field errors
throw ValidationError.fromFields({
  email: ['Invalid format', 'Already exists'],
  password: ['Too short']
});
```

#### ApiError
```typescript
import { ApiError } from '@/errors';

// From Axios error
try {
  await axios.get('/api/data');
} catch (error) {
  throw ApiError.fromAxiosError(error);
}

// Manual creation
throw new ApiError('API failed', 404, '/users', 'GET');
```

**Error Handling**:

```typescript
try {
  // Some operation
} catch (error) {
  if (error instanceof ValidationError) {
    Logger.error('Validation failed:', error);
  } else if (error instanceof ApiError) {
    Logger.error(`API Error (${error.statusCode}):`, error);
  } else {
    Logger.error('Unexpected error:', error);
  }
}
```

---

### 5. Validator (Static Utility)

**Purpose**: Reusable input validation logic.

**Design Pattern**: Utility Class

**Methods**:

```typescript
import { Validator } from '@/validators';

// Email validation
const result = Validator.validateEmail('test@example.com');
if (!result.isValid) {
  console.log(result.error);
}

// Or throw if invalid
Validator.requireEmail('test@example.com'); // throws ValidationError

// Required field
Validator.require(username, 'username');

// File existence
Validator.requireFile('./config.json');

// Directory existence
Validator.requireDirectory('./dist');

// String length
Validator.validateLength(password, 8, 128, 'password');

// URL format
Validator.requireUrl('https://example.com');

// Enum validation
Validator.validateEnum(env, ['dev', 'prod'], 'environment');
```

**Creating Custom Validators**:

```typescript
// In Validator.ts, add new method:
public static validatePort(port: number): ValidationResult {
  if (port < 1 || port > 65535) {
    return {
      isValid: false,
      error: 'Port must be between 1 and 65535'
    };
  }
  return { isValid: true };
}
```

---

### 6. BaseApiService (Abstract Class)

**Purpose**: Standardized HTTP API interactions.

**Design Pattern**: Template Method Pattern

**Key Features**:
- Axios wrapper with error handling
- Type-safe API responses
- Built-in retry logic
- Request/Response interceptors
- Authentication support

**Creating an API Service**:

```typescript
import { BaseApiService } from '@/services';

interface User {
  id: number;
  name: string;
  email: string;
}

export class MyApiService extends BaseApiService {
  constructor(apiKey?: string) {
    super('https://api.example.com', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (apiKey) {
      this.setAuthToken(apiKey);
    }
  }
  
  // GET request
  async getUser(id: number): Promise<User> {
    return this.get<User>(`/users/${id}`);
  }
  
  // POST request
  async createUser(data: Partial<User>): Promise<User> {
    return this.post<User>('/users', data);
  }
  
  // PUT request
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.put<User>(`/users/${id}`, data);
  }
  
  // DELETE request
  async deleteUser(id: number): Promise<void> {
    return this.delete<void>(`/users/${id}`);
  }
  
  // With retry logic
  async getUserWithRetry(id: number): Promise<User> {
    return this.withRetry(
      () => this.getUser(id),
      3,  // retries
      1000 // delay in ms
    );
  }
}
```

**Using the Service**:

```typescript
const api = new MyApiService(process.env.API_KEY);

try {
  const user = await api.getUser(123);
  Logger.success(`Found user: ${user.name}`);
} catch (error) {
  if (error instanceof ApiError) {
    Logger.error(`API Error: ${error.statusCode}`, error);
  }
}
```

---

## 🎨 Design Patterns Used

### 1. **Singleton Pattern**
- **Where**: CommandRegistry
- **Why**: Single source of truth for all commands

### 2. **Template Method Pattern**
- **Where**: BaseCommand, BaseApiService
- **Why**: Define skeleton, let subclasses implement details

### 3. **Registry Pattern**
- **Where**: CommandRegistry
- **Why**: Centralized command management

### 4. **Factory Method Pattern**
- **Where**: ApiError.fromAxiosError(), ValidationError.fromFields()
- **Why**: Flexible object creation

### 5. **Strategy Pattern**
- **Where**: Validator methods
- **Why**: Interchangeable validation algorithms

---

## 🔐 SOLID Principles

### **S - Single Responsibility Principle**
- Each class has one reason to change
- `Logger` - only logging
- `Validator` - only validation
- `BaseApiService` - only HTTP communication

### **O - Open/Closed Principle**
- Open for extension, closed for modification
- `BaseCommand` - extend for new commands, don't modify base
- `BaseApiService` - extend for new APIs, don't modify base

### **L - Liskov Substitution Principle**
- Subclasses can replace base classes
- All commands can be used as `BaseCommand`
- All services can be used as `BaseApiService`

### **I - Interface Segregation Principle**
- Small, focused interfaces
- `CommandOptions` - minimal interface for command options
- `ValidationResult` - specific to validation

### **D - Dependency Inversion Principle**
- Depend on abstractions, not concretions
- Commands depend on `BaseCommand` interface
- Services depend on axios abstractions

---

## 🚀 Adding New Features

### Adding a New Command

1. **Create Command File**: `src/commands/MyCommand.ts`

```typescript
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';
import { Command } from 'commander';

export class MyCommand extends BaseCommand {
  public readonly name = 'my-command';
  public readonly description = 'My new command';
  
  public configure(command: Command): Command {
    return command.option('-f, --flag', 'Some flag');
  }
  
  public async execute(options: CommandOptions): Promise<void> {
    Logger.info('Executing my command');
    // Implementation
  }
}
```

2. **Export Command**: `src/commands/index.ts`

```typescript
export { MyCommand } from './MyCommand';
```

3. **Register Command**: `src/index.ts`

```typescript
import { MyCommand } from '@/commands';
registry.register(new MyCommand());
```

### Adding a New API Service

1. **Create Service File**: `src/services/MyApiService.ts`

```typescript
import { BaseApiService } from './BaseApiService';

export class MyApiService extends BaseApiService {
  constructor() {
    super('https://api.myservice.com');
  }
  
  async getData(): Promise<unknown> {
    return this.get('/data');
  }
}
```

2. **Use in Command**:

```typescript
import { MyApiService } from '@/services/MyApiService';

export class FetchCommand extends BaseCommand {
  private apiService: MyApiService;
  
  constructor() {
    super();
    this.apiService = new MyApiService();
  }
  
  async execute(options: CommandOptions): Promise<void> {
    const data = await this.apiService.getData();
    // Use data
  }
}
```

---

## 🧪 Testing Guidelines

### Unit Testing Commands

```typescript
import { MyCommand } from '@/commands/MyCommand';

describe('MyCommand', () => {
  it('should have correct metadata', () => {
    const cmd = new MyCommand();
    expect(cmd.name).toBe('my-command');
    expect(cmd.description).toBeTruthy();
  });
  
  it('should execute successfully', async () => {
    const cmd = new MyCommand();
    await expect(cmd.execute({})).resolves.not.toThrow();
  });
});
```

### Testing Validators

```typescript
import { Validator } from '@/validators';

describe('Validator', () => {
  it('should validate email correctly', () => {
    const result = Validator.validateEmail('test@example.com');
    expect(result.isValid).toBe(true);
  });
  
  it('should reject invalid email', () => {
    const result = Validator.validateEmail('invalid');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
```

---

## 📝 Best Practices

### Command Development

✅ **DO**:
- Keep commands focused (single responsibility)
- Use validators for input validation
- Handle errors gracefully with try-catch
- Provide clear success/error messages
- Use Logger for consistent output

❌ **DON'T**:
- Put business logic in the command execute method (extract to services)
- Use console.log directly (use Logger)
- Ignore error handling
- Make commands dependent on other commands

### Service Development

✅ **DO**:
- Extend BaseApiService for HTTP APIs
- Use TypeScript interfaces for API responses
- Handle API errors with ApiError
- Use retry logic for unreliable endpoints
- Set appropriate timeouts

❌ **DON'T**:
- Make services stateful (avoid instance variables that change)
- Catch errors without re-throwing
- Use hardcoded URLs (use constructor parameters)

### Error Handling

✅ **DO**:
- Use custom error classes (ValidationError, ApiError)
- Provide descriptive error messages
- Log errors with Logger.error()
- Exit with appropriate exit codes

❌ **DON'T**:
- Throw generic Error objects
- Swallow errors silently
- Use console.error directly

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# API Keys
GITHUB_TOKEN=your_token_here
MY_API_KEY=your_key_here

# Environment
NODE_ENV=development

# Custom Config
API_BASE_URL=https://api.example.com
```

Access in code:

```typescript
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MY_API_KEY;
```

### TypeScript Path Aliases

Already configured in `tsconfig.json`:

```typescript
// Instead of:
import { Logger } from '../../../utils/Logger';

// Use:
import { Logger } from '@/utils';
```

---

## 🎓 Key Takeaways

1. **Extensible Architecture**: Easy to add new commands and services
2. **Type Safety**: Full TypeScript support with strict mode
3. **Error Handling**: Structured error hierarchy for better debugging
4. **Code Reusability**: Base classes and utilities reduce duplication
5. **Maintainability**: Clear separation of concerns
6. **Testability**: Each component can be tested independently
7. **Production Ready**: Built with best practices and SOLID principles

---

## 📚 Additional Resources

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

## 💡 Next Steps

1. Add more commands for your specific use case
2. Implement unit tests with Jest or Mocha
3. Add CI/CD pipeline (GitHub Actions)
4. Publish to npm
5. Add interactive prompts (inquirer.js)
6. Add configuration file support
7. Implement plugin system for extensibility

---

**Happy Coding! 🚀**
