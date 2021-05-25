import './App.css';
import Navbar from './navbar'
import Banner from './banner'
import Products from './products'
import Footer from './footer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar/>
        <Banner/>
        <Products/>
        <Footer/>
      </header>
    </div>
  );
}

export default App;
