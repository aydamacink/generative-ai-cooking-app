const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const axios = require("axios");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY",
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).send({ error: "Please provide a question" });
  }

  try {
    // Fetch a dish image from Pexels API
    const imageResponse = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
      params: {
        query: question, // Use the question or recipe name as the search query
        per_page: 1, // Fetch only 1 image
      },
    });

    const imageUrl =
      imageResponse.data.photos.length > 0
        ? imageResponse.data.photos[0].src.medium
        : null;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that returns recipes step by step. You give the recipe back in max 150 words.  Please don't include examples. If someone enters an input  that is not asking for a recipe say you can't cook this and add something witty.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 200,
    });

    const answer = response.choices[0].message.content.trim();

    res.status(200).json({ answer, imageUrl });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// Serve Vue frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
