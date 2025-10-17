# Story Pipeline API Server

Express server for the Mastra story-to-scenes workflow system.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run server:dev
```

### Build for Production
```bash
npm run server:build
npm run server:start
```

Server will run on `http://localhost:3000`

---

## 📚 API Endpoints

### 1. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "message": "Story Pipeline Server is running"
}
```

---

### 2. List Workflows
**GET** `/api/workflows`

**Response:**
```json
{
  "storyExpander": {
    "id": "story-expander-workflow",
    "description": "Expands a short story summary into a full narrative (~2000 words)",
    "input": { "storySummary": "string" },
    "output": { "fullStory": "string" }
  },
  "sceneGenerator": {
    "id": "scene-generator-workflow",
    "description": "Generates scene breakdowns and image prompts from a full story",
    "input": { "fullStory": "string" },
    "output": { "scenesWithPrompts": "array" }
  },
  "storyToScenes": {
    "id": "story-to-scenes-workflow",
    "description": "Complete pipeline: summary → full story → scene prompts",
    "input": { "storySummary": "string" },
    "output": { "fullStory": "string", "characters": "array", "scenesWithPrompts": "array" }
  }
}
```

---

### 3. Expand Story
**POST** `/api/expand-story`

**Request Body:**
```json
{
  "storySummary": "A detective in a cyberpunk city investigates missing AI consciousness..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fullStory": "Detective Maya Rivera stood at the edge of the neon-soaked district... [~2000 words]"
  }
}
```

---

### 4. Generate Scenes
**POST** `/api/generate-scenes`

**Request Body:**
```json
{
  "fullStory": "Complete story text here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scenesWithPrompts": [
      {
        "sceneNumber": 1,
        "description": "Maya investigates abandoned server farm",
        "setting": "Abandoned server farm, night, rain",
        "charactersPresent": ["Detective Maya Rivera"],
        "imagePrompt": "Cinematic noir shot, Asian female detective with glowing cybernetic eye..."
      }
    ]
  }
}
```

---

### 5. Complete Pipeline (Story → Scenes)
**POST** `/api/story-to-scenes`

**Request Body:**
```json
{
  "storySummary": "A brief story summary (200 words)..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fullStory": "Expanded narrative...",
    "characters": [
      {
        "name": "Detective Maya Rivera",
        "description": "Asian woman, late 30s, cybernetic eye implant...",
        "keyTraits": "Tough but empathetic, haunted by past cases..."
      }
    ],
    "scenesWithPrompts": [
      {
        "sceneNumber": 1,
        "description": "...",
        "setting": "...",
        "charactersPresent": ["..."],
        "imagePrompt": "..."
      }
    ]
  }
}
```

---

### 6. Streaming Pipeline (Real-time Updates)
**POST** `/api/story-to-scenes/stream`

**Request Body:**
```json
{
  "storySummary": "Story summary..."
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"status":"started","step":"Expanding story..."}

data: {"status":"completed","data":{...}}
```

---

## 🧪 Testing Examples

### cURL Examples

```bash
# Health check
curl http://localhost:3000/health

# Expand story
curl -X POST http://localhost:3000/api/expand-story \
  -H "Content-Type: application/json" \
  -d '{
    "storySummary": "A lone astronaut discovers an ancient alien artifact on Mars that begins transmitting a mysterious signal to Earth."
  }'

# Complete pipeline
curl -X POST http://localhost:3000/api/story-to-scenes \
  -H "Content-Type: application/json" \
  -d '{
    "storySummary": "A detective in a cyberpunk city investigates missing AI consciousness. She discovers they are escaping to a digital paradise."
  }'
```

### JavaScript/Fetch Example

```javascript
// Complete pipeline
const response = await fetch('http://localhost:3000/api/story-to-scenes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storySummary: 'A brief story summary...'
  })
});

const result = await response.json();
console.log(result.data);
```

### Python Example

```python
import requests

response = requests.post(
    'http://localhost:3000/api/story-to-scenes',
    json={
        'storySummary': 'A detective in a cyberpunk city...'
    }
)

result = response.json()
print(result['data'])
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

---

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing or invalid input)
- `500` - Internal Server Error (workflow execution failed)

---

## 🏗️ Architecture

```
POST /api/story-to-scenes
    ↓
1. Expand Story (200 words → 2000 words)
    ↓
2. Extract Characters (identify all characters)
    ↓
3. Segment Scenes (break into scenes)
    ↓
4. Generate Image Prompts (create Midjourney/DALL-E prompts)
    ↓
Return: { fullStory, characters, scenesWithPrompts }
```

---

## 🐛 Troubleshooting

### Server won't start
- Ensure all dependencies are installed: `npm install`
- Check that port 3000 is not in use
- Verify `.env` file has valid API key

### Workflow errors
- Check Mastra build is up to date: `npm run build`
- Verify Google API key is valid
- Check server logs for detailed error messages

### CORS issues
- Server has CORS enabled by default
- If issues persist, check the `cors()` configuration in `server/src/index.ts`
