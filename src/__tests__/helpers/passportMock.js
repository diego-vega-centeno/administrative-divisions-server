import passport from 'passport';

let originalGoogleStrategy = null;

// Mock Google OAuth strategy for testing
// This simulates the authenticated response from google
// Use req.query.code to simulate failure or success response

// In the type def the passport.use supports an object
const mockGoogleStrategy = {
  name: 'google',

  authenticate: function (req) {
    const CALLBACK_URL = process.env.NODE_ENV === 'development' ? process.env.CALLBACK_DEV_GOOGLE_URL : process.env.CALLBACK_PROD_GOOGLE_URL;
    const FRONTEND_URL = process.env.NODE_ENV === 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_DEV_PROD;
    // Check if this is the callback route (has code parameter)
    if (req.query && req.query.code) {
      const mockUser = {
        id: 1,
        email: 'test_user@test.com',
        name: 'test_user_name',
        oauth_id: 'google-test_user'
      };

      switch (req.query.code) {
        case 'oauth_failed':
          this.redirect(FRONTEND_URL + `?error=${req.query.code}`);
          break;
        case 'oauth_succeeded':
          this.success(mockUser);
          break;
        default:
          this.success(mockUser);
      }
    } else {
      // For initial OAuth request, redirect to Google OAuth URL
      const googleOAuthUrl = 'https://accounts.google.com/oauth/authorize?' +
        'response_type=code&' +
        'client_id=mock_client_id&' +
        'redirect_uri=' + encodeURIComponent(CALLBACK_URL) + '&' +
        'scope=profile%20email&' +
        'prompt=select_account';

      this.redirect(googleOAuthUrl);
    }
  }
};

// Helper to capture and install mock strategy
export function installMockGoogleStrategy() {
  // Capture original strategy before replacing it
  originalGoogleStrategy = passport._strategies['google'] || null;
  passport.unuse('google');

  // Install mock strategy
  passport.use('google', mockGoogleStrategy);
}

// Restore original strategy
export function restoreOriginalGoogleStrategy() {
  // Remove mock strategy
  passport.unuse('google');

  // Restore original strategy if it existed
  if (originalGoogleStrategy) {
    passport.use('google', originalGoogleStrategy);
    originalGoogleStrategy = null;
  }
}