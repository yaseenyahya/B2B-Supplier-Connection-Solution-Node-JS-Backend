Express SameSite Default
------------------------

Defaults cookies to `SameSite=None` if not specified, and adds `Secure` flag to all cookies.

Usage:

```bash
npm install --save express-samesite-default
```

```javascript
import express from 'express'
import { sameSiteCookieMiddleware } from 'express-samesite-default';

const app = express();
app.use(sameSiteCookieMiddleware());
```

Quick Start
-----------

#### Getting Started

- Fork the module
- Run setup: `npm run setup`
- Start editing code in `./src` and writing tests in `./tests`
- `npm run build`

#### Building

```bash
npm run build
```

#### Tests

- Edit tests in `./test/tests`
- Run the tests:

  ```bash
  npm run test
  ```

#### Publishing

##### Before you publish for the first time:

- Delete the example code in `./src`, `./test/tests` and `./demo`
- Edit the module name in `package.json`
- Edit `README.md` and `CONTRIBUTING.md`

##### Then:

- Publish your code: `npm run release` to add a patch
  - Or `npm run release:path`, `npm run release:minor`, `npm run release:major`
