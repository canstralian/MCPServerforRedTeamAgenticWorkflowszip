# SDK Compatibility Notes

## @modelcontextprotocol/sdk v1.25.1

This project has been updated to use @modelcontextprotocol/sdk version 1.25.1 (upgraded from 0.5.0).

### Testing

Comprehensive test suites have been added to verify compatibility with the new SDK version:

- **Server Initialization Tests** (`src/__tests__/server.test.ts`): Validates that the Server class is properly initialized with the required capabilities.
- **Tool Registration Tests** (`src/__tests__/tools.test.ts`): Verifies that all tools are registered correctly and can be called through the SDK.
- **Operation Tools Tests** (`src/__tests__/operations.test.ts`): Tests the full workflow of creating and managing operations, targets, and agents.

All tests pass successfully, confirming that the application is fully compatible with SDK 1.25.1.

### Current Implementation

The application uses the `Server` class from the SDK, which provides low-level access to the MCP protocol. While the SDK documentation recommends using the `McpServer` class for new implementations, the `Server` class is still fully supported and backward-compatible.

Key points:
- ✅ **Builds successfully** with SDK 1.25.1
- ✅ **All tests pass** - 13 tests covering server initialization, tool registration, and operations
- ✅ **Runtime verified** - Server starts and handles requests correctly
- ✅ **No breaking changes** - The Server API remains stable and compatible

### API Notes

When using the tools via the MCP protocol, enum values should be passed in their lowercase string form as defined in `src/types/index.ts`:

- Agent types: `reconnaissance`, `exploitation`, `post_exploitation`, etc.
- Operation phases: `planning`, `reconnaissance`, `initial_access`, etc.
- Target types: `web_application`, `network`, `host`, etc.

### Running Tests

```bash
npm test
```

To run a specific test suite:
```bash
npm test -- --testNamePattern="Server Initialization"
```

### Future Improvements

While the current implementation is fully functional and tested, a future refactoring could migrate to the `McpServer` high-level API, which provides:
- Simplified tool registration with `registerTool()`
- Built-in schema validation using Zod
- Better type safety with TypeScript

This migration is optional and would be a code quality improvement rather than a functional requirement.
