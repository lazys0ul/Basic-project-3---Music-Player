# 📡 Resona Music Player - API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user"
  },
  "token": "string"
}
```

### Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

## 🎵 Music Endpoints

### Get All Music
**GET** `/api/music`

**Query Parameters:**
- `search` (optional): Search by title or artist
- `artist` (optional): Filter by artist name
- `limit` (optional): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Music retrieved successfully",
  "music": [
    {
      "_id": "string",
      "title": "string",
      "artist": "string",
      "filepath": "string",
      "imageFilepath": "string",
      "uploadedBy": {
        "_id": "string",
        "username": "string"
      },
      "fileSize": "number",
      "duration": "number",
      "playCount": "number",
      "createdAt": "date"
    }
  ]
}
```

### Upload Music
**POST** `/api/music/add-music`

**Headers:** `Content-Type: multipart/form-data`

**Form Data:**
- `title`: string (required)
- `artist`: string (required) 
- `music`: file (required - MP3, WAV, FLAC)
- `image`: file (required - JPG, PNG, WebP)

**Response:**
```json
{
  "success": true,
  "message": "Music uploaded successfully",
  "music": {
    "id": "string",
    "title": "string",
    "artist": "string",
    "uploadedBy": "string",
    "createdAt": "date"
  }
}
```

### Delete Music
**DELETE** `/api/music/delete-music/:id`

**Response:**
```json
{
  "success": true,
  "message": "Music deleted successfully",
  "music": {
    "_id": "string",
    "title": "string",
    "artist": "string"
  }
}
```

## 🎧 Audio Streaming

### Stream Audio File
**GET** `/stream/:filename`

**Headers:** Supports Range requests for audio streaming

**Response:** Audio file stream with appropriate headers

### Static File Access
**GET** `/uploads/:filename`

**Response:** Static file (images, audio)

## 📊 System Endpoints

### Health Check
**GET** `/`

**Response:**
```json
{
  "message": "Music Player API Server",
  "status": "running",
  "version": "1.0.0"
}
```

### Detailed Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-09T...",
  "uptime": "number",
  "memory": {
    "rss": "number",
    "heapTotal": "number",
    "heapUsed": "number",
    "external": "number"
  },
  "environment": "development"
}
```

## 🚨 Error Responses

All endpoints may return these error formats:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🔧 Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 1000 per window per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🛡️ Security Features
- Helmet.js security headers
- CORS protection
- Input validation and sanitization
- JWT token authentication
- File type validation
- Request size limits
- Rate limiting

## 📝 Example Usage

### JavaScript/Axios Example
```javascript
// Register new user
const registerUser = async () => {
  try {
    const response = await axios.post('/api/auth/register', {
      username: 'musiclover',
      email: 'user@example.com',
      password: 'securepassword'
    });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  } catch (error) {
    console.error(error.response.data.message);
  }
};

// Upload music
const uploadMusic = async (title, artist, musicFile, imageFile) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('artist', artist);
  formData.append('music', musicFile);
  formData.append('image', imageFile);

  try {
    const response = await axios.post('/api/music/add-music', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response.data.message);
  }
};
```

### cURL Examples
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "user@example.com", 
    "password": "secure_password"
  }'

# Get music list
curl -X GET http://localhost:5000/api/music \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload music
curl -X POST http://localhost:5000/api/music/add-music \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Song" \
  -F "artist=Artist Name" \
  -F "music=@/path/to/song.mp3" \
  -F "image=@/path/to/cover.jpg"
```
