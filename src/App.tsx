import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Features from './pages/Features';
import Docs from './pages/Docs';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Analyze from './pages/Analyze';
import SavedTokens from './pages/SavedTokens';

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="analyze" element={<Analyze />} />
                    <Route path="saved" element={<SavedTokens />} />
                    <Route path="features" element={<Features />} />
                    <Route path="docs" element={<Docs />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="terms" element={<Terms />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
