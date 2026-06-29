import express from 'express';
import listEndpoints from 'express-list-endpoints';
import fs from 'fs';
import path from 'path';

// Import the app initialization function/module without actually starting the server
import setupRoutes from '../src/routes';

const app = express();
setupRoutes(app);

const endpoints = listEndpoints(app);

let markdown = `# API Endpoints (Auto-generated)\n\n`;
markdown += `This document lists all active endpoints parsed from the Express routing tree.\n\n`;
markdown += `| Method | Path | Middlewares |\n`;
markdown += `|---|---|---|\n`;

endpoints.forEach((ep) => {
  ep.methods.forEach((method) => {
    // Exclude basic global middleware from display if needed
    const middlewares = ep.middlewares.join(', ');
    markdown += `| **${method}** | \`${ep.path}\` | ${middlewares} |\n`;
  });
});

const outputPath = path.join(__dirname, '../API_DOCS.md');
fs.writeFileSync(outputPath, markdown);

console.log(`Successfully generated API documentation at ${outputPath}`);
