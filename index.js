class TrustedAccountsClient {
    constructor(
      clientId, 
      redirectUri, 
      authUrl = 'https://auth.trustedaccounts.org/oauth2/auth', 
      tokenUrl = 'https://auth.trustedaccounts.org/oauth2/token') {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.authUrl = authUrl; // Optionally allow the user to specify a custom auth URL
        this.tokenUrl = tokenUrl; // Optionally allow the user to specify a custom token URL
    }
  
    // Generate the verification link (OIDC authorization URL)
    generateVerificationLink(email) {
      const state = Math.random().toString(36).substring(2); // Generate a random state value
      const url = new URL(this.authUrl);
      url.searchParams.append('client_id', this.clientId);
      url.searchParams.append('redirect_uri', this.redirectUri);
      url.searchParams.append('response_type', 'token'); // Using Implicit Flow
      url.searchParams.append('scope', 'openid');
      url.searchParams.append('state', state);
      url.searchParams.append('email', email); // You can also pass other user details as necessary
  
      return url.toString();
    }
  
    // Handle the callback after the user completes the verification
    async handleCallback(url) {
      const urlParams = new URLSearchParams(new URL(url).hash.substring(1)); // Extract hash parameters from URL
      const idToken = urlParams.get('id_token');
  
      if (!idToken) {
        throw new Error('ID Token missing in callback URL');
      }
  
      // Decode the ID Token to extract the Trusted ID (sub claim)
      const trustedId = this.decodeIdToken(idToken);
      return trustedId;
    }
  
    // Decoding the ID Token and returning the sub claim
    decodeIdToken(idToken) {
      const base64Url = idToken.split('.')[1]; // Get the payload part of the JWT
      const base64 = base64Url.replace('-', '+').replace('_', '/'); // Base64URL decode
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      const decodedPayload = JSON.parse(jsonPayload);
  
      // Return the "sub" (user's unique Trusted ID)
      return decodedPayload.sub;
    }
}
  
module.exports = TrustedAccountsClient;