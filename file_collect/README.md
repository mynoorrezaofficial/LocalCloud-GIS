# File Management System

A professional, locally-hosted file management system with a clean SaaS aesthetic built with Flask (Python backend) and Tailwind CSS frontend.

## Features

✅ **Dual-Mode Upload**
- Support for multiple files and entire directory structures
- "All Files/Folders" mode - upload any file type
- "Filtered Mode" - restrict to .jpg, .png, .img, .jpeg, .json, .shp, .shx, .dbf
- Drag-and-drop support

✅ **Segmented Storage**
- Every upload requires a 2-digit ID (10-99)
- Files organized in `/uploads/{ID}/` directories
- Preserves directory structure from uploads

✅ **Secure Access Control**
- Access files by entering 2-digit segment ID
- Browse and download files from specific segments
- Path sanitization prevents directory traversal attacks
- 500MB file size limit

✅ **Modern UI/UX**
- Professional SaaS aesthetic with white background and blue accents
- Real-time success/error notifications
- Segments overview dashboard
- Responsive design for desktop and mobile
- Clean typography and soft gray borders

## Project Structure

```
file_collect/
├── backend/
│   ├── app.py                 # Flask application with all API endpoints
│   └── requirements.txt        # Python dependencies
├── frontend/
│   └── index.html             # Single-page application with Tailwind CSS
├── uploads/                   # File storage directory (auto-created)
└── README.md
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Dependencies:**
- Flask 2.3.3
- Flask-CORS 4.0.0
- Werkzeug 2.3.7

### 2. Start the Backend Server

```bash
cd backend
python app.py
```

The server will start at `http://localhost:5000`

### 3. Open the Frontend

Open your browser and navigate to:
```
file_collect/frontend/index.html
```

Or use a simple HTTP server:
```bash
cd frontend
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## API Endpoints

### Upload Files
**POST** `/api/upload`
- Parameters: `segment_id`, `upload_mode` (all/filtered), `files`
- Response: Success/error status with uploaded files list

### Access Segment
**GET** `/api/access-segment/<segment_id>`
- Returns hierarchical file structure for a segment
- Validates 2-digit segment ID

### Download File
**GET** `/api/download/<segment_id>/<file_path>`
- Downloads a file from specific segment
- Includes path sanitization

### Delete File
**DELETE** `/api/delete/<segment_id>/<file_path>`
- Deletes a file from specific segment
- Includes path sanitization

### List Segments
**GET** `/api/segments`
- Returns all available segments with file counts

### Health Check
**GET** `/api/health`
- Returns system status

## Security Features

🔒 **Path Sanitization**
- All file paths are validated and sanitized
- Directory traversal attacks are prevented
- Users cannot access files outside the uploads directory

🔒 **Segment Isolation**
- 2-digit ID validation (10-99 range)
- Files are strictly organized by segment
- No cross-segment access

🔒 **File Type Filtering**
- Filtered mode restricts file types to whitelisted extensions
- Prevents unauthorized file types in filtered uploads

## Usage Guide

### Uploading Files

1. Enter a 2-digit Segment ID (e.g., 15, 88)
2. Choose upload mode:
   - **All Files/Folders**: Upload any file type
   - **Filtered Mode**: Only .jpg, .png, .img, .jpeg, .json, .shp, .shx, .dbf
3. Select files or check "Upload entire folder" to select a directory
4. Click "Upload Files"
5. Wait for success confirmation

### Accessing Files

1. Enter the Segment ID you want to access
2. Click "Access Segment"
3. View the file browser with all files in that segment
4. Click "Download" to download any file
5. Files are organized by folder structure

### File Organization

Files are stored as:
```
uploads/
├── 15/
│   ├── photo1.jpg
│   ├── subfolder/
│   │   └── photo2.png
│   └── data.json
├── 88/
│   ├── map.shp
│   ├── map.shx
│   └── map.dbf
└── ...
```

## Configuration

Edit `backend/app.py` to customize:

```python
BASE_DIR = Path(__file__).parent.parent  # Project root
UPLOAD_DIR = BASE_DIR / "uploads"       # Upload directory
ALLOWED_EXTENSIONS = {...}              # Allowed file types in filtered mode
MAX_FILE_SIZE = 500 * 1024 * 1024       # Maximum file size: 500MB
```

## Troubleshooting

### "Cannot connect to backend"
- Ensure Flask server is running: `python app.py` from `/backend` folder
- Check if port 5000 is available
- Try accessing `http://localhost:5000/api/health` in browser

### "CORS Error"
- CORS is already enabled in Flask-CORS
- Ensure frontend is being served over HTTP/HTTPS

### "Files not uploading"
- Check file size (max 500MB)
- Verify segment ID is 2-digit (10-99)
- In filtered mode, check file extension is allowed

### "Cannot download files"
- Verify segment ID exists
- Ensure file path contains no special characters
- Check file permissions on host system

## Performance Tips

- File uploads are handled one at a time
- Large directories maintain structure automatically
- Database-free system for fast local operations
- Files are stored on host PC for direct OS access

## License

This project is provided as-is for local use.

## Support

For issues or questions, check:
1. Flask console output for backend errors
2. Browser console (F12) for frontend errors
3. File permissions in `/uploads/` directory
