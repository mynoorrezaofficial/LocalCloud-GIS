from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pathlib import Path
import os
import json
from datetime import datetime
import mimetypes

app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = Path(__file__).parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
ALLOWED_EXTENSIONS = {'.jpg', '.png', '.img', '.jpeg', '.json', '.shp', '.shx', '.dbf'}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

# Ensure uploads directory exists
UPLOAD_DIR.mkdir(exist_ok=True)


def is_valid_segment_id(segment_id):
    """Validate that segment ID is a 2-digit number."""
    try:
        num = int(segment_id)
        return 10 <= num <= 99
    except (ValueError, TypeError):
        return False


def sanitize_path(base_dir, user_path):
    """Sanitize path to prevent directory traversal attacks."""
    try:
        base = Path(base_dir).resolve()
        target = (base / user_path).resolve()
        
        # Ensure target is within base directory
        target.relative_to(base)
        return target
    except (ValueError, OSError):
        return None


def is_allowed_file(filename, filtered_mode=False):
    """Check if file extension is allowed."""
    if filtered_mode:
        ext = Path(filename).suffix.lower()
        return ext in ALLOWED_EXTENSIONS
    return True


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "File Management System is running"}), 200


@app.route('/api/upload', methods=['POST'])
def upload_files():
    """
    Handle file upload with segmented storage.
    
    Expected form data:
    - segment_id: 2-digit ID
    - upload_mode: 'all' or 'filtered'
    - files: file(s) to upload
    """
    try:
        segment_id = request.form.get('segment_id', '').strip()
        upload_mode = request.form.get('upload_mode', 'all')
        
        # Validate segment ID
        if not is_valid_segment_id(segment_id):
            return jsonify({
                "success": False,
                "error": "Invalid segment ID. Must be a 2-digit number (10-99)."
            }), 400
        
        filtered_mode = upload_mode == 'filtered'
        
        # Check if files were provided
        if 'files' not in request.files:
            return jsonify({
                "success": False,
                "error": "No files provided in upload."
            }), 400
        
        files = request.files.getlist('files')
        if not files:
            return jsonify({
                "success": False,
                "error": "No files provided in upload."
            }), 400
        
        # Create segment directory
        segment_dir = UPLOAD_DIR / segment_id
        segment_dir.mkdir(parents=True, exist_ok=True)
        
        uploaded_files = []
        errors = []
        
        for file in files:
            if not file or file.filename == '':
                continue
            
            # Get the original directory structure if it exists
            original_path = file.filename
            
            # For directory uploads, preserve relative path
            file_path = Path(original_path)
            
            # Check file size
            file_content = file.read()
            file_size = len(file_content)
            
            if file_size > MAX_FILE_SIZE:
                errors.append(f"{original_path}: File too large (max {MAX_FILE_SIZE / 1024 / 1024}MB)")
                continue
            
            # Move pointer back to start
            file.seek(0)
            
            # Check if file is allowed
            if not is_allowed_file(original_path, filtered_mode):
                errors.append(f"{original_path}: File type not allowed in filtered mode")
                continue
            
            # Create subdirectory structure if needed
            target_file_path = segment_dir / original_path
            target_file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Sanitize the full path
            safe_path = sanitize_path(segment_dir, original_path)
            if not safe_path:
                errors.append(f"{original_path}: Invalid file path")
                continue
            
            # Save file
            try:
                file.save(str(safe_path))
                uploaded_files.append({
                    "name": original_path,
                    "size": file_size,
                    "saved_at": datetime.now().isoformat()
                })
            except Exception as e:
                errors.append(f"{original_path}: {str(e)}")
        
        if not uploaded_files and errors:
            return jsonify({
                "success": False,
                "error": "No files were uploaded successfully",
                "details": errors
            }), 400
        
        return jsonify({
            "success": True,
            "message": f"Successfully uploaded {len(uploaded_files)} file(s) to segment {segment_id}",
            "segment_id": segment_id,
            "uploaded_files": uploaded_files,
            "errors": errors if errors else None
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Upload failed: {str(e)}"
        }), 500


@app.route('/api/access-segment/<segment_id>', methods=['GET'])
def access_segment(segment_id):
    """
    List files in a specific segment.
    
    Returns a hierarchical structure of files and folders.
    """
    try:
        # Validate segment ID
        if not is_valid_segment_id(segment_id):
            return jsonify({
                "success": False,
                "error": "Invalid segment ID. Must be a 2-digit number (10-99)."
            }), 400
        
        segment_dir = UPLOAD_DIR / segment_id
        
        # Check if segment exists
        if not segment_dir.exists():
            return jsonify({
                "success": False,
                "error": f"Segment {segment_id} does not exist."
            }), 404
        
        # Sanitize path
        safe_dir = sanitize_path(UPLOAD_DIR, segment_id)
        if not safe_dir:
            return jsonify({
                "success": False,
                "error": "Invalid segment path."
            }), 400
        
        def build_tree(directory):
            """Recursively build file tree."""
            items = []
            try:
                for item in sorted(directory.iterdir()):
                    if item.is_file():
                        file_stat = item.stat()
                        items.append({
                            "name": item.name,
                            "path": str(item.relative_to(segment_dir)),
                            "type": "file",
                            "size": file_stat.st_size,
                            "modified": datetime.fromtimestamp(file_stat.st_mtime).isoformat()
                        })
                    elif item.is_dir():
                        items.append({
                            "name": item.name,
                            "path": str(item.relative_to(segment_dir)),
                            "type": "folder",
                            "children": build_tree(item)
                        })
            except PermissionError:
                pass
            return items
        
        file_tree = build_tree(segment_dir)
        
        return jsonify({
            "success": True,
            "segment_id": segment_id,
            "files": file_tree
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to access segment: {str(e)}"
        }), 500


@app.route('/api/download/<segment_id>/<path:file_path>', methods=['GET'])
def download_file(segment_id, file_path):
    """
    Download a file from a specific segment.
    
    Includes path sanitization to prevent directory traversal.
    """
    try:
        # Validate segment ID
        if not is_valid_segment_id(segment_id):
            return jsonify({
                "success": False,
                "error": "Invalid segment ID."
            }), 400
        
        segment_dir = UPLOAD_DIR / segment_id
        
        # Sanitize the requested file path
        safe_file_path = sanitize_path(segment_dir, file_path)
        if not safe_file_path or not safe_file_path.exists():
            return jsonify({
                "success": False,
                "error": "File not found."
            }), 404
        
        # Ensure it's a file, not a directory
        if not safe_file_path.is_file():
            return jsonify({
                "success": False,
                "error": "Invalid file path."
            }), 400
        
        # Send the file
        return send_file(
            safe_file_path,
            as_attachment=True,
            download_name=safe_file_path.name
        )
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Download failed: {str(e)}"
        }), 500


@app.route('/api/delete/<segment_id>/<path:file_path>', methods=['DELETE'])
def delete_file(segment_id, file_path):
    """
    Delete a file from a specific segment.
    
    Includes path sanitization.
    """
    try:
        # Validate segment ID
        if not is_valid_segment_id(segment_id):
            return jsonify({
                "success": False,
                "error": "Invalid segment ID."
            }), 400
        
        segment_dir = UPLOAD_DIR / segment_id
        
        # Sanitize the requested file path
        safe_file_path = sanitize_path(segment_dir, file_path)
        if not safe_file_path or not safe_file_path.exists():
            return jsonify({
                "success": False,
                "error": "File not found."
            }), 404
        
        # Ensure it's a file, not a directory
        if not safe_file_path.is_file():
            return jsonify({
                "success": False,
                "error": "Can only delete files, not directories."
            }), 400
        
        # Delete the file
        safe_file_path.unlink()
        
        return jsonify({
            "success": True,
            "message": f"File deleted successfully."
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Delete failed: {str(e)}"
        }), 500


@app.route('/api/segments', methods=['GET'])
def list_segments():
    """List all available segments."""
    try:
        segments = []
        if UPLOAD_DIR.exists():
            for item in sorted(UPLOAD_DIR.iterdir()):
                if item.is_dir() and is_valid_segment_id(item.name):
                    file_count = sum(1 for _ in item.rglob('*') if _.is_file())
                    segments.append({
                        "id": item.name,
                        "file_count": file_count
                    })
        
        return jsonify({
            "success": True,
            "segments": segments
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to list segments: {str(e)}"
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
