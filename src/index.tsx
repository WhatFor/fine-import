import React from "react";

const SayHello = ({ name }: { name: string }) => (
  <div className="bg-red-100">Hey, {name}!</div>
);

export default SayHello;
