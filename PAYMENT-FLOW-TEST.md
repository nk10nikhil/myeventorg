# Payment Flow Testing Guide

## 🔧 Fixes Applied

### 1. **Script Loading Issues**

- ✅ Fixed duplicate Razorpay script loading
- ✅ Added promise-based script loader with checks
- ✅ Prevents multiple script tags from being added

### 2. **Null Reference Errors**

- ✅ Added null checks for `event` object before accessing `event.ticketPrice`
- ✅ Validates event data is loaded before initiating payment
- ✅ Added proper error messages when event data is missing

### 3. **Payment Flow**

- ✅ Proper async/await handling in payment verification
- ✅ Error handling in Razorpay handler callback
- ✅ Loading states properly managed throughout the flow

### 4. **Logging & Debugging**

- ✅ Added comprehensive console logging for debugging
- ✅ Logs show: registration → order creation → payment → verification
- ✅ All errors are now properly logged with context

### 5. **Razorpay Configuration**

- ✅ Validates Razorpay keys are configured
- ✅ Shows clear error messages if keys are missing
- ✅ Logs key configuration status

## 🧪 How to Test the Payment Flow

### Step 1: Verify Environment Setup

```bash
# Check your .env file has these:
RAZORPAY_KEY_ID=rzp_test_Ny11uTWgNKU2OD
RAZORPAY_KEY_SECRET=wvugWmCAFWdWHQ6dWMatd6mC
```

### Step 2: Restart Dev Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### Step 3: Open Browser Console

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Clear console (Ctrl+L)

### Step 4: Register for Event

1. Go to http://localhost:3000
2. Click on any event
3. Fill registration form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Date of Birth: 01/01/2000
   - Password: test123
   - Confirm Password: test123

4. Click **"Register & Pay"**

### Step 5: Watch Console Logs

You should see this sequence:

```
[Register] Starting registration for: test@example.com
[Register] User registered: <user-id>
[Payment] Initiating payment for user: <user-id>
[Payment] Event loaded: <event-name> Price: <price>
[Payment] Creating order for: {eventId: ..., userId: ...}
[Payment] Event found: {name: ..., price: ...}
[Payment] Razorpay keys configured: {key_id: "Yes", key_secret: "Yes"}
[Payment] Order created successfully: <order-id>
```

### Step 6: Razorpay Modal

✅ **Razorpay payment modal should appear!**

It will show:

- Event name
- Amount
- Payment options (Card, UPI, NetBanking, etc.)

### Step 7: Make Test Payment

Use these test credentials:

**Card:**

- Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Name: Any name

**Or UPI:**

- VPA: `success@razorpay`

### Step 8: After Payment

Watch console for:

```
[Payment] Verifying payment: {orderId: ..., paymentId: ..., userId: ...}
[Payment] Signature verified, generating QR...
[Payment] Ticket created: <ticket-id>
[Payment] Verification complete
```

Then you should:

- See "Payment successful! Ticket generated. Redirecting..." toast
- Be redirected to dashboard
- See your ticket with QR code

## 🐛 Troubleshooting

### Issue: Razorpay Modal Not Showing

**Check console for:**

```
[Payment] Razorpay keys configured: {key_id: "No", key_secret: "No"}
```

**Fix:** Add keys to `.env` file

**Or:**

```
Failed to load payment gateway
```

**Fix:** Check internet connection (Razorpay script loads from CDN)

### Issue: "Event details not loaded"

**Check console for:**

```
[Payment] Event loaded: undefined Price: undefined
```

**Fix:**

- Wait for event to load before clicking Pay
- Refresh the page and try again
- Check if event exists in database

### Issue: Invalid payment signature

**Check:**

- Razorpay keys match (test with test, live with live)
- No extra spaces in `.env` file
- Keys are complete and not truncated

### Issue: Payment succeeds but no ticket created

**Check console for:**

```
[Payment] Ticket created: <ticket-id>
```

If missing, check MongoDB connection in `.env`

## ✅ Success Indicators

**Payment flow is working if you see:**

1. ✅ Razorpay modal appears
2. ✅ Payment options visible (Card, UPI, etc.)
3. ✅ After payment, success toast shows
4. ✅ Redirected to dashboard
5. ✅ Ticket visible with QR code
6. ✅ All console logs appear in sequence

## 📊 Expected Console Output (Full Flow)

```
[Register] Starting registration for: test@example.com
[Register] User registered: 698f3c1518eba17774aea50d
[Payment] Initiating payment for user: 698f3c1518eba17774aea50d
[Payment] Event loaded: Tech Conference 2026 Price: 500
[Payment] Creating order for: {eventId: "698f3c151...", userId: "698f3c151..."}
[Payment] Event found: {name: "Tech Conference 2026", price: 500}
[Payment] Razorpay keys configured: {key_id: "Yes", key_secret: "Yes"}
[Payment] Order created successfully: order_NbPxqzqRvX3gKb
[Payment] Verifying payment: {orderId: "order_Nb...", paymentId: "pay_Nb...", userId: "698f..."}
[Payment] Signature verified, generating QR...
[Payment] Ticket created: 698f3c1518eba17774aea50f
[Payment] Email sending failed: [Error details] (optional - doesn't stop flow)
[Payment] Verification complete
```

## 🎯 Next Steps After Successful Test

1. **Test Multiple Users**: Register different users to verify system handles concurrent usage
2. **Test Email**: Configure EMAIL settings in `.env` to receive ticket emails
3. **Test Dashboard**: Verify tickets appear correctly
4. **Test QR Scanner**: Use admin scanner to validate QR codes
5. **Test Offline Mode**: Disconnect internet during scanning (admin page)

## 📝 Notes

- All logs are prefixed with context: `[Register]`, `[Payment]`
- Errors include stack traces for easy debugging
- Email failures won't stop ticket creation (non-blocking)
- Test mode is completely removed - full Razorpay integration active
