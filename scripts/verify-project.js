const fs = require('fs');
const path = require('path');

const root = process.cwd();

const requiredFiles = [
  {
    path: 'pages/business/[business].jsx',
    reason: 'Required for /business/dorato, /business/bastani, /business/barial, and all other business profile pages.',
  },
  {
    path: 'pages/collections/[id].jsx',
    reason: 'Required for dynamic collection URLs such as /collections/1, /collections/2, and API-backed business pages.',
  },
  {
    path: 'pages/restaurant.jsx',
    reason: 'Required for the Melal restaurant page.',
  },
  {
    path: 'src/components/BusinessProfilePage.jsx',
    reason: 'Required to render business profile pages.',
  },
  {
    path: 'src/components/RestaurantPage.jsx',
    reason: 'Required to render the restaurant page.',
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
