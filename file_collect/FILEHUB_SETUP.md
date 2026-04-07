# 🗂️ FileHub - Professional File Sharing System

## Overview

**FileHub** is a professional, modern file-sharing system built with a sleek glassmorphism design. It features dual-server architecture with Flask backend and a responsive HTML/CSS/JS frontend with real-time progress tracking.

## ✨ Key Features

### 1. **Backend Architecture**
- **Segmented Storage**: Files are organized into 2-digit ID segments (10-99)
- **IP Detection**: Automatically detects and displays the local IP address on startup
- **CORS Support**: Enables cross-origin communication between frontend (Port 8000) and backend (Port 5000)
- **Security Features**: Path sanitization, file validation, and size limits
- **API Endpoints**:
  - `POST /api/upload` - Upload files to a segment
  - `GET /api/segments` - List all available segments
  - `GET /api/access-segment/<id>` - Access files in a segment
  - `GET /api/download/<id>/<path>` - Download files
  - `DELETE /api/delete/<id>/<path>` - Delete files
  - `GET /api/health` - Health check

### 2. **Frontend Design**
- **Glassmorphism UI**: Dark blue gradient background with semi-transparent frosted glass cards
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Progress**: XHR-based upload progress bar with percentage display
- **Live Segments**: Auto-updating list of segment IDs with file counts
- **Toast Notifications**: Sleek popup notifications for success/error messages

### 3. **Animations**
- **Fade-In**: Page sections fade in smoothly on load
- **Pulse Effect**: Upload icon pulses to draw attention
- **Slide-Up**: Modal dialogs slide up from bottom
- **Hover Effects**: Smooth transitions on interactive elements

### 4. **User Experience**
- **Drag & Drop**: Drop files directly onto the upload zone
- **Segment Chips**: Click segments to quickly access files
- **Server Status**: Real-time backend status indicator
- **Settings Modal**: Customize server connection settings
- **Auto-Detection**: Automatically detects server IP from current connection

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- Flask and Flask-CORS installed
- Windows OS (for start.bat) or manual terminal startup

### Installation

1. **Install Python Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the System**:
   ```bash
   start.bat
   ```
   
   The batch file will:
   - Detect your local IP address
   - Install missing dependencies
   - Start Flask backend (Port 5000)
   - Start HTTP server for frontend (Port 8000)
   - Automatically open FileHub in your browser

### Manual Startup (if start.bat doesn't work)

**Terminal 1 - Backend**:
```powershell
cd backend
python app.py
```
The backend will display:
```
╔════════════════════════════════════════════════════╗
║         🗂️  FileHub - Professional File Sharing ║
║                                                  ║
║  📍 Local IP Address:  192.168.x.x              ║
║  🌐 Backend API:       http://192.168.x.x:5000 ║
║  💻 Frontend UI:       http://192.168.x.x:8000 ║
╚════════════════════════════════════════════════════╝
```

**Terminal 2 - Frontend**:
```powershell
cd frontend
python -m http.server 8000
```

Then open your browser to:
- **Local**: `http://localhost:8000`
- **Network**: `http://192.168.x.x:8000` (replace with your IP)

## 📖 Usage Guide

### Uploading Files

1. **Enter Segment ID**: Input a 2-digit number (10-99)
2. **Select Files**: Drag & drop or click to browse
3. **Upload**: Click "Upload Files"
4. **Progress**: Watch the real-time progress bar
5. **Confirmation**: Toast notification appears on success

### Accessing Files

1. **Navigate**: Click "Access Files" in the UI or click a segment chip
2. **Enter Segment ID**: Input the 2-digit segment number
3. **View**: Files display with sizes and download buttons
4. **Download**: Hover and click download button for any file

### Live Segments

The right sidebar shows all available segments:
- **Segment ID**: Two-digit identifier
- **File Count**: Number of files in segment
- **Quick Access**: Click to access segment immediately

## 🎨 Design Details

### Glassmorphism Effects
- **Background**: Linear gradient (dark blue to navy)
- **Cards**: Semi-transparent white (8%) + blur filter
- **Borders**: Soft white borders (20% opacity)
- **Shadow**: Multi-layered box shadow for depth

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Background**: Dark gradient (#1E3A8A → #082F49)
- **Text**: White & Blue tones

### Animations
```css
/* Fade-In on Page Load */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Pulse Effect on Icon */
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
}

/* Slide-Up Modal */
@keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## 🔐 Security Features

### File Handling
- **Path Sanitization**: Prevents directory traversal attacks
- **File Validation**: Checks extensions and file types
- **Size Limits**: 500MB max per file
- **Segment Validation**: Only accepts IDs 10-99

### API Security
- **CORS Enabled**: Prevents unauthorized cross-origin requests
- **Input Validation**: All inputs validated server-side
- **Error Handling**: Generic error messages prevent information leakage

## 🛠️ Customization

### Change Default Port
**Backend** (app.py line 185):
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000
```

**Frontend** (start.bat line 87):
```batch
python -m http.server 8000  # Change 8000
```

### Modify Allowed Extensions
**Backend** (app.py line 17):
```python
ALLOWED_EXTENSIONS = {'.jpg', '.png', '.img', '.jpeg', '.json', '.shp', '.shx', '.dbf'}
```

### Change Max File Size
**Backend** (app.py line 18):
```python
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB
```

## 📊 API Examples

### Upload Files
```bash
curl -X POST \
  -F "segment_id=42" \
  -F "upload_mode=all" \
  -F "files=@file1.jpg" \
  -F "files=@file2.png" \
  http://localhost:5000/api/upload
```

### List Segments
```bash
curl http://localhost:5000/api/segments
```

Response:
```json
{
    "success": true,
    "segments": [
        {"id": "42", "file_count": 3},
        {"id": "51", "file_count": 5}
    ]
}
```

### Access Segment
```bash
curl http://localhost:5000/api/access-segment/42
```

Response:
```json
{
    "success": true,
    "segment_id": "42",
    "files": [
        {
            "name": "image.jpg",
            "type": "file",
            "size": 2048000,
            "path": "image.jpg"
        }
    ]
}
```

## 🐛 Troubleshooting

### "Address already in use" Error
Ports 5000 or 8000 are occupied:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (get PID from above)
taskkill /PID <PID> /F
```

### Blank Screen on Access
- Check browser console for errors (F12)
- Verify backend is running (check terminal output)
- Try hard refresh (Ctrl+F5)

### Files Won't Upload
- Check file size (max 500MB)
- Verify segment ID is 2 digits (10-99)
- Check disk space in uploads/ folder

### Can't Access from Other PC
- Verify firewall allows ports 5000 and 8000
- Use correct IP from startup message
- Both IP and hostname work: `192.168.x.x:8000` or `hostname:8000`

## 📁 Directory Structure

```
file_collect/
├── backend/
│   ├── app.py           # Flask application with all endpoints
│   └── requirements.txt  # Python dependencies
├── frontend/
│   └── index.html       # Complete HTML with CSS & JS
├── uploads/             # Auto-created storage directory
│   ├── 10/              # Segment folders (10-99)
│   ├── 42/
│   └── ...
├── start.bat            # Windows startup script with IP detection
└── start.ps1            # PowerShell startup (alternative)
```

## 📋 Server Information Display

When you start the backend, you'll see:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🗂️  FileHub - Professional File Sharing System              ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  📍 Local IP Address:  192.168.140.26                         ║
║  🌐 Backend API:       http://192.168.140.26:5000/api        ║
║  💻 Frontend UI:       http://192.168.140.26:8000             ║
║                                                                ║
║  Access from Other PCs:                                       ║
║  📱 http://192.168.140.26:8000                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

## 🎯 Professional Features Summary

| Feature | Implementation |
|---------|-----------------|
| **Glassmorphism Design** | Backdrop blur + semi-transparent cards |
| **Dark Theme** | Navy/blue gradient background |
| **Real-time Progress** | XMLHttpRequest upload tracking |
| **Smooth Animations** | CSS keyframes (fade, pulse, slide) |
| **Toast Notifications** | Auto-dismiss success/error alerts |
| **Live Segments** | Auto-refresh segment list |
| **IP Detection** | Automatic local IP discovery |
| **Responsive Design** | Works on all screen sizes |
| **Drag & Drop** | Full file upload support |
| **Error Handling** | Comprehensive validation |

## 🔄 Backend Status Monitoring

Frontend automatically:
- Checks backend health every 10 seconds
- Updates segment list every 15 seconds
- Shows online/offline status indicator
- Handles connection errors gracefully

## 💡 Tips & Tricks

1. **Quick Segment Access**: Click segment chips in the right sidebar
2. **Large Uploads**: Use the progress bar to monitor transfer
3. **Custom IP**: Settings → Custom Server IP for advanced setups
4. **Multiple Segments**: Organize files by project ID (10-99)
5. **Network Sharing**: Share the IP with team members for remote access

## 📝 Version Info

- **FileHub**: Professional File Sharing System v1.0
- **Backend**: Flask 2.3.3, Python 3.7+
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Architecture**: REST API + Progressive Web UI

---

**Built with ❤️ for professional file sharing**

For questions or issues, check the backend terminal output for detailed error messages.
