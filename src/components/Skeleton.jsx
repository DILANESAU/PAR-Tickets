// src/components/Skeleton.jsx
import React from "react";

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-slate-800 rounded-md ${className}`}></div>
  );
}

export default Skeleton;
