"use client";

import { useEffect, useState } from "react";

export default function Homes() {
  const [background, setBackground] = useState("#000");
  const [textColor, setTextColor] = useState("#fff");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4000/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.background, data.textColor);
      if (data.background) return setBackground(data.background) 
      
      if (data.textColor) return setTextColor(data.textColor);
      
    };

    return () => {
      eventSource.close();
    };
  }, []);

  console.log(textColor)

  return (
    <div
      style={{ backgroundColor: background, color: '#f44444' }}
      className="flex flex-col items-center justify-center h-screen transition-all duration-500 "
    >
      <h1 className="text-3xl font-bold text-white">Arduino Button Control</h1>
      <p className="text-white opacity-75 mt-4">Press the Arduino button to change background color!</p>
    </div>
  );
}
