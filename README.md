# Trusted Accounts SDK for Node.js

The **Trusted Accounts Node SDK** allows you to integrate **user verification** and **validation** into your Node.js application with minimal setup. It supports the **OIDC flow**, **dynamic redirects**, and **session management**.

## Installation

```bash
npm install --save trusted-accounts-sdk-node
```

### Setup
Get your platform credentials by creating a free developer account here: [**developer console**](https://developers.trustedaccounts.org/).

```typescript
import TrustedAccountsSDK from 'trusted-accounts-sdk-node';

const taClient = new TrustedAccountsSDK({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'YOUR_REDIRECT_URL'
});
```

### Example Usage

#### Start the Validation Flow.

```typescript
import TrustedAccountsClient from 'trusted-accounts-sdk-node';

app.get('/start-verification', async (req, res) => {
    const trustedClient = new TrustedAccountsClient(
      "CLIENT_ID", // Your Client ID
      "REDIRECT_URL" // Your Redirect URI
    );

    // Generate the verification URL
    const verificationUrl = await trustedClient.generateVerificationLink(
        'foo@bar.com', // The email of the user you want to validate
    );
   
    // Redirect the user to the verification page 
    // or create a verification button to trigger it manually
    res.redirect(verificationUrl);
});
```

### Handle the Callback

```typescript
app.get('/callback', async (req, res) => {
  const trustedCallback = await taClient.handleCallback(req.originalUrl);
  res.send(`Verification completed! Trusted ID: ${trustedCallback.trustedId}`);
});
```

### Retrieve User Data
```typescript
app.get('/user', async (req, res) => {
  const user = await taClient.getUser('USER_TRUSTED_ID');
  res.json(user);
});
```

**That's it!** You have successfully integrated Trusted Accounts on your platform! 🖖 Try validate yourself and then go to the user list in the [**developer console**](https://developers.trustedaccounts.org/) to find the newly validated user.