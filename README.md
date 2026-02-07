# Interactive Question Sheet Manager 

A modern, interactive React application for managing your DSA (Data Structures and Algorithms) question sheets. This project allows you to organize questions into topics and sub-topics, track your progress, and visualize your achievements with a built-in dashboard.

##  Features

- **Hierarchical Organization**: Manage Topics, Sub-Topics, and Questions in a structured view.
- **Drag & Drop Reordering**: Easily reorder any item (Topic, Sub-Topic, or Question) using intuitive drag-and-drop handles.
- **Progress Tracking**: Mark questions as "Done" or "Todo" and see your progress update instantly.
- **Statistics Dashboard (Bonus)**: 
    - Visualize your overall completion percentage.
    - Track questions solved by difficulty (Easy, Medium, Hard).
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on any device.
- **Data Persistence**: Starting data is fetched from the Codolio API, and changes are managed in local state (Zustand).

##  Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/) & [@dnd-kit/sortable](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utils**: `uuid` for unique IDs, `clsx` & `tailwind-merge` for class management.

##  Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.
- [npm](https://www.npmjs.com/) (usually comes with Node.js).

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder:
    ```bash
    cd question_management
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server**:
    ```bash
    npm run dev
    ```

2.  **Open in Browser**:
    Visit the URL shown in your terminal, typically `http://localhost:5173`.

##  Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Question.jsx    # Individual question item
│   ├── SubTopic.jsx    # Sub-topic container
│   ├── Topic.jsx       # Main topic container
│   └── StatsDashboard.jsx # Bonus statistics dashboard
├── store/              # State management
│   └── useStore.js     # Zustand store definition
├── utils/              # Helper functions
│   └── dataProcessor.js # API data transformation logic
├── App.jsx             # Main application entry point
└── main.jsx            # React DOM rendering
```

##  Usage Guide

1.  **Adding Content**: Use the "New Topic", "Sub-topic", or "Question" buttons to add new items.
2.  **Editing**: Click the **Edit (pencil)** icon to rename topics.
3.  **Reordering**: Drag items using the **Grip (six dots)** handle.
4.  **Marking Progress**: Click the **Circle/Check** icon next to a question to toggle its status.
5.  **Deleting**: Use the **Trash** icon to remove items.

---
© 2026 Question Sheet Manager. All rights reserved.
