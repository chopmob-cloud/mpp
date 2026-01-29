// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';


// prettier-ignore
type Page =
| { path: '/'; render: 'static' }
| { path: '/sdk/typescript/BodyDigest.compute'; render: 'static' }
| { path: '/sdk/typescript/BodyDigest.verify'; render: 'static' }
| { path: '/sdk/typescript/Challenge.deserialize'; render: 'static' }
| { path: '/sdk/typescript/Challenge.from'; render: 'static' }
| { path: '/sdk/typescript/Challenge.fromHeaders'; render: 'static' }
| { path: '/sdk/typescript/Challenge.fromIntent'; render: 'static' }
| { path: '/sdk/typescript/Challenge.fromResponse'; render: 'static' }
| { path: '/sdk/typescript/Challenge.serialize'; render: 'static' }
| { path: '/sdk/typescript/Challenge.verify'; render: 'static' }
| { path: '/sdk/typescript/Credential.deserialize'; render: 'static' }
| { path: '/sdk/typescript/Credential.from'; render: 'static' }
| { path: '/sdk/typescript/Credential.fromRequest'; render: 'static' }
| { path: '/sdk/typescript/Credential.serialize'; render: 'static' }
| { path: '/sdk/typescript/Expires'; render: 'static' }
| { path: '/sdk/typescript/Intent.authorize'; render: 'static' }
| { path: '/sdk/typescript/Intent.charge'; render: 'static' }
| { path: '/sdk/typescript/Intent.from'; render: 'static' }
| { path: '/sdk/typescript/Intent.subscription'; render: 'static' }
| { path: '/sdk/typescript/Method.from'; render: 'static' }
| { path: '/sdk/typescript/Method.toClient'; render: 'static' }
| { path: '/sdk/typescript/Method.toServer'; render: 'static' }
| { path: '/sdk/typescript/MethodIntent.from'; render: 'static' }
| { path: '/sdk/typescript/MethodIntent.fromIntent'; render: 'static' }
| { path: '/sdk/typescript/PaymentRequest.deserialize'; render: 'static' }
| { path: '/sdk/typescript/PaymentRequest.from'; render: 'static' }
| { path: '/sdk/typescript/PaymentRequest.fromIntent'; render: 'static' }
| { path: '/sdk/typescript/PaymentRequest.serialize'; render: 'static' }
| { path: '/sdk/typescript/Receipt.deserialize'; render: 'static' }
| { path: '/sdk/typescript/Receipt.from'; render: 'static' }
| { path: '/sdk/typescript/Receipt.fromResponse'; render: 'static' }
| { path: '/sdk/typescript/Receipt.serialize'; render: 'static' }
| { path: '/sdk/typescript'; render: 'static' }
| { path: '/sdk/typescript/server/Method.tempo'; render: 'static' }
| { path: '/sdk/typescript/server/Mpay.create'; render: 'static' }
| { path: '/sdk/typescript/server/Mpay.toNodeListener'; render: 'static' }
| { path: '/sdk/typescript/server/Transport.from'; render: 'static' }
| { path: '/sdk/typescript/server/Transport.http'; render: 'static' }
| { path: '/sdk/typescript/server/Transport.mcp'; render: 'static' }
| { path: '/sdk/typescript/server/Transport.mcpSdk'; render: 'static' }
| { path: '/sdk/typescript/client/Fetch.from'; render: 'static' }
| { path: '/sdk/typescript/client/Fetch.polyfill'; render: 'static' }
| { path: '/sdk/typescript/client/Fetch.restore'; render: 'static' }
| { path: '/sdk/typescript/client/Method.tempo'; render: 'static' }
| { path: '/sdk/typescript/client/Mpay.create'; render: 'static' }
| { path: '/sdk/typescript/client/Transport.from'; render: 'static' }
| { path: '/sdk/typescript/client/Transport.http'; render: 'static' }
| { path: '/sdk/typescript/client/Transport.mcp'; render: 'static' }
| { path: '/sdk/rust'; render: 'static' }
| { path: '/sdk/python'; render: 'static' };

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
