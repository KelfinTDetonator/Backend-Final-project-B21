import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Header from "./Components/Header";
=======
import Header from "./components/Header";
>>>>>>> backend
import Homepage from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
