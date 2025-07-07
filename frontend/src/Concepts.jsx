import React, { useState } from "react";
import { fetchConcepts } from "./api";

function Concepts() {
  const [concepts, setConcepts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetConcepts = async () => {
    setLoading(true);
    const data = await fetchConcepts();
    setConcepts(data.concepts);
    setLoading(false);
  };

  return (
    <div>
      <h2>AI Concepts</h2>
      <button onClick={handleGetConcepts} disabled={loading}>
        {loading ? "Loading..." : "Get AI Concepts"}
      </button>
      {concepts && <pre style={{ marginTop: 12 }}>{concepts}</pre>}
    </div>
  );
}

export default Concepts; 