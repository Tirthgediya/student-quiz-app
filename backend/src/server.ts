import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes";

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Student Quiz API is running");
});

// Quiz routes
app.use("/api", quizRoutes);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});