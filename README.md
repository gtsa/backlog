# Plans Board - Kanban Task Management

A modern, responsive kanban-style project management board built with Next.js 16, React 19, and Tailwind CSS. Organize your plans across five stages: To Plan, Planning, In Progress, Review, and Done.

## Features

- **Drag & Drop Interface**: Easily move plans between columns with intuitive drag-and-drop functionality
- **User Authentication**: Simple email/password login system with user-specific boards
- **Demo Mode**: Try the app without logging in - see a pre-populated demo board with full interactivity
- **Search & Filter**: Find plans quickly with text search and tag-based filtering
- **Plan Management**: Create, edit, and delete plans with confirmation dialogs
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices (including Pixel 7)
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Tags & Due Dates**: Organize plans with custom tags and track deadlines
- **Local Storage**: User data is persisted in browser localStorage (no backend required)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gtsa/backlog.git
cd backlog
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Demo Mode

When you first open the app, you'll see a demo board with sample plans. You can:
- Drag plans between columns
- Create new plans
- Edit existing plans
- Delete plans with confirmation
- Search and filter by tags

**Note**: All changes in demo mode are temporary and won't be saved when you refresh.

### Authenticated Mode

1. Click the **Login** button in the top right corner
2. Enter any email and password (no actual authentication server required)
3. Your personal board will load from localStorage, or you'll start with a blank board
4. All changes are automatically saved to your browser's localStorage
5. Click **Logout** to return to demo mode

### Creating Plans

1. Click the **New Plan** button
2. Fill in the plan details:
   - Title (required)
   - Description (required)
   - Status (column)
   - Tags (comma-separated)
   - Due date (optional)
3. Click **Save**

### Editing Plans

- Click any plan card to open the edit modal
- Update any fields
- Click **Save** to apply changes or **Delete** to remove the plan

### Deleting Plans

- Hover over a plan card and click the trash icon
- Or open the plan modal and click the **Delete** button
- Confirm deletion in the confirmation dialog

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with auth provider
│   ├── page.tsx            # Main kanban board page
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── kanban-column.tsx   # Column component with drag-drop
│   ├── plan-card.tsx       # Individual plan card
│   ├── plan-modal.tsx      # Create/edit plan modal
│   ├── filters-bar.tsx     # Search and filter controls
│   ├── login-dialog.tsx    # Login modal
│   └── delete-confirmation-dialog.tsx  # Delete confirmation
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── use-auth.tsx        # Authentication context/hook
│   └── use-plans.tsx       # Plans state management hook
└── README.md
```

## Key Components

### usePlans Hook

Manages all plan state, filtering, and CRUD operations:
- Loads demo plans for unauthenticated users
- Loads user-specific plans from localStorage for authenticated users
- Handles search and tag filtering
- Provides functions to add, update, delete, and move plans

### useAuth Hook

Simple authentication context that:
- Tracks login state
- Stores current user email
- Provides login/logout functions
- No actual authentication server (email/password accepted for demo purposes)

### Responsive Design

The app is fully responsive with breakpoints optimized for:
- Mobile: 320px - 640px (Pixel 7: 393px × 851px)
- Tablet: 640px - 1024px
- Desktop: 1024px+

Mobile optimizations include:
- Horizontal scrolling for kanban columns
- Stacked search and button layout
- Compact spacing and text sizes
- Touch-friendly tap targets

## Data Persistence

- **Demo Mode**: No persistence - data resets on refresh
- **Authenticated Mode**: Data saved to `localStorage` under key `plans_<email>`
- Each user's plans are stored separately based on their email

## Design System

The app uses a professional teal accent color scheme with semantic design tokens:
- Primary: Teal for CTAs and interactive elements
- Accent: Bright teal for highlights
- Neutrals: Grays for backgrounds and borders
- Destructive: Red for delete actions

## Future Enhancements

Potential features to add:
- Real backend integration (Supabase, Firebase, etc.)
- OAuth authentication (Google, GitHub)
- Plan comments and activity history
- File attachments
- Collaborative features (sharing boards)
- Export/import functionality
- Advanced filtering (due date ranges, assignees)
- Notifications for overdue plans


## License
This project is currently licensed for non-commercial use. For commercial licensing and full terms and conditions, see [LICENSE](LICENSE) file.

---

**Built with ❤️ by George Tsagiannis | [gtsa](https://github.com/gtsa)**
