# Mobidziennik SDK
[![npm](https://img.shields.io/npm/v/mobidziennik-api.svg?style=for-the-badge)](https://www.npmjs.com/package/mobidziennik-api)
[![License](https://img.shields.io/badge/license-gpl-green.svg?style=for-the-badge)](https://opensource.org/license/gpl-3-0/)

TypeScript web scraping SDK for Polish e-gradebook [MobiDziennik](https://www.mobidziennik.pl/).

> **Warning**
>
> I don't recommend enabling 2factor authentication on your account, 
> as it will break the SDK. We will try to support it in future!
>

## Usage
```js
var MobidziennikSDK = require("./index").MobidziennikSDK;

const client = new MobidziennikSDK('<school_id>');
client.authorize('<email>', '<password>').then((el) => {
    // Messages
    mobi.messages.getMessages().then((messages) => {})
    mobi.messages.getMessage('<message_id>').then((el) => {});
    
    // Library
    mobi.library.getBooks().then((books) => {})
});
```