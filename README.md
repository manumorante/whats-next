# What's Next?

[![Tests](https://github.com/manumorante/whats-next/actions/workflows/test.yml/badge.svg)](https://github.com/manumorante/whats-next/actions/workflows/test.yml)

An intelligent activity recommendation system that suggests the right tasks at the right time, based on your schedule, context, and preferences.

## Features

- **Smart Suggestions**: Activities recommended based on current time, day of week, and active contexts
- **Flexible Scheduling**: Define activities with specific time slots or flexible contexts (work hours, after work, weekends, etc.)
- **Intelligent Scoring**: Algorithm considers priority, energy level, recurrence, and completion history
- **Categories**: Organize activities into Productive, Leisure, Social, Wellness, and Maintenance
- **Real-time Updates**: Auto-refresh every 5 minutes to adapt to your changing schedule
- **Completion Tracking**: Monitor your progress and streaks for recurring activities

## Tech Stack

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Database**: Turso (SQLite at the edge)
- **Data Fetching**: SWR with optimistic updates
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd whats-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Turso credentials:
```bash
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token
```

4. Run the migration:
```bash
turso db shell <your-db-name> < migrations/001_initial_schema.sql
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Schema

- **activities**: Main activity data with title, description, category, priority, duration, energy level, etc.
- **categories**: Activity categories (Productive, Leisure, Social, Wellness, Maintenance)
- **contexts**: Time-based contexts (work_hours, after_work, weekend, etc.)
- **activity_time_slots**: Specific time windows for activities
- **activity_contexts**: Many-to-many relationship between activities and contexts
- **activity_completions**: Completion history for tracking and statistics

## How It Works

### Scoring Algorithm

Activities are scored based on multiple factors:

- **+60 pts**: Matches specific time slot
- **+50 pts**: Matches active context
- **+40 pts**: Urgent priority
- **+25 pts**: Important priority
- **+20 pts**: Recurring activity pending today
- **+15 pts**: Energy level matches time of day
- **-30 pts**: Completed less than 2 hours ago

### Example Use Cases

1. **"Go to the gym"**
   - Contexts: lunch_break, after_work, weekend_morning
   - Energy: high
   - Priority: important
   - Duration: 60 min

2. **"Team standup meeting"**
   - Time slots: Mon-Fri 10:00-10:30
   - Priority: important
   - Recurrence: daily

3. **"Watch a movie"**
   - Contexts: after_work, weekend_evening
   - Energy: low
   - Category: Leisure

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Lint and format with auto-fix

### Testing

Tests are built with **Vitest** and **Testing Library**. Coverage includes:

- **Unit Tests**: Algorithm logic, context matching, type validation
- **Integration Tests**: API client, hooks with SWR
- **Component Tests**: UI rendering and interactions

Run tests:
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

### Project Structure

```
├── app/
│   ├── api/           # API routes
│   │   ├── activities/
│   │   ├── categories/
│   │   ├── contexts/
│   │   └── suggestions/
│   ├── layout.tsx
│   └── page.tsx       # Main page
├── components/        # React components
├── hooks/            # Custom SWR hooks
├── lib/              # Business logic
│   ├── activities.ts
│   ├── categories.ts
│   ├── contexts.ts
│   ├── suggestions.ts
│   ├── api.ts        # API client
│   ├── db.ts         # Database client
│   └── types.ts      # TypeScript types
└── migrations/       # Database migrations
```

## API Endpoints

### Activities
- `GET /api/activities` - List activities (with filters)
- `POST /api/activities` - Create activity
- `PUT /api/activities?id=X` - Update activity
- `DELETE /api/activities?id=X` - Delete activity
- `POST /api/activities/[id]/toggle` - Toggle completion
- `POST /api/activities/[id]/complete` - Mark as completed (for recurring)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories?id=X` - Update category
- `DELETE /api/categories?id=X` - Delete category

### Contexts
- `GET /api/contexts` - List contexts
- `GET /api/contexts?active=true` - Get active contexts
- `POST /api/contexts` - Create context
- `PUT /api/contexts?id=X` - Update context
- `DELETE /api/contexts?id=X` - Delete context

### Suggestions
- `GET /api/suggestions?limit=10&category=X` - Get suggestions

## Customization

### Adding Custom Contexts

You can create custom contexts that fit your schedule:

```typescript
await createContext(
  'early_bird',           // name
  'Early morning work',   // label
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // days
  '05:00',               // start time
  '08:00'                // end time
);
```

### Creating Activities

```typescript
await createActivity({
  title: 'Morning run',
  description: 'Cardio workout',
  category_id: 4,        // Wellness
  duration_minutes: 30,
  energy_level: 'high',
  priority: 'important',
  contexts: [5],         // weekend_morning
  is_recurring: true,
  recurrence_type: 'daily'
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Future Ideas

- [ ] Mobile app (React Native)
- [ ] Push notifications for suggested activities
- [ ] Statistics dashboard
- [ ] Weather-based suggestions
- [ ] Calendar integration
- [ ] Team/shared activities
- [ ] Habit tracking with streaks
- [ ] AI-powered suggestions using user patterns

---

Built using Next.js and Turso
