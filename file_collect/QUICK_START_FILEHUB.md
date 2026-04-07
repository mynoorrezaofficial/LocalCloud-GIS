# 🚀 FileHub - Quick Start (2 Minutes)

## 🎯 Super Quick Start

### Windows - One Command
```bash
start.bat
```
That's it! The system will:
1. ✓ Detect your local IP automatically
2. ✓ Start Flask backend (Port 5000)
3. ✓ Start frontend server (Port 8000)
4. ✓ Open FileHub in your browser

---

## 📍 Access URLs

After startup, you'll see:

**Your PC:**
```
http://localhost:8000
```

**Other PCs on Network:**
```
http://192.168.x.x:8000
```
(Replace with your IP from the startup message)

---

## 📤 How to Upload Files

1. Enter a **2-digit ID** (like 42, 51, etc.)
2. **Drag & drop** files or click to browse
3. Click **"Upload Files"**
4. Watch the progress bar
5. ✓ Done! Files are saved to `uploads/<ID>/`

---

## 🔓 How to Access Files

1. Click **"Access Files"** tab
2. Enter the **Segment ID** you used for upload
3. See all files with their sizes
4. Click **"Download"** to get files

---

## 📊 See All Segments

Check the right sidebar which shows:
- **Live Segments**: All available storage locations
- **File Counts**: How many files in each
- **Quick Click**: Access any segment instantly

---

## ⚙️ If start.bat Doesn't Work

**Terminal 1:**
```bash
cd backend
python app.py
```

**Terminal 2:**
```bash
cd frontend
python -m http.server 8000
```

Then open: `http://localhost:8000`

---

## 🎨 What You'll See

- **Dark blue gradient background** - Modern glassmorphism design
- **Semi-transparent cards** - Professional frosted glass effect
- **Real-time upload progress** - Watch files upload with percentage
- **Smooth animations** - Fade-in, pulse, and slide effects
- **Toast notifications** - Success/error messages pop up
- **Live segment list** - Auto-updates as you upload

---

## 💡 Pro Tips

✨ **Click segment chips** on the right to quickly access files
📊 **Upload progress bar** shows real-time percentage
🎯 **Segment IDs**: Use 10-99 for organization
📁 **Folders**: Preserve directory structure during upload
🔄 **Auto-refresh**: Segment list updates every 15 seconds

---

## ⚠️ Common Issues

| Problem | Fix |
|---------|-----|
| "Address in use" | Close port 5000/8000: `taskkill /PID <PID> /F` |
| Blank page | Hard refresh: Ctrl+F5 |
| Upload fails | Check ID is 2 digits, file < 500MB |
| Can't access from other PC | Check firewall, verify IP address |

---

## 📚 Full Documentation

For detailed guides, see:
- `FILEHUB_SETUP.md` - Complete setup guide
- `BUILD_SUMMARY.md` - What was built
- Backend terminal output - Real-time logs

---

## 🎉 That's It!

You're now running a professional file-sharing system with:
- ✓ Modern glassmorphism UI
- ✓ Real-time progress tracking
- ✓ Beautiful animations
- ✓ Professional design
- ✓ Fully functional storage

**Enjoy FileHub!** 🗂️✨
