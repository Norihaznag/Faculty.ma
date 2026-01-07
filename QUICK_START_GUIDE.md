# 🚀 Quick Start Guide - CMS Features

## For Content Creators

### Creating University Content
```
1. Home → "New University Post"
2. Select: University → Faculty → Field → Semester → Subject
3. Fill: Title, Description, Content Type
4. Optional: Add file URL (PDF, Word docs)
5. Optional: Add embed URL (YouTube videos, etc.)
6. Choose: Save as Draft or Publish
7. Submit → Done!
```

### Creating School Content
```
1. Home → "New School Post"
2. Select: School Level → Year → Subject
3. Fill: Title, Description, Content Type
4. Optional: Add file URL (PDF, Word docs)
5. Optional: Add embed URL (YouTube videos, etc.)
6. Choose: Save as Draft or Publish
7. Submit → Done!
```

### Browsing Content
```
1. Home → "Browse Content"
2. Search: Type keywords to find posts
3. Filter: By Type, Level, Status
4. Sort: Newest, Oldest, Title
5. Click post: View full details
6. Edit/Delete: Available in preview modal
```

### Editing Posts
```
1. Browse → Click post → Preview modal
2. Click "Edit" button
3. Modify: Title, Description, Type, URLs
4. Click "Save Changes"
5. Automatic refresh → Done!
```

### Deleting Posts
```
1. Browse → Click post → Preview modal
2. Click "Delete" button
3. Confirm: Read warning message
4. Click "Delete Permanently"
5. Post removed → Done!
```

---

## For Administrators & Moderators

### Accessing Admin Panel
```
Click "Database Management" in navigation
OR: Home → Quick action card labeled "Database Management"
```

### Managing Structure

#### Universities
- View all universities
- Add new university (name, city)
- Edit university details
- Delete university (and all related data)

#### Faculties
- Select university first
- View faculties in that university
- Add, edit, delete faculties

#### Fields
- Select faculty first
- View fields in that faculty
- Add, edit, delete fields
- Specify degree type (licence/master)

#### Semesters
- Select field first
- View semesters in that field
- Add, edit, delete semesters
- Choose semester name (S1-S6)

#### Subjects
- Select semester first
- View subjects in that semester
- Add, edit, delete subjects

#### School Levels
- View all school levels (Collège, Lycée)
- Add new level
- Edit, delete levels

#### School Years
- Select level first
- View years in that level
- Add, edit, delete years

#### School Subjects
- Select year first
- View subjects in that year
- Add, edit, delete subjects

#### Posts Management
- View all posts in table
- Delete posts (simple delete, no edit here)
- View title, type, publication status
- Quick status overview

---

## Dashboard Overview

### Home Page Shows:
1. **Welcome Message** - Personalized greeting
2. **Quick Actions** - Create posts, browse, admin (based on role)
3. **Content Statistics** - Total posts, published, drafts
4. **Recent Posts** - Latest 5 posts with details

### Quick Stats
- **Total Posts** - All posts in system
- **Published** - Live posts visible to users
- **Drafts** - Posts not yet published

---

## Content Types Explained

When creating posts, choose a content type:

| Type | Purpose | Example |
|------|---------|---------|
| **Course** | Learning material | Lecture notes, tutorials |
| **Exam** | Assessment content | Past papers, tests |
| **TD** | Practical work | Exercises, assignments |
| **Summary** | Study guides | Quick reference, notes |
| **Link** | External resource | Website, article, tool |

---

## Education Levels Explained

### University Structure
- **University** → Top level (e.g., "University of Mohammed V")
- **Faculty** → Department (e.g., "Faculty of Science")
- **Field** → Program (e.g., "Computer Science", "Biology")
- **Degree Type** → Licence (Bachelor) or Master
- **Semester** → S1-S6 (6 semesters = 3 years)
- **Subject** → Individual courses

### School Structure
- **Level** → Collège (Middle) or Lycée (High)
- **Year** → Grade/Form (e.g., "Year 1", "Year 3")
- **Subject** → Courses (e.g., "Mathematics", "French")

---

## Advanced Features

### Full-Text Search
```
Browse → Type in search box
Searches: Post titles and descriptions
Real-time: Results update as you type
```

### Filtering (Multiple Filters Work Together)
```
Browse → Select filters
- Content Type: Show only course, exam, etc.
- Education Level: Show only university, school
- Status: Show only published, drafts
```

### Sorting
```
Browse → Choose sort order
- Newest First: Most recently created first
- Oldest First: Earliest created first
- Title A-Z: Alphabetical order
- Title Z-A: Reverse alphabetical
```

### Analytics
```
Browse → Click "Show Analytics"
Shows:
- Content type distribution
- Education level distribution
- Publication status breakdown
- Total counts
```

---

## Roles & Permissions

### Admin
- ✅ Create, edit, delete all posts
- ✅ Access admin panel
- ✅ Manage all database structures
- ✅ View all content (published & draft)

### Moderator
- ✅ Create, edit, delete all posts
- ✅ Access admin panel (NEW)
- ✅ Manage all database structures (NEW)
- ✅ View all content (published & draft)

### Regular User
- ✅ Create posts
- ✅ Browse published posts
- ⚠️ Cannot edit/delete other users' posts
- ⚠️ Cannot access admin panel

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Back/Escape | Close modals, exit edit |
| Enter | Submit forms (in some contexts) |
| Tab | Navigate between fields |
| Space | Toggle checkboxes |

---

## Common Tasks

### How to Add a Subject?
```
1. Admin Panel → Click "Subjects" tab
2. Click "Add Subject"
3. Select: Semester, then enter name
4. Click "Add" button
```

### How to Reorganize Faculty?
```
1. Admin Panel → Click "Faculties" tab
2. Find the faculty
3. Click "Edit" button
4. Modify the name
5. Click "Save" button
```

### How to Archive a Post?
```
1. Browse → Click post
2. Click "Edit"
3. Uncheck "Publish immediately"
4. Click "Save Changes"
→ Post becomes draft (archived)
```

### How to Promote a Draft?
```
1. Browse → Filter by "Draft" status
2. Click post
3. Click "Edit"
4. Check "Publish immediately"
5. Click "Save Changes"
→ Post becomes published
```

---

## Troubleshooting

### Can't See Admin Panel?
- ❓ Are you admin/moderator? Check header for your role
- ✅ Solution: Ask admin to grant moderator role

### Posts Not Showing in Browse?
- ❓ Did you publish them? Check "Publish immediately" checkbox
- ✅ Solution: Edit post and check publish status

### Can't Edit a Post?
- ❓ Did you create it? Or are you admin/moderator?
- ✅ Solution: Only creators and admins can edit

### Search Not Finding Posts?
- ❓ Are posts published? Search only shows published
- ✅ Solution: Publish the posts first

### Missing a Subject?
- ❓ Did you create the full hierarchy? University → Faculty → Field → Semester → Subject
- ✅ Solution: Create missing levels first in Admin Panel

---

## Best Practices

✅ **DO:**
- Use clear, descriptive titles
- Write helpful descriptions
- Include file/embed URLs when available
- Publish content regularly
- Use appropriate content types
- Review and fix typos before publishing
- Organize content hierarchically

❌ **DON'T:**
- Use ALL CAPS titles
- Leave descriptions blank
- Create duplicate posts
- Delete important content
- Forget to set publish status
- Use broken file links
- Mix unrelated content

---

## Support

For issues or questions:
1. Check the dashboard for help
2. Review this guide
3. Contact your administrator
4. Check error messages for details

---

## Version Info
- **CMS Version:** 1.0.0
- **Last Updated:** January 7, 2026
- **Status:** Production Ready
