# 🚀 Setup Guide for API Integration

## Configuring the Bearer Token

To connect your React app to the football predictions API, you need to configure your bearer token.

### Option 1: Environment Variables (Recommended)

1. Create a `.env` file in the root directory of your project:
   ```bash
   touch .env
   ```

2. Add your bearer token to the `.env` file:
   ```env
   REACT_APP_BEARER_TOKEN=your_actual_bearer_token_here
   ```

3. Replace `your_actual_bearer_token_here` with your real bearer token from the API.

4. Restart your development server:
   ```bash
   npm start
   ```

### Option 2: Direct Configuration

If you prefer to set the token directly in the code:

1. Open `src/config/api.ts`
2. Find the line: `export const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN || 'YOUR_BEARER_TOKEN_HERE';`
3. Replace `'YOUR_BEARER_TOKEN_HERE'` with your actual token
4. Save the file

### Security Notes

- **Never commit your `.env` file to version control**
- **Never share your bearer token publicly**
- The `.env` file is already in `.gitignore` for security

### Testing the Connection

Once configured:

1. The app will automatically fetch data from `https://binging.fly.dev/lb/points`
2. You'll see a loading spinner while data is being fetched
3. If successful, the leaderboard will display real data from the API
4. If there's an error, you'll see helpful error messages

### Troubleshooting

- **401 Error**: Check your bearer token
- **403 Error**: Check your API permissions
- **Network Error**: Check your internet connection
- **Server Error**: The API might be down, try again later

### API Response Format

The app expects the API to return an array of player objects. If the API response structure is different, you may need to adjust the data transformation in `src/components/Leaderboard.tsx`.
