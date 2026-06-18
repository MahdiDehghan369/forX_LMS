# API Documentation

## Base URL
```
http://localhost:3000
```

All authenticated endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Module (`/api/v1/auth`)

### POST /register
**Description:** Register a new user account. Only allowed when no users exist yet.  
**Endpoint:** `POST http://localhost:3000/api/v1/auth/register`  
**Headers:** None (public endpoint)  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username |
| email | string | Yes | Unique email address |
| password | string | Yes | Password (min 6 characters) |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |

**Success Response (201):**
```json
{
  "message": "ثبت نام شما با موفقیت انجام شد.",
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Responses:**
- `400` – Registration limit exceeded (when users already exist)  
- `409` – Email or username already exists  
- `400` – Validation error  

---

### POST /login
**Description:** Authenticate user and receive JWT tokens.  
**Endpoint:** `POST http://localhost:3000/api/v1/auth/login`  
**Headers:** None (public endpoint)  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Username or email |
| password | string | Yes | User password |

**Success Response (200):**
```json
{
  "message": "ورود شما با موفقیت انجام شد.",
  "username": "john_doe",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Error Responses:**
- `401` – Invalid credentials  
- `403` – Account locked  
- `400` – Validation error  

---

### POST /refresh-token
**Description:** Exchange refresh token for a new access token.  
**Endpoint:** `POST http://localhost:3000/api/v1/auth/refresh-token`  
**Headers:** None (public endpoint)  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Previously received refresh token |

**Success Response (200):**
```json
{
  "message": "جلسه شما با موفقیت پایان یافت.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "bmV3IHJlZnJlc2ggdG9rZW4..."
}
```

**Error Responses:**
- `401` – Invalid or expired refresh token  

---

### POST /logout
**Description:** Invalidate current session by removing refresh token.  
**Endpoint:** `POST http://localhost:3000/api/v1/auth/logout`  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** None  

**Success Response (200):**
```json
{
  "message": "شما با موفقیت از حساب کاربری خود خارج شدید."
}
```

**Error Responses:**
- `401` – Unauthorized  

---

### GET /me
**Description:** Get current authenticated user's profile information.  
**Endpoint:** `GET http://localhost:3000/api/v1/auth/me`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "اطلاعات حساب کاربری شما با موفقیت دریافت شد.",
  "user": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "avatarUrl": null
  }
}
```

**Error Responses:**
- `401` – Unauthorized  

---  

## User Module (`/api/v1/users`)

### GET /
**Description:** List all users with pagination.  
**Endpoint:** `GET http://localhost:3000/api/v1/users`  
**Headers:** `Authorization: Bearer <token>`  

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |
| role | string | No | - | Filter by role |

**Success Response (200):**
```json
{
  "message": "اطلاعات کاربر با موفقیت دریافت شد.",
  "data": {
    "docs": [...],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### GET /:userId
**Description:** Get a specific user by ID.  
**Endpoint:** `GET http://localhost:3000/api/v1/users/:userId`  
**Headers:** `Authorization: Bearer <token>`  

**Params:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | MongoDB ObjectId |

**Success Response (200):**
```json
{
  "message": "اطلاعات کاربر با موفقیت دریافت شد.",
  "data": {...}
}
```

### POST /
**Description:** Create a new user (admin only).  
**Endpoint:** `POST http://localhost:3000/api/v1/users`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username |
| email | string | Yes | Unique email |
| password | string | Yes | Password |
| firstName | string | Yes | First name |
| lastName | string | Yes | Last name |
| phone | string | No | Phone number |
| avatarUrl | string | No | Avatar URL |
| bio | string | No | Bio (max 500 chars) |
| permissions | array | No | Array of permission strings |

**Success Response (201):**
```json
{
  "message": "کاربر با موفقیت ایجاد شد.",
  "data": {...}
}
```

### PUT /:userId
**Description:** Update user information (admin only).  
**Endpoint:** `PUT http://localhost:3000/api/v1/users/:userId`  

**Headers:** `Authorization: Bearer <token>`  

**Request Body:** Fields to update (email, firstName, lastName, etc.)

**Success Response (200):**
```json
{
  "message": "اطلاعات کاربر با موفقیت به‌روزرسانی شد.",
  "data": {...}
}
```

### DELETE /:userId
**Description:** Delete a user.  
**Endpoint:** `DELETE http://localhost:3000/api/v1/users/:userId`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "کاربر با موفقیت حذف شد."
}
```

### PUT /:userId/permissions
**Description:** Add permissions to a user (admin only).  
**Endpoint:** `PUT http://localhost:3000/api/v1/users/:userId/permissions`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "permissions": ["user:create", "user:edit"]
}
```

### DELETE /:userId/permissions
**Description:** Remove permissions from a user (admin only).  
**Endpoint:** `DELETE http://localhost:3000/api/v1/users/:userId/permissions`  
**Headers:** `Authorization: Bearer <token>`

### PATCH /me
**Description:** Update current user's own profile.  
**Endpoint:** `PATCH http://localhost:3000/api/v1/users/me`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:** Profile fields to update  

### PATCH /change-password
**Description:** Change current user's password.  
**Endpoint:** `PATCH http://localhost:3000/api/v1/users/change-password`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

### POST /upload-profile-image
**Description:** Upload profile image.  
**Endpoint:** `POST http://localhost:3000/api/v1/users/upload-profile-image`  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** `multipart/form-data` with `file` field  

### DELETE /profile-image
**Description:** Delete profile image.  
**Endpoint:** `DELETE http://localhost:3000/api/v1/users/profile-image`  
**Headers:** `Authorization: Bearer <token>`  

---

## Course Module (`/api/v1/courses`)

### POST /:courseCode
**Description:** Create a new course (admin only).  
**Endpoint:** `POST http://localhost:3000/api/v1/courses/:courseCode`  

**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Course title |
| description | string | No | Course description |
| instructorId | string | Yes | Instructor's user ID |
| status | string | No | draft, published, or archived |
| startsAt | date | No | Course start date |
| endsAt | date | No | Course end date |

**Success Response (201):**
```json
{
  "message": "درس با موفقیت ایجاد شد.",
  "data": {...}
}
```

### GET /:courseCode
**Description:** Get a single course by courseCode.  
**Endpoint:** `GET http://localhost:3000/api/v1/courses/:courseCode`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "اطلاعات درس با موفقیت دریافت شد.",
  "data": {...}
}
```

### GET /
**Description:** List courses with pagination.  
**Endpoint:** `GET http://localhost:3000/api/v1/courses`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** page, limit, status, sortMethod  

**Success Response (200):** Paginated courses.

### PUT /:courseCode
**Description:** Update course information.  
**Endpoint:** `PUT http://localhost:3000/api/v1/courses/:courseCode`  
**Headers:** `Authorization: Bearer <token>`  

### DELETE /:courseCode
**Description:** Delete a course.  
**Endpoint:** `DELETE http://localhost:3000/api/v1/courses/:courseCode`  
**Headers:** `Authorization: Bearer <token>`  

### PATCH /:courseCode/status
**Description:** Update course status (draft/published/archived).  
**Endpoint:** `PATCH http://localhost:3000/api/v1/courses/:courseCode/status`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "status": "published"
}
```

### GET /:courseCode/sessions
**Description:** Get sessions for a course.  
**Endpoint:** `GET http://localhost:3000/api/v1/courses/:courseCode/sessions`  
**Headers:** `Authorization: Bearer <token>`  

---

## Session Module (`/api/v1/sessions`)

### POST /:courseCode
**Description:** Create a new session for a course.  
**Endpoint:** `POST http://localhost:3000/api/v1/sessions/:courseCode`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sessionNumber | number | Yes | Session number (1+) |
| title | string | Yes | Session title |
| description | string | No | Session description |
| startAt | date | Yes | Start datetime |
| endAt | date | Yes | End datetime |
| location | string | No | Physical/virtual location |
| meetingLink | string | No | Online meeting URL |

**Success Response (201):**
```json
{
  "message": "جلسه با موفقیت ایجاد شد.",
  "data": {...}
}
```

### GET /:sessionId
**Description:** Get a single session.  

**Endpoint:** `GET http://localhost:3000/api/v1/sessions/:sessionId`  
**Headers:** `Authorization: Bearer <token>`  

### PUT /:sessionId
**Description:** Update session.  

**Endpoint:** `PUT http://localhost:3000/api/v1/sessions/:sessionId`  

### DELETE /:sessionId
**Description:** Delete session (cannot delete live sessions).  

**Endpoint:** `DELETE http://localhost:3000/api/v1/sessions/:sessionId`  

### PATCH /:sessionId/status
**Description:** Update session status with valid transitions.  
**Endpoint:** `PATCH http://localhost:3000/api/v1/sessions/:sessionId/status`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "status": "live",
  "cancelReason": "..."
}
```

---

## Session Material Module (`/api/v1/sessions/:sessionId/materials`)

### POST /
**Description:** Upload a material file for a session (teacher/admin only).  
**Endpoint:** `POST http://localhost:3000/api/v1/sessions/:sessionId/materials`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body (multipart/form-data):**
- `file` (required) – The file to upload  
- `title` (optional)  
- `description` (optional)  
- `expiresAt` (optional)  

**Success Response (201):**
```json
{
  "message": "فایل با موفقیت بارگذاری شد.",
  "data": {...}
}
```

### GET /
**Description:** List materials for a session (paginated).  

**Endpoint:** `GET http://localhost:3000/api/v1/sessions/:sessionId/materials`  
**Headers:** `Authorization: Bearer <token>`  

**Query:** page, limit, sortMethod  

### GET /:materialId
**Description:** View material (increments view count).  

**Endpoint:** `GET http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId`  
**Headers:** `Authorization: Bearer <token>`  

### GET /:materialId/meta
**Description:** Get material metadata without incrementing view count.  

**Endpoint:** `GET http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId/meta`  
**Headers:** `Authorization: Bearer <token>`  

### PUT /:materialId
**Description:** Update material metadata (teacher/admin only).  

**Endpoint:** `PUT http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:** `{ "title", "description", "expiresAt" }`  

### DELETE /:materialId
**Description:** Delete material and remove file from disk (teacher/admin only).  

**Endpoint:** `DELETE http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId`  
**Headers:** `Authorization: Bearer <token>`  

### POST /:materialId/download
**Description:** Download material (increments download count).  

**Endpoint:** `POST http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId/download`  
**Headers:** `Authorization: Bearer <token>`  

### POST /:materialId/version
**Description:** Upload a new version of existing material (teacher/admin only).  

**Endpoint:** `POST http://localhost:3000/api/v1/sessions/:sessionId/materials/:materialId/version`  
**Headers:** `Authorization: Bearer <token>`  

---

## Course Enrollment Module (`/api/v1/courseEnrollment`)

### POST /enroll
**Description:** Enroll a user in a course. Students can only enroll themselves; admins/teachers can enroll any user.  
**Endpoint:** `POST http://localhost:3000/api/v1/courseEnrollment/enroll`  

**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "courseId": "ObjectId",
  "userId": "ObjectId (optional – defaults to requester)"
}
```

**Success Response (201):**
```json
{
  "message": "ثبت نام در دوره با موفقیت انجام شد.",
  "data": {...}
}
```

### GET /user/:userId
**Description:** Get enrollments for a specific user.  
**Endpoint:** `GET http://localhost:3000/api/v1/courseEnrollment/user/:userId`  
**Headers:** `Authorization: Bearer <token>`  
**Query:** pagination  

**Success Response (200):**
```json
{
  "message": "لیست ثبت نام‌ها با موفقیت دریافت شد.",
  "data": {
    "docs": [...],
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

### GET /course/:courseId
**Description:** Get enrollments for a course (admin/teacher only).  
**Endpoint:** `GET http://localhost:3000/api/v1/courseEnrollment/course/:courseId`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):** Paginated enrollments.

### GET /:id
**Description:** Get single enrollment by ID.  

**Endpoint:** `GET http://localhost:3000/api/v1/courseEnrollment/:id`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "ثبت نام با موفقیت دریافت شد.",
  "data": {...}
}
```

### PUT /:id
**Description:** Update enrollment status.  

**Endpoint:** `PUT http://localhost:3000/api/v1/courseEnrollment/:id`  
**Headers:** `Authorization: Bearer <token>`  

**Request Body:**
```json
{
  "status": "active|completed|dropped|pending"
}
```

**Success Response (200):**
```json
{
  "message": "وضعیت ثبت نام با موفقیت به‌روزرسانی شد.",
  "data": {...}
}
```

### DELETE /:id
**Description:** Drop enrollment (sets status to 'dropped').  

**Endpoint:** `DELETE http://localhost:3000/api/v1/courseEnrollment/:id`  

**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "وضعیت ثبت نام با موفقیت به‌روزرسانی شد."
}
```

### GET /check?courseId=&userId=
**Description:** Check if user is enrolled in a course.  

**Endpoint:** `GET http://localhost:3000/api/v1/courseEnrollment/check?courseId=...&userId=...`  
**Headers:** `Authorization: Bearer <token>`  

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | string | Yes | MongoDB ObjectId |
| userId | string | Yes | MongoDB ObjectId |

**Success Response (200):**
```json
{
  "message": "کاربر در دوره ثبت نام دارد."
}
```

### GET /course/:courseId/statistics
**Description:** Get enrollment statistics for a course (admin/teacher only).  

**Endpoint:** `GET http://localhost:3000/api/v1/courseEnrollment/course/:courseId/statistics`  
**Headers:** `Authorization: Bearer <token>`  

**Success Response (200):**
```json
{
  "message": "آمار ثبت نام دوره با موفقیت دریافت شد.",
  "data": {
    "active": 30,
    "completed": 10,
    "dropped": 5,
    "pending": 2
  }
}
```

---

## Error Responses
Common error responses follow this structure:
```json
{
  "message": "<localized message>",
  "errors": ["..."]
}
```

HTTP Status Codes:
- **200** – Success (GET/PUT/PATCH/DELETE)  
- **201** – Resource created  
- **400** – Bad Request (validation or business rule violation)  
- **401** – Unauthorized  
- **403** – Forbidden (insufficient permissions)  
- **404** – Not Found  
- **409** – Conflict (duplicate enrollment)  

---  

*All endpoints use JSON for request and response bodies unless otherwise specified.*  

---  

*End of documentation.*  