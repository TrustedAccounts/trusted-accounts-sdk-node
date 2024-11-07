# Trusted Accounts SDK for Node.js

### 1. Start the Validation Flow. 
Place this code on your website to show a validation button that starts the validation process. Get your platform credentials by creating a developer account for free in the [**developer console**](https://developers.trustedaccounts.org/).

```
npm install --save trusted-accounts-sdk-node
```

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

### 2. Handle the Callback
After the user completes the verification, they will be redirected back to your redirect URL. Place this code on your website at this url to handle this callback and get the Trusted ID.

```typescript
app.get('/callback', async (req, res) => {
   // Get the Trusted ID by passing the code_verifier
   const trustedId = await trustedClient.handleCallback(req, code_verifier);
   res.send('Verification completed! Trusted ID: ' + trustedId);
});
```

**That's it!** You have successfully integrated Trusted Accounts on your platform! 🖖 Try validate yourself and then go to the user list in the [**developer console**](https://developers.trustedaccounts.org/) to find the newly validated user.