import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Papers from './pages/Papers';
import PaperDetail from './pages/PaperDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Gaps from './pages/Gaps';
import Experiments from './pages/Experiments';
import Researchers from './pages/Researchers';
import Datasets from './pages/Datasets';
import Algorithms from './pages/Algorithms';
import Notes from './pages/Notes';
import Search from './pages/Search';
import Settings from './pages/Settings';
import GapFinder from './pages/GapFinder';
import KnowledgeGraph from './pages/KnowledgeGraph';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gap-finder" element={<GapFinder />} />
          <Route path="/graph" element={<KnowledgeGraph />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/papers/:id" element={<PaperDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/gaps" element={<Gaps />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/researchers" element={<Researchers />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
