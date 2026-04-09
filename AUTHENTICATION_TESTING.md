# Login & Registration Testing Guide with Notifications

## Overview
You now have:
✅ Enhanced error handling with validation
✅ Visible notification popups (top-right corner)
✅ Console logging for debugging
✅ Better UX with success/error feedback

## Demo Credentials
```
Email: alice@example.com
Password: password123
Role: candidate
```

OR
```
Email: bob@example.com
Password: password123
Role: referrer
```

## Testing Steps

### 1. **Start the Backend (if not running)**
```bash
cd server
npm run dev
```
Expected: "✅ Backend running on port 5000"

### 2. **Start the Frontend**
```bash
cd client
npm run dev
```
Expected: Frontend loads at http://localhost:3000

### 3. **Test Login with Valid Credentials**
1. Navigate to http://localhost:3000/login
2. Enter: alice@example.com / password123
3. Click "Login"
4. **Expected Result:**
   - ✅ Green success notification: "✅ Login successful! Redirecting..."
   - Page redirects to /dashboard/candidate within 500ms
   - User logged in successfully

### 4. **Test Login with Invalid Email**
1. Navigate to http://localhost:3000/login
2. Enter: invalid@example.com
3. Click "Login"
4. **Expected Result:**
   - ❌ Red error notification: "❌ Invalid email or password"
   - Form stays on login page
   - No redirect

### 5. **Test Login with Invalid Password**
1. Navigate to http://localhost:3000/login
2. Enter: alice@example.com / wrongpassword
3. Click "Login"
4. **Expected Result:**
   - ❌ Red error notification: "❌ Invalid email or password"
   - Form stays on login page

### 6. **Test Login Form Validation**
1. Click "Login" without entering anything
2. **Expected Result:**
   - ❌ Red error notification: "❌ Please enter both email and password"

### 7. **Test Invalid Email Format**
1. Enter: notanemail
2. Enter password: password123
3. Click "Login"
4. **Expected Result:**
   - ❌ Red error notification: "❌ Please enter a valid email address"

### 8. **Test Registration with Valid Data**
1. Navigate to http://localhost:3000/register
2. Enter: newtester@example.com
3. Enter password: password123
4. Select role: "candidate"
5. Click "Register"
6. **Expected Result:**
   - ✅ Green success notification: "✅ Registration successful! Setting up your profile..."
   - Page redirects to /onboarding/candidate

### 9. **Test Registration Form Validation**
1. Try registering with password length < 6
2. **Expected Result:**
   - ❌ Red error notification: "❌ Password must be at least 6 characters"

### 10. **Test Notification Auto-Dismiss**
1. Trigger any notification
2. **Expected Result:**
   - Notification appears in top-right corner
   - Automatically disappears after 5 seconds
   - Can be manually dismissed by clicking × button

## Notification System Features

### Visual Feedback
- **Success** (Green): Login/registration successful
- **Error** (Red): Validation errors, login failures
- **Info** (Blue): General information messages
- **Warning** (Orange): Warning messages

### Location
- Fixed in top-right corner
- Responsive design (centered on mobile)
- Non-intrusive with smooth animations

### Auto-Dismiss
- Default: 5 seconds
- Manual close: Click × button
- Stack multiple notifications if needed

## Debugging

### Check Browser Console (F12)
```javascript
// You'll see:
Login error: Error message details
Register error: Error message details
```

### Check Network Tab (F12)
1. Open DevTools → Network tab
2. Attempt login
3. Click "XHR" filter
4. Check POST /api/auth/login response
5. Should see: `{ token: "...", user: {...} }`

### Check Backend Logs
Look at terminal where `npm run dev` is running:
- Should see login attempts
- Should see token generation
- Any errors will be logged

## Expected Behavior Summary

| Action | Button State | Notification | Navigation |
|--------|-------------|--------------|------------|
| Valid login | Disabled during request | ✅ Green success | → Dashboard |
| Invalid login | Disabled during request | ❌ Red error | Stay on page |
| Valid register | Disabled during request | ✅ Green success | → Onboarding |
| Invalid register | Disabled during request | ❌ Red error | Stay on page |
| Validation fail | Enabled | ❌ Red error | Stay on page |

## If Something Doesn't Work

### Symptom: Notifications not showing
- Check: Is NotificationContainer imported in App.jsx?
- Check: Is NotificationProvider wrapping children?
- Solution: Clear browser cache (Ctrl+Shift+Delete)

### Symptom: Login fails silently
- Check browser console (F12) for errors
- Check Network tab for API response
- Verify backend is running on port 5000
- Verify MongoDB is running

### Symptom: Token not persisting
- Check: localStorage has 'token' key
- Open DevTools → Applications → LocalStorage
- Should see token value after login

### Symptom: Can't redirect to dashboard
- Check: Browser console for routing errors
- Verify user object has required fields
- Check: Protected routes configuration

## Next Steps After Testing

1. ✅ Verify login works with notifications
2. ✅ Verify registration works
3. ✅ Test profile editing in EditProfile.jsx
4. ✅ Test referral workflow
5. ✅ Test match discovery features

Good luck! 🚀
