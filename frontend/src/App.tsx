import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ApplicationsList from './pages/ApplicationsList';
import CreateApplication from './pages/CreateApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import EditApplication from './pages/EditApplication';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ApplicationsList />} />
          <Route path="applications/new" element={<CreateApplication />} />
          <Route path="applications/:id/edit" element={<EditApplication />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
