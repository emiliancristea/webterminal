# Testing Guide

This document describes the testing infrastructure and how to run tests for the Web Terminal project.

## Testing Setup

The project uses:

- **Vitest** - Fast unit test runner built on Vite
- **React Testing Library** - Testing utilities for React components
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **JSDOM** - DOM environment for testing

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Structure

Tests are located alongside source files with `.test.ts` or `.test.tsx` extensions:

```
client/src/
├── App.test.tsx          # App component tests
├── lib/
│   └── utils.test.ts     # Utility function tests
└── test/
    └── setup.ts          # Test setup and global mocks
```

## Writing Tests

### Basic Component Test

```typescript
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

### Utility Function Test

```typescript
import { describe, it, expect } from "vitest";
import { myUtilFunction } from "./utils";

describe("myUtilFunction", () => {
  it("returns expected result", () => {
    expect(myUtilFunction("input")).toBe("expected");
  });
});
```

## Mocks and Setup

Global mocks are configured in `client/src/test/setup.ts`:

- `window.matchMedia` - For responsive design tests
- `ResizeObserver` - For component resize handling

## CI Integration

Tests are automatically run in CI/CD pipeline:

- On pull requests to main branch
- On pushes to main and develop branches
- Matrix testing on Node.js 18 and 20

## Coverage

To add test coverage reporting, you can extend the vitest configuration:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests simple and focused**
4. **Mock external dependencies**
5. **Test error cases and edge cases**
