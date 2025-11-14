/**
 * Admin Panel JavaScript
 * Handles authentication, gallery management, and CRUD operations
 */

(function() {
    'use strict';

    // Configuration
    const ADMIN_PASSWORD = 'sooji2024'; // In production, use proper authentication
    const STORAGE_KEY = 'admin_authenticated';
    const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

    // State
    let manifest = null;
    let currentFilter = 'all';
    let editingImageId = null;

    // DOM Elements
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminGalleryGrid = document.getElementById('adminGalleryGrid');
    const addImageBtn = document.getElementById('addImageBtn');
    const imageModal = document.getElementById('imageModal');
    const imageForm = document.getElementById('imageForm');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    const fileUploadArea = document.getElementById('fileUploadArea');

    /**
     * Initialize admin panel
     */
    function init() {
        // Check if already authenticated
        if (isAuthenticated()) {
            showAdminPanel();
        } else {
            showLoginScreen();
        }

        // Setup event listeners
        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        addImageBtn.addEventListener('click', openAddImageModal);
        modalClose.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        imageForm.addEventListener('submit', handleImageSubmit);
        categoryFilter.addEventListener('change', handleFilterChange);
        imageFile.addEventListener('change', handleFileSelect);

        // Setup drag and drop
        setupDragAndDrop();

        // Close modal on outside click
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });
    }

    /**
     * Check if user is authenticated
     */
    function isAuthenticated() {
        const authData = localStorage.getItem(STORAGE_KEY);
        if (!authData) return false;

        try {
            const { timestamp } = JSON.parse(authData);
            const now = Date.now();
            
            // Check if session has expired
            if (now - timestamp > SESSION_TIMEOUT) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Handle login form submission
     */
    function handleLogin(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (password === ADMIN_PASSWORD) {
            // Store authentication
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                timestamp: Date.now()
            }));
            
            showAdminPanel();
            loginError.textContent = '';
        } else {
            loginError.textContent = 'Incorrect password. Please try again.';
        }
    }

    /**
     * Handle logout
     */
    function handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem(STORAGE_KEY);
        showLoginScreen();
    }

    /**
     * Show login screen
     */
    function showLoginScreen() {
        loginScreen.style.display = 'flex';
        adminPanel.style.display = 'none';
        document.getElementById('adminPassword').value = '';
        loginError.textContent = '';
    }

    /**
     * Show admin panel
     */
    function showAdminPanel() {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        loadGallery();
    }

    /**
     * Load gallery data from manifest.json
     */
    async function loadGallery() {
        try {
            const response = await fetch('manifest.json');
            if (!response.ok) {
                throw new Error('Failed to load manifest.json');
            }
            manifest = await response.json();
            
            updateStats();
            populateCategoryFilters();
            renderGalleryItems();
        } catch (error) {
            console.error('Error loading gallery:', error);
            showMessage('Error loading gallery data', 'error');
            adminGalleryGrid.innerHTML = '<div class="loading-message" style="color: #dc3545;">Error loading gallery. Please refresh the page.</div>';
        }
    }

    /**
     * Update statistics
     */
    function updateStats() {
        document.getElementById('totalImages').textContent = manifest.images.length;
        document.getElementById('totalCategories').textContent = Object.keys(manifest.categories).length;
    }

    /**
     * Populate category filters
     */
    function populateCategoryFilters() {
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        // Populate modal category select
        const imageCategory = document.getElementById('imageCategory');
        imageCategory.innerHTML = '<option value="">Select Category</option>';

        Object.keys(manifest.categories).forEach(key => {
            const category = manifest.categories[key];
            
            // Add to filter dropdown
            const filterOption = document.createElement('option');
            filterOption.value = key;
            filterOption.textContent = category.name;
            categoryFilter.appendChild(filterOption);

            // Add to modal dropdown
            const modalOption = document.createElement('option');
            modalOption.value = key;
            modalOption.textContent = category.name;
            imageCategory.appendChild(modalOption);
        });
    }

    /**
     * Render gallery items
     */
    function renderGalleryItems() {
        adminGalleryGrid.innerHTML = '';

        const filteredImages = currentFilter === 'all' 
            ? manifest.images 
            : manifest.images.filter(img => img.category === currentFilter);

        if (filteredImages.length === 0) {
            adminGalleryGrid.innerHTML = '<div class="loading-message">No images found in this category.</div>';
            return;
        }

        filteredImages.forEach(image => {
            const item = createGalleryItem(image);
            adminGalleryGrid.appendChild(item);
        });
    }

    /**
     * Create a gallery item element
     */
    function createGalleryItem(image) {
        const div = document.createElement('div');
        div.className = 'admin-gallery-item';
        div.dataset.imageId = image.id;

        div.innerHTML = `
            <div class="admin-gallery-image">
                <img src="${image.path}" alt="${image.title}" loading="lazy">
                <span class="admin-gallery-category">${manifest.categories[image.category].name}</span>
            </div>
            <div class="admin-gallery-info">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
                <div class="admin-gallery-actions">
                    <button class="admin-btn-edit" data-id="${image.id}">✏️ Edit</button>
                    <button class="admin-btn-delete" data-id="${image.id}">🗑️ Delete</button>
                </div>
            </div>
        `;

        // Add event listeners
        div.querySelector('.admin-btn-edit').addEventListener('click', () => openEditImageModal(image));
        div.querySelector('.admin-btn-delete').addEventListener('click', () => handleDeleteImage(image));

        return div;
    }

    /**
     * Handle filter change
     */
    function handleFilterChange(e) {
        currentFilter = e.target.value;
        renderGalleryItems();
    }

    /**
     * Open add image modal
     */
    function openAddImageModal() {
        editingImageId = null;
        document.getElementById('modalTitle').textContent = 'Add New Image';
        imageForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
        imageModal.classList.add('active');
    }

    /**
     * Open edit image modal
     */
    function openEditImageModal(image) {
        editingImageId = image.id;
        document.getElementById('modalTitle').textContent = 'Edit Image';
        document.getElementById('imageId').value = image.id;
        document.getElementById('imageCategory').value = image.category;
        document.getElementById('imageTitle').value = image.title;
        document.getElementById('imageDescription').value = image.description;
        document.getElementById('imageAvailable').checked = image.available;

        // Show current image
        imagePreview.innerHTML = `<img src="${image.path}" alt="${image.title}">`;
        imagePreview.classList.add('active');

        imageModal.classList.add('active');
    }

    /**
     * Close modal
     */
    function closeModal() {
        imageModal.classList.remove('active');
        imageForm.reset();
        editingImageId = null;
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
    }

    /**
     * Handle file selection
     */
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            displayImagePreview(file);
        }
    }

    /**
     * Display image preview
     */
    function displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }

    /**
     * Setup drag and drop
     */
    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.style.borderColor = 'var(--primary-color)';
                fileUploadArea.style.background = 'rgba(99, 102, 241, 0.05)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, () => {
                fileUploadArea.style.borderColor = 'var(--border-color)';
                fileUploadArea.style.background = 'var(--bg-light)';
            }, false);
        });

        fileUploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                imageFile.files = files;
                handleFileSelect({ target: { files } });
            }
        }, false);
    }

    /**
     * Handle image form submission
     */
    function handleImageSubmit(e) {
        e.preventDefault();

        const formData = new FormData(imageForm);
        const imageData = {
            id: editingImageId || `${formData.get('category')}-${Date.now()}`,
            category: formData.get('category'),
            title: formData.get('title'),
            description: formData.get('description'),
            available: formData.get('available') === 'on'
        };

        if (editingImageId) {
            // Update existing image
            const index = manifest.images.findIndex(img => img.id === editingImageId);
            if (index !== -1) {
                // Keep the path if no new file uploaded
                imageData.path = manifest.images[index].path;
                manifest.images[index] = imageData;
                showMessage('Image updated successfully! Note: In a production environment, this would save to the server.', 'success');
            }
        } else {
            // Add new image
            const file = imageFile.files[0];
            if (!file) {
                showMessage('Please select an image file', 'error');
                return;
            }
            
            // In a real implementation, you would upload the file to the server
            // For this demo, we'll use a placeholder path
            imageData.path = `images/gallery/${imageData.category}/new-${Date.now()}.jpg`;
            manifest.images.push(imageData);
            showMessage('Image added successfully! Note: In a production environment, the file would be uploaded to the server.', 'success');
        }

        // Update display
        updateStats();
        renderGalleryItems();
        closeModal();

        // In a real implementation, you would save the manifest to the server
        console.log('Updated manifest:', manifest);
        showMessage('Changes saved locally. In production, run "node generate-manifest.js" to persist changes.', 'success');
    }

    /**
     * Handle delete image
     */
    function handleDeleteImage(image) {
        if (confirm(`Are you sure you want to delete "${image.title}"?`)) {
            const index = manifest.images.findIndex(img => img.id === image.id);
            if (index !== -1) {
                manifest.images.splice(index, 1);
                updateStats();
                renderGalleryItems();
                showMessage('Image deleted successfully! Note: In production, this would be saved to the server.', 'success');
                
                // In a real implementation, you would delete the file and update manifest on the server
                console.log('Updated manifest:', manifest);
            }
        }
    }

    /**
     * Show success/error message
     */
    function showMessage(text, type = 'success') {
        const message = document.createElement('div');
        message.className = `admin-message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
