// Quick API Test Script
// Run with: node test_api.js

const API_URL = 'http://localhost:5000/api';

console.log('🧪 PEARL HOTEL - API TESTING\n');
console.log('Testing critical endpoints...\n');

// Test 1: Get All Rooms
fetch(`${API_URL}/rooms`)
  .then(res => res.json())
  .then(data => {
    console.log('✅ GET /api/rooms - SUCCESS');
    console.log(`   Found ${data.length} rooms`);
  })
  .catch(err => {
    console.log('❌ GET /api/rooms - FAILED');
    console.log(`   Error: ${err.message}`);
  });

// Test 2: Register User (will fail if user exists, that's OK)
setTimeout(() => {
  fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'test123'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        console.log('✅ POST /api/auth/register - SUCCESS');
        console.log(`   User created with token`);
      } else {
        console.log('⚠️  POST /api/auth/register - User exists (OK)');
      }
    })
    .catch(err => {
      console.log('❌ POST /api/auth/register - FAILED');
      console.log(`   Error: ${err.message}`);
    });
}, 1000);

// Test 3: Login
setTimeout(() => {
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'test123'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        console.log('✅ POST /api/auth/login - SUCCESS');
        console.log(`   Token received`);
      } else {
        console.log('❌ POST /api/auth/login - FAILED');
        console.log(`   ${data.message}`);
      }
    })
    .catch(err => {
      console.log('❌ POST /api/auth/login - FAILED');
      console.log(`   Error: ${err.message}`);
    });
}, 2000);

console.log('\n⏳ Running tests...\n');

setTimeout(() => {
  console.log('\n✅ API Testing Complete!');
  console.log('\nFor full testing, use FINAL_TESTING_CHECKLIST.md');
}, 3000);
