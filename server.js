import express from "express";
import multer from "multer";
import { analyzeCalories } from "./ai.js";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (for CSS/JS if needed)
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main page with upload form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🍎 Food Calorie Analyzer</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 600px;
                width: 100%;
                text-align: center;
            }
            
            h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            
            .upload-area {
                border: 3px dashed #667eea;
                border-radius: 15px;
                padding: 40px 20px;
                margin: 30px 0;
                cursor: pointer;
                transition: all 0.3s ease;
                background: #f8f9ff;
            }
            
            .upload-area:hover {
                border-color: #764ba2;
                background: #f0f2ff;
            }
            
            .upload-area.dragover {
                border-color: #764ba2;
                background: #e8ebff;
                transform: scale(1.02);
            }
            
            .upload-icon {
                font-size: 4em;
                margin-bottom: 15px;
                color: #667eea;
            }
            
            .upload-text {
                font-size: 1.2em;
                color: #333;
                margin-bottom: 10px;
            }
            
            .upload-subtext {
                color: #666;
                font-size: 0.9em;
            }
            
            input[type="file"] {
                display: none;
            }
            
            .analyze-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 40px;
                border-radius: 30px;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
                display: none;
            }
            
            .analyze-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            
            .analyze-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .preview-container {
                margin: 20px 0;
                display: none;
            }
            
            .preview-image {
                max-width: 100%;
                max-height: 300px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .result {
                margin-top: 30px;
                padding: 20px;
                background: #f8f9ff;
                border-radius: 15px;
                display: none;
                text-align: left;
            }
            
            .result h3 {
                color: #333;
                margin-bottom: 15px;
            }
            
            .loading {
                display: none;
                margin: 20px 0;
            }
            
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .selected-file {
                color: #667eea;
                font-weight: bold;
                margin: 10px 0;
            }
            
            @media (max-width: 600px) {
                .container {
                    padding: 20px;
                    margin: 10px;
                }
                
                h1 {
                    font-size: 2em;
                }
                
                .upload-area {
                    padding: 30px 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🍎 Food Calorie Analyzer</h1>
            <p class="subtitle">Upload a photo of your food and get instant calorie analysis powered by AI</p>
            
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="upload-area" id="uploadArea">
                    <div class="upload-icon">📸</div>
                    <div class="upload-text">Click to upload or drag and drop</div>
                    <div class="upload-subtext">Supports JPG, PNG, GIF up to 10MB</div>
                    <input type="file" id="photoInput" name="photo" accept="image/*" required>
                </div>
                
                <div class="selected-file" id="selectedFile"></div>
                
                <div class="preview-container" id="previewContainer">
                    <img id="previewImage" class="preview-image" alt="Preview">
                </div>
                
                <button type="submit" class="analyze-btn" id="analyzeBtn">
                    🔍 Analyze Calories
                </button>
            </form>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Analyzing your food image with AI...</p>
            </div>
            
            <div class="result" id="result">
                <h3>📊 Analysis Results:</h3>
                <div id="resultContent"></div>
            </div>
        </div>
        
        <script>
            const uploadArea = document.getElementById('uploadArea');
            const photoInput = document.getElementById('photoInput');
            const analyzeBtn = document.getElementById('analyzeBtn');
            const selectedFile = document.getElementById('selectedFile');
            const previewContainer = document.getElementById('previewContainer');
            const previewImage = document.getElementById('previewImage');
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            const resultContent = document.getElementById('resultContent');
            const uploadForm = document.getElementById('uploadForm');
            
            // Click to upload
            uploadArea.addEventListener('click', () => {
                photoInput.click();
            });
            
            // Drag and drop functionality
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    photoInput.files = files;
                    handleFileSelect();
                }
            });
            
            // File input change
            photoInput.addEventListener('change', handleFileSelect);
            
            function handleFileSelect() {
                const file = photoInput.files[0];
                if (file) {
                    selectedFile.textContent = \`Selected: \${file.name}\`;
                    analyzeBtn.style.display = 'inline-block';
                    
                    // Show preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewImage.src = e.target.result;
                        previewContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                    
                    // Hide previous results
                    result.style.display = 'none';
                }
            }
            
            // Form submission
            uploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!photoInput.files[0]) {
                    alert('Please select an image first!');
                    return;
                }
                
                // Show loading
                analyzeBtn.disabled = true;
                loading.style.display = 'block';
                result.style.display = 'none';
                
                // Prepare form data
                const formData = new FormData();
                formData.append('photo', photoInput.files[0]);
                
                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Show results
                        resultContent.innerHTML = \`
                            <p><strong>🍽️ Analysis:</strong></p>
                            <pre style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; white-space: pre-wrap; font-family: inherit;">\${data.estimatedCalories}</pre>
                            <p><strong>📁 File:</strong> \${data.filename}</p>
                            <p><strong>⏰ Analyzed at:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
                        \`;
                        result.style.display = 'block';
                    } else {
                        resultContent.innerHTML = \`
                            <p style="color: #e74c3c;"><strong>❌ Error:</strong> \${data.error || 'Failed to analyze image'}</p>
                            \${data.message ? \`<p><strong>Details:</strong> \${data.message}</p>\` : ''}
                        \`;
                        result.style.display = 'block';
                    }
                } catch (error) {
                    resultContent.innerHTML = \`
                        <p style="color: #e74c3c;"><strong>❌ Network Error:</strong> Failed to connect to server</p>
                        <p><strong>Details:</strong> \${error.message}</p>
                    \`;
                    result.style.display = 'block';
                }
                
                // Hide loading
                loading.style.display = 'none';
                analyzeBtn.disabled = false;
            });
        </script>
    </body>
    </html>
  `);
});

app.post("/api/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Processing image: ${req.file.originalname}, Size: ${req.file.size} bytes`);

    // Call Bedrock
    const result = await analyzeCalories(req.file.buffer, req.file.mimetype);

    return res.json({
      estimatedCalories: result,
      filename: req.file.originalname,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Bedrock error:", err);
    res.status(500).json({ 
      error: "Failed to analyze image",
      message: err.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🍎 Food Analyzer available at http://localhost:${PORT}`);
});
