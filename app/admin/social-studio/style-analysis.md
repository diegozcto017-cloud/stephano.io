# Stephano.io — Visual Style Analysis (Verified from site)

## Brand Colors (Real — verified browsing stephano.io)

| Token | Value | Use |
|-------|-------|-----|
| Primary accent | `#0066FF` | Royal Blue — buttons, CTAs, key elements |
| Secondary accent | `#00C2FF` | Bright Cyan — highlights, secondary accents |
| Tertiary accent | `#00E5FF` | Vivid Cyan — glow effects |
| Primary background | `#0B1220` | Deep Navy — main slide background |
| Secondary background | `#111827` | Charcoal Navy — content slides |
| Elevated bg | `#1e2740` | Slate Navy — cards, elevated sections |
| Brand dark | `#021f59` | Deep Blue — dark accents |
| Glass overlay | `rgba(255,255,255,0.06)` | Frosted glass effect |
| Glass border | `rgba(255,255,255,0.12)` | Glass borders |
| Primary text | `#f0f2f5` | Off-white |
| Secondary text | `#94a3b8` | Muted gray-blue |
| Gradient | `linear-gradient(135deg, #0066FF, #00C2FF)` | Signature gradient |
| Glow | `rgba(0,102,255,0.2)` | Blue glow for interactive elements |

## Image Style Guide for Social Media

### Cover Slides (Slide 1)
- Background: Deep navy `#0B1220`
- Centered layout
- Large bold headline — white, Inter 800 weight
- Subtle blue-to-cyan radial glow from center-bottom
- Thin gradient horizontal rule (80% width) near bottom: `#0066FF` → `#00C2FF`
- "STEPHANO.IO" small monospace, cyan `#00C2FF`, top-right corner
- Abstract geometric grid lines fading into deep navy

### Content Slides (Slides 2-N)
- Background: Charcoal navy `#111827`
- Left-aligned content
- Thin vertical **gradient** bar on left edge (3px): `#0066FF` → `#00C2FF`
- Slide counter top-right: "2/5" in small cyan `#00C2FF`
- Bold white headline (Inter 700)
- Muted body text `rgba(255,255,255,0.6)`
- Glassmorphism card accent: `rgba(255,255,255,0.06)` with `rgba(255,255,255,0.12)` border
- "STEPHANO.IO" watermark bottom-right, 20% opacity

### CTA Slide (Last Slide)
- Background: Deep navy `#0B1220`
- Gradient rectangle/button: `linear-gradient(135deg, #0066FF, #00C2FF)` with "stephano.io"
- Scattered blue particle dots in background
- Clear action text below button
- Frosted glass card overlay

## Image Composition Rules
1. **Max 8 words** per slide (legibility on mobile)
2. **No stock photos** — abstract tech visuals, glassmorphism, geometry
3. **Blue glows** instead of pure cyan glows
4. **No people/faces** in generated images
5. **Consistent brand mark** on every slide
6. **High contrast** — text must be readable at small sizes

## Aspect Ratios
| Format | Ratio | Use |
|--------|-------|-----|
| Carousel posts | `1:1` (1080x1080) | Standard feed |
| Reels cover | `9:16` (1080x1920) | Vertical |
| Stories | `9:16` (1080x1920) | Ephemeral |

## Nano-banana Prompt Template

```bash
# Cover slide
nano-banana "Premium Instagram cover slide, deep navy background #0B1220,
royal blue #0066FF to cyan #00C2FF gradient glow, bold white headline '{HEADLINE}',
abstract grid lines, STEPHANO.IO branding, Silicon Valley liquid glass corporativo aesthetic,
frosted glass elements, no people, 8K sharp"
-s 1K -a 1:1 -o slide-1

# Content slide
nano-banana "Instagram carousel slide {N}/{TOTAL}, dark navy #111827 background,
thin blue gradient left border, bold white text '{HEADLINE}', glassmorphism card,
STEPHANO.IO watermark, clean grid layout, royal blue #0066FF to cyan #00C2FF accent"
-s 1K -a 1:1 -o slide-{N}

# CTA slide
nano-banana "Instagram CTA slide, deep navy background #0B1220, blue-cyan gradient
rectangle button with 'stephano.io', scattered blue particle dots, frosted glass overlay,
white call-to-action text '{CTA_TEXT}', liquid glass corporativo premium"
-s 1K -a 1:1 -o slide-cta
```

## Reference Visual Aesthetic
- Apple product launch slides
- Linear.app marketing
- Vercel / Next.js website (dark navy, not pure black)
- Stripe homepage
- Tesla reveal presentations
- Figma dark mode UI
- Glassmorphism + frosted glass design trend
