# AI Workplace Learning Application - Frontend

## Features

- **🤖 AI-Powered Learning**: Generate personalized micro-lessons and learning content
- **📊 Progress Tracking**: Monitor learning progress with detailed analytics
- **🎯 Skill Assessment**: AI-driven skill evaluation and recommendations
- **📚 Micro-Lessons**: Bite-sized learning content with AI generation
- **🎮 Interactive Simulations**: Scenario-based learning experiences
- **🔍 Web Search Integration**: Real-time web search for current information
- **🎥 Video Lessons**: Video content with AI-generated quizzes and summaries
- **💼 Career Coaching**: AI-powered career guidance and development
- **📈 Skills Forecasting**: Predictive analytics for skill development
- **🏆 Certification Tracking**: Monitor and manage professional certifications
- **👥 Team Dynamics**: Analyze and improve team collaboration
- **🎨 Light/Dark Theme**: Customizable interface themes
- **🔍 Global Search**: Search across all features with keyboard shortcuts
- **🎤 Voice Input**: Speech-to-text for hands-free interaction
- **⚡ Streaming AI Responses**: Real-time AI response streaming
- **🎯 Per-Query Confidence Bar**: Adjustable confidence thresholds for AI routing
- **📝 Idea Log**: Admin interface for managing user suggestions and feedback
- **🗺️ Feature Roadmap & AI Code Generation**: AI-powered code scaffolding with 6 scaffold types
- **🔮 Phase 5 Preview**: Vision for real-time dynamic feature activation with live demo preview

## Phase 5: Real-Time Dynamic Feature Activation

Our application includes a **Phase 5 Preview** that showcases the future of adaptive, self-evolving applications. This vision demonstrates:

### 🏗️ Technical Architecture
- **🧠 Cursor AI + Scaffolding**: Generate backend/frontend/test/docs code
- **🐛 Bugbot Integration**: Catch runtime and build-time errors in AI code  
- **🔁 Hot Reloading**: Inject new code without full restart
- **🧪 Sandbox Execution**: Secure VMs/containers for testing generated code
- **🧯 Rollback Safety**: Git snapshots or state backups before patching
- **🔗 Real-Time PR Automation**: Auto-create branches, PRs, and notify admins

### 📊 Business Impact
- **⏱️ Speed**: New features in hours, not weeks
- **🎯 Personalization**: User-driven evolution
- **🔄 Agility**: Dynamic adaptation
- **🚀 Competitive Edge**: AI-powered innovation

### 🛠️ Implementation Roadmap
- **Short-Term**: Phase 5 Preview panel, live scaffold testing, experimental feature tags
- **Medium-Term**: Git snapshot rollback, sandbox module trials, enhanced security
- **Long-Term**: Full PR generation, auto-validation pipelines, production deployment

This vision positions our application as a pioneer in the future of AI-powered development platforms.

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

## Feature Roadmap: AI Code Scaffold Options

When generating a scaffold for a feature, you can now choose from 6 options:

1. **API Route**: Generates a FastAPI route (Python) with Pydantic models as needed. Use this to scaffold new API endpoints for your backend.
2. **DB Model**: Generates a MongoDB (Motor) collection/model and any related Pydantic schemas. Use this to scaffold new database models for your backend.
3. **Background Job**: Generates an async background task (e.g., using FastAPI's BackgroundTasks or Celery). Use this for features that require scheduled or background processing.
4. **Unit Test**: Generates a Python unit test for the feature. Use this to scaffold tests for your backend logic or API routes.
5. **Cypress Test**: Generates a Cypress end-to-end test for the feature. Use this to scaffold automated UI tests for your frontend.
6. **Docs**: Generates markdown documentation for the feature. Use this to create self-documenting code and feature guides.

A short preview/description of each option is shown in the Feature Roadmap panel to help you choose the right scaffold type.

🧠 What This Feature Is
The scaffold dropdown in your Feature Roadmap UI allows users (usually admins, devs, or PMs) to trigger AI-generated boilerplate code for new features based on the feature type. It's powered by your integration with GPT (likely via Cursor AI or OpenAI).

It turns feature ideas into working code scaffolds — saving time and standardizing structure.

👤 Who It’s For
| Role           | Usage Purpose                                                                 |
|----------------|-------------------------------------------------------------------------------|
| Developers     | To generate backend/frontend code quickly and stay consistent with project architecture. |
| Tech Leads     | To spin up base code and delegate implementation.                             |
| PMs/Admins     | To preview how a feature might look or trigger dev work with AI support.      |
| New contributors | To understand how a feature is structured and get a head start on implementation. |

🔧 How Each Scaffold Type Works
1. 🟦 API Route
   - Generates: @router.post("/feature-name") or similar route with FastAPI + Pydantic.
   - Use: When adding a new backend endpoint.
   - Example Output:
     ```python
     @router.post("/learning-tip")
     async def send_tip(tip: LearningTip):
         ...
     ```
2. 🟩 DB Model
   - Generates: MongoDB/Motor model + matching Pydantic schemas.
   - Use: When a new feature needs data persistence.
   - Example Output:
     ```python
     class LearningTip(BaseModel):
         tip: str
         created_at: datetime = Field(default_factory=datetime.utcnow)
     ```
3. 🟨 Background Job
   - Generates: An async task or Celery worker.
   - Use: For scheduled tasks like daily emails or report generation.
   - Example:
     ```python
     async def send_daily_tip():
         ...
     ```
4. 🔵 Unit Test
   - Generates: pytest unit test for API or logic.
   - Use: To cover the newly scaffolded code with test coverage.
   - Example:
     ```python
     def test_send_tip():
         ...
     ```
5. 🟣 Cypress Test
   - Generates: End-to-end UI test using Cypress.
   - Use: When adding or validating frontend changes.
   - Example:
     ```js
     it('submits daily tip', () => {
       cy.visit('/daily-tip');
       ...
     });
     ```
6. 📄 Docs
   - Generates: Markdown doc explaining the feature's purpose, route, and usage.
   - Use: For internal or user-facing documentation.
   - Example:
     ```markdown
     ### Daily AI Tip
     This feature sends a daily AI-generated learning tip to users.
     ```

🚀 Workflow Example (Developer)
- A new idea is added to roadmap: "Daily Learning Tip".
- Admin sets status to Planned.
- Developer chooses:
  - API Route to generate a /daily-tip endpoint.
  - DB Model for storing tips.
  - Background Job for scheduling.
  - Unit Test + Docs.
- Cursor AI or backend LLM returns the scaffolded code → dev integrates it.

---

## Admin Approval Workflow for Scaffolds

- Each generated scaffold in the Feature Roadmap history can be reviewed and approved by an admin.
- Admins can leave an approval comment/feedback when marking a scaffold as approved.
- Approval status, approver, timestamp, and comment are displayed for each scaffold in the history modal.
- Only unapproved scaffolds show the "Approve" button; approved scaffolds display a green check and details.
- This creates a full audit trail and collaborative review process for all AI-generated code.

Enjoy your weekend! 🎉

For more details, see the main project README or contact the development team.

## Manual Test Checklist
- Sidebar navigation for all modules
- Progress cards and charts
- Modal dialogs for feedback and unknown intents
- Light/dark theme toggle
- Real user data integration
- Streaming AI responses for all LLM-powered features
- Idea Log: Filtering, tagging, delete, and search
- **Feature Roadmap:** View, upvote, subscribe, change status, and generate AI code scaffold for features. Status badges and sorting work as expected.
- Run Test: Now includes Feature Roadmap in the checklist
