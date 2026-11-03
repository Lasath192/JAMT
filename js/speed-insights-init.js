/**
 * Vercel Speed Insights Initialization
 * ASTRA-1: The Red Frontier - 2026 NASA Space Apps Challenge
 */

// Import and initialize Vercel Speed Insights
import { injectSpeedInsights } from '../node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights for tracking web vitals
injectSpeedInsights({
    debug: false,
    sampleRate: 1 // Track all events (100%)
});

console.log('✓ Vercel Speed Insights initialized - Performance tracking active');
