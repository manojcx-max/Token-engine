# Extraction Logic Specification

## Step 1: Fetch Page

- Use server-side fetch
- Validate URL protocol (http/https only)
- Reject local IPs
- Reject file:// schemes

## Step 2: Extract CSS

From HTML:
- Extract <link rel="stylesheet">
- Extract <style> blocks

Fetch linked CSS files.

## Step 3: Extract Color Values

Match patterns:
- #RRGGBB
- #RGB
- rgb()
- rgba()
- hsl()

Store all values in array.

## Step 4: Normalize Colors

Convert:
- rgb → hex
- hsl → hex
- Remove alpha channel (ignore transparency in V1)

## Step 5: Frequency Counting

Count occurrences of each color.
Remove:
- Colors used < 3 times

## Step 6: Cluster Similar Colors

Basic similarity check:
If color distance < threshold (e.g. 15 in RGB space):
- Group them

Keep dominant representative.

## Step 7: Extract Fonts

Search for:
- font-family declarations

Count frequency.

Detect:
- Most-used overall → body font
- Most-used in h1–h3 → heading font

## Step 8: Extract Border Radius

Find:
- border-radius values

Collect numeric px values.

Group similar ones.
Keep up to 3 sizes.
