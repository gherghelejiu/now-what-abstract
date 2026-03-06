import { ConvexProvider } from './ConvexProvider';

/**
 * Singleton Convex backend provider instance.
 *
 * Import this wherever you need direct (non-React) access to the backend.
 * For the React tree, use `backendProvider.reactClient` with the Convex
 * <ConvexProvider> component in your root layout.
 */
const backendProvider = new ConvexProvider();

export default backendProvider;