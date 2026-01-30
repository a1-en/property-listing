# Property Genie - Property Listing Application

A modern, high-performance property listing application built with Next.js and Material UI. This application provides a premium user experience for browsing, filtering, and searching real estate listings in Malaysia.

## 🚀 Features

- **Advanced Filtering System**: Filter properties by category (Residential, Commercial, etc.), price range, bedrooms, bathrooms, tenure, furnishing, and auction status.
- **Dynamic Search**: High-performance search interface for finding properties by location or landmarks.
- **Premium UI/UX**: Built with a custom Material UI theme, featuring a clean "rectangular-rounded" aesthetic and responsive layouts.
- **SSR (Server-Side Rendering)**: Optimized for SEO and performance using Next.js Server-Side Rendering for all listing pages.
- **Smart Feedback**: Visual badges and filter counts to clearly indicate applied search criteria.
- **Interactive Map Section**: Integration-ready map explore cards with location-based discovery.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **UI Framework**: [Material UI (MUI)](https://mui.com/)
- **Icons**: [MUI Icons](https://mui.com/material-ui/material-icons/)
- **Data Fetching**: [Axios](https://axios-http.com/)
- **Styling**: Emotion (CSS-in-JS)

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd property-listing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

1. **Development Mode**:
   Run the development server with hot-reloading:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production Build**:
   Build the application for optimal production performance:
   ```bash
   npm run build
   ```

3. **Start Production Server**:
   Once built, start the production server:
   ```bash
   npm start
   ```

## 📂 Project Structure

- `src/pages/index.tsx`: Main property listing page and SSR logic.
- `src/components/Filters/Filters.tsx`: Advanced filtering drawer and logic.
- `src/components/PropertyCard/PropertyCard.tsx`: Reusable property showcase component.
- `src/lib/api/properties.ts`: API interaction Layer for fetching property data.

## 📝 License

This project is developed for the Property Genie assessment.
