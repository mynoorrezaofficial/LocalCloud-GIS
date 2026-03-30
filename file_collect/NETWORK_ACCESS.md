# Network Access Setup Guide

## Your PC Information
- **IP Address**: `192.168.140.26`
- **Port**: `5000`
- **Network Access URL**: `http://192.168.140.26:5000`

---

## 🚀 How to Start

### 1. Start Backend on Your PC
```bash
cd file_collect\backend
python app.py
```

The backend will now listen on `0.0.0.0:5000` - accessible from any computer on your network.

### 2. Other Users Access the System

Other users on the same network can visit:
```
http://192.168.140.26
```

Or with port specified:
```
http://192.168.140.26:5000
```

---

## 📍 Ways to Access

### **On Your PC (Local)**
- Backend: `http://localhost:5000`
- Frontend: `file:///c:/Users/USER/Desktop/Qgis-tools-main/file_collect/frontend/index.html`

### **From Other Computers (Network)**
- Backend: `http://192.168.140.26:5000`
- Frontend URL for others: Share the `frontend/index.html` file OR set up a web server

---

## 🌐 Option 1: Share Frontend as File (Easiest)
Other users can open the `index.html` file directly from a shared folder or by downloading it from your shared network drive.

**Share Steps:**
1. Right-click `file_collect\frontend\` folder
2. Select "Share with" → "Specific people" (Windows)
3. Share on your network with read permissions
4. Other users right-click → "Map network drive" or access via `\\192.168.140.26\Qgis-tools-main\...`

---

## 🌐 Option 2: Run Frontend Web Server
Make the frontend accessible at `http://192.168.140.26:8000`

**Setup (Terminal 2):**
```bash
cd file_collect\frontend
python -m http.server 8000
```

Now other users can visit: **`http://192.168.140.26:8000`**

The system will automatically connect to the backend on `192.168.140.26:5000`

---

## 🌐 Option 3: Configure Frontend URL Manually

Edit the `frontend/index.html` file and change:
```javascript
const SERVER_IP = localStorage.getItem('serverIP') || 'localhost';
```

To:
```javascript
const SERVER_IP = '192.168.140.26';  // Your PC's IP address
```

---

## 🔧 Troubleshooting

### "Cannot connect to backend from other PC"
1. ✅ Backend is running? Check terminal 1
2. ✅ IP address correct? Run `ipconfig | findstr /i "ipv4"`
3. ✅ Firewall blocking? Add exception for port 5000:
   ```bash
   netsh advfirewall firewall add rule name="Flask 5000" dir=in action=allow protocol=tcp localport=5000
   ```
4. ✅ Same WiFi network? Both PCs must be on same network

### Test Connection
From another PC, run:
```bash
curl http://192.168.140.26:5000/api/health
```

Should return: `{"status": "ok", "message": "..."}`

---

## 📋 Simplified Instructions for Other Users

Share this with your team:

> **To use FileHub (File Management System):**
> 
> 1. **Option A** - Direct Website:
>    - Open browser
>    - Visit: `http://192.168.140.26:8000`
> 
> 2. **Option B** - Local File:
>    - Get `index.html` from shared network drive
>    - Open in any web browser
> 
> 3. Upload files with 2-digit segment ID (10-99)
> 4. Enter segment ID to download files

---

## 📝 Important Notes

- **IP Address May Change**: If your PC reboots, your IP might change. Run `ipconfig` again to confirm
- **Static IP Recommended**: For permanent setup, contact IT to assign a static IP
- **Firewall**: Some networks block port 5000. Consult your IT department
- **Data Privacy**: All files are stored locally on your PC in `/uploads/` folder

---

## 🎯 Quick Start Command (All-in-One)

**Terminal 1 - Backend**:
```bash
cd c:\Users\USER\Desktop\Qgis-tools-main\file_collect\backend && python app.py
```

**Terminal 2 - Frontend Server**:
```bash
cd c:\Users\USER\Desktop\Qgis-tools-main\file_collect\frontend && python -m http.server 8000
```

**Then Share This URL**: `http://192.168.140.26:8000`

---

## 🔐 Security Considerations

For production use on public networks, consider:
- Adding authentication (login system)
- Using HTTPS instead of HTTP
- Restricting file types
- Setting up a reverse proxy (Nginx, Apache)
- Rate limiting requests

For now, this is perfect for **local network sharing** within a trusted environment.
