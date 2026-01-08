# Minimalist Design Guide - Faculty.ma

**Inspired by PDFDrive - Clean, Fast, Direct**

---

## 🎨 Visual Design

### Color Palette (Only 3 colors!)
```
Black:      #1A1A1A  (text, headings)
Blue:       #0066CC  (links, hover states)
Light Gray: #F5F5F5  (backgrounds, subtle)
```

### Typography
```
Font Family: System stack
  -apple-system, "Segoe UI", Roboto, sans-serif
  (NO web fonts, loads instantly)

Sizes:
  Page Title (H1):     24px, bold
  Section Head (H2):   18px, bold
  Content (Body):      14px, regular
  Metadata:            12px, gray (#666)

Line Height:
  Headings: 1.3
  Body: 1.5 (readable but compact)
```

### Spacing (8px Grid)
```
Padding:  8px, 16px, 24px (multiples of 8)
Margins:  8px, 16px, 24px
Gap:      8px, 16px (between items)
```

---

## 🏠 Homepage Layout

```
┌─────────────────────────────────────────┐
│ Faculty.ma    [Search...]   FR|AR|EN ☀  │  Header (64px)
├─────────────────────────────────────────┤

                                            Main content area
Universities                                (920px max width)
─ Université Mohammed V
─ Université Al Akhawayn
─ Université Cadi Ayyad
[Show more...]

                                            Cards in 3-4 columns
Browse by
[Browse All Fields] [Browse All Subjects] [Latest Added]

─────────────────────────────────────────

Footer
About | Contact | Donate | © 2026
```

### Header (Always Visible)
```
Height: 64px
Content:
  Left (16px padding): Logo/Text "Faculty.ma"
  Center: Search input (300px wide)
  Right (16px padding): Language + Theme toggle

Search Input:
  Height: 40px
  Border: 1px #E0E0E0
  Font: 14px
  Padding: 8px 12px
  Focus: Border becomes #0066CC
```

### Content Cards
```
Size: 200px × 280px (including padding)
Layout:
┌──────────────────┐
│  [Image 200x150] │
├──────────────────┤
│ Title (2 lines)  │  16px, bold, black
│                  │
│ Grade 8          │  12px gray
│ Mathematics      │
│                  │
│ Jan 5 · 12 min   │  12px gray
└──────────────────┘

Border: 1px #E0E0E0
Border Radius: 0 (square)
Hover: Border #0066CC, cursor pointer
No shadow
```

---

## 📄 Content Page Layout

```
┌─────────────────────────────────────────┐
│ ← Back    Faculty.ma              A+  ☀ │  Header (64px)
├─────────────────────────────────────────┤
│ Home > Mohammed V > CS > Data Struct    │  Breadcrumb (small)
│                                         │
│ Binary Trees Explained                  │  H1, 24px, bold
│                                         │
│ Grade 10 · Computer Science             │  Metadata, gray, 12px
│ Jan 5, 2026 · 15 min read               │
│                                         │
├─────────────────────────────────────────┤
│ [Progress bar: ▓▓▓░░░░░░░░░░░░ 35%]   │
├─────────────────────────────────────────┤
│                                         │
│ Article content starts here...          │  Body 14px, line-height 1.5
│ Clean typography, no fancy formatting   │
│                                         │
│ ## Introduction                         │  H2, 18px, black
│ More content...                         │
│                                         │
│ ### Key Concepts                        │  H3, 16px, black
│ Even more content...                    │
│                                         │
│ [Simple image - no caption]             │
│                                         │
├─────────────────────────────────────────┤
│ ❤ Save    Twitter · WhatsApp · Link    │  Simple buttons
│                                         │
│ Related Content                         │
│ - Graphs and Trees                      │  Simple links (blue)
│ - Algorithm Complexity                  │
│ - Interview Questions                   │
│                                         │
└─────────────────────────────────────────┘

Footer:
About | Contact | Donate | © 2026
```

---

## 🔍 Search Results Page

```
┌─────────────────────────────────────────┐
│ Faculty.ma    [Search: algebra...]      │
├─────────────────────────────────────────┤

Search Results for "algebra" (127 results)

Results:
□ Algebra Basics (Grade 8, Math)
  Mohammed V University
  
□ Algebra Advanced (Grade 10, Math)
  Cadi Ayyad University
  
□ Linear Algebra (Grade 12, Math)
  Al Akhawayn University

[Load more] or infinite scroll

└─────────────────────────────────────────┘
```

---

## 🧭 Navigation Hierarchy

### Homepage
```
Faculty.ma (logo/text)
├── Universities
├── Fields
└── Subjects
```

### University Page (/universities/[name])
```
← Back
[University Name]
├── Computer Science
├── Mathematics
└── Physics
```

### Field Page (/universities/[name]/[field])
```
← Back > [University] > [Field]
[Field Name]
├── Data Structures
├── Algorithms
└── Web Development
```

### Subject Page (/universities/[name]/[field]/[subject])
```
← Back > [University] > [Field] > [Subject]
[Subject Name]

Content cards grid:
- Card 1
- Card 2
- Card 3
- Card 4
...
```

### Content Page (/[category]/[slug])
```
← Back
Breadcrumb: Home > University > Field > Subject

Full article content
Simple, clean, readable
```

---

## 🎯 Design Rules (Non-Negotiable)

1. **No Animations**
   - No fade-ins, slide-ins, or transitions
   - Hover: only color change (instant)
   - Load: instant, no skeleton screens

2. **No Sidebars**
   - Single column on mobile
   - Max 2 columns on tablet
   - Max 3-4 columns on desktop
   - No floating elements

3. **No Decorations**
   - No shadows, gradients, borders on buttons
   - No icons unless text-labeled
   - No emojis (except simple ones: ← ♥ ↗)
   - No background images

4. **No Complexity**
   - Simple borders: 1px #E0E0E0 or none
   - No rounded corners (border-radius: 0)
   - No hover effects (only color change)
   - One layout for all screen sizes (responsive grid)

5. **Fast Load**
   - System fonts only
   - Optimize images (WebP, lazy-load)
   - Minimal CSS (<20KB)
   - No JavaScript animations

---

## 🎨 Component Examples

### Button (Primary)
```css
.button-primary {
  background: #0066CC;
  color: white;
  border: none;
  padding: 8px 16px;
  height: 44px;
  font: 14px system font;
  cursor: pointer;
  border-radius: 0;
}

.button-primary:hover {
  background: #0052A3;
  transition: background 0.2s;
}
```

### Button (Outline)
```css
.button-outline {
  background: transparent;
  color: #0066CC;
  border: 1px #0066CC;
  padding: 8px 16px;
  height: 44px;
}

.button-outline:hover {
  background: #F5F5F5;
}
```

### Link
```css
a {
  color: #0066CC;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

a:hover {
  border-bottom-color: #0066CC;
}
```

### Card
```css
.card {
  border: 1px solid #E0E0E0;
  padding: 0;
  border-radius: 0;
  background: white;
  cursor: pointer;
}

.card:hover {
  border-color: #0066CC;
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.card-body {
  padding: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.card-meta {
  font-size: 12px;
  color: #666;
}
```

### Input
```css
input {
  width: 100%;
  height: 44px;
  border: 1px solid #E0E0E0;
  padding: 8px 12px;
  font: 14px system font;
  border-radius: 0;
}

input:focus {
  border-color: #0066CC;
  outline: none;
}
```

---

## 📱 Responsive Design (Mobile-First)

### Breakpoints
```
Mobile:  < 640px  (single column, full width)
Tablet:  640px - 1024px (2 columns)
Desktop: > 1024px (3-4 columns)
```

### Card Layout
```
Mobile:  1 card per row (full width - 16px padding)
Tablet:  2 cards per row
Desktop: 3-4 cards per row
```

### Typography
```
Mobile:
  H1: 20px (down from 24px)
  H2: 16px (down from 18px)
  Body: 13px (down from 14px)

Desktop:
  H1: 24px
  H2: 18px
  Body: 14px
```

### Layout
```
Desktop: Content max-width 920px, centered
Mobile:  Full width with 16px padding each side
```

---

## 🚀 Implementation Notes

**Build with:**
- Next.js (App Router)
- Plain CSS (no Tailwind utility classes needed)
- System fonts (0 web fonts)
- Vercel (auto-deploy)
- Supabase (already set up)

**Avoid:**
- Design system libraries
- Component libraries
- CSS frameworks (write CSS directly)
- Animations or transitions
- Complex layouts

**Testing:**
- Test on real devices (not just DevTools)
- Test slow 3G network
- Test with screen reader (WCAG AA)
- Test dark mode (optional, CSS media query)

---

## 📊 Performance Goals

- **LCP (Load)**: < 2.0 seconds
- **PageSpeed**: 90+ score
- **CSS**: < 20KB (gzip)
- **JS**: < 50KB (gzip)
- **Images**: WebP + JPEG fallback, lazy-loaded

**How:**
- System fonts (no web fonts)
- Simple CSS (no framework)
- Image optimization (Vercel Edge)
- Minimal JavaScript
- Server-side rendering (Next.js SSR)
- Caching (ISR)

---

## ✨ Design Checklist

Before launching, verify:

- [ ] No animations or transitions
- [ ] No shadows or gradients
- [ ] No rounded corners
- [ ] No sidebars or floating elements
- [ ] Max 5 choices visible at once
- [ ] All buttons 44px minimum height
- [ ] Text contrast 4.5:1 or higher
- [ ] Simple black/blue/gray color scheme
- [ ] System fonts only (no web fonts)
- [ ] Mobile-first responsive design
- [ ] Fast load < 2 seconds
- [ ] Works without JavaScript

**Goal: PDFDrive-simple, direct, fast.** 🎯
