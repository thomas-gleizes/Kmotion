import React, { useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const Home: Page = () => {
  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("connected");

      socket.emit("message", "Hello from client");

      socket.on("message", (data) => {
        console.log("Data", data);
      });
    });
  }, []);

  const handleClick = async () => {
    const response = await axios.post("/api/auth/sign-in", { email: "kalat@email.fr", password: "azerty" });

    console.log("Response", response);
  };

  return (
    <div className="h-screen p-10">
      <button onClick={handleClick} className="px-5 py-2 bg-blue-500 text-white">
        Click me
      </button>
    </div>
  );
};

export default Home;
