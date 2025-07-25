# AI Workplace Learning Application - Frontend

## Features

- Sidebar navigation for all modules
- Progress cards and charts
- Modal dialogs for feedback and unknown intents
- Light/dark theme toggle
- Real user data integration
- Streaming AI responses for all LLM-powered features
- **Idea Log (Unknown Requests Table):**
  - Displays all user queries that could not be matched to an existing feature
  - **Filter by confidence level and module/topic** using dropdowns
  - **Search** by user input or intent
  - **Colored tags** for confidence (High/Medium/Low) and module match
- **Feature Roadmap Panel:**
  - Shows all user-submitted ideas and potential future features
  - **Color-coded status badges** for each phase (Idea, Planned, In Review, Coming Soon, Implemented)
  - **Sortable columns** for upvotes, status, and submission date (click column headers to sort)
  - Upvote, subscribe for notifications, or (admin) update status
  - Generate code scaffold for each feature

## UI Overview

### Idea Log (Unknown Requests Table)
- Access from the sidebar: **Idea Log**
- Use the **Confidence** and **Module** dropdowns to filter the table
- Use the **search box** to filter by user input or intent
- Confidence and module match are shown as **colored tags** for quick visual identification

### Feature Roadmap
- Access from the sidebar: **Feature Roadmap**
- Each feature/idea shows:
  - Feature name
  - **Status** (color-coded badge)
  - Summary
  - Upvotes (sortable)
  - Notifications
  - Submission date (sortable)
  - Generate Scaffold button
- **Status Legend** above the table shows the color for each phase
- **Click column headers** for Status, Upvotes, or Submitted to sort the table (ascending/descending)

## How to Use the New Features

- To filter ideas in the Idea Log, select a confidence level or module from the dropdowns, or type in the search box
- To sort the Feature Roadmap, click the column headers for Upvotes, Status, or Submitted; click again to toggle sort direction
- Statuses are color-coded for easy tracking of feature progress

---

For more details, see the main project README or contact the development team.
