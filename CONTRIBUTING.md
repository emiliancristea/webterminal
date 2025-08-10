# Contributing to Web Terminal

We love your input! We want to make contributing to Web Terminal as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your feature/fix
4. **Make your changes** following our guidelines
5. **Test thoroughly** and ensure the build passes
6. **Submit a pull request** with a clear description

## 📋 Development Process

We use GitHub to host code, track issues and feature requests, and accept pull requests. Pull requests are the best way to propose changes to the codebase.

### Setting Up Your Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/webterminal.git
cd webterminal

# Add upstream remote
git remote add upstream https://github.com/emiliancristea/webterminal.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Branch Naming Convention

Use descriptive branch names that indicate the type of change:

- `feature/terminal-themes` - New features
- `fix/websocket-reconnect` - Bug fixes
- `docs/api-examples` - Documentation updates
- `refactor/component-structure` - Code refactoring
- `test/command-execution` - Adding tests

## 🐛 Bug Reports

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Node.js version: [e.g. 18.0.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We welcome feature requests! Before submitting one:

1. **Check existing issues** to avoid duplicates
2. **Consider the scope** - is this a core feature or better as a plugin?
3. **Think about maintenance** - who will maintain this feature?

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation considerations**

- How does this fit with existing architecture?
- What are the potential challenges?
- Are there any breaking changes?
```

## 📝 Pull Request Process

### Before Submitting

1. **Ensure tests pass**: `npm run check`
2. **Build successfully**: `npm run build`
3. **Follow code style**: Use existing patterns and conventions
4. **Update documentation**: If your changes affect the API or user interface
5. **Write good commit messages**: Follow conventional commit format

### Pull Request Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing

- [ ] I have tested my changes locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Related Issues

Fixes #(issue_number)
```

## 🎨 Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface TerminalSession {
  id: string;
  currentDirectory: string;
  environmentVars: Record<string, string>;
}

const createSession = async (userId?: string): Promise<TerminalSession> => {
  // implementation
};

// ❌ Bad
interface terminalSession {
  id: any;
  currentDirectory: any;
}

function createSession(userId) {
  // implementation
}
```

### React Components

```typescript
// ✅ Good
interface TerminalInputProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TerminalInput({
  onCommand,
  disabled = false,
  className
}: TerminalInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  }, [input, onCommand]);

  return (
    <form onSubmit={handleSubmit} className={cn("terminal-input", className)}>
      {/* component content */}
    </form>
  );
}

// ❌ Bad
export function TerminalInput(props: any) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    // implementation
  }

  return <div>{/* content */}</div>;
}
```

### Styling with Tailwind

```typescript
// ✅ Good - Use semantic class combinations
<div className={cn(
  "flex items-center gap-2 p-4",
  "bg-background border border-border rounded-lg",
  "hover:bg-accent transition-colors",
  isActive && "ring-2 ring-primary",
  className
)}>

// ✅ Good - Use CSS variables for theming
<div className="bg-primary text-primary-foreground">

// ❌ Bad - Hardcoded colors
<div className="bg-blue-500 text-white">

// ❌ Bad - Overly long class strings without organization
<div className="flex items-center justify-between p-4 m-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200">
```

### Naming Conventions

- **Files**: kebab-case (`terminal-input.tsx`, `use-websocket.tsx`)
- **Components**: PascalCase (`TerminalInput`, `FileExplorer`)
- **Functions/Variables**: camelCase (`executeCommand`, `currentDirectory`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_SHELL`, `MAX_HISTORY_SIZE`)
- **Types/Interfaces**: PascalCase (`TerminalSession`, `CommandResult`)

### Import Organization

```typescript
// 1. External libraries
import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

// 2. Internal components and hooks
import { Button } from "@/components/ui/button";
import { useTerminal } from "@/hooks/use-terminal";
import { TerminalOutput } from "@/components/terminal/terminal-output";

// 3. Utilities and types
import { cn } from "@/lib/utils";
import type { Session, Command } from "@shared/schema";

// 4. Relative imports
import "./terminal.css";
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

When submitting changes, please test:

**Terminal Functionality:**

- [ ] Command execution works
- [ ] Directory navigation functions
- [ ] File operations complete successfully
- [ ] Error handling displays properly

**WebSocket Communication:**

- [ ] Real-time command execution
- [ ] Connection resilience
- [ ] Reconnection after network issues

**UI/UX:**

- [ ] Responsive design on mobile and desktop
- [ ] Keyboard shortcuts work
- [ ] Accessibility features function
- [ ] Dark/light theme switching

**Performance:**

- [ ] App loads quickly
- [ ] Commands execute without delay
- [ ] Memory usage remains reasonable
- [ ] No console errors

### Writing Tests (Future)

We plan to add comprehensive testing. When writing tests:

```typescript
// Component tests
describe("TerminalInput", () => {
  it("should execute command on submit", () => {
    // test implementation
  });

  it("should clear input after execution", () => {
    // test implementation
  });
});

// Hook tests
describe("useTerminal", () => {
  it("should manage session state", () => {
    // test implementation
  });
});

// API tests
describe("Session API", () => {
  it("should create new session", async () => {
    // test implementation
  });
});
```

## 📖 Documentation

### Code Documentation

```typescript
/**
 * Executes a command in the terminal session
 * @param command - The command string to execute
 * @param sessionId - The session identifier
 * @returns Promise resolving to command result
 * @throws {Error} When command is restricted or session not found
 */
async function executeCommand(
  command: string,
  sessionId: string,
): Promise<CommandResult> {
  // implementation
}
```

### README Updates

When adding new features:

- Update feature list in README
- Add usage examples
- Update API documentation if applicable
- Include any new dependencies

### Documentation Files

- **API changes**: Update `docs/api.md`
- **Development process**: Update `docs/development.md`
- **Deployment**: Update `docs/deployment.md`
- **New features**: Add to README and relevant docs

## 🏷️ Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```
feat(terminal): add command history navigation with arrow keys

fix(websocket): resolve connection dropping after 30 seconds

docs(api): add WebSocket event examples

refactor(components): extract common terminal utilities

perf(rendering): optimize command output display for large outputs

test(hooks): add unit tests for useTerminal hook

chore(deps): update React to v18.3.1
```

## 🎯 Project Priorities

### Current Focus Areas

1. **Core Functionality**
   - Stable command execution
   - Reliable WebSocket connections
   - Session persistence

2. **User Experience**
   - Mobile optimization
   - Performance improvements
   - Accessibility enhancements

3. **Developer Experience**
   - Clear documentation
   - Easy setup process
   - Good error messages

### Future Roadmap

- **Testing Framework**: Comprehensive test suite
- **Plugin System**: Extensible architecture
- **Themes**: Customizable terminal appearance
- **Collaboration**: Multi-user sessions
- **File Management**: Enhanced file operations

## 🤝 Community

### Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Getting Help

- **Documentation**: Check `/docs` folder first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord (link coming soon)

### Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special thanks in project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License that covers the project. Feel free to contact the maintainers if that's a concern.

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes

### Release Schedule

- **Patch releases**: As needed for critical fixes
- **Minor releases**: Every 2-4 weeks for new features
- **Major releases**: When breaking changes are necessary

## 📞 Contact

- **Project Maintainer**: @emiliancristea
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: Available in GitHub profile

---

Thank you for contributing to Web Terminal! 🙏

Your contributions help make this project better for everyone. Whether you're fixing a typo, adding a feature, or improving documentation, every contribution matters.

**Happy coding!** 🚀
