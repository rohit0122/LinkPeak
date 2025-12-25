# Payment Provider Configuration
# Set to 'mock' for testing or 'razorpay' for production
PAYMENT_PROVIDER=mock

# Mock Provider Settings (for testing)
MOCK_PAYMENT_BASE_URL=http://localhost:3000/api/mock/razorpay
MOCK_WEBHOOK_SECRET=mock_webhook_secret_change_in_production

# Razorpay Credentials (for production)
# Get these from https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# Application URL (for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
