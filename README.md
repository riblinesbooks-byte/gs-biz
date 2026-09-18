# Real Estate CRM & Activities Manager

A comprehensive, production-ready Real Estate CRM and property transaction pipeline built with React 19, Vite, and Tailwind CSS.

## Features

- **Executive Canvas Matrix**:
  - **Property Canvas**: 360° property appraisal, negotiation range, legal title issues, selling script, and prospective buyer shortlisting.
  - **Customer Canvas**: Buyer requirement mapping, budget negotiation range, special criteria, and personalized pitch guides.
  - **Seller Canvas**: Landowner mandate management, bottom-line valuation, and legal clearance tracking.
- **Activity Master & Logging Pipeline**:
  - 14 pre-configured activity masters with automatic next-action workflows.
  - Comprehensive timeline tracking for customer, seller, and property engagements.
- **Full-Lifecycle Pipeline**:
  - Leads capture and verification.
  - Move to Potential status.
  - Waiting for Approval admin authorization.
  - Locked Records with immutable security protection.
- **Interactive CRM Kanban Boards**:
  - Drag-and-drop lead stage progression.
  - Filter by executive, priority, and date.
- **Analytics & Reporting Hub**:
  - Activity conversion metrics, pipeline velocity, and team performance stats.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```
Runs the development server on `http://localhost:3000`.

### Production Build

```bash
npm run build
```
Generates optimized static assets in the `dist/` directory ready for deployment on Vercel, Netlify, or Cloud Run.

### Deployment to Vercel

The project includes `vercel.json` pre-configured for instant Vite SPA deployment:
1. Push repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Vercel automatically detects the Vite framework and builds to `dist/`.
