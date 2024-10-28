<template>
  <div id="app" class="container">
    <h1>What would you like to cook today?</h1>
    <form @submit.prevent="submitRecipe" class="form">
      <input
        type="text"
        v-model="recipe"
        placeholder="Enter a dish name"
        class="input" />
      <input
        type="text"
        v-model="excludedIngredients"
        placeholder="Enter ingredients to exclude (comma-separated)"
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

    <div v-if="ingredients.length > 0" class="ingredients-section">
      <h2>Ingredients</h2>
      <ul>
        <li v-for="(ingredient, index) in ingredients" :key="index">
          {{ ingredient }}
        </li>
      </ul>
    </div>

    <div v-if="steps.length > 0" class="recipe-steps">
      <h2>Recipe Steps</h2>
      <div v-for="(step, index) in steps" :key="index" class="recipe-step">
        <p>Step {{ index + 1 }}: {{ step }}</p>
      </div>
    </div>

    <p v-if="message && !recipeImage" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recipe: "",
      excludedIngredients: "",
      message: "",
      ingredients: [],
      steps: [],
      recipeImage: "",
    };
  },
  methods: {
    async submitRecipe() {
      if (this.recipe) {
        this.message = `Fetching image and recipe for ${this.recipe}...`;

        try {
          const exclusions = this.excludedIngredients
            .split(",")
            .map((ingredient) => ingredient.trim());

          const response = await axios.post("/ask", {
            question: this.recipe,
            excludedIngredients: exclusions,
          });

          this.recipeImage = response.data.imageUrl;
          const recipeText = response.data.answer;

          const [ingredientsText, instructionsText] =
            recipeText.split("**Instructions:**");

          this.ingredients = ingredientsText
            ? ingredientsText
                .replace("**Ingredients:**", "")
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item !== "")
            : [];

          this.steps = instructionsText
            ? instructionsText
                .split(/\d+\.\s/)
                .map((step) => step.trim())
                .filter((step) => step !== "")
            : [];
        } catch (error) {
          this.message = "Something went wrong fetching the recipe or image.";
          console.error(error);
        }
      } else {
        this.message = "Please enter a dish name.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.input {
  padding: 15px;
  font-size: 1rem;
  width: 80%;
  margin-bottom: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
  outline: none;
}

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

.btn:hover {
  background-color: #5b0ba8;
  transform: scale(1.05);
}

.message {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #42b983;
  animation: fadeIn 0.5s ease-in-out;
}

.answer {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  animation: fadeIn 0.5s ease-in-out;
}

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

.ingredients-section {
  margin-top: 20px;
}

.ingredients-section ul {
  list-style-type: none;
  color: #5b0ba8;
  padding: 0;
}
</style>
