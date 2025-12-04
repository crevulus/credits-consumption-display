import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [hello, setHello] = useState<string>("");

  // Fetch backend hello message
  const fetchHello = async () => {
    const res = await fetch("http://127.0.0.1:8000/hello");
    const data = await res.json();
    setHello(data.message);
  };

  // Fetch on mount
  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <>
      <div style={{ marginTop: "2em" }}>
        <h2>Backend says:</h2>
        <p>{hello}</p>
      </div>
    </>
  );
}

export default App;
