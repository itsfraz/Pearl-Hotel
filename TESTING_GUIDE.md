# 🧪 PEARL HOTEL - MANUAL TESTING GUIDE

## 📋 PRE-TESTING SETUP

### 1. Ensure Both Servers Are Running
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd client
npm start
```

### 2. Admin Credentials
```
Email: admin@pearlhotel.com
Password: adminpassword123
```

---

## ✅ TEST SUITE 1: AUTHENTICATION

### Test 1.1: User Registration ✓
**Steps:**
1. Navigate to `/register`
2. Fill in all fields:
   - First Name: Test
   - Last Name: User
   - Email: testuser@example.com
   - Password: Test123!
   - Phone: 1234567890
   - ID Type: Passport
   - ID Number: ABC123
3. Click "Register"

**Expected Result:**
- ✅ Success message appears
- ✅ Redirected to login or home page
- ✅ Token stored in localStorage

**Actual Result:** _____________

---

### Test 1.2: Login with Valid Credentials ✓
**Steps:**
1. Navigate to `/login`
2. Enter:
   - Email: admin@pearlhotel.com
   - Password: adminpassword123
3. Click "Login"

**Expected Result:**
- ✅ Success message
- ✅ Redirected to home page
- ✅ Navbar shows user name
- ✅ "Admin Panel" link visible (for admin)

**Actual Result:** _____________

---

### Test 1.3: Login with Invalid Credentials ✓
**Steps:**
1. Navigate to `/login`
2. Enter:
   - Email: wrong@example.com
   - Password: wrongpass
3. Click "Login"

**Expected Result:**
- ❌ Error message: "Invalid email or password"
- ❌ No redirect
- ❌ No token stored

**Actual Result:** _____________

---

### Test 1.4: Protected Route Access (Not Logged In) ✓
**Steps:**
1. Logout if logged in
2. Try to access `/admin` directly via URL

**Expected Result:**
- ❌ Redirected to `/login`
- ❌ Cannot access admin panel

**Actual Result:** _____________

---

### Test 1.5: Admin Access (Regular User) ✓
**Steps:**
1. Login as regular user (testuser@example.com)
2. Try to access `/admin`

**Expected Result:**
- ❌ Redirected to home page
- ❌ Cannot access admin features

**Actual Result:** _____________

---

### Test 1.6: Logout ✓
**Steps:**
1. Click "Logout" in navbar
2. Check localStorage

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Token removed from localStorage
- ✅ Navbar shows "Login" button

**Actual Result:** _____________

---

## ✅ TEST SUITE 2: ROOM MANAGEMENT (ADMIN)

### Test 2.1: View All Rooms ✓
**Steps:**
1. Login as admin
2. Navigate to `/rooms`

**Expected Result:**
- ✅ All rooms displayed
- ✅ Room cards show: name, type, price, capacity
- ✅ "Book Now" button visible

**Actual Result:** _____________

---

### Test 2.2: Create New Room ✓
**Steps:**
1. Login as admin
2. Go to Admin Panel → Rooms
3. Click "Add New Room"
4. Fill in:
   - Name: Deluxe Ocean Suite
   - Type: Deluxe
   - Room Number: 301
   - Price: 8000
   - Capacity: 3
   - Size: 500 sq ft
   - Bed Type: 1 King Bed
   - Description: Beautiful ocean view...
   - Amenities: Select WiFi, TV, AC
   - Features: Ocean view, Balcony
   - Images: /images/slider/hotel1.jpg
5. Click "Create Room"

**Expected Result:**
- ✅ Success message
- ✅ Room appears in list
- ✅ All fields saved correctly

**Actual Result:** _____________

---

### Test 2.3: Edit Room ✓
**Steps:**
1. In Admin Panel → Rooms
2. Click "Edit" on a room
3. Change price to 9000
4. Click "Update Room"

**Expected Result:**
- ✅ Room updated
- ✅ New price displayed

**Actual Result:** _____________

---

### Test 2.4: Delete Room ✓
**Steps:**
1. Click "Delete" on a room
2. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Room removed from list
- ✅ Room deleted from database

**Actual Result:** _____________

---

## ✅ TEST SUITE 3: BOOKING SYSTEM

### Test 3.1: Book a Room (Logged In) ✓
**Steps:**
1. Login as regular user
2. Go to `/rooms`
3. Click on a room
4. Click "Book Now"
5. Select dates:
   - Check-in: Tomorrow
   - Check-out: Day after tomorrow (2 nights)
6. Select 2 adults, 1 child
7. Click "Continue"
8. Review summary
9. Click "Complete Booking"

**Expected Result:**
- ✅ Nights calculated correctly (2 nights)
- ✅ Price = Room Price × 2 × Guest Multiplier
- ✅ Booking created successfully
- ✅ Success message shown

**Actual Result:** _____________

---

### Test 3.2: Apply Coupon Code ✓
**Steps:**
1. During booking (Step 2)
2. Enter coupon code (if available)
3. Click "Apply"

**Expected Result:**
- ✅ Discount applied
- ✅ Total price reduced
- ✅ Discount amount shown

**Actual Result:** _____________

---

### Test 3.3: View My Bookings ✓
**Steps:**
1. After booking, navigate to `/bookings` or profile

**Expected Result:**
- ✅ All user's bookings displayed
- ✅ Shows: room, dates, status, price

**Actual Result:** _____________

---

### Test 3.4: Cancel Booking ✓
**Steps:**
1. In bookings list
2. Click "Cancel" on a booking
3. Confirm cancellation

**Expected Result:**
- ✅ Confirmation dialog
- ✅ Booking status changes to "Cancelled"

**Actual Result:** _____________

---

### Test 3.5: Admin View All Bookings ✓
**Steps:**
1. Login as admin
2. Go to Admin Panel → Bookings

**Expected Result:**
- ✅ All bookings from all users visible
- ✅ Shows user name, room, dates, status
- ✅ Can cancel any booking

**Actual Result:** _____________

---

## ✅ TEST SUITE 4: USER MANAGEMENT (ADMIN)

### Test 4.1: View All Users ✓
**Steps:**
1. Login as admin
2. Go to Admin Panel → Users

**Expected Result:**
- ✅ All users listed
- ✅ Shows: name, email, role, join date

**Actual Result:** _____________

---

### Test 4.2: Promote User to Admin ✓
**Steps:**
1. In Users list
2. Find a regular user
3. Click "Make Admin"
4. Confirm

**Expected Result:**
- ✅ User role changes to Admin
- ✅ Badge shows "Admin"
- ✅ User can now access admin panel

**Actual Result:** _____________

---

### Test 4.3: Revoke Admin Rights ✓
**Steps:**
1. Find an admin user
2. Click "Revoke Admin"
3. Confirm

**Expected Result:**
- ✅ User role changes to Guest
- ✅ User loses admin panel access

**Actual Result:** _____________

---

## ✅ TEST SUITE 5: UI/UX & RESPONSIVENESS

### Test 5.1: Mobile View ✓
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone SE, iPad, Desktop

**Expected Result:**
- ✅ All pages responsive
- ✅ Navbar collapses to hamburger menu
- ✅ Forms stack vertically on mobile
- ✅ No horizontal scroll

**Actual Result:** _____________

---

### Test 5.2: Loading States ✓
**Steps:**
1. Check all pages for loading indicators
2. Slow down network (DevTools → Network → Slow 3G)

**Expected Result:**
- ✅ Spinners shown during data fetch
- ✅ Buttons show "Loading..." when processing
- ✅ No blank screens

**Actual Result:** _____________

---

## ✅ TEST SUITE 6: ERROR HANDLING

### Test 6.1: Network Error ✓
**Steps:**
1. Stop backend server
2. Try to login

**Expected Result:**
- ✅ Error message shown
- ✅ No crash
- ✅ User-friendly message

**Actual Result:** _____________

---

### Test 6.2: Invalid Form Data ✓
**Steps:**
1. Try to register with:
   - Empty email
   - Short password
   - Invalid email format

**Expected Result:**
- ✅ Validation errors shown
- ✅ Form not submitted
- ✅ Helpful error messages

**Actual Result:** _____________

---

## 📊 TEST RESULTS SUMMARY

| Test Suite | Total Tests | Passed | Failed |
|------------|-------------|--------|--------|
| Authentication | 6 | ___ | ___ |
| Room Management | 4 | ___ | ___ |
| Booking System | 5 | ___ | ___ |
| User Management | 3 | ___ | ___ |
| UI/UX | 2 | ___ | ___ |
| Error Handling | 2 | ___ | ___ |
| **TOTAL** | **22** | **___** | **___** |

---

## 🐛 BUGS FOUND DURING TESTING

| # | Bug Description | Severity | Steps to Reproduce |
|---|----------------|----------|-------------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## ✅ COMPETITION READINESS CHECKLIST

- [ ] All critical bugs fixed
- [ ] All features working
- [ ] UI is professional and polished
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states everywhere
- [ ] Error messages user-friendly
- [ ] Admin credentials documented
- [ ] README.md updated
- [ ] Code is clean and commented

---

**Tested By:** _____________  
**Date:** _____________  
**Overall Status:** ⬜ PASS  ⬜ FAIL  ⬜ NEEDS WORK
