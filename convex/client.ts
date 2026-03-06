/**
 * Legacy Convex client singleton.
 *
 * This file is retained so that ConvexProvider.ts (src/backend/convex/)
 * remains the single source of the Convex URL.  Nothing outside of
 * src/backend/ should import from here.
 *
 * @deprecated  Import `backend` from 'src/backend' instead.
 */

// TODO: remove if switching backend provider
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient('https://brave-roadrunner-570.convex.cloud');

export default convex;