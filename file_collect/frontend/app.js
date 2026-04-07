/**
 * FileHub - Modern Professional UI
 * Light Theme + Glassmorphism + Gradient Animations + 3D Effects
 * Version: 2.2
 */

// ============ EARLY LOGGING ============
console.error('🚀 app.js: Script starting to load...');

// ============ GLOBAL NAV FUNCTION - MUST BE FIRST ============
// Make absolutely sure nav is globally available before anything else
function nav(page, btn) {
    console.error('📍 nav() called with page:', page, 'btn:', btn);
    try {
        console.error('🔄 NAVIGATION: Switching to:', page);
        console.error('Button element:', btn);
        console.error('Button text:', btn?.textContent.trim());

        // Validate page name
        if (!page || typeof page !== 'string') {
            console.error('❌ Invalid page name:', page);
            return;
        }

        // Hide all page containers & deactivate all buttons
        const allContainers = document.querySelectorAll('.page-container');
        const allButtons = document.querySelectorAll('.nav-btn');

        console.error(`📦 Found ${allContainers.length} containers and ${allButtons.length} buttons`);

        allContainers.forEach(p => {
            p.classList.remove('active');
            console.error(`  Hidden: ${p.id}`);
        });
        allButtons.forEach(b => {
            b.classList.remove('active');
        });

        // Show target page container
        const containerId = page + '-container';
        const targetContainer = document.getElementById(containerId);

        console.error(`🎯 Looking for container: "${containerId}"`);

        if (targetContainer) {
            targetContainer.classList.add('active');
            console.error(`✅ Container activated: ${containerId}`);

            // Verify it's actually visible
            const styles = window.getComputedStyle(targetContainer);
            console.log(`📊 Container styles [${containerId}]: disp=${styles.display}, op=${styles.opacity}, ptr=${styles.pointerEvents}`);
        } else {
            console.error('❌ Container not found:', containerId);
            console.warn('Available containers:', Array.from(allContainers).map(c => c.id));
            return;
        }

        // Activate button
        if (btn) {
            btn.classList.add('active');
            console.log('✅ Button activated');
        } else {
            console.warn('⚠️ No button provided to activate');
        }

    } catch (error) {
        console.error('❌ Navigation error:', error);
        console.log('Stack:', error.stack);
    }
}

// Make globals available on window
window.nav = nav;
console.log('✅ window.nav set successfully');

// Verify nav is available
if (typeof window.nav === 'function') {
    console.log('✅ window.nav is a function');
} else {
    console.error('❌ window.nav is NOT a function', typeof window.nav);
}

// ============ SERVER CONFIG ============
const getServerHost = () => {
    const currentHost = window.location.hostname;
    const saved = localStorage.getItem('serverIP');
    return saved || currentHost;
};

let SERVER_IP = getServerHost();
let API_URL = `http://${SERVER_IP}:5000/api`;

console.log('✓ app.js loaded successfully');
console.log('✓ nav function is globally available');
console.log('Server IP:', SERVER_IP);
console.log('API URL:', API_URL);

// ============ INITIALIZATION ============
// Initialize navigation buttons and page state
function initializeNavigation() {
    console.log('🚀 Initializing navigation...');

    // Ensure dashboard is active on page load
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer && !dashboardContainer.classList.contains('active')) {
        dashboardContainer.classList.add('active');
        console.log('✅ Dashboard container initialized');
    }

    // Set up button click handlers using event delegation
    console.log('📌 Setting up navigation button listeners...');

    const navButtons = document.querySelectorAll('.nav-btn[data-page]');
    console.log(`✅ Found ${navButtons.length} navigation buttons with data-page`);

    navButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const page = this.getAttribute('data-page');
            console.log(`🔘 Clicked button with page: ${page}`);
            nav(page, this);
        });
    });

    // Set up quick action buttons
    const quickUploadBtn = document.querySelector('[onclick*="nav(\'upload\'"][class*="btn-primary"]');
    if (quickUploadBtn) {
        quickUploadBtn.onclick = function (e) {
            e.preventDefault();
            const uploadBtn = document.querySelector('.nav-btn[data-page="upload"]');
            if (uploadBtn) {
                nav('upload', uploadBtn);
            }
        };
    }

    const quickAccessBtn = document.querySelector('[onclick*="nav(\'access\'"][class*="btn-primary"]');
    if (quickAccessBtn) {
        quickAccessBtn.onclick = function (e) {
            e.preventDefault();
            const accessBtn = document.querySelector('.nav-btn[data-page="access"]');
            if (accessBtn) {
                nav('access', accessBtn);
            }
        };
    }

    console.log('✅ Navigation initialization complete');
}

// Diagnostic function to test navigation
window.testNavigation = function () {
    console.log('🧪 TESTING NAVIGATION');

    // Test each button
    const buttons = document.querySelectorAll('.nav-btn');
    console.log(`Found ${buttons.length} navigation buttons`);

    buttons.forEach((btn, index) => {
        const text = btn.textContent.trim();
        const isClickable = btn.style.pointerEvents !== 'none';
        const styles = window.getComputedStyle(btn);
        console.log(`✅ Button ${index}: "${text}"`);
        console.log(`   - Cursor: ${styles.cursor}`);
        console.log(`   - Z-Index: ${styles.zIndex}`);
        console.log(`   - Display: ${styles.display}`);
        console.log(`   - Visible: ${styles.visibility}`);
        console.log(`   - Clickable: ${isClickable}`);
        console.log(`   - Has onclick: ${btn.onclick !== null || btn.getAttribute('onclick') !== null}`);
    });

    // Test containers
    const containers = document.querySelectorAll('.page-container');
    console.log(`\nFound ${containers.length} page containers`);

    containers.forEach(container => {
        const styles = window.getComputedStyle(container);
        console.log(`\n📦 Container: ${container.id}`);
        console.log(`   - Active: ${container.classList.contains('active')}`);
        console.log(`   - Display: ${styles.display}`);
        console.log(`   - Opacity: ${styles.opacity}`);
        console.log(`   - Pointer-events: ${styles.pointerEvents}`);
    });

    console.log('\n✅ Navigation test complete!');
};

// Auto-run test on page load
window.addEventListener('load', function () {
    console.log('✨ FileHub loaded successfully!');
    console.log('💡 Run testNavigation() in console to verify button setup');
    setTimeout(() => {
        testNavigation();
    }, 500);
});

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}

// Track which files are selected for upload
let selectedFiles = [];
let currentUploadMode = 'selected';
let isFolderMode = false;

// Allowed extensions for filtered mode (GIS + Image formats)
const ALL_FILTER_EXTENSIONS = [
    { ext: '.shp', label: 'SHP', group: 'GIS' },
    { ext: '.shx', label: 'SHX', group: 'GIS' },
    { ext: '.dbf', label: 'DBF', group: 'GIS' },
    { ext: '.prj', label: 'PRJ', group: 'GIS' },
    { ext: '.geojson', label: 'GeoJSON', group: 'GIS' },
    { ext: '.json', label: 'JSON', group: 'GIS' },
    { ext: '.kml', label: 'KML', group: 'GIS' },
    { ext: '.kmz', label: 'KMZ', group: 'GIS' },
    { ext: '.csv', label: 'CSV', group: 'Data' },
    { ext: '.tif', label: 'TIF', group: 'Raster' },
    { ext: '.tiff', label: 'TIFF', group: 'Raster' },
    { ext: '.jp2', label: 'JP2', group: 'Raster' },
    { ext: '.png', label: 'PNG', group: 'Image' },
    { ext: '.jpg', label: 'JPG', group: 'Image' },
    { ext: '.jpeg', label: 'JPEG', group: 'Image' },
    { ext: '.webp', label: 'WebP', group: 'Image' },
    { ext: '.svg', label: 'SVG', group: 'Image' }
];

// Get currently selected filtered extensions from checkboxes
function getSelectedFilteredExtensions() {
    const checkboxes = document.querySelectorAll('#formatCheckboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Toggle all format checkboxes
function toggleAllFormats() {
    const selectAll = document.getElementById('selectAllFormats');
    const checkboxes = document.querySelectorAll('#formatCheckboxes input[type="checkbox"]');
    checkboxes.forEach(cb => { cb.checked = selectAll.checked; });
}

// Handle upload mode radio change - show/hide format checkboxes
function handleUploadModeChange() {
    const mode = document.querySelector('input[name="uploadMode"]:checked')?.value || 'all';
    const formatSection = document.getElementById('formatFilterSection');
    if (formatSection) {
        formatSection.style.display = mode === 'filtered' ? 'block' : 'none';
    }
    updateModeButtons();
}

// Update the visual state of the upload mode buttons
function updateModeButtons() {
    const mode = document.querySelector('input[name="uploadMode"]:checked')?.value || 'all';
    const btnAll = document.getElementById('btnModeAll');
    const btnFiltered = document.getElementById('btnModeFiltered');

    if (!btnAll || !btnFiltered) return;

    if (mode === 'all') {
        btnAll.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
        btnAll.style.color = 'white';
        btnAll.style.border = '2px solid #6366f1';
        btnAll.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.3)';

        btnFiltered.style.background = 'white';
        btnFiltered.style.color = '#64748b';
        btnFiltered.style.border = '2px solid rgba(99, 102, 241, 0.2)';
        btnFiltered.style.boxShadow = 'none';
    } else {
        btnFiltered.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
        btnFiltered.style.color = 'white';
        btnFiltered.style.border = '2px solid #6366f1';
        btnFiltered.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.3)';

        btnAll.style.background = 'white';
        btnAll.style.color = '#64748b';
        btnAll.style.border = '2px solid rgba(99, 102, 241, 0.2)';
        btnAll.style.boxShadow = 'none';
    }
}

function validateUploadID() {
    const input = document.getElementById('uploadSegmentId');
    const errorMsg = document.getElementById('idErrorMsg');
    const id = parseInt(input.value);

    if (isNaN(id) || id < 10 || id > 99) {
        input.style.borderColor = '#ef4444';
        input.style.backgroundColor = 'rgba(239,68,68,0.05)';
        if (input.value.trim()) {
            errorMsg.textContent = 'ID must be between 10 and 99';
            errorMsg.style.display = 'block';
        }
    } else {
        input.style.borderColor = 'rgba(99,102,241,0.3)';
        input.style.backgroundColor = 'white';
        errorMsg.style.display = 'none';
    }
    updateUploadButtonState();
}

function toggleFolderMode() {
    const checkbox = document.getElementById('folderUploadCheckbox');
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    const dropZone = document.getElementById('dropZone');
    const fileListContainer = document.getElementById('fileListContainer');
    const dzsContent = document.querySelector('.dz-content');

    isFolderMode = checkbox.checked;

    // Reset file selections
    fileInput.value = '';
    folderInput.value = '';
    selectedFiles = [];

    if (fileListContainer) fileListContainer.style.display = 'none';
    if (dzsContent) {
        if (isFolderMode) {
            dzsContent.innerHTML = `
                <svg style="width:56px; height:56px; margin:0 auto 16px; color:#6366f1;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4c0-1 .5-2 2-2h3l1 2h6c1 0 2 .5 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z"></path></svg>
                <div style="color:#1e2937; font-weight:600; font-size:16px; margin-bottom:8px;">Click to select a folder</div>
                <div style="color:#64748b; font-size:13px;">All files in the folder will be uploaded</div>
            `;
        } else {
            dzsContent.innerHTML = `
                <svg style="width:56px; height:56px; margin:0 auto 16px; color:#6366f1;" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2c-1 0-2 .5-2.5 1.5M13 6c.5 1 .5 2.5 0 4M8 14c1 0 2-.5 2.5-1.5m-9-2c-.5-1-.5-2.5 0-4M8 2v8m-4-4l4 4 4-4"></path></svg>
                <div style="color:#1e2937; font-weight:600; font-size:16px; margin-bottom:8px;">Drag files here or click</div>
                <div style="color:#64748b; font-size:13px;">Choose files from your device or drag them here</div>
            `;
        }
    }

    updateUploadButtonState();
}

function updateUploadButtonState() {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadBtnText = document.getElementById('uploadBtnText');
    const idInput = document.getElementById('uploadSegmentId');
    const id = parseInt(idInput.value);

    const idValid = !isNaN(id) && id >= 10 && id <= 99;
    const hasFiles = selectedFiles.length > 0 || (isFolderMode && Array.from(document.getElementById('folderInput').files).length > 0);

    if (idValid && hasFiles) {
        uploadBtn.style.opacity = '1';
        uploadBtn.style.pointerEvents = 'auto';

        const fileCount = isFolderMode ? Array.from(document.getElementById('folderInput').files).length : selectedFiles.length;
        uploadBtnText.textContent = `⬆ Upload ${fileCount} File${fileCount !== 1 ? 's' : ''} (ID: ${id})`;
    } else {
        uploadBtn.style.opacity = '0.5';
        uploadBtn.style.pointerEvents = 'none';

        if (!idValid && !isFolderMode) {
            uploadBtnText.textContent = '⬆ Enter a valid ID (10-99)';
        } else if (!hasFiles) {
            uploadBtnText.textContent = '⬆ Select files to upload';
        } else {
            uploadBtnText.textContent = '⬆ Select ID and Files to Upload';
        }
    }
}

function uploadFiles() {
    const segmentId = document.getElementById('uploadSegmentId').value.trim();
    const uploadMode = document.querySelector('input[name="uploadMode"]:checked')?.value || 'all';

    if (!segmentId || parseInt(segmentId) < 10 || parseInt(segmentId) > 99) {
        alert('❌ Please enter a valid Upload ID (10-99)');
        return;
    }

    // Get files based on mode
    let filesToUpload = [];
    if (isFolderMode) {
        filesToUpload = Array.from(document.getElementById('folderInput').files);
    } else {
        filesToUpload = selectedFiles;
    }

    if (filesToUpload.length === 0) {
        alert('❌ Please select files to upload');
        return;
    }

    // Filter files if in filtered mode
    if (uploadMode === 'filtered') {
        const activeExtensions = getSelectedFilteredExtensions();
        if (activeExtensions.length === 0) {
            alert('❌ Please select at least one file format in Filtered Mode');
            return;
        }
        filesToUpload = filesToUpload.filter(file => {
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            return activeExtensions.includes(ext);
        });

        if (filesToUpload.length === 0) {
            alert('❌ No files match the selected format filters');
            return;
        }
    }

    // Create FormData and add files
    const formData = new FormData();
    for (let file of filesToUpload) {
        formData.append('files', file);
    }

    // Add segment_id and upload_mode
    formData.append('segment_id', segmentId);
    formData.append('upload_mode', uploadMode); // 'all' or 'filtered'

    // Show progress bar
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';

    // Upload files
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percentComplete + '%';
            progressPercent.textContent = percentComplete + '%';
        }
    });

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (window.notificationManager) {
                    window.notificationManager.show('success', '✓ Upload Complete', `${filesToUpload.length} file(s) uploaded to Upload ID ${segmentId}`);
                }

                // Reset form
                setTimeout(() => {
                    document.getElementById('fileInput').value = '';
                    document.getElementById('folderInput').value = '';
                    document.getElementById('fileList').innerHTML = '';
                    document.getElementById('folderList').innerHTML = '';
                    selectedFiles = [];
                    progressContainer.style.display = 'none';
                    loadSegments();
                }, 1000);
            } catch (e) {
                if (window.notificationManager) {
                    window.notificationManager.show('error', '⚠ Upload Error', 'Invalid response from server');
                }
            }
        } else {
            if (window.notificationManager) {
                window.notificationManager.show('error', '✕ Upload Failed', `Server error: ${xhr.status}`);
            }
        }
    });

    xhr.addEventListener('error', () => {
        if (window.notificationManager) {
            window.notificationManager.show('error', '✕ Connection Error', 'Failed to connect to server');
        }
        progressContainer.style.display = 'none';
    });

    console.log('Uploading to:', `${API_URL}/upload`);
    xhr.open('POST', `${API_URL}/upload`);
    xhr.send(formData);
}

function accessFiles() {
    nav('access', event?.target?.closest('.nav-btn'));
}

function openDashboard() {
    nav('dashboard', document.querySelector('[onclick*="nav(\'dashboard\'"]'));
}

function browseFolders() {
    nav('browse', event?.target?.closest('.nav-btn'));
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }
}

// ============ UPLOAD MODE SWITCHING ============
function switchUploadMode(mode) {
    currentUploadMode = mode;
    const selectedMode = document.getElementById('selectedFilesMode');
    const folderMode = document.getElementById('folderMode');
    const selectedBtn = document.getElementById('modeSelectedBtn');
    const folderBtn = document.getElementById('modeFolderBtn');

    // Toggle visibility only - NO color or opacity changes
    if (mode === 'selected') {
        selectedMode.style.display = 'block';
        folderMode.style.display = 'none';
    } else {
        selectedMode.style.display = 'none';
        folderMode.style.display = 'block';
    }

    // Clear previous selections
    document.getElementById('fileInput').value = '';
    document.getElementById('folderInput').value = '';
    document.getElementById('fileList').innerHTML = '';
    document.getElementById('folderList').innerHTML = '';
}

// ============ 3D HOVER EFFECTS ============
class ThreeDEffects {
    constructor() {
        this.init();
    }

    init() {

        const elements = document.querySelectorAll('.nav-btn, .btn-primary');
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-5px) scale(1.05)';
                el.style.boxShadow = '0 25px 60px rgba(99, 102, 241, 0.25)';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '';
            });
        });
    }
}

// ============ GRADIENT ANIMATOR ============
class GradientAnimator {
    constructor() {
        this.colors = ['#6366f1', '#a855f7', '#22d3ee', '#ec4899'];
        this.animate();
    }

    animate() {
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(btn => {
            let i = 0;
            setInterval(() => {
                const c1 = this.colors[i % this.colors.length];
                const c2 = this.colors[(i + 1) % this.colors.length];
                btn.style.backgroundImage = `linear-gradient(135deg, ${c1}, ${c2})`;
                i++;
            }, 3000);
        });
    }
}

// ============ NOTIFICATION SYSTEM ============
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notificationsContainer');
    }

    show(type, title, message) {
        const id = `notify-${Date.now()}`;
        const isSuccess = type === 'success';
        const isError = type === 'error';

        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `toast glass-panel p-5 rounded-2xl border shadow-2xl flex gap-4 items-start transition-all duration-300`;
        notification.style.background = isSuccess ? 'rgba(236, 253, 245, 0.95)' :
            isError ? 'rgba(254, 242, 242, 0.95)' :
                'rgba(239, 246, 255, 0.95)';
        notification.style.borderColor = isSuccess ? '#10b981' : isError ? '#ef4444' : '#6366f1';

        notification.innerHTML = `
            <div class="text-2xl mt-0.5 ${isSuccess ? 'text-emerald-600' : isError ? 'text-red-600' : 'text-indigo-600'}">
                ${isSuccess ? '✓' : isError ? '✕' : 'ℹ'}
            </div>
            <div class="flex-1">
                <p class="font-semibold text-slate-900">${title}</p>
                <p class="text-sm mt-1 ${isSuccess ? 'text-emerald-700' : isError ? 'text-red-700' : 'text-slate-600'}">${message}</p>
            </div>
            <button onclick="this.closest('.toast').remove()" class="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        `;

        this.container.appendChild(notification);

        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.style.opacity = '0';
            setTimeout(() => el && el.remove(), 400);
        }, 5000);
    }
}

// ============ FILE HANDLER ============
class FileHandler {
    constructor() {
        console.log('📁 FileHandler: Initializing...');
        this.fileInput = document.getElementById('fileInput');
        this.folderInput = document.getElementById('folderInput');
        this.dropZone = document.getElementById('dropZone');

        console.log('📁 FileHandler: Elements found:');
        console.log(`  - fileInput: ${this.fileInput ? '✅' : '❌'}`);
        console.log(`  - folderInput: ${this.folderInput ? '✅' : '❌'}`);
        console.log(`  - dropZone: ${this.dropZone ? '✅' : '❌'}`);

        if (this.dropZone) {
            this.setup();
            console.log('📁 FileHandler: Dropzone setup complete');
        } else {
            console.warn('⚠️ FileHandler: dropZone not found');
        }

        if (this.folderInput) {
            this.setupFolderMode();
            console.log('📁 FileHandler: Folder mode setup complete');
        } else {
            console.warn('⚠️ FileHandler: folderInput not found');
        }
    }

    setup() {
        this.dropZone.addEventListener('click', () => {
            if (isFolderMode) {
                this.folderInput.click();
            } else {
                this.fileInput.click();
            }
        });
        this.dropZone.addEventListener('dragover', e => {
            e.preventDefault();
            this.dropZone.style.borderColor = '#06b6d4';
            this.dropZone.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        });
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.style.borderColor = '#6366f1';
            this.dropZone.style.backgroundColor = 'transparent';
        });
        this.dropZone.addEventListener('drop', e => {
            e.preventDefault();
            this.dropZone.style.borderColor = '#6366f1';
            this.dropZone.style.backgroundColor = 'transparent';
            const dt = new DataTransfer();
            for (let file of e.dataTransfer.files) {
                dt.items.add(file);
            }
            this.fileInput.files = dt.files;
            this.generateFileList();
        });
        this.fileInput.addEventListener('change', () => this.generateFileList());
    }

    generateFileList() {
        const container = document.getElementById('fileListContainer');
        const checkboxList = document.getElementById('filesCheckboxList');
        const countLabel = document.getElementById('filesCountLabel');

        if (!container || !checkboxList) return;

        const allFiles = Array.from(this.fileInput.files);

        if (allFiles.length === 0) {
            container.style.display = 'none';
            checkboxList.innerHTML = '';
            updateSelectedFiles();
            return;
        }

        container.style.display = 'block';
        checkboxList.innerHTML = '';
        countLabel.textContent = `(${allFiles.length} file${allFiles.length !== 1 ? 's' : ''})`;

        // Add checkboxes for each file
        allFiles.forEach((file, index) => {
            const checkbox = document.createElement('label');
            checkbox.style.cssText = 'display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(99,102,241,0.02); border-radius:10px; cursor:pointer; border:1px solid rgba(99,102,241,0.15); transition:all 0.2s ease;';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.style.cssText = 'width:16px; height:16px; cursor:pointer; accent-color:#6366f1;';
            input.checked = true;
            input.onchange = () => updateSelectedFiles();

            const label = document.createElement('div');
            label.style.cssText = 'flex:1; min-width:0;';
            label.innerHTML = `
                <div style="color:#1e2937; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500;">${file.name}</div>
                <div style="color:#64748b; font-size:11px; margin-top:2px;">${(file.size / 1024).toFixed(1)} KB</div>
            `;

            checkbox.appendChild(input);
            checkbox.appendChild(label);
            checkboxList.appendChild(checkbox);
        });

        // Initialize selected files
        updateSelectedFiles();
    }

    setupFolderMode() {
        this.folderInput.addEventListener('change', () => {
            const allFiles = Array.from(this.folderInput.files);

            if (allFiles.length === 0) {
                updateUploadButtonState();
                return;
            }

            // Extract folder name from first file's path
            const folderPath = allFiles[0]?.webkitRelativePath?.split('/')[0] || 'Unknown';

            // Update button state
            updateUploadButtonState();
        });
    }
}

// ============ FILE SELECTION FUNCTIONS ============
function updateSelectedFiles() {
    const checkboxes = document.querySelectorAll('#filesCheckboxList input[type="checkbox"]');
    const fileInput = document.getElementById('fileInput');
    const allFiles = Array.from(fileInput.files);

    // Build array of selected files
    selectedFiles = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked && allFiles[index]) {
            selectedFiles.push(allFiles[index]);
        }
    });

    // Update "Select All" checkbox
    const selectAllCheckbox = document.getElementById('selectAllFiles');
    selectAllCheckbox.checked = selectedFiles.length === allFiles.length && allFiles.length > 0;

    // Update button state
    updateUploadButtonState();
}

function toggleSelectAllFiles() {
    const selectAllCheckbox = document.getElementById('selectAllFiles');
    const checkboxes = document.querySelectorAll('#filesCheckboxList input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    updateSelectedFiles();
}

// ============ ACCESS FILE MANAGER (Updated Name) ============
class AccessFileManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        this.currentFiles = [];
        this.currentUploadId = '';
        this.setup();
    }

    setup() {
        const accessBtn = document.getElementById('accessFilesBtn');
        if (accessBtn) {
            accessBtn.addEventListener('click', async () => {
                const uploadId = document.getElementById('accessSegmentId').value.trim();
                console.log('Access button clicked with uploadId:', uploadId);
                if (!uploadId) {
                    this.notificationManager.show('error', 'Validation Error', 'Please enter Upload ID');
                    return;
                }

                try {
                    console.log('Making API request to:', `${API_URL}/access-segment/${uploadId}`);
                    const res = await axios.get(`${API_URL}/access-segment/${uploadId}`);
                    console.log('API response:', res.data);
                    this.currentFiles = res.data.files || [];
                    this.currentUploadId = uploadId;
                    console.log('Setting current files:', this.currentFiles);
                    this.displayFiles(this.currentFiles, uploadId);
                    this.notificationManager.show('success', 'Access Granted', `Files loaded for ID ${uploadId}`);
                } catch (err) {
                    console.error('API error:', err);
                    this.notificationManager.show('error', 'Access Failed', err.response?.data?.error || 'Invalid Upload ID');
                }
            });
        }
    }

    displayFiles(files, uploadId) {
        console.log('displayFiles called with files:', files, 'uploadId:', uploadId);
        const container = document.getElementById('filesContainer');
        const list = document.getElementById('filesList');
        console.log('Container element:', container, 'List element:', list);
        if (!container || !list) {
            console.error('filesContainer or filesList element not found!');
            return;
        }

        document.getElementById('displaySegmentId').textContent = uploadId;
        list.innerHTML = '';

        // Helper function to recursively collect all files
        const collectAllFiles = (items, parentPath = '') => {
            let allFiles = [];
            items.forEach(item => {
                const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
                if (item.type === 'file') {
                    allFiles.push({ ...item, fullPath });
                } else if (item.type === 'folder' && item.children) {
                    allFiles = allFiles.concat(collectAllFiles(item.children, fullPath));
                }
            });
            return allFiles;
        };

        // Get all files recursively
        const allFiles = collectAllFiles(files);
        console.log('Total files collected:', allFiles.length, 'Files:', allFiles);

        if (!allFiles || allFiles.length === 0) {
            console.log('No files found');
            list.innerHTML = '<p style="text-align:center; color:#64748b; padding:20px;">No files found for this Upload ID</p>';
            container.style.display = 'block';
            return;
        }

        // Add "Download All" button if there are multiple files
        if (allFiles.length > 1) {
            const downloadAllDiv = document.createElement('div');
            downloadAllDiv.style.cssText = 'margin-bottom:20px; padding-bottom:20px; border-bottom:2px solid rgba(99,102,241,0.2);';
            downloadAllDiv.innerHTML = `
                <button onclick="downloadAllFiles('${uploadId}')" style="
                    background: linear-gradient(135deg, #3beeeee0, #00b4ccce);
                    color:white;
                    border:none;
                    padding:10px 20px;
                    border-radius:14px;
                    font-size:14px;
                    font-weight:600;
                    cursor:pointer;
                    box-shadow: 0 4px 12px rgba(22, 216, 151, 0.45);
                    transition: all 0.35s ease;
                    width:100%;
                    text-align:center;
                " onmouseover="this.style.boxShadow='0 12px 32px rgba(16,185,129,0.5)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 8px 24px rgba(16,185,129,0.3)'; this.style.transform='translateY(0)';">⬇ Download All Files (${allFiles.length})</button>
            `;
            list.appendChild(downloadAllDiv);
        }

        allFiles.forEach(file => {
            const size = (file.size / 1024).toFixed(1);
            const displayName = file.fullPath.includes('/') ? file.fullPath : file.name;
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:rgba(255, 255, 255, 1); border:1px solid rgba(99,102,241,0.15); border-radius:14px; margin-bottom:10px; transition:all 0.3s ease;';
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                    <span style="font-size:24px;">📄</span>
                    <div style="flex:1; min-width:0;">
                        <p style="font-weight:600; color:#1e2937; margin:0; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${displayName}</p>
                        <p style="font-size:11px; color:#64748b; margin:4px 0 0 0;">${size} KB</p>
                    </div>
                </div>
                <button onclick="downloadFile('${uploadId}', '${file.path}')" style="
                    background: linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8));
                    color:white;
                    border:none;
                    padding:8px 16px;
                    border-radius:10px;
                    font-size:12px;
                    font-weight:600;
                    cursor:pointer;
                    box-shadow: 0 4px 12px rgba(99,102,241,0.25);
                    transition: all 0.35s ease;
                    white-space:nowrap;
                    margin-left:12px;
                " onmouseover="this.style.boxShadow='0 8px 20px rgba(99,102,241,0.4)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.boxShadow='0 4px 12px rgba(99,102,241,0.25)'; this.style.transform='translateY(0)';">⬇</button>
            `;
            list.appendChild(div);
            console.log('Added file to display:', displayName);
        });

        console.log('Setting container display to block');
        container.style.display = 'block';
        console.log('displayFiles complete - container visible:', container.style.display);
    }
}

// ============ SETTINGS ============
class SettingsManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
    }

    init() {
        window.toggleSettings = () => {
            const modal = document.getElementById('settingsModal');
            if (modal) modal.classList.toggle('hidden');
        };

        window.saveSettings = () => {
            const ip = document.getElementById('customServerIP')?.value.trim();
            if (ip) localStorage.setItem('serverIP', ip);
            else localStorage.removeItem('serverIP');

            this.notificationManager.show('success', 'Settings Saved', 'Page will reload...');
            setTimeout(() => location.reload(), 1200);
        };
    }
}

// ============ GLOBAL FUNCTIONS ============
window.downloadFile = (uploadId, filePath) => {
    const url = `${API_URL}/download/${uploadId}/${encodeURIComponent(filePath)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();

    window.notificationManager?.show('success', 'Download Started', filePath.split('/').pop() || filePath);
};

window.downloadAllFiles = (uploadId) => {
    if (!uploadId) {
        window.notificationManager?.show('error', 'Error', 'No Upload ID specified');
        return;
    }

    // Download all files as zip
    const url = `${API_URL}/download-all/${uploadId}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `files_${uploadId}.zip`;
    a.click();

    window.notificationManager?.show('success', 'Download Started', `All files from Upload ID ${uploadId} are being downloaded`);
};

async function loadSegments() {
    try {
        const res = await axios.get(`${API_URL}/segments`);
        const segments = res.data.segments || [];

        console.log('Segments loaded:', segments);

        // Update dashboard total uploads
        const totalUploadElements = document.querySelectorAll('[style*="font-size:48px"][style*="font-weight:700"]');
        if (totalUploadElements.length > 0 && segments.length > 0) {
            totalUploadElements.forEach(el => {
                if (el.textContent === '-') {
                    el.textContent = segments.length;
                }
            });
        }

        // Update file browser - READ-ONLY VIEW
        const liveSegmentsContainer = document.getElementById('liveSegments');
        if (liveSegmentsContainer) {
            if (segments.length === 0) {
                liveSegmentsContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text2);">No uploads yet</div>';
                return;
            }

            liveSegmentsContainer.innerHTML = '';

            // Add "Viewing Mode" label
            const viewingModeLabel = document.createElement('div');
            viewingModeLabel.style.cssText = 'grid-column:1/-1; padding:12px 16px; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:10px; font-size:12px; color:#2563eb; font-weight:600; display:flex; align-items:center; gap:8px; margin-bottom:16px;';
            viewingModeLabel.innerHTML = '👁 Viewing Mode (Read-Only) — To download files, use the Access Files section';
            liveSegmentsContainer.appendChild(viewingModeLabel);

            // Helper function to recursively collect all files from the tree
            function collectAllFiles(items, parentPath = '') {
                let allFiles = [];
                items.forEach(item => {
                    const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
                    if (item.type === 'file') {
                        allFiles.push({ ...item, fullPath });
                    } else if (item.type === 'folder' && item.children) {
                        allFiles = allFiles.concat(collectAllFiles(item.children, fullPath));
                    }
                });
                return allFiles;
            }

            // Load files for each segment
            for (const segment of segments) {
                try {
                    const filesRes = await axios.get(`${API_URL}/access-segment/${segment.id}`);
                    const fileTree = filesRes.data.files || [];

                    // Get all files recursively
                    const allFiles = collectAllFiles(fileTree);

                    // Create segment header (clickable to expand/collapse)
                    const segmentHeader = document.createElement('div');
                    segmentHeader.style.cssText = 'padding:16px 20px; background:rgba(99,102,241,0.08); border-left:3px solid var(--accent); border-radius:8px; margin-top:12px; cursor:pointer; transition:all 0.3s ease; user-select:none;';
                    segmentHeader.dataset.expanded = 'false';

                    const chevron = document.createElement('span');
                    chevron.style.cssText = 'display:inline-block; margin-right:8px; transition:transform 0.3s ease;';
                    chevron.textContent = '▶';

                    const headerContent = document.createElement('div');
                    headerContent.style.cssText = 'display:flex; justify-content:space-between; align-items:center;';
                    headerContent.innerHTML = `
                        <div>
                            <div style="font-weight:600; color:#1e2937; display:flex; align-items:center;">
                                <span style="display:inline-block; margin-right:8px; transition:transform 0.3s ease;">▶</span>
                                📁 Upload ID: ${segment.id}
                            </div>
                            <div style="font-size:12px; color:#64748b; margin-top:4px;">${segment.file_count} file(s)</div>
                        </div>
                    `;
                    segmentHeader.appendChild(headerContent);
                    liveSegmentsContainer.appendChild(segmentHeader);

                    // Create container for files (hidden by default)
                    const filesContainer = document.createElement('div');
                    filesContainer.style.cssText = 'max-height:0; overflow:hidden; transition:max-height 0.35s ease; margin-bottom:0;';

                    // Display files for this segment
                    if (allFiles.length === 0) {
                        const emptyMsg = document.createElement('div');
                        emptyMsg.style.cssText = 'padding:12px 20px; color:#94a3b8; font-size:13px; font-style:italic;';
                        emptyMsg.textContent = 'No files in this upload';
                        filesContainer.appendChild(emptyMsg);
                    } else {
                        const fileList = document.createElement('div');
                        fileList.style.cssText = 'display:flex; flex-direction:column; gap:8px; padding:0 20px; margin-bottom:16px;';

                        allFiles.forEach(file => {
                            const fileItem = document.createElement('div');
                            fileItem.style.cssText = 'padding:12px 16px; background:rgba(255,255,255,0.5); border:1px solid rgba(99,102,241,0.1); border-radius:10px; font-size:13px; color:#64748b; display:flex; justify-content:space-between; align-items:center; cursor:default;';

                            // Show folder path if file is nested
                            const displayName = file.fullPath.includes('/') ? file.fullPath : file.name;

                            const fileNameSpan = document.createElement('span');
                            fileNameSpan.style.cssText = 'display:flex; align-items:center; gap:10px; flex:1; min-width:0;';
                            fileNameSpan.innerHTML = `<span style="font-size:14px;">📄</span> <span style="color:#1e2937; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${displayName}</span>`;

                            const fileSizeSpan = document.createElement('span');
                            fileSizeSpan.style.cssText = 'font-size:11px; color:#94a3b8; margin-left:8px; white-space:nowrap;';
                            fileSizeSpan.textContent = file.size ? `${(file.size / 1024).toFixed(1)} KB` : '';

                            fileItem.appendChild(fileNameSpan);
                            fileItem.appendChild(fileSizeSpan);
                            fileList.appendChild(fileItem);
                        });

                        filesContainer.appendChild(fileList);
                    }

                    liveSegmentsContainer.appendChild(filesContainer);

                    // Add click handler to toggle expand/collapse
                    segmentHeader.addEventListener('click', () => {
                        const isExpanded = segmentHeader.dataset.expanded === 'true';
                        const chevronSpan = segmentHeader.querySelector('span');

                        if (isExpanded) {
                            // Collapse
                            filesContainer.style.maxHeight = '0';
                            chevronSpan.style.transform = 'rotate(0deg)';
                            segmentHeader.dataset.expanded = 'false';
                        } else {
                            // Expand
                            filesContainer.style.maxHeight = filesContainer.scrollHeight + 'px';
                            chevronSpan.style.transform = 'rotate(90deg)';
                            segmentHeader.dataset.expanded = 'true';
                        }
                    });

                } catch (e) {
                    console.error(`Failed to load files for segment ${segment.id}`, e);
                }
            }
        }
    } catch (e) {
        console.error('Failed to load segments', e);
    }
}

async function checkStatus() {
    try {
        await axios.get(`${API_URL}/health`, { timeout: 2500 });
        const badge = document.getElementById('statusBadge');
        if (badge) badge.innerHTML = `<span class="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block mr-2"></span>Online`;
    } catch {
        const badge = document.getElementById('statusBadge');
        if (badge) badge.innerHTML = `<span class="w-2.5 h-2.5 bg-red-500 rounded-full inline-block mr-2"></span>Offline`;
    }
}

// ============ INITIALIZATION ============
window.addEventListener('load', () => {
    window.notificationManager = new NotificationManager();

    new FileHandler();
    new AccessFileManager(window.notificationManager);
    new SettingsManager(window.notificationManager).init();
    new ThreeDEffects();
    new GradientAnimator();

    // Initialize upload button state
    updateUploadButtonState();

    checkStatus();
    loadSegments();

    setInterval(checkStatus, 15000);
    setInterval(loadSegments, 20000);
});