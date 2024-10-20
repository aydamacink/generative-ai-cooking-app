<template>
  <div id="app" class="container">
    <h1>What would you like to cook today?</h1>
    <form @submit.prevent="submitRecipe" class="form">
      <input
        type="text"
        v-model="recipe"
        placeholder="Enter a dish name"
        class="input" />
      <button type="submit" class="btn">
        <i class="fas fa-search"></i> Search
      </button>
    </form>

    <img
      v-if="recipeImage"
      :src="recipeImage"
      alt="Dish Image"
      class="dish-image" />

    <div v-if="steps.length > 0" class="recipe-steps">
      <h2>Recipe Steps</h2>
      <div v-for="(step, index) in steps" :key="index" class="recipe-step">
        <p>Step {{ index + 1 }}: {{ step }}</p>
      </div>
    </div>

    <!-- Show message when available, but not during or after loading image -->
    <p v-if="message && !recipeImage" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios"; // Import axios for API requests

export default {
  data() {
    return {
      recipe: "", // Holds the input value
      message: "", // Placeholder for user input message
      steps: [], // Holds the individual recipe steps
      recipeImage: "", // Placeholder for a dish image
    };
  },
  methods: {
    async submitRecipe() {
      if (this.recipe) {
        this.message = `Fetching image for ${this.recipe}...`;

        try {
          // Fetch the image and recipe from the backend
          const response = await axios.post("/ask", { question: this.recipe });

          // Set the image
          this.recipeImage = response.data.imageUrl;

          // Step 1: Split the recipe into steps based on the pattern "number + period + space"
          const recipeText = response.data.answer;
          this.steps = recipeText
            .split(/(?:\d+\.\s)/) // Split by a number, followed by a period and space
            .map((step) => step.trim())
            .filter((step) => step !== "");
        } catch (error) {
          this.message = "Something went wrong fetching the recipe or image.";
        }
      } else {
        this.message = "Please enter a dish name.";
      }
    },
  },
};
</script>

<style scoped>
/* General container styling */
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Input field styling */
.input {
  padding: 15px;
  font-size: 1rem;
  width: 80%;
  margin-bottom: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  transition: all 0.3s ease;
}

/* Focus state for input field */
.input:focus {
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
  outline: none;
}

/* Button styling with Font Awesome icon */
.btn {
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #6a0dad; /* Purple */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Button hover effect */
.btn:hover {
  background-color: #5b0ba8; /* Darker Purple */
  transform: scale(1.05);
}

/* Animated message */
.message {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #42b983; /* Green */
  animation: fadeIn 0.5s ease-in-out;
}

/* Animated answer section */
.answer {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  animation: fadeIn 0.5s ease-in-out;
}

/* Dish image styling */
.dish-image {
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Keyframe for fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive design for smaller screens */
@media (max-width: 600px) {
  .container {
    width: 100%;
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  .input {
    width: 100%;
  }

  button {
    font-size: 1rem;
    padding: 10px 20px;
  }
}

.recipe-steps {
  margin-top: 20px;
}

.recipe-step {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recipe-step p {
  margin: 0;
}
</style>
