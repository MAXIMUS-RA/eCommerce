import axios from "axios";
import React, { useState, type FormEvent } from "react";

function AddCategories() {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/categories/store",
        {
          name: name,
        }
      );
      console.log("Success");
      setName("");
    } catch (e: any) {
      console.log(e);
      setError(e.response?.data?.error || "Помилка створення категорії");
      console.log(e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Create new categories
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl w-fit p-10 rounded-xl px-20"
      >
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-6 px-1">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {"Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategories;
