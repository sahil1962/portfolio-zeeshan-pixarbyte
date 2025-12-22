# Image Setup Instructions

## Profile Picture

To display your profile picture on the portfolio:

1. **Prepare your image:**
   - Choose a professional headshot or portrait
   - Recommended: Square aspect ratio (1:1)
   - Minimum size: 500x500 pixels
   - Format: JPG, PNG, or WebP

2. **Add the image:**
   - Rename your image to `profile.jpg` (or `profile.png`)
   - Place it in the `public` folder: `public/profile.jpg`

3. **Location in the website:**
   - The profile picture appears at the **top of the Hero section** (landing page)
   - It's displayed as a large circular image with a blue ring
   - Features a calculator icon badge in the bottom-right corner

## Example file structure:
```
portfolio/
├── public/
│   ├── profile.jpg    ← Add your image here
│   ├── next.svg
│   └── vercel.svg
├── app/
└── ...
```

## Tips:
- Use a high-quality professional photo with good lighting
- Ensure your face is clearly visible and centered
- A solid or blurred background works best
- The image will be displayed as a circle, so position yourself in the center

## Alternative names:
If you prefer a different filename, update line 14 in `app/components/Hero.tsx`:
```typescript
src="/profile.jpg"  // Change this to your filename
```
