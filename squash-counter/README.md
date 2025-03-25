# Dublin Sports Hub - Squash Counter Feature

This package contains a standalone implementation of the Squash Introduction Counter for the Dublin Sports Hub website. It tracks and displays the number of people introduced to squash with the goal of reaching 1% of Dublin's population.

## Features

- Real-time counter display showing current progress
- Progress bar visualization
- Admin panel for authorized updating of the counter
- Firebase integration for data persistence
- Responsive design for all devices

## File Structure

- `index.html` - Main counter display page
- `admin.html` - Admin interface for updating the counter
- `styles.css` - Styling for both pages
- `firebase-config.js` - Firebase configuration and initialization
- `db.js` - Database interaction functions

## Integration Instructions

### Option 1: Standalone Pages

You can deploy these files as standalone pages within your existing website structure:

1. Upload all files to your web server
2. Link to them from your main site navigation
3. Ensure Firebase SDK is properly loaded

### Option 2: Component Integration

To integrate the counter directly into existing pages:

1. Include the Firebase scripts in your main HTML:
   ```html
   <script type="module" src="firebase-config.js"></script>
   <script type="module" src="db.js"></script>
   ```

2. Copy the counter-card HTML structure from `index.html` into your desired page
3. Add the required CSS from `styles.css` to your main stylesheet
4. Include the counter initialization JavaScript

## Firebase Setup

This counter uses the existing Firebase project for Dublin Sports Hub. If you need to use a different Firebase project:

1. Update the `firebaseConfig` object in `firebase-config.js` with your new project credentials
2. Ensure your Firestore database has appropriate security rules
3. Create an admin user in Firebase Authentication for admin access

## Admin Access

To update the counter:
1. Navigate to the `/admin.html` page
2. Log in with authorized Firebase admin credentials
3. Enter the new count value and submit

## Initial Data

The counter initializes with:
- Current count: 823 (starting value)
- Goal count: 12,991 (1% of Dublin's population)

## Customization

Feel free to modify:
- Colors and styling in `styles.css`
- Default counter values in `db.js`
- Layout and content in the HTML files

## Support

For questions or support, please contact the Dublin Sports Hub development team.