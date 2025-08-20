# ⚽ Football Predictions Leaderboard

A React-based web application for displaying and tracking football (soccer) prediction rankings.

## Features

- **Leaderboard Display**: Shows player rankings based on prediction accuracy and points
- **Visual Rankings**: Gold, silver, and bronze medals for top 3 players
- **Statistics Cards**: Display total players, top score, and average points
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with hover effects and smooth transitions

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

### Building for Production

Create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Leaderboard.tsx      # Main leaderboard component
│   └── Leaderboard.css      # Leaderboard styles
├── types/
│   └── leaderboard.ts       # TypeScript interfaces
├── App.tsx                  # Main app component
└── index.tsx                # App entry point
```

## Data Structure

The app currently uses mock data for demonstration. The main data types are:

- **Player**: Contains player information, points, and prediction statistics
- **Match**: Represents football matches with teams and scores
- **Prediction**: Individual predictions made by players

## Customization

To customize the leaderboard:

1. **Add Real Data**: Replace the mock data in `Leaderboard.tsx` with real API calls
2. **Modify Scoring**: Adjust the points calculation logic
3. **Add Features**: Implement user authentication, prediction submission, etc.
4. **Styling**: Modify `Leaderboard.css` to match your brand colors

## Technologies Used

- React 18
- TypeScript
- CSS3 with Grid and Flexbox
- Responsive design principles

## License

This project is open source and available under the MIT License.
