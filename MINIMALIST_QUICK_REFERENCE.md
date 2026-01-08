# Faculty.ma Frontend - Quick Reference

**Minimalist Design. PDFDrive Inspired. Seconds to Content.**

---

## 📋 What Changed from Previous Spec

### Before: Complex, Multi-feature
- ✅ Premium tiers, subscriptions
- ✅ Personalized feed, ML recommendations
- ✅ Carousels, animations, transitions
- ✅ Multiple colors, web fonts
- ✅ Complex design system
- ✅ Sidebars, floating elements
- ✅ 4 weeks to build

### After: Minimalist, Direct
- ✅ Free for all users
- ✅ Simple hierarchy navigation
- ✅ Zero animations, plain CSS
- ✅ System fonts, 3 colors (black/blue/gray)
- ✅ No design system needed
- ✅ Single column + content focus
- ✅ 2-3 weeks to build (50% faster!)

---

## 🏗️ Information Architecture

Users find content by following this hierarchy:

```
1. Homepage (search + universities list)
   ↓
2. University page (list of fields)
   ↓
3. Field page (list of subjects)
   ↓
4. Subject page (list of content cards)
   ↓
5. Content page (full article/materials)
```

**URLs:**
- `/` - Homepage
- `/universities` - All universities
- `/universities/[name]` - Fields in university
- `/universities/[name]/[field]` - Subjects in field
- `/universities/[name]/[field]/[subject]` - Content list
- `/[category]/[slug]` - Single content
- `/search?q=[query]` - Search results

---

## 🎨 Design Basics

### Colors (Only 3!)
```
#1A1A1A - Black (all text)
#0066CC - Blue (links, hover)
#F5F5F5 - Light gray (backgrounds)
```

### Typography
```
Font: System fonts only (-apple-system, "Segoe UI", Roboto)
Sizes: H1=24px, H2=18px, Body=14px, Small=12px
```

### Components
```
Buttons: Simple, 44px tall, no shadow
Cards: Border only, image + title + metadata
Links: Underline on hover
Inputs: 44px tall, border only
```

### Spacing (8px Grid)
```
Padding: 8px, 16px, 24px
Margins: 8px, 16px, 24px
Gap: 8px (between items)
```

### Layout
```
Mobile: 1 column, full width
Tablet: 2 columns
Desktop: 3-4 columns, max 920px wide
```

---

## 🎯 Key Pages

### Homepage
```
Header: Faculty.ma | Search | FR|AR|EN | Theme
Content:
  - Universities list (text links)
  - Browse buttons
  - That's it!
Footer: About | Contact | Donate
```

### Content Page
```
Header: Faculty.ma | Search | FR|AR|EN | Theme
Breadcrumb: Home > University > Field > Subject
Content:
  - Title (h1)
  - Metadata (gray text)
  - Progress bar
  - Article body (14px, line-height 1.5)
  - Save & Share buttons
  - Related content (3 links)
Footer: Links
```

### Search Results
```
Header: Faculty.ma | Search | FR|AR|EN | Theme
Content:
  - Search query repeated
  - Results count
  - Simple list of results (text-based or cards)
  - No filtering, no complex UI
Footer: Links
```

---

## 🚀 Build Timeline

### Week 1: Core Pages
- [ ] Header component (logo, search, language)
- [ ] Homepage (university list)
- [ ] University/Field/Subject pages (list views)
- [ ] Content page (article view)
- [ ] Footer
- [ ] Basic CSS (no framework)

### Week 2: Features
- [ ] Search functionality
- [ ] Breadcrumb navigation
- [ ] Save/Bookmark (localStorage)
- [ ] Share buttons
- [ ] Responsive design
- [ ] Dark mode (optional)

### Week 3: Launch
- [ ] Google AdSense ads
- [ ] Donation button
- [ ] Email subscription
- [ ] Analytics setup
- [ ] Deploy to Vercel
- [ ] Domain setup

---

## 💡 Building Philosophy

### DO:
```
✅ Use system fonts
✅ Simple borders (1px #E0E0E0)
✅ Black text on white background
✅ Touch-friendly buttons (44px+)
✅ Plain HTML/CSS
✅ Mobile-first approach
✅ Server-side rendering (SSR)
✅ Simple, readable code
```

### DON'T:
```
❌ Use web fonts
❌ Add shadows or gradients
❌ Use rounded corners (border-radius: 0)
❌ Add animations or transitions
❌ Use design system libraries
❌ Create complex components
❌ Add sidebars or floating elements
❌ Use hover effects (except color change)
```

---

## 📊 Performance Targets

```
LCP (Load):     < 2.0 seconds ⚡
PageSpeed:      90+ score 🎯
CSS:            < 20KB (gzip) 📦
JS:             < 50KB (gzip) 📦
Images:         WebP + lazy-load 🖼️
```

---

## 🔧 Tech Stack (Simple)

```
Frontend:   Next.js 14 (App Router)
Language:   TypeScript
Styling:    Plain CSS (no Tailwind)
Database:   Supabase (already set up)
Hosting:    Vercel (auto-deploy)
Analytics:  Google Analytics 4 (minimal)
```

---

## ✅ Launch Checklist

Before going live:

**Design:**
- [ ] No animations
- [ ] No shadows/gradients
- [ ] Black text, blue links
- [ ] 44px buttons
- [ ] 14px body text
- [ ] System fonts only

**Functionality:**
- [ ] Search works
- [ ] All pages load < 2s
- [ ] Mobile responsive
- [ ] Links work
- [ ] Images load
- [ ] Dark mode works (if included)

**Content:**
- [ ] Data from Supabase loads
- [ ] Universities show
- [ ] Fields/Subjects show
- [ ] Content displays
- [ ] Metadata visible

**Monetization:**
- [ ] AdSense ads show
- [ ] Donation button visible
- [ ] Email signup works
- [ ] Analytics tracking

**Accessibility:**
- [ ] WCAG AA contrast (4.5:1)
- [ ] Touch targets 44px+
- [ ] Works without JavaScript
- [ ] Screen reader friendly

---

## 📈 Success Metrics (First 6 Months)

```
Users:        50K monthly visitors
Content:      5K+ pieces
Engagement:   30% return rate
Donations:    1K monthly
Revenue:      $11K/month (ads + donations)
Performance:  2s load time, 90+ PageSpeed
```

---

## 🎓 Design Examples

### PDFDrive-style Content Card
```
┌──────────────────┐
│                  │
│    [Image]       │  200x150
│   (No text)      │
│                  │
├──────────────────┤
│ Title Text       │  Bold, 2 lines max
│ (2 Lines Max)    │
│                  │
│ Grade 8          │  Gray, 12px
│ Mathematics      │
│                  │
│ Jan 5 · 15 min   │  Gray, 12px
└──────────────────┘
  (Border on hover changes to blue)
```

### Simple Button Styles
```
Primary:    Blue background (#0066CC), white text
Outline:    Blue border (#0066CC), blue text, no fill
Link:       Blue text (#0066CC), underline on hover

All: 44px height, 8px × 12px padding, no radius
```

### Search Page Layout
```
┌────────────────────────────────┐
│ Faculty.ma  [Search: math...]  │
├────────────────────────────────┤
│ 127 Results for "math"         │
│                                │
│ □ Algebra Basics               │
│   Grade 8 - Mathematics        │
│                                │
│ □ Calculus I                   │
│   Grade 12 - Mathematics       │
│                                │
│ □ Linear Algebra               │
│   University Level             │
│                                │
│ [Load more...]                 │
└────────────────────────────────┘
```

---

## 🆘 Common Questions

**Q: Should I add a carousel on homepage?**
A: No. Use simple university list instead.

**Q: Should I add animations?**
A: No. Users find content faster without animations.

**Q: Should I use Tailwind CSS?**
A: Optional. Plain CSS is simpler and smaller.

**Q: Should I add dark mode?**
A: Optional. Use CSS media query if you do.

**Q: Should I add personalization?**
A: No. Simple hierarchy is clearer.

**Q: Should I add premium features?**
A: No. Everything free, funded by ads + donations.

**Q: Should I add filters on search?**
A: No. Users navigate hierarchy or search.

**Q: Should I add real-time notifications?**
A: No. Simple email digest instead.

---

## 📞 Next Steps

1. **Review this specification**
2. **Approve design direction**
3. **Start building Week 1 items**
4. **Test on real devices**
5. **Launch MVP in 2-3 weeks**
6. **Get user feedback**
7. **Iterate based on data**

---

**Ready to build something simple and fast?** 🚀

**Philosophy:** *Minimize clutter. Maximize clarity. Delete the unnecessary.*
