import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import IndexRouter from "./routers/IndexRouter";
import Footer from './components/Footer/Footer';
import Spinner from './components/Spinner/Spinner';

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Spinner/>;

  return (
    <div className="App">
      <IndexRouter />
      <Footer/>
    </div>
  );
}

export default App;
