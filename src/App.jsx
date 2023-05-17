import { useState } from 'react'
import Layout from "./components/Layout/Layout"
import './App.css'
import RealChart from './components/Chart/Chart'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout></Layout>
      {/* <RealChart></RealChart> */}
    </>
  )
}

export default App
