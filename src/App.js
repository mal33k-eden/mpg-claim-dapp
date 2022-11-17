import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import { InvestmentsProvider } from "./context/investments";
import { InvestorProvider } from "./context/user";
import PageNotFound from "./pages/404";
import Claim from "./pages/Claim";
import Home from "./pages/Home";
import Load from "./pages/Load";
function App() {
  return (
    <InvestorProvider>
      <InvestmentsProvider>
        <Router>
          <div className="flex flex-col justify-between h-screen">
            <Navbar title="MPG" />
            <main className="container mx-auto px-3 py-12 min-h-screen  ">
              <Routes>
                <Route path="/" element={<Claim />} />
                <Route path="/load" element={<Load />} />
                <Route path="/old-claim" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </InvestmentsProvider>
    </InvestorProvider>
  );
}

export default App;
