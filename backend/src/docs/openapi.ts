export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Notes App Backend API",
    version: "1.0.0",
    description: "Production-level multi-user notes API with authentication, sharing, search, and version history.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "Current API version",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Notes" },
    { name: "Sharing" },
    { name: "Search" },
    { name: "System" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          details: { type: "array", items: { type: "object" } },
        },
      },
      AuthPayload: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      NotePayload: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", maxLength: 160 },
          content: { type: "string", maxLength: 20000 },
          tags: { type: "array", items: { type: "string" } },
          isFavorite: { type: "boolean" },
          isPinned: { type: "boolean" },
        },
      },
      SharePayload: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: { "200": { description: "API is healthy" } },
      },
    },
    "/about": {
      get: {
        tags: ["System"],
        summary: "About this API",
        responses: { "200": { description: "API metadata" } },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthPayload" } } },
        },
        responses: {
          "201": { description: "User registered" },
          "409": { description: "Email already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthPayload" } } },
        },
        responses: {
          "200": { description: "User logged in" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/notes": {
      get: {
        tags: ["Notes", "Search"],
        summary: "Get all accessible notes with pagination and search",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "tag", in: "query", schema: { type: "string" } },
          { name: "isFavorite", in: "query", schema: { type: "boolean" } },
          { name: "isPinned", in: "query", schema: { type: "boolean" } },
          { name: "includeDeleted", in: "query", schema: { type: "boolean" } },
        ],
        responses: { "200": { description: "Notes fetched" }, "401": { description: "Unauthorized" } },
      },
      post: {
        tags: ["Notes"],
        summary: "Create note",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/NotePayload" } } },
        },
        responses: { "201": { description: "Note created" } },
      },
    },
    "/notes/{noteId}": {
      get: {
        tags: ["Notes"],
        summary: "Get note by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Note fetched" }, "403": { description: "Forbidden" } },
      },
      patch: {
        tags: ["Notes"],
        summary: "Update note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/NotePayload" } } },
        },
        responses: { "200": { description: "Note updated" }, "403": { description: "Owner only" } },
      },
      delete: {
        tags: ["Notes"],
        summary: "Soft delete note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Note deleted" }, "403": { description: "Owner only" } },
      },
    },
    "/notes/{noteId}/share": {
      post: {
        tags: ["Sharing"],
        summary: "Share note with another user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SharePayload" } } },
        },
        responses: { "200": { description: "Note shared" }, "409": { description: "Already shared" } },
      },
    },
    "/notes/{noteId}/restore": {
      patch: {
        tags: ["Notes"],
        summary: "Restore soft-deleted note",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Note restored" } },
      },
    },
    "/notes/{noteId}/favorite": {
      patch: {
        tags: ["Notes"],
        summary: "Set favorite status",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Favorite status updated" } },
      },
    },
    "/notes/{noteId}/pin": {
      patch: {
        tags: ["Notes"],
        summary: "Set pinned status",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Pinned status updated" } },
      },
    },
    "/notes/{noteId}/versions": {
      get: {
        tags: ["Notes"],
        summary: "Get note version history",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "noteId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Version history fetched" } },
      },
    },
  },
} as const;
