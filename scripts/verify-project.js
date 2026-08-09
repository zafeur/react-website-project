const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredFiles = [
  {
    path: 'pages/collections/[id].jsx',
    reason: 'Required for all collection-backed business profile pages.',
  },
  {
    path: 'src/components/BusinessProfilePage.jsx',
    reason: 'Required to render business profile pages.',
  },
  {
    path: 'src/components/BusinessProfileEmptyState.jsx',
    reason: 'Required to render empty business placeholders until API data exists.',
  },
  {
    path: 'src/components/BusinessProfileEmptyState.css',
    reason: 'Required to style empty business placeholders until API data exists.',
  },
  {
    path: 'src/data/siteData.js',
    reason: 'Required for business data, aliases, and route matching.',
  },
];

const missing = requiredFiles.filter((item) => !fs.existsSync(path.join(root, item.path)));

if (missing.length) {
  console.error('\nProject verification failed.\n');
  console.error('These required files are missing:\n');
  missing.forEach((item) => {
    console.error(`- ${item.path}`);
    console.error(`  ${item.reason}`);
  });
  console.error('\nBusiness pages will return 404 until these files are restored.\n');
  process.exit(1);
}

console.log('Project verification passed.');
