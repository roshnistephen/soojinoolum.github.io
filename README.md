# SOOJI_NOOLUM - Custom Apparel & Clothing

A professional website showcasing custom apparel and clothing designs with a dynamic gallery system.

## 🎨 Features

- **Dynamic Gallery**: Automatically loads images from organized category folders
- **Category Filtering**: Filter by Wedding Gown, Partywear Lehenga, Bridal Ariwork Blouse, Kids Birthday Frock, Dhavani Design, and New Arrivals
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Professional Styling**: Modern UI with smooth animations and transitions
- **Proper Image Display**: All images are fully focused using object-fit cover

## 📁 Gallery Structure

Images are organized in the following structure:

```
images/
  gallery/
    ├── wedding/         # Wedding gown images
    ├── lehenga/         # Partywear lehenga images
    ├── blouse/          # Bridal ariwork blouse images
    ├── kids/            # Kids birthday frock images
    ├── dhavani/         # Dhavani design images
    └── new-arrivals/    # Latest collection images
```

## 🔄 Updating the Gallery

When you add new images to any category folder:

1. Make sure Node.js is installed on your system
2. Run the manifest generator script:
   ```bash
   node generate-manifest.js
   ```
3. This will scan all category folders and update `manifest.json`
4. The gallery page will automatically load the new images

## 🖼️ Adding New Images

1. Place your images in the appropriate category folder under `images/gallery/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
3. Use descriptive filenames (e.g., `wedding-01.jpg`, `lehenga-02.jpg`)
4. Run `node generate-manifest.js` to update the manifest
5. Refresh the gallery page to see your new images

## 🎯 Adding New Categories

To add a new category:

1. Create a new folder under `images/gallery/`
2. Update the `CATEGORIES` object in `generate-manifest.js`:
   ```javascript
   'category-name': {
     name: 'Display Name',
     description: 'Category description'
   }
   ```
3. Run `node generate-manifest.js` to regenerate the manifest
4. The new category will automatically appear in the gallery filters

## 🚀 Development

### Local Testing

To test the website locally:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx http-server -p 8080
```

Then open your browser to `http://localhost:8080`

## 📝 File Structure

- `index.html` - Home page
- `gallery.html` - Dynamic gallery page
- `about.html` - About us page
- `contact.html` - Contact page
- `style.css` - Global styles (unchanged)
- `script.js` - Common JavaScript (unchanged)
- `generate-manifest.js` - Gallery manifest generator
- `manifest.json` - Generated gallery data (auto-generated)

## 🎨 Technologies

- HTML5
- CSS3 with CSS Variables
- Vanilla JavaScript (ES6+)
- Node.js (for manifest generation)

## 👤 Developer

Designed and Developed by [Roshni Stephen](https://linkedin.com/in/roshni-a-s-545a6215a/)

## 📞 Contact

Contact: +91 98765 43210
