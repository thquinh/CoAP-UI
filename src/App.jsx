import { useState } from 'react'
import Layout from "./components/Layout/Layout"
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout></Layout>
      {/* <RealChart></RealChart> */}
      <ToastContainer />
    </>
  )
}

export default App
