# 🚀 DevForge CLI

> A production-level Command-Line Interface tool built with TypeScript, OOP architecture, and modern best practices

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518.0.0-green.svg)](https://nodejs.org/)
[![Commander.js](https://img.shields.io/badge/Commander.js-14.0.3-orange.svg)](https://github.com/tj/commander.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**DevForge CLI** is a powerful, extensible command-line tool that demonstrates professional software engineering practices. Built from the ground up with Object-Oriented Programming (OOP) principles, it provides a robust foundation for building production-ready CLI applications.

---

## 📖 Table of Contents

- [Features](#-features)
- [What Problem Does It Solve?](#-what-problem-does-it-solve)
- [Installation](#-installation)
- [Available Commands](#-available-commands)
- [Global Flags](#-global-flags)
- [Usage Examples](#-usage-examples)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Architecture Highlights](#-architecture-highlights)
- [Development](#-development)
- [npm CLI Linking](#-npm-cli-linking)
- [API Configuration](#-api-configuration)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏗️ **Professional OOP Architecture**
- **SOLID Principles** - Maintainable and scalable codebase
- **Design Patterns** - Registry, Singleton, Template Method, Strategy patterns
- **Type Safety** - Full TypeScript with strict mode enabled
- **Modular Structure** - Clean separation of concerns

### 🎨 **Beautiful CLI Experience**
- **Colored Output** - Success (green), errors (red), warnings (yellow), info (blue)
- **Loading Indicators** - Visual feedback during API operations
- **Formatted Tables** - Structured data display with dividers and headers
- **Progress Messages** - Clear status updates for long-running operations

### 🔧 **12 Powerful Commands**
- **Core Utilities** - File operations, system info, data processing
- **Security Tools** - Cryptographic hashing (SHA256, SHA512, SHA384, SHA1, MD5)
- **Validation** - Email validation with detailed analysis
- **API Integration** - GitHub users, inspirational quotes, random jokes

### 🌐 **Advanced CLI Features**
- **Global Flags** - `--json`, `--save`, `--verbose` work with all commands
- **JSON Output** - Machine-readable output for automation
- **File Saving** - Export command results to files
- **Aliases** - Short command names for productivity
- **Help System** - Comprehensive help for every command

### 🔐 **Security & Validation**
- **Input Validation** - Type checking and format validation
- **Error Handling** - Graceful error messages with actionable suggestions
- **API Error Management** - Network errors, rate limits, authentication handling
- **Environment Variables** - Secure API key management via `.env`

---

## 💡 What Problem Does It Solve?

DevForge CLI addresses several key challenges in building production-ready CLI applications:

1. **Architecture Complexity** - Provides a clean, OOP-based architecture for CLI tools
2. **Inconsistent Output** - Standardizes colored, formatted terminal output
3. **Poor Error Handling** - Implements comprehensive error handling with clear messages
4. **API Integration** - Demonstrates proper REST API integration with retry logic
5. **Extensibility** - Makes it easy to add new commands without modifying core code
6. **Type Safety** - Enforces TypeScript types throughout the application

**Perfect for:**
- Learning professional CLI development patterns
- Building custom developer tools
- Creating automation scripts with rich terminal output
- Understanding TypeScript and OOP design patterns
- API integration and error handling examples

---

## 📦 Installation

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/devforge-cli.git
cd devforge-cli

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. (Optional) Link globally for system-wide access
npm link
```

After installation, you can run commands using:
```bash
# Development mode
npm run dev -- <command>

# Production mode (after build)
npm start <command>

# Global mode (after npm link)
devforge <command>
```

---

## 📋 Available Commands

DevForge CLI provides **12 commands** organized into 4 categories:

### 🛠️ **Utility Commands** (3)

| Command | Alias | Description |
|---------|-------|-------------|
| `hello` | `hi` | Simple greeting command with optional name |
| `info` | - | Display CLI tool information and version |
| `version` | - | Show detailed version information |

### 🎯 **Core Commands** (5)

| Command | Alias | Description |
|---------|-------|-------------|
| `greet` | `g` | Display styled greeting with timestamp |
| `fileinfo` | `fi` | Show file metadata, size, and permissions |
| `hash` | `h` | Generate cryptographic hashes (5 algorithms) |
| `validate-email` | `ve` | Validate email addresses with detailed analysis |
| `sysinfo` | `si` | Display system information and resource usage |

### 🌐 **API Integration Commands** (3)

| Command | Alias | Description | API Key Required |
|---------|-------|-------------|------------------|
| `github` | `gh` | Fetch GitHub user profiles and stats | Optional (higher limits) |
| `quote` | `q` | Get random inspirational quotes | No |
| `joke` | `j` | Get random jokes | No |

### 📚 **Help Command** (1)

| Command | Description |
|---------|-------------|
| `help` | Display help for any command |

---

## 🎛️ Global Flags

These flags work with **all commands**:

| Flag | Description | Example |
|------|-------------|---------|
| `--json` | Output results in JSON format | `devforge github torvalds --json` |
| `--save <file>` | Save output to a file | `devforge quote --save quote.txt` |
| `--verbose` | Show additional debugging information | `devforge sysinfo --verbose` |
| `-V, --version` | Display version number | `devforge --version` |
| `-h, --help` | Show help information | `devforge --help` |

---

## 🎬 Usage Examples

### Basic Commands

```bash
# Styled greeting
$ devforge greet Shibaditya
════════════════════════════════════════════════════════════
  👋 Hello, Shibaditya!
  Welcome to DevForge CLI
  Current time: 08:22 PM
════════════════════════════════════════════════════════════
✔ Great to have you here, Shibaditya!

# File information
$ devforge fileinfo package.json
📄 FILE INFORMATION
Size: 842 B
Permissions: 644 (rw-r--r--)
Modified: 2026-03-04

# Generate hash
$ devforge hash hello
🔐 HASH RESULT
Algorithm: SHA256
Hash: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

# Validate email
$ devforge validate-email test@gmail.com
✅ VALID EMAIL ADDRESS
📧 test@gmail.com
Local Part: test | Domain: gmail.com | TLD: COM
```

### System Information

```bash
$ devforge sysinfo
💻 SYSTEM INFORMATION
🖥️  OPERATING SYSTEM:
  Platform: Darwin | Architecture: arm64
⚙️  CPU: Apple M3 (8 cores @ 2400 MHz)
💾 MEMORY: 7.84 GB / 8.00 GB (97.99%)
⏱️  UPTIME: 2 days, 10 hours, 36 minutes
```

### API Integration

```bash
# GitHub user lookup
$ devforge github torvalds
👤 GITHUB USER: torvalds
Name: Linus Torvalds
Location: Portland, OR
Company: Linux Foundation
📊 STATS:
  Public Repos: 11
  Followers: 288536
  Following: 0
🔗 Profile: https://github.com/torvalds

# Random quote
$ devforge quote
💭 INSPIRATIONAL QUOTE
"You must either modify your dreams or magnify your skills."
― Jim Rohn

# Random joke
$ devforge joke
😂 RANDOM JOKE
Setup: What did one snowman say to the other snow man?
Punchline: Do you smell carrot?
Type: general
```

### Using Global Flags

```bash
# JSON output (for scripts/automation)
$ devforge github torvalds --json
{
  "login": "torvalds",
  "name": "Linus Torvalds",
  "company": "Linux Foundation",
  "location": "Portland, OR",
  "public_repos": 11,
  "followers": 288536,
  "following": 0,
  ...
}

# Save output to file
$ devforge quote --save inspiration.txt
💭 INSPIRATIONAL QUOTE
"The ego wants comfort and certainty. The soul wants to live fully."
― Maxime Lagace
✔ Output saved to: /path/to/inspiration.txt

# Verbose mode (debugging)
$ devforge sysinfo --verbose
[Shows detailed system information with extra logging]
```

### Command Aliases

All commands have short aliases for faster typing:

```bash
devforge g "Alice"           # greet
devforge fi package.json     # fileinfo
devforge h "data"            # hash
devforge ve user@test.com    # validate-email
devforge si                  # sysinfo
devforge gh octocat          # github
devforge q                   # quote
devforge j                   # joke
```

---

## 📁 Project Structure

```
devforge-cli/
├── src/
│   ├── commands/              # Command implementations
│   │   ├── BaseCommand.ts     # Abstract base class for all commands
│   │   ├── GreetCommand.ts    # Greeting command
│   │   ├── FileInfoCommand.ts # File information
│   │   ├── HashCommand.ts     # Hash generator
│   │   ├── ValidateEmailCommand.ts
│   │   ├── SysInfoCommand.ts  # System information
│   │   ├── HelloCommand.ts    # Simple hello
│   │   ├── InfoCommand.ts     # CLI info
│   │   ├── VersionCommand.ts  # Version display
│   │   ├── GitHubUserCommand.ts # GitHub API integration
│   │   ├── QuoteCommand.ts    # Quote API integration
│   │   ├── JokeCommand.ts     # Joke API integration
│   │   └── index.ts           # Exports
│   │
│   ├── services/              # API service layer
│   │   ├── BaseApiService.ts  # Base class for API services
│   │   ├── GitHubApiService.ts
│   │   ├── QuoteService.ts
│   │   ├── JokeService.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility classes
│   │   ├── Logger.ts          # Colored logging utility
│   │   ├── OutputFormatter.ts # Output formatting & file saving
│   │   └── index.ts
│   │
│   ├── validators/            # Input validation
│   │   ├── Validator.ts       # General validators
│   │   ├── EmailValidator.ts  # Email-specific validation
│   │   └── index.ts
│   │
│   ├── errors/                # Custom error classes
│   │   ├── AppError.ts        # Base application error
│   │   ├── ValidationError.ts # Validation failures
│   │   ├── ApiError.ts        # API-related errors
│   │   └── index.ts
│   │
│   ├── registry/              # Command registry
│   │   ├── CommandRegistry.ts # Singleton registry pattern
│   │   └── index.ts
│   │
│   └── index.ts               # CLI entry point
│
├── dist/                      # Compiled JavaScript output
├── docs/                      # Documentation
│   ├── COMMANDS.md            # Complete command reference
│   ├── ARCHITECTURE.md        # Architecture documentation
│   └── API-GUIDE.md           # API integration guide
│
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

## 🛠️ Technologies Used

### Core Technologies
- **[Node.js](https://nodejs.org/)** - JavaScript runtime (v20.19.4)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript (v5.9.3)
- **[Commander.js](https://github.com/tj/commander.js/)** - CLI framework (v14.0.3)

### Libraries & Tools
- **[Axios](https://axios-http.com/)** - HTTP client for API requests (v1.13.6)
- **[Chalk](https://github.com/chalk/chalk)** - Terminal styling and colors (v5.6.2)
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management (v17.3.1)

### Development Tools
- **ts-node** - TypeScript execution for development
- **tsc-alias** - TypeScript path alias resolution
- **tsconfig-paths** - Module resolution for path mappings

### API Integrations
- **[GitHub API](https://docs.github.com/en/rest)** - User profile data
- **[ZenQuotes API](https://zenquotes.io/)** - Inspirational quotes
- **[Official Joke API](https://official-joke-api.appspot.com/)** - Random jokes

---

## 🏛️ Architecture Highlights

DevForge CLI is built with professional software engineering principles:

### Design Patterns
- **Singleton Pattern** - CommandRegistry for centralized command management
- **Template Method Pattern** - BaseCommand defines command lifecycle
- **Registry Pattern** - Dynamic command registration and discovery
- **Strategy Pattern** - OutputFormatter for multiple output formats
- **Service Layer Pattern** - Separation of API logic from command logic

### SOLID Principles
- **Single Responsibility** - Each class has one clear purpose
- **Open/Closed** - Open for extension (new commands), closed for modification
- **Liskov Substitution** - All commands are interchangeable via BaseCommand
- **Interface Segregation** - Clean, focused interfaces
- **Dependency Inversion** - Commands depend on abstractions (BaseCommand, BaseApiService)

### Key Architectural Decisions

1. **Command Registry** - Centralized command management with automatic registration
2. **Base Classes** - `BaseCommand` and `BaseApiService` provide common functionality
3. **Custom Error Classes** - `ApiError`, `ValidationError`, `AppError` for type-safe error handling
4. **Logger Utility** - Consistent colored output across all commands
5. **OutputFormatter** - Flexible output handling (text, JSON, file saving)
6. **Validator Classes** - Reusable validation logic
7. **Service Layer** - API logic separated from command logic

---

## 💻 Development

### Available Scripts

```bash
# Development mode with hot reload
npm run dev -- <command> [options]

# Build for production
npm run build

# Run production build
npm start <command> [options]

# Clean build artifacts
npm run clean
```

### Adding New Commands

1. **Create Command Class** - Extend `BaseCommand` in `src/commands/`
2. **Implement Required Methods** - `name`, `description`, `execute()`
3. **Add Configuration** - Override `configure()` for options/arguments
4. **Register Command** - Add to `src/index.ts`
5. **Export Command** - Add to `src/commands/index.ts`

Example:
```typescript
import { BaseCommand, CommandOptions } from './BaseCommand';
import { Logger } from '@/utils';

export class MyCommand extends BaseCommand {
  public readonly name = 'mycommand';
  public readonly description = 'My custom command';
  public readonly alias = 'mc';

  public async execute(options: CommandOptions): Promise<void> {
    Logger.info('Hello from MyCommand!');
  }
}
```

### Development Workflow

```bash
# 1. Make changes to source files
# 2. Test in development mode
npm run dev -- mycommand

# 3. Build and test production
npm run build
npm start mycommand

# 4. Link globally for system-wide testing
npm link
devforge mycommand
```

---

## 🔗 npm CLI Linking

To use DevForge CLI globally on your system:

### Link Locally

```bash
# 1. Build the project
npm run build

# 2. Create global symlink
npm link

# 3. Now run from anywhere!
devforge greet John
devforge github octocat
devforge joke
```

### Verify Installation

```bash
# Check if linked correctly
which devforge
# Output: /usr/local/bin/devforge

# Test with any command
devforge --help
devforge version
```

### Unlink

```bash
# Remove global link
npm unlink -g devforge-cli

# Or from within project directory
npm unlink
```

### How It Works

`npm link` creates a global symbolic link to your local project:
- Package name from `package.json`: `devforge-cli`
- Binary name from `bin` field: `devforge`
- Points to: `./dist/index.js`
- Callable from: any directory

---

## 🔑 API Configuration

### GitHub API (Optional)

**Without Token:**
- 60 requests/hour
- Public data only

**With Token:**
- 5,000 requests/hour
- Access to more endpoints

**Setup:**
```bash
# 1. Create .env file
cp .env.example .env

# 2. Generate GitHub token at https://github.com/settings/tokens
# 3. Add to .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 4. Test
devforge github octocat
```

### Quote API

- **No setup required** ✅
- Free tier: 50 quotes/day
- Provider: [ZenQuotes.io](https://zenquotes.io/)

### Joke API

- **No setup required** ✅
- Unlimited requests
- Provider: [Official Joke API](https://official-joke-api.appspot.com/)

---

## 🚀 Future Improvements

### Planned Features

1. **🤖 AI Integration**
   - ChatGPT command for AI-powered responses
   - Code generation assistant
   - Natural language processing

2. **🌐 More API Integrations**
   - Cryptocurrency prices
   - Stock market data
   - News headlines
   - Translation service

3. **🔌 Plugin System**
   - Dynamic plugin loading
   - Community-contributed commands
   - Plugin marketplace

4. **📊 Advanced Output Formats**
   - CSV export
   - XML output
   - Markdown tables
   - HTML reports

5. **🧪 Testing Suite**
   - Unit tests with Jest
   - Integration tests
   - E2E testing with CLI scenarios
   - Code coverage reporting

6. **🔄 Interactive Mode**
   - REPL-style interactive shell
   - Command history
   - Tab completion
   - Multi-command workflows

7. **⚙️ Configuration Management**
   - User preferences
   - Command aliases
   - Default options
   - Profile management

8. **📦 Distribution**
   - Publish to npm registry
   - Homebrew formula
   - Docker image
   - Standalone binaries

---

## 🧪 Testing

### Manual Testing

```bash
# Test all core commands
npm run dev -- greet Shibaditya
npm run dev -- fileinfo package.json
npm run dev -- hash hello
npm run dev -- validate-email test@gmail.com
npm run dev -- sysinfo

# Test API commands
npm run dev -- github torvalds
npm run dev -- quote
npm run dev -- joke

# Test with global flags
npm run dev -- github torvalds --json
npm run dev -- quote --save quote.txt
npm run dev -- sysinfo --verbose
```

### Automated Testing (Future)

```bash
# Run test suite (not yet implemented)
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- GitHubUserCommand.test.ts
```

---

## 📚 Documentation

- **[COMMANDS.md](COMMANDS.md)** - Complete command reference with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture documentation
- **[API-GUIDE.md](API-GUIDE.md)** - API integration guide

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Follow the existing code style
4. **Test thoroughly** - Ensure all commands still work
5. **Commit your changes** - `git commit -m 'Add amazing feature'`
6. **Push to the branch** - `git push origin feature/amazing-feature`
7. **Open a Pull Request** - Describe your changes

### Contribution Guidelines

- Follow TypeScript strict mode
- Extend `BaseCommand` for new commands
- Add comprehensive error handling
- Update documentation (COMMANDS.md)
- Include usage examples
- Test with all global flags

---

## 📄 License

This project is licensed under the ISC License. See [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Shibaditya Deb**

---

## 🙏 Acknowledgments

- Built during SESD Workshop 2026
- Inspired by modern CLI tools like `gh`, `vercel`, and `aws-cli`
- Uses industry-standard libraries and patterns

---

## 📞 Support

- **Documentation:** See [COMMANDS.md](COMMANDS.md) for detailed usage

---

## 🎯 Project Goals

This project demonstrates:

✅ Professional OOP architecture in TypeScript  
✅ Clean code principles and design patterns  
✅ RESTful API integration with error handling  
✅ User-friendly CLI with beautiful output  
✅ Comprehensive documentation  
✅ Production-ready code structure  
✅ Modern development workflow  
✅ Best practices for CLI tools  

---
**Built with ❤️ by Shibaditya Deb for personal interest**

---

## 📝 Version History

### v1.0.0 (Current)
- ✨ Initial release
- 🎯 12 commands (3 utility, 5 core, 3 API, 1 help)
- 🌐 GitHub, Quote, and Joke API integrations
- 🎨 Beautiful colored terminal output
- 🔧 Global flags: --json, --save, --verbose
- 📚 Comprehensive documentation

---

*Last Updated: March 4, 2026*
