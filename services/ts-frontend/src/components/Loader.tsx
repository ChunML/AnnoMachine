import React, { useEffect, useState } from "react";

function Loader(props: any) {
  const [text, setText] = useState("Uploading");

  useEffect(() => {
    const interval = setInterval(() => {
      setText(text === "Uploading..." ? "Uploading" : `${text}.`);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="segment loader">
      <p>{text}</p>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Loader;
