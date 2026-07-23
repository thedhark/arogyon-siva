const fs = require('fs');
const path = require('path');

const catDir = 'app/packages/category';
const detailDir = 'app/packages/detail';
const detailTemplatePath = path.join(detailDir, '[packageId].tsx');

if (!fs.existsSync(detailTemplatePath)) {
  console.log('Error: Detail template not found!');
  process.exit(1);
}

const templateContent = fs.readFileSync(detailTemplatePath, 'utf8');
const files = fs.readdirSync(catDir).filter(f => f.endsWith('.tsx'));

let generatedSlugs = new Map(); // using Map to store unique slugs and their titles

files.forEach(file => {
  const filePath = path.join(catDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/id:\s*'p\d+',\s*title:\s*'([^']+)'/g, (match, title) => {
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/1 x /g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
      
    generatedSlugs.set(slug, title);
    return `id: '${slug}',
        title: '${title}'`;
  });

  fs.writeFileSync(filePath, content);
});

console.log('Generated slugs:', Array.from(generatedSlugs.entries()));

// Now generate the detail screens
generatedSlugs.forEach((title, slug) => {
  const componentName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Screen';
  
  let newDetail = templateContent.replace('export default function PackageDetailScreen() {', `export default function ${componentName}() {`);
  
  // Replace the hardcoded title in the template with the specific title
  newDetail = newDetail.replace(/title:\s*'Complete Pregnancy Package',/, `title: '${title}',`);
  
  // Replace useLocalSearchParams since packageId isn't there anymore
  newDetail = newDetail.replace(/const { packageId } = useLocalSearchParams\(\);/, '');
  
  // Replace references to packageId in checkout router push with the static slug
  newDetail = newDetail.replace(/router\.push\(`\/packages\/checkout\/\$\{packageId\}` as any\)/, `router.push(\`/packages/checkout/${slug}\` as any)`);
  
  // Save to detail directory
  fs.writeFileSync(path.join(detailDir, slug + '.tsx'), newDetail);
});

// Remove generic template
fs.unlinkSync(detailTemplatePath);

console.log('Refactoring complete!');
