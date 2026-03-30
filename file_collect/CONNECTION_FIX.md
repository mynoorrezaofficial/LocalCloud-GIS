# 🔧 Fix: Connection Error for Network Users

## Problem
Users on other computers get this error in browser console:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## Solution ✅

### What Changed
The system now **automatically detects** the server IP from the URL being accessed:
- ✅ Access from `http://192.168.140.26:8000` → API uses `http://192.168.140.26:5000`
- ✅ Access from `http://localhost:8000` → API uses `http://localhost:5000`

### For Other Users

**Step 1: Refresh Browser Cache**
```
Press: Ctrl + Shift + R  (Hard Refresh)
```

**Step 2: Clear Browser Cache (if hard refresh doesn't work)**
- Chrome: Settings → Privacy → Clear Browsing Data
- Firefox: Preferences → Privacy → Clear Data
- Edge: Settings → Privacy → Clear Browsing Data

**Step 3: Access via Correct URL**
Make sure you're accessing with the full URL:
```
✅ Correct:   http://192.168.140.26:8000
❌ Wrong:     192.168.140.26:8000
❌ Wrong:     https://192.168.140.26:8000
```

**Step 4: Check Server Settings**
1. Look at **bottom left corner** of sidebar
2. Click **⚙️ Server Settings** button
3. Verify "Current Connection" shows your server IP
4. Example: `http://192.168.140.26:5000/api` ← Should match your server

---

## 🛠️ Manual Fix (If Auto-Detect Doesn't Work)

If the system still can't connect:

1. Click **⚙️ Server Settings** button (bottom left)
2. Enter your server IP/hostname:
   ```
   Example: 192.168.140.26
   ```
3. Click **Save**
4. Page will reload automatically

---

## 🔍 Troubleshooting

### "Still getting connection refused"

1. **Verify Backend is Running**
   - On your PC (where backend runs), open terminal
   - Should see: `Running on http://0.0.0.0:5000`

2. **Check Firewall**
   - Windows Firewall might be blocking port 5000
   - Run on server PC:
   ```
   netsh advfirewall firewall add rule name="Flask API" dir=in action=allow protocol=tcp localport=5000
   ```

3. **Verify Network Connection**
   - Both PCs must be on **same WiFi network**
   - Test from other PC's terminal:
   ```
   ping 192.168.140.26
   ```
   Should respond ✅

4. **Try Different Browser**
   - Chrome, Firefox, Edge all recommended
   - Safari sometimes has issues

### "Wrong IP Address Shows"

1. Click **⚙️ Server Settings**
2. Clear the input field (leave blank)
3. Click **Reset**
4. Refresh page (Ctrl+R)
5. System will auto-detect again

---

## 📋 For System Administrator

### Verify Everything Works

**Test from another PC on network:**
```
1. Open: http://192.168.140.26:8000
2. Verify "● Online" shows in green (bottom left)
3. Verify Server Settings shows: http://192.168.140.26:5000/api
4. Try uploading a file to test full connection
```

### Share These Steps with Users

Send your team this checklist:
```
✅ PC/Laptop on same WiFi as server PC
✅ Accessing URL: http://192.168.140.26:8000
✅ Hard refresh: Ctrl + Shift + R
✅ Status indicator green (● Online)
✅ Server Settings shows correct IP
```

---

## 🚀 Quick Test Commands

**On Server PC:**
```bash
# Test Backend
curl http://localhost:5000/api/health

# Should return:
{"status": "ok", "message": "File Management System is running"}
```

**On Another PC (replace with your IP):**
```bash
# Test Backend API
curl http://192.168.140.26:5000/api/health

# Should return same JSON
```

If both work → your frontend should work too!

---

## 📝 Browser Console Check

If connections are failing, check browser console (F12):

**Good** - No errors:
```
GET http://192.168.140.26:5000/api/health 200 OK
```

**Bad** - Connection refused:
```
GET http://192.168.140.26:5000/api/health ERR_CONNECTION_REFUSED
GET http://localhost:5000/api/health ERR_CONNECTION_REFUSED
```

---

## ⚙️ Server Settings Modal Guide

When you click **⚙️ Server Settings**, you'll see:

| Field | What It Shows | What To Do |
|-------|---------------|-----------|
| **Current Connection** | Active API URL | Read only - shows where it's connected |
| **Server IP/Hostname** | Manual override field | Leave blank for auto-detect |
| **Save button** | Saves custom IP | Click only if manually changing |
| **Reset button** | Remove custom setting | Click to go back to auto-detect |

---

## ✅ Verification Checklist

After applying this fix:
- ✅ No more "ERR_CONNECTION_REFUSED" 
- ✅ Server Settings shows green Online
- ✅ API connection works from other PCs
- ✅ File uploads work
- ✅ File downloads work

---

## 🎯 Email Template for Users

**Subject: File Management System - Connection Fix**

> Hi Team,
>
> The file management system now automatically detects your server connection!
>
> **To Access:**
> - Use URL: `http://192.168.140.26:8000`
> - Hard refresh: `Ctrl + Shift + R`
> - Check status indicator is green (● Online)
>
> **If You Get Errors:**
> 1. Check you're on same WiFi network
> 2. Click ⚙️ Server Settings (bottom left)
> 3. Verify IP shows `192.168.140.26:5000`
> 4. Contact IT if still not working
>
> Thanks!

---

## 📊 Known Working Configurations

| Scenario | Status | Notes |
|----------|--------|-------|
| Same PC - localhost:8000 → localhost:5000 | ✅ Works | No configuration needed |
| Same Network - IP:8000 → IP:5000 | ✅ Works | Auto-detection handles it |
| Different Network - VPN | ❓ Needs setup | Contact IT for VPN/proxy |
| Internet access | ❌ Not supported | Not designed for public internet |

---

## 💡 How Auto-Detection Works

```javascript
// The system detects:
User visits: http://192.168.140.26:8000
Browser gets: window.location.hostname = "192.168.140.26"
API connects to: http://192.168.140.26:5000/api ✅

User visits: http://localhost:8000  
Browser gets: window.location.hostname = "localhost"
API connects to: http://localhost:5000/api ✅
```

Simple & Automatic! 🎯

---

## 🎉 Result

After this fix:
- ✅ **Zero configuration needed** for most users
- ✅ **Auto-detection works** for different IPs
- ✅ **Manual override available** if needed
- ✅ **Clear status indicator** shows connection health
- ✅ **No more connection errors** ✅

**Your FileHub is now Network-Ready!** 🚀
