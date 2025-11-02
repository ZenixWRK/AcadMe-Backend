# Assignment Management API Documentation

## Overview
This API has been transformed from a transaction management system to an assignment management system for students to track their class assignments.

## Database Schema

### Assignments Table
```sql
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dueDate DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Base URL: `/api/assignments`

### 1. Create Assignment
- **POST** `/`
- **Body:**
```json
{
    "userId": "string",
    "title": "string",
    "description": "string",
    "dueDate": "YYYY-MM-DD",
    "subject": "string",
    "priority": "low|medium|high" // optional, defaults to "medium"
}
```
- **Response:** Created assignment object

### 2. Get All Assignments for User
- **GET** `/:userId`
- **Response:** Array of assignments ordered by creation date (newest first)

### 3. Get Assignments by Subject
- **GET** `/:userId/subject/:subject`
- **Response:** Array of assignments for specific subject ordered by due date

### 4. Update Assignment
- **PUT** `/:id`
- **Body:**
```json
{
    "title": "string",
    "description": "string",
    "dueDate": "YYYY-MM-DD",
    "subject": "string",
    "priority": "low|medium|high",
    "completed": boolean
}
```
- **Response:** Updated assignment object

### 5. Toggle Assignment Completion
- **PATCH** `/:id/toggle`
- **Response:** Assignment object with toggled completion status

### 6. Delete Assignment
- **DELETE** `/:id`
- **Response:** Success message

## File Structure Changes

### Renamed Files:
- `transactionsController.js` → `assignmentsController.js`
- `transactionsRoute.js` → `assignmentsRoute.js`

### Functions Renamed:
- `getTransactionsByUserId` → `getAssignmentsByUserId`
- `createTransaction` → `createAssignment`
- `deleteTransaction` → `deleteAssignment`

### New Functions Added:
- `updateAssignment` - Update assignment details
- `toggleAssignmentCompletion` - Toggle completion status
- `getAssignmentsBySubject` - Filter assignments by subject

## Example Usage

### Creating an Assignment:
```javascript
POST /api/assignments
{
    "userId": "user_123",
    "title": "Math Homework Chapter 5",
    "description": "Complete exercises 1-20 on page 45",
    "dueDate": "2025-11-10",
    "subject": "Mathematics",
    "priority": "high"
}
```

### Getting User's Assignments:
```javascript
GET /api/assignments/user_123
```

### Marking Assignment as Complete:
```javascript
PATCH /api/assignments/5/toggle
```

## Priority Levels
- **low**: Not urgent, can be done later
- **medium**: Standard priority (default)
- **high**: Urgent, needs immediate attention

## Error Responses
All endpoints return appropriate HTTP status codes:
- `400`: Bad Request (missing required fields)
- `404`: Not Found (assignment doesn't exist)
- `500`: Internal Server Error

## Rate Limiting
The API includes rate limiting middleware to prevent abuse.