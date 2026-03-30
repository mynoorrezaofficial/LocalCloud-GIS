# File Management System - Quick Start Guide

## ✅ System Successfully Created!

Your professional File Management System is ready to use. Here's everything you need to know.

---

## 📁 Project Structure

```
file_collect/
├── backend/
│   ├── app.py                 # Flask backend with all APIs
│   └── requirements.txt        # Python dependencies
├── frontend/
│   └── index.html             # Single-page web interface
├── uploads/                   # Storage directory for files
├── start.bat                  # Windows batch startup script
├── start.ps1                  # PowerShell startup script
└── README.md                  # Detailed documentation
```

---

## 🚀 Getting Started (3 Simple Steps)

### **Option 1: Quick Start with Batch File (Recommended for Windows)**

1. **Double-click** `start.bat` in the file_collect folder
2. The system will automatically:
   - Check Python installation
   - Install dependencies if needed
   - Start the backend server
   - Open the frontend in your browser

### **Option 2: Manual Startup**

**Terminal 1 - Start Backend:**
```bash
cd file_collect\backend
python app.py
```

**Terminal 2 - Open Frontend:**
- For local file access: Open `file_collect/frontend/index.html` in your browser
- For web server: 
  ```bash
  cd file_collect\frontend
  python -m http.server 8000
  # Then visit: http://localhost:8000
  ```

---

## 💻 System Requirements

- **Python 3.7+** (3.11+ recommended)
- **Windows, Mac, or Linux**
- **Modern Web Browser** (Chrome, Firefox, Edge, Safari)
- **Minimum 100MB free disk space** (more for file uploads)

---

## 🎯 Key Features

### ✨ **Dual-Mode Upload**
- **All Files/Folders Mode**: Upload any file type
- **Filtered Mode**: Restrict to .jpg, .png, .img, .jpeg, .json, .shp, .shx, .dbf

### 📦 **Segmented Storage**
- Every upload uses a 2-digit ID (10-99)
- Files organized in separate folders: `uploads/15/`, `uploads/88/`, etc.
- Directory structure preserved from uploads

### 🔒 **Secure Access**
- Enter segment ID to access files
- Path sanitization prevents unauthorized access
- Download individual files directly
- Delete files when no longer needed

### 🎨 **Professional UI**
- Modern SaaS aesthetic with white background
- Blue primary buttons and soft gray borders
- Real-time success/error messages
- Responsive design (works on desktop and mobile)
- Segments overview dashboard

---

## 📖 Usage Guide

### **Uploading Files**

1. **Set Segment ID**: Enter a 2-digit number (e.g., 15, 42, 88)
2. **Choose Upload Mode**:
   - Select "All Files/Folders" for any file types
   - Select "Filtered Mode" to restrict to specific types
3. **Add Files**:
   - Click the upload area and select files
   - OR drag & drop files into the area
   - OR check "Upload entire folder" to select a directory
4. **Upload**: Click "Upload Files" button
5. **Confirmation**: See green success message when complete

### **Accessing Files**

1. **Enter Segment ID**: Type the 2-digit ID you want to access
2. **Click "Access Segment"**: View all files in that segment
3. **Browse Files**: See folder structure and file information
4. **Download**: Click "Download" on any file to save it to your computer
5. **Delete**: Use browser console or API to delete files if needed

### **File Storage**

Files are stored in:
```
uploads/
├── 15/
│   ├── photo1.jpg
│   ├── folder/
│   │   └── photo2.png
│   └── data.json
├── 88/
│   ├── map.shp
│   ├── map.shx
│   └── map.dbf
└── [other segment IDs]
```

---

## 🔌 API Endpoints

All endpoints return JSON responses.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check system status |
| POST | `/api/upload` | Upload files to segment |
| GET | `/api/access-segment/<id>` | List files in segment |
| GET | `/api/download/<id>/<path>` | Download file |
| DELETE | `/api/delete/<id>/<path>` | Delete file |
| GET | `/api/segments` | List all segments |

**Example curl requests:**
```bash
# Check health
curl http://localhost:5000/api/health

# List segments
curl http://localhost:5000/api/segments

# Access segment 15
curl http://localhost:5000/api/access-segment/15

# Download file
curl -O http://localhost:5000/api/download/15/photo.jpg
```

---

## 🛡️ Security Features

✅ **Path Sanitization** - Prevents directory traversal attacks
✅ **Segment Isolation** - Files only accessible via correct segment ID
✅ **File Type Filtering** - Filtered mode whitelist enforcement
✅ **Size Limits** - 500MB maximum file size
✅ **2-Digit ID Validation** - Only accepts 10-99 range

---

## ⚙️ Configuration

To customize the system, edit `backend/app.py`:

```python
# File size limit (default: 500MB)
MAX_FILE_SIZE = 500 * 1024 * 1024

# Allowed file types in filtered mode
ALLOWED_EXTENSIONS = {'.jpg', '.png', '.img', '.jpeg', '.json', '.shp', '.shx', '.dbf'}

# Upload directory location
UPLOAD_DIR = BASE_DIR / "uploads"

# Server port
app.run(host='localhost', port=5000)
```

---

## 🐛 Troubleshooting

### **"Cannot connect to backend"**
- Make sure backend is running (check terminal window)
- Verify Flask is running on http://localhost:5000/api/health
- Check if port 5000 is available (close other apps using it)
- Restart the backend server

### **"ModuleNotFoundError" when starting**
- Install dependencies: `pip install -r backend/requirements.txt`
- Or run the startup script which handles this automatically

### **"CORS Error" in browser console**
- CORS is enabled by default - shouldn't happen
- Try restarting the backend server
- Check backend console for errors

### **"Files not uploading"**
- Verify segment ID is 2-digit (10-99)
- Check file size (max 500MB)
- In filtered mode, verify file extension is allowed
- Check available disk space in `uploads/` folder

### **"Cannot download files"**
- Verify segment ID exists (check Available Segments)
- Try accessing the segment first before downloading
- Check file wasn't deleted between access and download

### **File upload stuck**
- Check internet connection (if applicable)
- Try uploading fewer files at once
- Check browser console (F12) for errors
- Restart browser and try again

---

## 📊 System Information

- **Backend**: Flask 2.3.3 with Flask-CORS
- **Frontend**: HTML5 + Tailwind CSS 3
- **Storage**: Local file system (no database)
- **API**: RESTful JSON
- **Development Server**: Werkzeug (included with Flask)

---

## 🎓 Example Workflow

1. **First Time Setup**
   - Run `start.bat` double-click
   - System starts automatically
   - Frontend opens in browser

2. **Upload Geospatial Data - Segment 01**
   - Segment ID: `01`
   - Upload Mode: `Filtered Mode`
   - Select: `map.shp`, `map.shx`, `map.dbf` files
   - Click Upload → See green success message

3. **Upload Photos - Segment 15**
   - Segment ID: `15`
   - Upload Mode: `All Files/Folders`
   - Select: Entire `photos/` folder
   - Click Upload → Files organized in folder structure

4. **Access Segment 15**
   - Enter ID: `15`
   - Click "Access Segment"
   - Browse folder structure
   - Download individual photos

5. **Check Overview**
   - See "Available Segments" showing all uploads
   - Quick access buttons for each segment

---

## 💡 Pro Tips

- Use meaningful Segment IDs (01=customers, 02=projects, 15=photos, etc.)
- Upload entire folder structures to preserve organization
- Filtered mode is great for consistent data types
- All files are checked by size before upload
- Browser back/forward buttons work in the UI
- Refresh browser to clear file list cache

---

## 📞 Support

For issues:
1. Check backend terminal for error messages
2. Open browser developer tools (F12) to see frontend errors
3. Review [README.md](README.md) for detailed documentation
4. Check `/uploads/` folder has write permissions

---

## 📝 License

This project is provided as-is for local file management use.

---

**System Ready! 🎉**

Your File Management System is fully set up and tested. Run `start.bat` to begin!
