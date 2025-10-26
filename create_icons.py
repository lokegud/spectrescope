#!/usr/bin/env python3
"""
Create simple placeholder icons for the SpectreScope extension.
This creates basic colored circles as placeholder icons.
"""

try:
    from PIL import Image, ImageDraw

    def create_icon(size, filename):
        # Create a transparent image
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Draw a circle with blue color (#61afef)
        margin = size // 8
        draw.ellipse(
            [margin, margin, size - margin, size - margin],
            fill=(97, 175, 239, 255),
            outline=(40, 44, 52, 255),
            width=2
        )

        # Draw a smaller circle inside (scope/lens effect)
        inner_margin = size // 3
        draw.ellipse(
            [inner_margin, inner_margin, size - inner_margin, size - inner_margin],
            fill=(40, 44, 52, 128),
            outline=(97, 175, 239, 255),
            width=1
        )

        # Save the image
        img.save(f'icons/{filename}')
        print(f'Created icons/{filename}')

    # Create all three icon sizes
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')

    print('\nAll icons created successfully!')
    print('You can now load the extension in Chrome.')

except ImportError:
    print('PIL/Pillow not installed. Creating simple placeholder instructions...')
    print('\nTo create icons manually:')
    print('1. Create 16x16, 48x48, and 128x128 pixel PNG images')
    print('2. Save them as icon16.png, icon48.png, icon128.png in the icons/ folder')
    print('3. You can use any image editor or online tool like:')
    print('   - https://favicon.io/favicon-generator/')
    print('   - https://www.favicon-generator.org/')
    print('   - Or use GIMP/Photoshop/etc.')
