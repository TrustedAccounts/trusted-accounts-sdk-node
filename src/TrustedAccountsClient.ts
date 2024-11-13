const axios = require('axios');
const qs = require('querystring');
const cryptoLib = require('crypto');  // Renamed to avoid conflicts
const { URL: NodeURL } = require('url');  // Renamed to avoid conflicts
const path = require('path');

interface Tokens {
  access_token: string;
  id_token: string;
  [key: string]: string;
}

class TrustedAccountsClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private authUrl: string;
  private tokenUrl: string;

  constructor(
    clientId: string, 
    clientSecret: string, 
    redirectUri: string, 
    authUrl: string = 'https://auth.trustedaccounts.org/oauth2/auth', 
    tokenUrl: string = 'https://auth.trustedaccounts.org/oauth2/token') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUrl = authUrl;
    this.tokenUrl = tokenUrl;
  }

  // Generate the authorization URL (OIDC Authorization Code Flow)
  public generateAuthorizationUrl(state?: string, nonce?: string): string {
    // If state or nonce is not provided, generate them
    const generatedState = state || this._generateRandomString();
    const generatedNonce = nonce || this._generateRandomString();

    const authUrl = new NodeURL(this.authUrl);
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('response_type', 'code'); // Using Authorization Code Flow
    authUrl.searchParams.append('scope', 'openid');
    authUrl.searchParams.append('state', generatedState);
    authUrl.searchParams.append('nonce', generatedNonce);

    // Return the URL for redirecting the user to the authorization server
    return authUrl.toString();
  }

  // Handle the callback and exchange the authorization code for tokens
  public async handleCallback(code: string): Promise<any> {
    // Ensure the authorization code is present
    if (!code) {
        throw new Error('Authorization code is missing');
    }

    // Exchange the authorization code for tokens
    const tokens = await this._exchangeCodeForTokens(code);
    const trusted_account = this.decodeIdToken(tokens.id_token);

    return trusted_account;
  }

  private async _exchangeCodeForTokens(code: string): Promise<Tokens> {
    const data = {
      grant_type: 'authorization_code',
      code: code,
      state: "asdfasdfsadf",  // Ensure this state matches the one used during authorization
      redirect_uri: this.redirectUri,
    };
  
    // Basic Authentication header: base64(client_id:client_secret)
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {  
      const response = await axios.post(this.tokenUrl, qs.stringify(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,  // Add Basic Auth header
        }
      });
  
      const tokens: Tokens = response.data;
      return tokens;
    } catch (error: any) {
      throw new Error('Error exchanging code for tokens: ' + error.message);
    }
  }
  

  // Helper method to generate a random string
  private _generateRandomString(length: number = 32): string {
    return cryptoLib.randomBytes(length).toString('hex');
  }

  // Helper method to decode the ID token
  public decodeIdToken(idToken: string): any {
    const base64Url = idToken.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace('-', '+').replace('_', '/'); // Base64URL decode
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8'); // Decode base64 to string
    const decodedPayload = JSON.parse(jsonPayload);

    // Return the "sub" (user's unique Trusted ID)
    return decodedPayload;
  }
}

module.exports = TrustedAccountsClient;
export = TrustedAccountsClient;