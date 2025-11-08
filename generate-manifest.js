#!/usr/bin/env node
/**
 * Gallery Manifest Generator
 * Scans images/gallery/ folders and creates a manifest.json file
 * with all images organized by category
 */

const fs = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, 'images', 'gallery');
const OUTPUT_FILE = path.join(__dirname, 'manifest.json');

// Category configuration with display names and descriptions
const CATEGORIES = {
  'wedding': {
    name: 'Wedding Gown',
    description: 'Custom wedding gown'
  },
  'lehenga': {
    name: 'Partywear Lehenga',
    description: 'Elegant partywear lehenga'
  },
  'blouse': {
    name: 'Bridal Ariwork Blouse',
    description: 'Stunning bridal blouse with intricate handwork'
  },
  'kids': {
    name: 'Kids Birthday Frock',
    description: 'Adorable custom birthday frock'
  },
  'dhavani': {
    name: 'Dhavani Design',
    description: 'Traditional dhavani set with contemporary styling'
  },
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Latest collection'
  }
};

/**
 * Check if a file is an image based on extension
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}

/**
 * Generate a title from filename
 */
function generateTitle(filename, category) {
  const nameWithoutExt = path.parse(filename).name;
  const categoryInfo = CATEGORIES[category];
  
  // Extract number from filename if present
  const match = nameWithoutExt.match(/\d+/);
  const number = match ? match[0] : '';
  
  return `${categoryInfo.name} ${number}`.trim();
}

/**
 * Scan a category folder and return image metadata
 */
function scanCategory(category) {
  const categoryPath = path.join(GALLERY_DIR, category);
  
  if (!fs.existsSync(categoryPath)) {
    console.warn(`Warning: Category folder not found: ${category}`);
    return [];
  }
  
  const files = fs.readdirSync(categoryPath);
  const images = files
    .filter(isImageFile)
    .sort() // Sort alphabetically
    .map((filename, index) => {
      const relativePath = `images/gallery/${category}/${filename}`;
      return {
        id: `${category}-${index + 1}`,
        category: category,
        path: relativePath,
        title: generateTitle(filename, category),
        description: CATEGORIES[category].description,
        available: true
      };
    });
  
  return images;
}

/**
 * Main function to generate manifest
 */
function generateManifest() {
  console.log('🎨 Generating gallery manifest...\n');
  
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    categories: CATEGORIES,
    images: []
  };
  
  // Scan each category
  for (const category of Object.keys(CATEGORIES)) {
    console.log(`📂 Scanning ${category}...`);
    const images = scanCategory(category);
    manifest.images.push(...images);
    console.log(`   Found ${images.length} images`);
  }
  
  // Write manifest to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  
  console.log(`\n✅ Manifest generated successfully!`);
  console.log(`📄 Total images: ${manifest.images.length}`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);
}

// Run the generator
try {
  generateManifest();
} catch (error) {
  console.error('❌ Error generating manifest:', error.message);
  process.exit(1);
}
