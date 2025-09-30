// Simple Vercel Test
const https = require('https');

const url = 'https://luxbyte-impdoccyd-amir-saids-projects-035bbecd.vercel.app';

console.log('🧪 Testing Vercel deployment...\n');

https.get(url, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`✅ Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ Response length: ${data.length} characters`);
    console.log(`✅ Contains 'LUXBYTE': ${data.includes('LUXBYTE')}`);
    console.log(`✅ Contains 'index.html': ${data.includes('index.html')}`);

    if (res.statusCode === 200) {
      console.log('\n🎉 SUCCESS: Site is working!');
    } else {
      console.log('\n❌ FAILED: Site returned error status');
    }
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});
