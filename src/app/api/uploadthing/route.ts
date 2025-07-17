import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// todo: need to understand its usage
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
