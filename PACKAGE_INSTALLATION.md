# Package Installation Guide

## Quick Installation Commands

### Python Packages

#### Essential Packages
```bash
# Update pip first
python -m pip install --upgrade pip

# Install essential packages
pip install numpy pandas matplotlib requests pillow
```

#### Data Science & Machine Learning
```bash
# Data analysis
pip install numpy pandas scipy

# Visualization
pip install matplotlib seaborn plotly

# Machine Learning
pip install scikit-learn tensorflow keras pytorch

# Deep Learning
pip install transformers opencv-python
```

#### Web Development
```bash
# Web frameworks
pip install flask django fastapi

# Web scraping
pip install requests beautifulsoup4 selenium

# API development
pip install fastapi uvicorn pydantic
```

#### Utilities
```bash
# File handling
pip install openpyxl xlrd python-docx PyPDF2

# Date/Time
pip install python-dateutil pytz

# Configuration
pip install python-dotenv pyyaml
```

---

## Java Libraries (Maven/Gradle)

### Using Maven (pom.xml)
```xml
<dependencies>
    <!-- JSON processing -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
    
    <!-- HTTP client -->
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5.14</version>
    </dependency>
</dependencies>
```

### Manual JAR files
Download JARs and add to classpath:
- **Gson**: https://github.com/google/gson
- **Apache Commons**: https://commons.apache.org/

---

## Node.js/JavaScript Packages

### Already Installed (in package.json)
```bash
# These are already in the project
npm install  # Installs all dependencies
```

### Additional Useful Packages
```bash
# Utilities
npm install lodash axios moment

# Testing
npm install jest @testing-library/react

# State management
npm install zustand redux
```

---

## C/C++ Libraries

### Using MSYS2
```bash
# Open MSYS2 terminal
pacman -S mingw-w64-x86_64-boost
pacman -S mingw-w64-x86_64-opencv
pacman -S mingw-w64-x86_64-curl
```

### Manual Installation
Download headers and link libraries:
- **Boost**: https://www.boost.org/
- **OpenCV**: https://opencv.org/

---

## Go Packages

```bash
# HTTP router
go get github.com/gorilla/mux

# JSON
go get github.com/json-iterator/go

# Database
go get gorm.io/gorm
go get gorm.io/driver/sqlite

# Testing
go get github.com/stretchr/testify
```

---

## Common Python Packages by Category

### 1. Data Analysis
```bash
pip install pandas numpy scipy statsmodels
```

### 2. Visualization
```bash
pip install matplotlib seaborn plotly bokeh
```

### 3. Machine Learning
```bash
pip install scikit-learn xgboost lightgbm
```

### 4. Deep Learning
```bash
pip install tensorflow keras pytorch torchvision
```

### 5. Natural Language Processing
```bash
pip install nltk spacy transformers gensim
```

### 6. Computer Vision
```bash
pip install opencv-python pillow scikit-image
```

### 7. Web Scraping
```bash
pip install requests beautifulsoup4 selenium scrapy
```

### 8. Database
```bash
pip install sqlalchemy pymongo redis psycopg2
```

### 9. API Development
```bash
pip install flask django fastapi uvicorn
```

### 10. Testing
```bash
pip install pytest unittest2 mock
```

---

## Installing from requirements.txt

Create a `requirements.txt` file:
```txt
numpy==1.24.0
pandas==2.0.0
matplotlib==3.7.0
requests==2.31.0
```

Install all at once:
```bash
pip install -r requirements.txt
```

---

## Virtual Environments (Recommended)

### Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install packages
pip install numpy pandas

# Deactivate
deactivate
```

---

## Checking Installed Packages

### Python
```bash
pip list
pip show package_name
```

### Node.js
```bash
npm list
npm list -g  # Global packages
```

### Go
```bash
go list -m all
```

---

## Upgrading Packages

### Python
```bash
# Upgrade single package
pip install --upgrade package_name

# Upgrade all packages
pip list --outdated
pip install --upgrade pip setuptools wheel
```

### Node.js
```bash
# Update single package
npm update package_name

# Update all packages
npm update

# Check outdated
npm outdated
```

---

## Uninstalling Packages

### Python
```bash
pip uninstall package_name
pip uninstall -r requirements.txt  # Uninstall all
```

### Node.js
```bash
npm uninstall package_name
```

---

## Common Installation Issues

### Issue: pip not found
```bash
# Windows
python -m pip install package_name

# Or reinstall Python with pip
```

### Issue: Permission denied
```bash
# Use --user flag
pip install --user package_name

# Or use virtual environment (recommended)
```

### Issue: Package conflicts
```bash
# Create fresh virtual environment
python -m venv new_env
new_env\Scripts\activate
pip install package_name
```

---

## Package Sources

### Python
- **PyPI**: https://pypi.org/
- **Conda**: https://anaconda.org/

### Node.js
- **npm**: https://www.npmjs.com/

### Java
- **Maven Central**: https://search.maven.org/

### Go
- **Go Packages**: https://pkg.go.dev/

---

## Quick Reference

| Language | Install Command | List Packages | Uninstall |
|----------|----------------|---------------|-----------|
| Python | `pip install pkg` | `pip list` | `pip uninstall pkg` |
| Node.js | `npm install pkg` | `npm list` | `npm uninstall pkg` |
| Go | `go get pkg` | `go list -m all` | `go clean -modcache` |
| Java | Add to pom.xml/build.gradle | N/A | Remove from config |

---

Happy coding! 🎉
