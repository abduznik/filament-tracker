import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddFilament } from './pages/AddFilament';
import { FilamentDetail } from './pages/FilamentDetail';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddFilament />} />
          <Route path="/filament/:id" element={<FilamentDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;