# 🚀 DevForge CLI

> A production-level CLI tool built with TypeScript and OOP architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- 🏗️ **Robust OOP Architecture** - Built with SOLID principles and design patterns
- 🎨 **Beautiful CLI Output** - Styled terminal output with colors and formatting
- 🔐 **Security Tools** - Cryptographic hashing with multiple algorithms
- ✅ **Input Validation** - Email validation, file checking, and more
- 💻 **System Utilities** - File info, system monitoring, and diagnostics
- 🌐 **API Integration** - GitHub API integration with error handling
- 📦 **Extensible Design** - Easy to add new commands
- 🧪 **Type-Safe** - Full TypeScript with strict mode

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd SESD-workshop

# Install dependencies
npm install

# Build the project
npm run build
```

### API Setup (Optional)

**For GitHub Command (Optional):**
- Works without token (60 requests/hour)
- With token: 5,000 requests/hour
- Setup: `cp .env.example .env` and add `GITHUB_TOKEN=your_token_here`

**For Quote Command:**
- No API key required - works out of the box!

**Quote Command:**
- ✅ No setup required - works out of the box!

### Usage

```bash
# Development mode (with hot reload)
npm run dev -- <command> [options]

# Production mode
npm start <command> [options]

# Install globally (optional)
npm link
devforge <command> [options]
```

---

## 📚 Available Commands

### Core Commands (5)

| Command | Alias | Description |
|---------|-------|-------------|
| `greet <name>` | `g` | Print a styled greeting message |
| `fileinfo <file>` | `fi` | Display detailed file metadata |
| `hash <text>` | `h` | Generate cryptographic hashes |
| `validate-email <email>` | `ve` | Validate email addresses |
| `sysinfo` | `si` | Display system information |

### Utility Commands (2)

| Command | Alias | Description |
|---------|-------|-------------|
| `hello [name]` | `hi` | Simple hello world command |
| `info` | - | Display CLI information |

### API Commands (2)

| Command | Alias | Description |
|---------|-------|-------------|
| `github <username>` | `gh` | Fetch GitHub user information |
| `quote` | `q` | Get random inspirational quote |

---

## 💡 Usage Examples

### Styled Greeting
```bash
$ devforge greet "Alice"

════════════════════════════════════════════════════════════
  👋 Hello, Alice!
  Welcome to DevForge CLI
  Current time: 07:36 PM
════════════════════════════════════════════════════════════

✔ Great to have you here, Alice!
```

### File Information
```bash
$ devforge fileinfo package.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 FILE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Path:        /Users/.../package.json
📦 Size:        842 B
🔐 Permissions: 644 (rw-r--r--)
📅 Created:     2025-03-01T10:30:45.123Z
✏️  Modified:   2025-03-04T19:25:10.456Z
```

### Cryptographic Hashing
```bash
$ devforge hash "Hello DevForge"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 HASH RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algorithm:  SHA256
Input:      Hello DevForge (14 bytes)

Hex:        a1b2c3d4... (64 characters)
Base64:     YWJjZGVm... (44 characters)
```

### Email Validation
```bash
$ devforge validate-email "user@example.com" --verbose

✅ VALID EMAIL ADDRESS

📧 Email:    user@example.com

COMPONENTS:
  Local Part:  user
  Domain:      example.com
  TLD:         COM

DETAILED ANALYSIS:
  ✓ Format is valid
  ✓ Local part length: 4 characters (within limits)
  ✓ Domain length: 11 characters (within limits)
  ✓ Contains exactly one @ symbol
  [... 10 validation checks ...]
```

### System Information
```bash
$ devforge sysinfo --detailed

💻 SYSTEM INFORMATION

🖥️  OPERATING SYSTEM:
  Platform:    Darwin
  Architecture: arm64

⚙️  CPU:
  Model:       Apple M3
  Cores:       8

💾 MEMORY:
  Total:       16.00 GB
  Used:        15.65 GB (97.86%)
  [████████████████████████████████████████░░] 97.86%
```

### GitHub API Integration
```bash
$ devforge github octocat

⏳ Fetching GitHub user information...

──────────────────────────────────────────────────
👤 GITHUB USER: octocat
──────────────────────────────────────────────────

Name:         The Octocat
Location:     San Francisco
Company:      @github

📊 STATS:
  Public Repos:     8
  Followers:        21965
  Following:        9
  Account Created:  2011-01-25

🔗 Profile: https://github.com/octocat
```

### Inspirational Quotes
```bash
$ devforge quote

⏳ Fetching inspirational quote...

──────────────────────────────────────────────────
💭 INSPIRATIONAL QUOTE
──────────────────────────────────────────────────

"Hope means hoping when everything seems hopeless."

― Gilbert Chesterton
```

---

## 📖 Documentation

- **[README.md](README.md)** - Project overview and quick start (you are here!)
- **[COMMANDS.md](COMMANDS.md)** - Complete command reference with detailed examples
- **[API-GUIDE.md](API-GUIDE.md)** - API integration guide and best practices
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - OOP architecture and design patterns
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to add new commands *(coming soon)*

---

## 🏗️ Architecture Highlights

### Design Patterns

- **Template Method Pattern** - BaseCommand enforces command structure
- **Singleton Pattern** - CommandRegistry manages command lifecycle
- **Factory Pattern** - Error creation and handling
- **Strategy Pattern** - Validation strategies

### Core Components

```
src/
├── commands/          # All CLI commands
│   ├── BaseCommand.ts # Abstract base command
│   └── [8 commands]   # Concrete implementations
├── registry/          # Command registration
├── services/          # API services
├── validators/        # Input validation
├── errors/            # Custom error types
└── utils/             # Logger and utilities
```

### Key Features

- ✅ SOLID Principles throughout
- 🔄 Extensible command system
- 🛡️ Type-safe with TypeScript strict mode
- 🎯 Path aliases for clean imports (`@/*`)
- 📦 Clean dependency management
- 🧪 Ready for unit testing

---

## 🛠️ Development

### Scripts

```bash
npm run dev        # Run in development mode
npm run build      # Build for production
npm start          # Run built version
npm run clean      # Clean build artifacts
```

### Adding a New Command

```bash
# 1. Create command file
src/commands/MyCommand.ts

# 2. Implement BaseCommand
export class MyCommand extends BaseCommand {
  name = 'my-command';
  description = 'My command description';
  // ... implement abstract methods
}

# 3. Register in src/index.ts
registry.register(new MyCommand());
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed implementation guide.

---

## 🔧 Configuration

### TypeScript Configuration

- **Target:** ES2022
- **Module:** CommonJS
- **Strict Mode:** Enabled
- **Path Aliases:** `@/*` maps to `src/*`

### Environment Variables

Create a `.env` file for sensitive data:

```bash
# .env
GITHUB_TOKEN=your_github_token
API_TIMEOUT=5000
LOG_LEVEL=info
```

---

## 📦 Dependencies

### Runtime Dependencies

- **commander** (^14.0.3) - CLI framework
- **axios** (^1.13.6) - HTTP client
- **chalk** (^5.6.2) - Terminal styling
- **dotenv** (^17.3.1) - Environment variables

### Development Dependencies

- **typescript** (^5.9.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution
- **tsconfig-paths** (^4.2.0) - Path alias resolution
- **tsc-alias** (^1.8.16) - Build-time path resolution
- **@types/node** (^22.15.15) - Node.js type definitions

---

## 🎯 Roadmap

- [ ] Add unit tests with Jest
- [ ] Implement interactive prompts
- [ ] Add plugin system
- [ ] Create update checker
- [ ] Add configuration file support
- [ ] Implement command auto-completion
- [ ] Add progress bars for long operations
- [ ] Create Docker support
- [ ] Publish to npm registry

---

## 📄 License

MIT License - feel free to use this project for learning and production!

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the existing OOP architecture
4. Add tests for new features
5. Submit a pull request

---

## 📮 Support

- 📖 Read the [COMMANDS.md](COMMANDS.md) for detailed command usage
- 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md) for design documentation
- 🐛 Report bugs via GitHub issues
- 💬 Ask questions in discussions

---

**Made with TypeScript, Commander.js, and OOP best practices**
