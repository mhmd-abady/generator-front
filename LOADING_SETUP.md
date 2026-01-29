# Loading Screen Image Setup

To complete the loading screen setup, please follow these steps:

1. **Add the Loading Image to Public Folder:**
   - Save the image you provided (the one with the flag and two people) as `loading-image.jpg` in the `/public` folder
   - The image path should be: `/Users/sadibousow/Desktop/generator-front/public/loading-image.jpg`

2. **Image Requirements:**
   - Format: JPG or PNG
   - Recommended size: 400x500px (will be responsive)
   - The component will automatically resize for different screen sizes
   - Ensure good compression to keep file size small

3. **How the Loading Screen Works:**
   - Appears when navigating between pages
   - Shows on initial page load and page refresh
   - Uses professional animations:
     * Floating effect on the image
     * Dual-ring rotating spinner
     * Pulsing glow effect
     * Animated text with fade-in effects
     * Floating particle background
     * Smooth fade-out transition

4. **To Test:**
   - After adding the image, run `npm run dev`
   - Navigate between different pages to see the loading screen
   - Refresh the page (F5) to see it on page load
   - The loading screen will automatically hide after 800ms

The LoadingContext provides these functions:
- `showLoading()` - Show the loading screen
- `hideLoading()` - Hide the loading screen
- `setLoading(boolean)` - Toggle loading state

You can use these in any component:
```tsx
import { useLoading } from './context/LoadingContext';

const MyComponent = () => {
  const { showLoading, hideLoading } = useLoading();
  
  // Use as needed
};
```
