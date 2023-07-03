import { useState } from "react";
import { Button } from "@material-tailwind/react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return <Button variant="filled">filled</Button>;
}

export default App;
