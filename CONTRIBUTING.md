# Contributing to MCP Red Team Server

Thank you for your interest in contributing to the MCP Red Team Server! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Include:**
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, etc.)
   - Relevant logs or error messages

### Suggesting Features

1. **Check the roadmap** and existing issues first
2. **Open a feature request** with:
   - Clear description of the feature
   - Use case and motivation
   - Potential implementation approach
   - How it aligns with MITRE ATT&CK workflows

### Submitting Pull Requests

1. **Fork the repository** and create a feature branch
2. **Follow the coding standards** outlined below
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a PR** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/mcp-redteam-server.git
cd mcp-redteam-server

# Install dependencies
npm install

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper interfaces for all data structures
- Use meaningful variable and function names

### Code Style

- Use 2-space indentation
- Use single quotes for strings
- Add trailing commas in multi-line arrays/objects
- Maximum line length: 100 characters

### File Organization

```
src/
├── tools/          # MCP tool definitions and handlers
├── types/          # TypeScript interfaces and enums
├── config/         # Configuration management
├── store/          # Data storage
├── resources/      # MCP resources
└── utils/          # Utility functions
```

### Tool Development

When adding new tools:

1. **Define the tool** in the appropriate file under `src/tools/`
2. **Add workflow stage mapping** in `src/tools/index.ts`
3. **Follow the naming convention:** `action_subject` (e.g., `scan_target`, `list_findings`)
4. **Include proper input validation** using Zod schemas
5. **Map to MITRE ATT&CK phases** appropriately

Example tool definition:

```typescript
{
  name: 'example_tool',
  description: 'Clear description of what this tool does',
  inputSchema: {
    type: 'object' as const,
    properties: {
      param1: {
        type: 'string',
        description: 'Description of parameter',
      },
    },
    required: ['param1'],
  },
}
```

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(tools): add subdomain enumeration tool
fix(integration): handle VirusTotal rate limiting
docs(readme): update installation instructions
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Guidelines

- Write unit tests for all tool handlers
- Test edge cases and error conditions
- Mock external API calls
- Aim for >80% code coverage on new code

## Pull Request Process

1. **Ensure all tests pass** locally
2. **Update CHANGELOG.md** with your changes
3. **Request review** from maintainers
4. **Address feedback** promptly
5. **Squash commits** if requested

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated
- [ ] No console.log statements (use logger)
- [ ] No hardcoded secrets or credentials

## Adding External Integrations

When adding new security tool integrations:

1. **Create integration in** `src/tools/integration-tools.ts`
2. **Document API requirements** clearly
3. **Handle authentication** via environment variables
4. **Implement proper error handling** for API failures
5. **Add rate limiting awareness** if applicable
6. **Update README.md** with setup instructions

## Security Considerations

- **Never commit secrets** or API keys
- **Validate all inputs** before processing
- **Log security-relevant events** appropriately
- **Follow least privilege** principles
- **Report security vulnerabilities** privately to maintainers

## Questions?

- Open a [Discussion](https://github.com/yourusername/mcp-redteam-server/discussions)
- Check existing issues and discussions
- Review the documentation

Thank you for contributing!
