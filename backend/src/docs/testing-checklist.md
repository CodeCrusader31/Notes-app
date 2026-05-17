# API Testing Checklist

## Core Flow
- Register a new user with a valid email and password.
- Reject duplicate registration with `409`.
- Login with valid credentials and receive a JWT.
- Reject invalid login with `401`.
- Create a note with title, content, tags, favorite, and pinned values.
- Fetch all notes with pagination metadata.
- Fetch a single owned note by id.
- Update note title/content and verify version history is created.
- Soft delete a note and verify it disappears from default list results.
- Restore a deleted note.
- Share a note with another registered user.
- Confirm shared user can read the note but cannot update, delete, restore, or share it.

## Postman Collection Structure
- Auth
  - Register User
  - Login User
- Notes
  - Create Note
  - Get All Notes
  - Get Note By ID
  - Update Note
  - Delete Note
  - Restore Note
  - Favorite Note
  - Pin Note
  - Get Note Versions
- Sharing
  - Share Note
  - Read Shared Note As Recipient
- Search
  - Search By Text
  - Filter By Tag
  - Pagination
- System
  - Health
  - About
  - OpenAPI JSON

## Edge Cases
- Missing JWT.
- Malformed JWT.
- JWT for deleted/nonexistent user.
- Invalid MongoDB object id.
- Empty title or content.
- Overlong title or content.
- Invalid pagination values.
- Duplicate share.
- Self-share.
- Share with nonexistent user.
- Access another user's private note.
- Shared user attempting write operations.
- Restore a note that is not deleted.
- Search with no matches.
- Deleted notes excluded unless `includeDeleted=true`.
