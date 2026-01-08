# Frontend Specification - Minimalist Learning Platform

## 🎯 Project Overview

Build a **minimalist, fast, direct** public frontend for Faculty.ma inspired by **PDFDrive's clean design**. Users should find content in seconds without clutter or friction.

**Design Philosophy:**
```
❌ NO:
- Carousels, animations, transitions
- Complex navigation, hamburger menus
- Design systems, component libraries
- Sidebars, floating elements, popups
- Social feeds, personalization complexity
- Multiple colors, decorative fonts
- Hover effects, fancy interactions

✅ YES:
- Simple hierarchy: Universities → Fields → Subjects → Content
- Direct search (always visible)
- Minimal cards (image + title + metadata)
- System fonts (fast, clear)
- Black text on white (high contrast)
- One primary action per page
- Fast, responsive, accessible
```

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Plain CSS (or Tailwind utilities only)
- Vercel deployment
- Supabase for content
- Google Analytics (lightweight)

---

## 📱 Core Requirements

### 1. ADHD-Friendly Design (Minimal Edition)

**Principles:**
```
✅ Minimize cognitive load:
   - Max 5 visible choices at once
   - One primary action per page
   - No sidebars or competing elements
   
✅ Clear hierarchy:
   - Largest text = most important
   - Consistent spacing (8px grid)
   - Black on white (4.5:1 contrast minimum)
   
✅ Remove distractions:
   - No autoplay videos
   - No notifications or alerts
   - No animations or transitions
   - No ads interrupting content (footer only)
```

### 2. Moroccan Cultural Adaptation

**Language Support:**
- Primary: French (80% users)
- Secondary: Arabic (Darija - Moroccan dialect)
- English: Growing demographic
- Automatic detection based on browser language
- Easy switcher in header (flag icons)

**Cultural Considerations:**
```
Content:
✅ Local success stories (Moroccan students)
✅ University/school system context (Morocco-specific)
✅ Local currency (MAD) for payments
✅ Moroccan time zones
✅ Local holidays in calendar

Design:
✅ Right-to-left (RTL) support for Arabic
✅ Local colors (Green, Red, White from flag)
✅ Moroccan education icons
✅ Local social proof (moroccan.ma domains, etc.)
```

### 3. Lazy Behavior Optimization

**Remove Friction:**
```
User Journey (Target: < 30 seconds to first content):
1. Land on site → Immediate value visible (NO signup required)
2. Browse content → Infinite scroll, no pagination clicks
3. Find something → One-click save/bookmark
4. Share interest → Auto-generated personalized feed

Implementation:
✅ No signup wall - read everything anonymous
✅ Infinite scroll with ghost loading
✅ Smart feed based on:
   - View history
   - Time spent per content
   - Search behavior
   - Grade/education level
✅ "Continue reading" suggestions
✅ Auto-expand first content item
```

**Engagement Without Friction:**
```
- One-click share (pre-filled Twitter/WhatsApp messages)
- Save to phone (offline PWA support)
- Email summaries (weekly digest, no signup)
- SMS alerts (optional, only Moroccan numbers)
- Smart notifications (only critical, not spammy)
```

### 4. Content Discovery & Homepage (Minimalist)

**Header (Always Visible):**
```
┌─────────────────────────────────────────────┐
│ Faculty.ma      [Search...]    FR|AR|EN ☀  │
└─────────────────────────────────────────────┘

- Logo: Simple text "Faculty.ma" (left)
- Search: Centered, large input (users start here)
- Language: Text links FR | AR | EN
- Theme: Light/Dark toggle (optional)
- NO navigation menu yet - search is hero
```

**Homepage Layout (PDFDrive-Style):**
```
[Search Bar - Takes 50% of above-fold]

"Universities"
- Université Mohammed V
- Université Al Akhawayn
- Université Cadi Ayyad
- [Show 10 more...]

"Browse by Field"
[Browse All Fields]  [Browse All Subjects]  [Latest Added]

OR Search Results:
- Card 1: Algebra Basics
- Card 2: Biology Notes
- Card 3: History Summary
```

**No carousel, no animations, no smart feed.**
**Fast, direct, hierarchy-based navigation.**

**Content Card Format (Minimal):**
```
┌──────────────────┐
│   [Thumbnail]    │ 200x150 only, no text overlay
├──────────────────┤
│ Algebra Basics   │ Title, 2 lines max
│                  │
│ Grade 8          │ Grade level
│ Mathematics      │ Subject
│                  │
│ Jan 5 · 12 min   │ Date · Read time
└──────────────────┘

Hover: Border becomes blue (#0066CC)
```

### 5. Content Pages (Minimalist Reading)

**Page Layout:**
```
┌─────────────────────────────────────────────┐
│ ← Back    Faculty.ma              Theme  A+ │
├─────────────────────────────────────────────┤
│                                             │
│ Algebra Basics                              │ H1, 24px
│                                             │
│ Grade 8 · Mathematics · Jan 5 · 12 min read│ Metadata
│                                             │
├─────────────────────────────────────────────┤
│ [Progress bar showing 35% scroll]          │
│                                             │
│ Article content here...                     │ 14px, line-height 1.5
│ Clean typography, no fancy formatting       │
│                                             │
│ ## Section Heading                          │ H2
│ Content continues...                        │
│                                             │
│ [Image - simple, no caption]                │
│                                             │
├─────────────────────────────────────────────┤
│ ❤ Save  ↗ Share (Twitter|WhatsApp|Link)   │
│                                             │
│ Related Content                             │
│ - Algebra Advanced Topics                   │
│ - Geometry Basics                           │
│ - Math Problem Sets                         │
└─────────────────────────────────────────────┘

Design:
- Clean, distraction-free reading
- No sidebars, no floating elements
- Progress bar shows scroll position
- Minimal controls (save, share, theme)
- Metadata in small gray text
```

CTA Sections:
- After 50% read: Related content suggestion (3 items)
- After 100% read: Next logical content suggestion
- Monetization point (see below)

Footer:
- 3 suggestions based on:
  * Other posts by same source
  * Popular in category
  * Trending this week
- Comments section (Disqus/native)
```

---

## 💰 Monetization Strategy (Ads + Donations Only)

### Free for Everyone
```
✅ Read unlimited content
✅ Offline reading (PWA)
✅ Save/bookmark
✅ Email summaries
✅ Full access to all features
✅ No paywalls
✅ No subscription required
```

**Revenue Streams:**
```
1. Advertising (Primary - 70% revenue target)
   - Google AdSense (footer only)
   - Moroccan tutoring platforms (sponsorship)
   - Local universities (job board)
   - Study materials vendors
   - Career platforms
   - Non-intrusive, non-blocking placements

2. Donations (Secondary - 30% revenue target)
   - "Support our mission" button
   - One-time donation option
   - Monthly donation support
   - Transparent fund allocation
   - Donor recognition (optional)
   - Cryptocurrency donations (Bitcoin)
```

**Ad & Donation Placement (Non-Intrusive):**
```
❌ NO:
- Pop-ups
- Interstitials
- Auto-playing videos
- Banner ads above fold
- Paywalls (all content free)
- Referral spam
- Aggressive donation prompts

✅ YES:
- Unobtrusive footer ads (2-3 rotating)
- Sidebar for desktop only (if needed)
- Native ad format (matches content)
- Subtle "Support us" donation button (top-right)
- Email digest sponsorships (clear labeling)
- Contextual ad placement (relevant to content)
- Monthly donation CTA (soft, once per session)
```

---

## 🎨 Design System (Minimalist)

### Colors (Simple, High Contrast)
```
Primary:    #1A1A1A (Black - all text and headings)
Secondary:  #0066CC (Blue - links, highlights only)
Neutral:    #FFFFFF (White - background)
Gray:       #666666 (Medium gray - secondary text)
Border:     #E0E0E0 (Light gray - card borders, dividers)
Error:      #D32F2F (Red - errors only)
```

### Typography (System Fonts, Clean)
```
Font Family: System stack (-apple-system, "Segoe UI", Roboto, sans-serif)
- No web fonts, no decorations
- Fast to load, clear to read

Sizes (Compact):
- H1: 24px (mobile 20px) - page titles only
- H2: 18px (mobile 16px) - section headers  
- H3: 16px (mobile 14px) - subsections
- Body: 14px (mobile 13px) - content, compact
- Caption: 12px (mobile 11px) - metadata

Weight: 400 (regular) for all, 600 (bold) for headings only
Line Height: 1.5 (compact but readable)
Letter Spacing: 0 (default)
```

### Components (Minimal, Direct)
```
Buttons:
- Simple text or text + small icon
- Outline style (1px border) or solid fill
- 44px minimum height
- No shadows, gradients, or hover animations
- Hover: color change only (0.2s transition)
- Example: [Search] [Browse] [Donate]

Cards:
- Simple 1px border (#E0E0E0), no shadows
- 12px padding (compact)
- Small thumbnail if available (200x150)
- Title + metadata only (clean)
- Hover: border color changes to blue (#0066CC)
- No animations

Forms:
- Simple text inputs with 1px border
- 44px height (touch friendly)
- No floating labels
- Clear error messages (red text)

Navigation:
- Text links only (no icons)
- Underline on hover
- Max 5 items visible
- Mobile: "Menu" text button (not hamburger)
```

---

## 🚀 Performance Requirements

### Core Web Vitals
```
LCP (Largest Contentful Paint):    < 2.0s (target)
FID (First Input Delay):            < 100ms
CLS (Cumulative Layout Shift):      < 0.1

Target Score: 90+ on Google PageSpeed
```

### Image Optimization
```
✅ WebP format with JPEG fallback
✅ Responsive images (srcset)
✅ Lazy loading (loading="lazy")
✅ Image compression (75% quality for thumbnails)
✅ CDN delivery (Vercel Edge, Cloudinary)
✅ No oversized images
```

### CSS/JS Optimization
```
✅ CSS: 40KB max (gzip)
✅ JS: 150KB max (gzip)
✅ Tree-shake unused code
✅ Code splitting for routes
✅ Font subsetting (load only used chars)
✅ Preload critical resources
```

### Server-Side Rendering (Next.js)
```
✅ SSR for all public pages (for SEO)
✅ ISR (Incremental Static Regeneration) for content
✅ Cache content pages 24 hours (revalidate)
✅ Cache homepage 1 hour (frequently changes)
✅ Cache category pages 6 hours
✅ Stream components (React 18)
✅ Optimize for Core Web Vitals
```

---

## 🔍 SEO & Discoverability

### Meta & Structured Data
```
✅ Unique title (50-60 chars)
✅ Meta description (150-160 chars)
✅ Open Graph tags (social sharing)
✅ JSON-LD schema (Article, Course, AggregateRating)
✅ Canonical URLs
✅ Robots meta tags
✅ Sitemap (auto-generated)
✅ RSS feed (for subscribers)
```

### URL Structure (Simple Hierarchy)
```
Homepage:           /
Universities:       /universities
Field List:         /universities/[name]
Subject List:       /universities/[name]/[field]
Content List:       /universities/[name]/[field]/[subject]
Single Content:     /[category]/[slug]
Search:             /search?q=[query]
Donate:             /donate
```

**Example Navigation:**
```
1. Homepage → Click "Université Mohammed V"
2. /universities/mohammed-v → List of fields
3. Click "Computer Science"
4. /universities/mohammed-v/computer-science → List of subjects
5. Click "Data Structures"
6. /universities/mohammed-v/computer-science/data-structures → List of content
7. Click "Binary Trees Explained"
8. /tutorials/binary-trees-explained → Full article
```

### Search Functionality (Simple)
```
✅ Simple search box (visible on every page)
✅ Full-text search
✅ No complex filters (users can navigate instead)
✅ Search results: Simple list of matching content
✅ No faceted search, no complex UI
```

---

## 📊 Analytics & Monitoring

### Tracking Events
```
Page Views:
- content_view (send UTM params)
- content_scroll_depth (25%, 50%, 75%, 100%)

Engagement:
- content_save (bookmark)
- content_share (which platform)
- content_complete (read 100%)

Monetization:
- upgrade_shown (when CTA appeared)
- upgrade_clicked
- payment_initiated
- payment_completed

Errors:
- Content_load_error
- Payment_error
- API_timeout
```

### Tools
```
✅ Google Analytics 4 (main)
✅ Vercel Analytics (performance)
✅ Sentry (error tracking)
✅ LogRocket (session replay - sample 5%)
✅ Segment (event warehouse)
```

---

## 🔐 Security & Privacy

### Authentication
```
✅ Passwordless auth (email link)
**Security & Privacy**
✅ Passwordless auth (email link)
✅ OAuth options (Google, GitHub)
✅ Session tokens (JWT, secure httpOnly cookies)
✅ Rate limiting (100 requests/min)
✅ CORS properly configured
✅ Google AdSense compliance
✅ No credit card storage (donations via Stripe)
```

### Privacy
```
✅ GDPR/CCPA compliant
✅ Privacy policy (simple version)
✅ Clear cookie consent
✅ No third-party tracking without consent
✅ Data export option
✅ Account deletion option
✅ Analytics sampling (not tracking individuals)
```

---

## 📲 Mobile-First Approach

### Touch Interactions
```
✅ 48px minimum touch targets
✅ No hover-dependent features
✅ Swipe gestures for navigation (optional)
✅ Bottom navigation bar (main actions)
✅ Thumb-friendly layout
✅ Double-tap zoom disabled (font resize available)
```

### Progressive Web App (PWA)
```
✅ Installable on home screen
✅ Offline reading (cached posts)
✅ Push notifications (optional, opt-in)
✅ Fast app-like experience
✅ Service worker for caching
✅ Manifest.json configured
```

### Responsive Design
```
Breakpoints:
- Mobile:  < 640px (single column)
- Tablet:  640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

Mobile First:
✅ Design for mobile first
✅ Enhance for larger screens
✅ Test on real devices (not just Chrome DevTools)
```

---

## 🎯 Content Management (Headless CMS)

### Data from Supabase
```
Tables used:
- posts (content)
- users (authors)
- tags (filtering)
- post_tags (relationships)

Caching Strategy:
✅ Cache posts 24 hours (ISR)
✅ Cache homepage 1 hour (more dynamic)
✅ Cache categories 6 hours
✅ Invalidate on publish/update
✅ Real-time updates for all users
```

### Content Types
```
1. Course-Style Posts
   - Multiple sections (H2, H3)
   - Code examples (with syntax highlighting)
   - Embedded videos (YouTube)
   - Download resources (PDF)

2. Exam Practice
   - Multiple choice questions
   - Explanations for each answer
   - Progress tracking
   - Time tracking

3. Study Materials
   - Notes and summaries
   - Mind maps (SVG embedded)
   - Flashcards
   - Related resources

4. News/Updates
   - Campus news
   - Exam updates
   - Education policy changes
```

---

## 🎬 Minimal Call-to-Action Flow

**Principle: Let content speak, no aggressive CTAs**

```
Homepage:
- Search bar is the only CTA
- "Browse Universities" link (optional)

Content Page:
- End of article: "Related Content" (3 simple links)
- Subtle "Support us" button (gray, bottom-right)
- No popups, no aggressive prompts

Email:
- Weekly digest with best new content
- One link to "Donate" (optional, unobtrusive)
- No spam, no daily emails

Monetization:
- Google AdSense footer ads only
- Donation button (always visible, top-right header)
- No interstitials, no paywalls, no friction
```

---

## 🚢 Deployment & DevOps

### Hosting
```
✅ Vercel (Next.js optimized, automatic)
✅ Custom domain: faculty.ma
✅ Environment variables (production, staging)
✅ Automatic deployments from main branch
✅ Edge Functions for API calls (reduce latency)
✅ Image optimization at edge
```

### Database
```
✅ Supabase PostgreSQL (already set up)
✅ Connection pooling (PgBouncer)
✅ Backups automated (daily)
✅ CDN caching headers configured
```

### Monitoring & Alerts
```
✅ Vercel deployment monitoring
✅ Sentry for errors
✅ Uptime monitoring (Better Uptime)
✅ Slack alerts for critical errors
✅ Database query monitoring
```

---

## 📋 Implementation Checklist (Minimalist Approach)

### Phase 1: Core MVP (Week 1)
- [ ] Header with logo + search + language switcher
- [ ] Homepage: Universities list + Browse buttons
- [ ] Field list page: Show all fields for university
- [ ] Subject list page: Show all subjects for field
- [ ] Content list page: Show all content for subject
- [ ] Content page: Full article with back button
- [ ] Mobile responsive (system font, simple grid)
- [ ] Basic styling (CSS only, no framework)

### Phase 2: Polish (Week 2)
- [ ] Breadcrumb navigation
- [ ] Search functionality (full-text)
- [ ] Footer with links
- [ ] Save/bookmark (localStorage)
- [ ] Share buttons (simple links)
- [ ] Dark mode toggle (optional)
- [ ] Related content at bottom of article

### Phase 3: Monetization (Week 3)
- [ ] Google AdSense footer ads
- [ ] Donation button (Stripe Donate)
- [ ] Email digest signup (Sendgrid)
- [ ] Analytics (Google Analytics 4)
- [ ] Error tracking (Sentry basic)

### Phase 4: Optimization (Week 4+)
- [ ] Performance: LCP < 2s, PageSpeed 90+
- [ ] SEO: Meta tags, structured data
- [ ] A/B testing donation CTAs
- [ ] User feedback, iterate design

---

## 🎓 Code Structure (Suggested)

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (homepage)
│   ├── universities/
│   │   ├── page.tsx (list all)
│   │   ├── [name]/
│   │   │   ├── page.tsx (list fields)
│   │   │   └── [field]/
│   │   │       ├── page.tsx (list subjects)
│   │   │       └── [subject]/page.tsx (list content)
│   ├── [category]/
│   │   ├── page.tsx (category list)
│   │   └── [slug]/page.tsx (single content)
│   ├── search/page.tsx
│   ├── donate/page.tsx
│   └── about/page.tsx
├── components/ (Minimal, no-frills)
│   ├── Header.tsx (logo + search + language)
│   ├── Footer.tsx (links + copyright)
│   ├── ContentCard.tsx (image + title + metadata)
│   ├── Breadcrumb.tsx (navigation helper)
│   ├── SearchBar.tsx
│   ├── AdBanner.tsx
│   └── Button.tsx (simple, outline style)
├── lib/
│   ├── supabase.ts
│   ├── analytics.ts
│   └── search.ts
└── styles/
    └── globals.css (minimal, ~100 lines)
```

**Design Philosophy:**
- Minimal components, maximum reuse
- No design system library (write CSS directly)
- No animations, transitions, or hover effects
- Simple utility classes (color, spacing, text-size)
- Responsive: mobile-first, simple breakpoints
- Fast load: system fonts, no web fonts, optimized images

---

## 📊 Expected Metrics (6 months)

```
Users:
- 50K monthly active users
- 8K subscribed to email digest
- 1K monthly donors

Content:
- 5K+ pieces of content
- 50K+ page views/month
- 30% return visitor rate

Business:
- $8K/month advertising revenue
- $3K/month donation revenue
- $11K/month total ($132K/year)
- 2% average donation conversion rate

Performance:
- 2s LCP (Largest Contentful Paint)
- 90+ PageSpeed score
- 0.5s first byte time
```

---

## ✨ Key Success Factors

1. **Speed First** - Lazy users won't wait, keep everything < 2s
2. **Clarity** - ADHD users need clear hierarchy and minimal choices
3. **No Friction** - Reduce decision paralysis, recommend smart
4. **Mobile Priority** - Design for phones, enhance for desktop
5. **Cultural Fit** - Moroccan context, language, values
6. **Monetization** - Non-intrusive, provide real value
7. **Accessibility** - WCAG 2.1 AA compliance
8. **Analytics** - Track everything, iterate based on data

---

## 🎉 This Is Your CMS Frontend!

Use this specification to:
- Brief developers or agencies
- Request quotes from contractors
- Use as design brief for UI/UX designers
- Evaluate third-party solutions
- Create implementation timeline

**Next Steps:**
1. Review this specification
2. Adjust based on your vision
3. Create GitHub issues for each section
4. Assign to developers or start building
5. Launch MVP in 2-3 weeks

---

**Ready to build? Let me know and I'll start implementing!** 🚀
