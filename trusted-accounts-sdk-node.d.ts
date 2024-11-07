// trusted-accounts-sdk-node.d.ts
declare module 'trusted-accounts-sdk-node' {
    class TrustedAccountsClient {
      constructor(clientId: string, redirectUri: string, authUrl?: string, tokenUrl?: string);
  
      generateVerificationLink(email: string): Promise<string>;
      handleCallback(callbackUrl: string): Promise<string>;
    }
  
    export default TrustedAccountsClient;
}