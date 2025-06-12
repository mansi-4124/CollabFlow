import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import Dashboard from "./pages/dashboard-page";
import ProjectDetailsPage from "./pages/project-details-page";
import BoardPage from "./pages/board-page";
import TaskDetailsPage from "./pages/task-details-page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          <Route path="/task/:taskId" element={<TaskDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
