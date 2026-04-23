# Modurian

Modurian is a desktop code editor based on [Visual Studio Code - Open source](https://github.com/microsoft/vscode) (MIT). Product branding, update endpoints, and AI features are maintained by [Modurian](https://modurian.com).

Upstream source remains subject to the licenses in [LICENSE.txt](LICENSE.txt) and [ThirdPartyNotices.txt](ThirdPartyNotices.txt).

## Build from source

See Microsoft’s guide for prerequisites and commands: [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute). Install the **exact** Node version in [`.nvmrc`](.nvmrc), or temporarily set **`VSCODE_SKIP_NODE_VERSION_CHECK=1`** if your patch version is slightly behind. This repo expects **`npm install`** / **`npm ci`** (not Yarn). Close other processes using `node_modules` on Windows if native addons fail with `EBUSY` / `EPERM`.

Compile only the Modurian extension with:

`npm run gulp -- compile-extension:modurian`

## Modurian extension and backend

The built-in extension in `extensions/modurian` adds an **Modurian** activity bar view and setting **`modurian.apiUrl`** (default `https://modurian.com`). **Ping Modurian API** sends `POST {apiUrl}/api/modurian/ping` with body `{}`. Implement that route on your site (any `2xx` + small JSON or text body is fine) to verify connectivity.

`ModurianSession` in `extensions/modurian/src/session.ts` is the place to add streaming chat and tool calls next.

## Git remotes

`origin` can stay on your GitHub fork; add **`upstream`** → `https://github.com/microsoft/vscode.git` and merge `upstream/main` periodically. Point `origin` at your own org repo when you are ready to make that the canonical Modurian remote.

## Upstream

This tree tracks `microsoft/vscode`. Report issues with the open-source core to the upstream repository; use [modurian.com](https://modurian.com) for Modurian-specific product support when available.
