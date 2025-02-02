"use client"; // For Next.js 13+ to indicate client-side rendering

import React, { useState, useEffect, useRef } from "react";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");

  const eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream(); // Close any existing connection
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream(); // Close any existing connection
      initializeEventStream(); // Open a new connection
    }
  }, [recipeData]);

  const initializeEventStream = async () => {
    console.log("Initializing")
    try {
    const recipeInputs = { ...recipeData };
    const queryParams = new URLSearchParams(recipeInputs).toString();
    console.log(queryParams);
    const url = `http://localhost:3002/recipeStream?${queryParams}`;
    
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json(); // Assuming server sends JSON data
      
      if (data.recipe) {
        // Update the state with the generated recipe
        setRecipeText(data.recipe);
      }
    } else {
      console.error("Error fetching recipe:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const onSubmit = (data) => {
    // setRecipeText('');
    setRecipeData(data);
  };

  return (
    <div className="App">
      <div className="flex flex-row h-full my-4 gap-2 justify-center">
        <RecipeCard onSubmit={onSubmit} />
        <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shadow-xl whitespace-pre-line overflow-y-auto">
          {recipeText}
        </div>
      </div>
    </div>
  );
};

export default Home;
