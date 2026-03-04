# DevForge CLI - Commands Reference

**Quick reference guide for all available commands and features**

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Command Overview](#command-overview)
- [Core Commands](#core-commands)
- [Utility Commands](#utility-commands)
- [API Integration Commands](#api-integration-commands)
- [Global Options](#global-options)
- [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Installation

```bash
npm install
npm run build
```

### Running Commands

**Development mode:**
```bash
npm run dev -- <command> [options]
```

**Production mode:**
```bash
npm start <command> [options]
# Or use the binary directly after npm link
devforge <command> [options]
```

### Get Help

```bash
# Show all commands
devforge --help

# Show help for a specific command
devforge <command> --help
```

---

## Command Overview

| Command | Alias | Category | Description |
|---------|-------|----------|-------------|
| `hello` | `hi` | Utility | Say hello to someone |
| `info` | - | Utility | Display CLI information |
| `greet` | `g` | Core | Print a styled greeting message |
| `fileinfo` | `fi` | Core | Display detailed file metadata |
| `hash` | `h` | Core | Generate cryptographic hashes |
| `validate-email` | `ve` | Core | Validate email addresses |
| `sysinfo` | `si` | Core | Display system information |
| `github` | `gh` | API | Fetch GitHub user information |
| `quote` | `q` | API | Get random inspirational quote |

---

## Core Commands

### 1. **greet** - Styled Greeting

**Purpose:** Display a beautiful styled greeting message with timestamp

**Usage:**
```bash
devforge greet <name>
devforge g <name>           # Using alias
```

**Arguments:**
- `<name>` (required) - Name of the person to greet

**Examples:**
```bash
# Basic greeting
devforge greet "Alice"

# Using alias
devforge g "Bob"
```

**Output:**
```
════════════════════════════════════════════════════════════
  👋 Hello, Alice!
  Welcome to DevForge CLI
  Current time: 07:36 PM
════════════════════════════════════════════════════════════

✔ Great to have you here, Alice!
```

**Features:**
- ✨ Styled output with colored borders
- 🕐 Current timestamp display
- ✅ Input validation (name required)

---

### 2. **fileinfo** - File Metadata Display

**Purpose:** Display comprehensive information about a file including size, permissions, and timestamps

**Usage:**
```bash
devforge fileinfo <filename>
devforge fi <filename>      # Using alias
```

**Arguments:**
- `<filename>` (required) - Path to the file (relative or absolute)

**Examples:**
```bash
# Check package.json
devforge fileinfo package.json

# Check a source file
devforge fi src/index.ts

# Check with absolute path
devforge fileinfo /path/to/file.txt
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 FILE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Path:        /Users/.../package.json
📦 Size:        842 B
🔐 Permissions: 644 (rw-r--r--)
📅 Created:     2025-03-01T10:30:45.123Z
✏️  Modified:   2025-03-04T19:25:10.456Z
👁️  Accessed:   2025-03-04T19:36:20.789Z

✔ File information retrieved successfully
```

**Features:**
- 📊 Human-readable file sizes (B, KB, MB, GB)
- 🔐 Permission display in both octal (644) and symbolic (rw-r--r--) format
- 📅 Full timestamp information (created, modified, accessed)
- ✅ File existence validation

---

### 3. **hash** - Cryptographic Hash Generator

**Purpose:** Generate cryptographic hashes for text input with multiple algorithm support

**Usage:**
```bash
devforge hash [options] <text>
devforge h [options] <text>    # Using alias
```

**Arguments:**
- `<text>` (required) - Text to hash

**Options:**
- `-a, --algorithm <algo>` - Hash algorithm (choices: sha256, sha512, sha1, md5, sha384)
- Default: `sha256`

**Examples:**
```bash
# Default SHA256 hash
devforge hash "Hello DevForge"

# Use MD5 (with security warning)
devforge hash "password" --algorithm md5

# Use SHA512
devforge h "secret data" -a sha512

# Hash a long string
devforge hash "The quick brown fox jumps over the lazy dog"
```

**Output (SHA256):**
```
Hashing text with SHA256 algorithm...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 HASH RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algorithm:  SHA256
Input:      Hello DevForge (14 bytes)

Hex:        a1b2c3d4e5f6789... (64 characters)
Base64:     YWJjZGVmZ2hpams... (44 characters)

✔ Hash generated successfully
```

**Output (MD5 - with warning):**
```
⚠️  MD5 is considered cryptographically weak. Use SHA256 or stronger for security-critical applications.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 HASH RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algorithm:  MD5
Input:      password (8 bytes)

Hex:        5f4dcc3b5aa765d6... (32 characters)
Base64:     X03MO1qnZdYdgyfeu... (24 characters)

✔ Hash generated successfully
```

**Features:**
- 🔐 5 hash algorithms: SHA256, SHA512, SHA384, SHA1, MD5
- 📝 Dual encoding: Hexadecimal and Base64
- ⚠️ Security warnings for weak algorithms (MD5, SHA1)
- 📊 Input size display
- ✅ Algorithm validation

**Security Notes:**
- ✅ **Recommended:** SHA256, SHA512, SHA384
- ⚠️ **Deprecated:** SHA1, MD5 (use only for non-security purposes like checksums)

---

### 4. **validate-email** - Email Validator

**Purpose:** Validate email addresses and analyze their components

**Usage:**
```bash
devforge validate-email [options] <email>
devforge ve [options] <email>    # Using alias
```

**Arguments:**
- `<email>` (required) - Email address to validate

**Options:**
- `-v, --verbose` - Show detailed validation analysis

**Examples:**
```bash
# Basic validation
devforge validate-email user@example.com

# Detailed analysis
devforge ve john.doe@company.co.uk --verbose

# Test invalid email
devforge ve invalid-email
```

**Output (Valid Email):**
```
Validating email address...

✅ VALID EMAIL ADDRESS

📧 Email:    user@example.com

COMPONENTS:
  Local Part:  user
  Domain:      example.com
  TLD:         COM

✔ Email is valid
```

**Output (Valid Email - Verbose Mode):**
```
Validating email address...

✅ VALID EMAIL ADDRESS

📧 Email:    john.doe@company.co.uk

COMPONENTS:
  Local Part:  john.doe
  Domain:      company.co.uk
  TLD:         UK

DETAILED ANALYSIS:
  ✓ Format is valid
  ✓ Local part length: 8 characters (within limits)
  ✓ Domain length: 10 characters (within limits)
  ✓ Contains exactly one @ symbol
  ✓ No consecutive dots
  ✓ No leading/trailing dots
  ✓ Valid characters used
  ✓ No spaces
  ✓ Domain has valid structure
  ✓ TLD is present

✔ Email is valid
```

**Output (Invalid Email):**
```
Validating email address...

❌ INVALID EMAIL ADDRESS

📧 Email:    invalid-email

ISSUES FOUND:
  ✗ Missing @ symbol
  ✗ Invalid email format

💡 SUGGESTIONS:
  • Email must contain exactly one @ symbol
  • Format should be: localpart@domain.tld
  • Example: user@example.com

✖ Email validation failed
```

**Features:**
- ✅ RFC-compliant email validation
- 📊 Component breakdown (local part, domain, TLD)
- 🔍 Verbose mode with 10+ validation checks
- ❌ Clear error messages with helpful suggestions
- 🎯 Exit code 1 for invalid emails (scripting-friendly)

**Validation Rules:**
- Must contain exactly one @ symbol
- Local part: 1-64 characters
- Domain: 1-255 characters
- No consecutive dots
- No leading/trailing dots
- Valid characters only
- Proper domain structure with TLD

---

### 5. **sysinfo** - System Information

**Purpose:** Display comprehensive system information including OS, CPU, memory, and network details

**Usage:**
```bash
devforge sysinfo [options]
devforge si [options]      # Using alias
```

**Options:**
- `-d, --detailed` - Show detailed system information including network interfaces

**Examples:**
```bash
# Basic system info
devforge sysinfo

# Detailed info with network interfaces
devforge si --detailed

# Using alias
devforge si -d
```

**Output (Basic Mode):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖥️  OPERATING SYSTEM:
  Platform:    Darwin
  Release:     23.3.0
  Type:        darwin
  Architecture: arm64
  Hostname:    MacBook-Pro.local

⚙️  CPU:
  Model:       Apple M3
  Cores:       8 (8 physical)
  Speed:       2400 MHz

💾 MEMORY:
  Total:       16.00 GB
  Used:        15.65 GB (97.86%)
  Free:        348.08 MB (2.14%)
  
  [████████████████████████████████████████░░] 97.86%

⏱️  UPTIME:
  System:      2 days, 5 hours, 30 minutes

✔ System information retrieved successfully
```

**Output (Detailed Mode):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... Basic info as above ...]

🔧 NODE.JS:
  Version:     v20.19.4
  V8:          11.3.244.8

🌐 NETWORK INTERFACES:
  lo0:         127.0.0.1 (IPv4)
               ::1 (IPv6)
  en0:         192.168.1.100 (IPv4)
               fe80::1234:5678:9abc:def0 (IPv6)
  [... more interfaces ...]

👤 USER:
  Username:    shibadityadeb
  Home Dir:    /Users/shibadityadeb
  Shell:       /bin/zsh

✔ System information retrieved successfully
```

**Features:**
- 💻 Operating system details (platform, release, arch, hostname)
- ⚙️ CPU information (model, cores, speed)
- 💾 Memory usage with visual bar and percentage
- 🌐 Network interfaces (detailed mode)
- 🔧 Node.js version info (detailed mode)
- 👤 User information (detailed mode)
- ⏱️ System uptime with human-readable format
- 📊 Color-coded memory bar (green < 70%, yellow < 90%, red ≥ 90%)

---

## Utility Commands

### 6. **hello** - Simple Hello World

**Purpose:** Basic hello world command with optional name

**Usage:**
```bash
devforge hello [options] [name]
devforge hi [options] [name]    # Using alias
```

**Arguments:**
- `[name]` (optional) - Name to greet

**Options:**
- `-l, --loud` - Make greeting LOUD (uppercase)

**Examples:**
```bash
# Default greeting
devforge hello

# Greet someone
devforge hello Alice

# Loud greeting
devforge hi Bob --loud
```

**Output:**
```bash
devforge hello Alice
# Hello, Alice!

devforge hello Bob --loud
# HELLO, BOB!
```

---

### 7. **info** - CLI Information

**Purpose:** Display information about the DevForge CLI tool

**Usage:**
```bash
devforge info
```

**Examples:**
```bash
devforge info
```

**Output:**
```
DevForge CLI v1.0.0
A production-level CLI tool built with OOP architecture
```

**Features:**
- Shows CLI version
- Displays description
- Quick reference for CLI metadata

---

## API Integration Commands

### 8. **github** - GitHub User Lookup

**Purpose:** Fetch and display GitHub user information via GitHub API

**Usage:**
```bash
devforge github <username>
devforge gh <username>      # Using alias
```

**Arguments:**
- `<username>` (required) - GitHub username to lookup

**Examples:**
```bash
# Fetch user info
devforge github octocat

# Check Linus Torvalds
devforge gh torvalds

# Check organization
devforge github github
```

**Output:**
```
⏳ Fetching GitHub user information...

──────────────────────────────────────────────────
👤 GITHUB USER: torvalds
──────────────────────────────────────────────────

Name:         Linus Torvalds
Location:     Portland, OR
Company:      Linux Foundation

📊 STATS:
  Public Repos:     11
  Followers:        288526
  Following:        0
  Account Created:  2011-09-03

🔗 Profile: https://github.com/torvalds

✔ User information retrieved successfully
```

**Features:**
- 👤 Full profile information (name, bio, location, company)
- 📊 Repository and follower statistics
- 🔗 Direct link to GitHub profile
- ⚡ Real-time API integration with GitHub
- ❌ Error handling for non-existent users
- 🔄 Automatic retry logic with exponential backoff (3 attempts)
- 🔐 Optional token authentication for higher rate limits

**Error Handling:**
```bash
# User not found
devforge github nonexistentuser999
# ✖ User 'nonexistentuser999' not found on GitHub

# Rate limit exceeded
# ✖ GitHub API rate limit exceeded
# ⚠ Tip: Add GITHUB_TOKEN to .env for higher rate limits

# Network error
# ✖ Network error: Unable to connect to GitHub API
# ⚠ Please check your internet connection
```

**Rate Limits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour
- Add `GITHUB_TOKEN` to `.env` for higher limits (optional)

---

### 9. **quote** - Inspirational Quotes

**Purpose:** Get random inspirational quotes from a curated collection

**Usage:**
```bash
devforge quote
devforge q                  # Using alias
```

**No Arguments Required**

**Setup:** ✅ No API key needed - works out of the box!

**Examples:**
```bash
# Get a random quote
devforge quote

# Using alias
devforge q
```

**Output Example 1:**
```
⏳ Fetching inspirational quote...

──────────────────────────────────────────────────
💭 INSPIRATIONAL QUOTE
──────────────────────────────────────────────────

"If you want to achieve anything in this world, you have to
  get used to the idea that not everyone will like you."

― Simon Sinek

✔ Quote retrieved successfully
```

**Output Example 2:**
```
──────────────────────────────────────────────────
💭 INSPIRATIONAL QUOTE
──────────────────────────────────────────────────

"Hope means hoping when everything seems hopeless."

― Gilbert Chesterton

✔ Quote retrieved successfully
```

**Features:**
- 💭 Curated inspirational quotes
- 📝 Automatic text wrapping for long quotes
- 🎨 Beautiful styled output with italics
- 👤 Author attribution
- 🆓 No API key required
- 🔄 Different quote each time

**Error Handling:**
```bash
# Network error
# ✖ Network error: Unable to connect to Quote API
# ⚠ Please check your internet connection

# API unavailable
# ✖ No quotes available at the moment
# ⚠ Please try again later
```

**API Details:**
- Provider: ZenQuotes.io
- Free tier: 50 quotes/day
- Authentication: None required
- Documentation: https://zenquotes.io/

---

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `-V, --version` | Output the version number |
| `-v, --verbose` | Enable verbose logging |
| `-h, --help` | Display help for command |

**Examples:**
```bash
# Check version
devforge --version

# Get help
devforge --help

# Command-specific help
devforge hash --help
```

---

## Tips & Best Practices

### 🚀 Performance

1. **Use Aliases**: All core commands have short aliases for faster typing
   ```bash
   devforge g "Alice"      # Instead of: devforge greet "Alice"
   devforge fi file.txt    # Instead of: devforge fileinfo file.txt
   devforge h "data"       # Instead of: devforge hash "data"
   ```

2. **Pipe Output**: Commands output to stdout, perfect for piping
   ```bash
   devforge hash "data" | grep "Hex:"
   ```

### 🔒 Security

1. **Hash Algorithms**: Always use SHA256 or stronger for security-critical applications
   ```bash
   # ✅ Good
   devforge hash "password" --algorithm sha256
   
   # ⚠️ Avoid for security
   devforge hash "password" --algorithm md5
   ```

2. **API Keys**: Store sensitive data in `.env` file (automatically loaded)
   ```bash
   # .env
   GITHUB_TOKEN=your_github_token
   ```
   
3. **Never Commit `.env`**: Always in `.gitignore`
   ```bash
   # Use .env.example for documentation
   cp .env.example .env
   ```

### 🌐 API Integration

1. **Check API Status**: If a command fails, verify the API is operational
   ```bash
   # GitHub Status: https://www.githubstatus.com/
   ```

2. **Rate Limit Awareness**: Know your limits
   ```bash
   # GitHub without token: 60/hour
   # GitHub with token: 5000/hour
   # Quote: 50/day
   ```

3. **Cache Results**: For repeated queries, save output to avoid API calls
   ```bash
   # Save GitHub profile to file
   devforge github octocat > profile.txt
   
   # Read cached result
   cat profile.txt
   ```

4. **Error Debugging**: Use verbose mode for API issues
   ```bash
   devforge -v github octocat
   ```

### 📝 Scripting & Automation

1. **Exit Codes**: Commands return proper exit codes for scripting
   ```bash
   # Check if email is valid in a script
   if devforge validate-email "user@example.com"; then
       echo "Valid email"
   else
       echo "Invalid email"
   fi
   ```

2. **Quiet Mode**: Combine with grep/awk for parsing
   ```bash
   # Extract just the hash
   devforge hash "data" | grep "Hex:" | awk '{print $2}'
   ```

### 🎨 Output Formatting

1. **Colored Output**: All commands use consistent color scheme
   - 🔵 Blue: Headers and information
   - 🟢 Green: Success messages
   - 🟡 Yellow: Warnings
   - 🔴 Red: Errors
   - ⚪ White: Data and details

2. **Structured Layouts**: Commands use dividers and sections for clarity

### 🛠️ Development

1. **Testing Changes**: Use dev mode for quick iteration
   ```bash
   npm run dev -- <command>
   ```

2. **Production Build**: Always build before deployment
   ```bash
   npm run build
   npm start <command>
   ```

3. **Adding New Commands**:
   - Extend `BaseCommand` class
   - Implement abstract methods
   - Register in `src/index.ts`
   - See [ARCHITECTURE.md](ARCHITECTURE.md) for details

---

## Command Categories

### 🎯 Quick Reference by Use Case

**File Operations:**
- `fileinfo` - Get file metadata and permissions

**Data Processing:**
- `hash` - Generate cryptographic hashes
- `validate-email` - Validate and analyze emails

**System Administration:**
- `sysinfo` - Check system resources and configuration

**API Integration:**
- `github` - Query GitHub API for user profiles and stats
- `quote` - Fetch inspirational quotes

**Utilities:**
- `hello` - Test command / simple greeting
- `info` - CLI metadata
- `greet` - Styled greeting messages

---

## Common Workflows

### 1. File Analysis
```bash
# Check if file exists and get info
devforge fileinfo config.json

# Hash a file's content (manual)
cat data.txt | xargs -0 devforge hash
```

### 2. Email Validation in Forms
```bash
# Quick validation
devforge validate-email "user@example.com"

# Detailed analysis for debugging
devforge ve "complex+email@sub.domain.com" --verbose
```

### 3. System Monitoring
```bash
# Quick memory check
devforge sysinfo

# Full system audit
devforge si --detailed > system-report.txt
```

### 4. Security Operations
```bash
# Generate strong hash
devforge hash "my-secret-data" --algorithm sha512

# Compare hashes
HASH1=$(devforge h "data1" | grep "Hex:" | awk '{print $2}')
HASH2=$(devforge h "data2" | grep "Hex:" | awk '{print $2}')
```

### 5. API Data Fetching
```bash
# Get user information
devforge github octocat

# Get daily inspiration
devforge quote

# Save API results to file
devforge github torvalds > profile.txt
```

---

## Error Handling

All commands provide clear error messages:

### Validation Errors
```bash
devforge greet
# ✖ Validation Error: Name is required

devforge hash "data" --algorithm invalid
# ✖ Validation Error: Algorithm must be one of: sha256, sha512, sha1, md5, sha384
```

### File Errors
```bash
devforge fileinfo nonexistent.txt
# ✖ Validation Error: File not found: nonexistent.txt
```

### API Errors
```bash
# User not found (GitHub)
devforge github invalid___user
# ✖ User 'invalid___user' not found on GitHub

# Network error
# ✖ Network error: Unable to connect to [API Name]
# ⚠ Please check your internet connection

# Rate limit exceeded
# ✖ GitHub API rate limit exceeded
# ⚠ Tip: Add GITHUB_TOKEN to .env for higher rate limits
```

---

## Environment Variables

Commands can use environment variables from `.env` file:

```bash
# .env

# GitHub API (Optional - for higher rate limits)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Application Configuration
API_TIMEOUT=10000
LOG_LEVEL=info
DEBUG=false
```

**Setup:**
1. Copy template: `cp .env.example .env`
2. Add your API keys (if using GitHub with higher limits)
3. Never commit `.env` to Git (already in `.gitignore`)

**Optional Keys:**
- 🔹 `GITHUB_TOKEN` - Increases GitHub rate limit from 60 to 5000 requests/hour
- 🔹 Quote API requires no key (no setup needed)

Automatically loaded at CLI startup.

---

## Version Information

**Current Version:** 1.0.0  
**Node.js Required:** ≥ 18.0.0  
**TypeScript:** 5.9.3  
**Last Updated:** March 2026

---

## Quick Command Cheat Sheet

```bash
# Greetings
devforge g "Alice"                          # Styled greeting
devforge hi "Bob" --loud                   # Loud hello

# File Operations  
devforge fi package.json                    # File metadata

# Hashing
devforge h "data"                           # SHA256 hash
devforge hash "pass" -a sha512             # SHA512 hash

# Validation
devforge ve user@example.com                # Validate email
devforge validate-email email@test.com -v  # Verbose validation

# System
devforge si                                 # Basic system info
devforge sysinfo --detailed                 # Detailed system info

# API Integration
devforge github octocat                     # GitHub user lookup
devforge gh torvalds                        # Using alias
devforge quote                              # Random quote
devforge q                                  # Quote using alias

# Help
devforge --help                             # All commands
devforge <command> --help                   # Command help
```

---

## Support & Documentation

- **Commands Reference:** [COMMANDS.md](COMMANDS.md) - You are here!
- **API Integration Guide:** [API-GUIDE.md](API-GUIDE.md) - Complete API documentation
- **Architecture Guide:** [ARCHITECTURE.md](ARCHITECTURE.md) - Full OOP architecture documentation
- **Project Overview:** [README.md](README.md) - Quick start and features
- **Source Code:** `src/` directory - All command implementations
- **Issues:** Report bugs or request features via GitHub issues

---

**Built with ❤️ using TypeScript, Commander.js, and OOP principles**
