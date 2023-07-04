import express from "express";
import cors from "cors";
const app = express();
// const http = require("http");
import { main, getAllTasks, updateTask, deleteTask } from "../utils/db.js";

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  console.log(await getAllTasks());
  res.json(await getAllTasks());
});

app.post("/", async (req, res) => {
  const data = req.body.message;
  console.log("received data:", data);
  try {
    await main(data);
    res.send("Data received successfully!");
  } catch (error) {
    console.error("Error inserting task: ", error);
  }
});

app.put("/data/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  console.log(id, updatedData);
  try {
    await updateTask(
      id,
      updatedData.task,
      updatedData.isProcessing,
      updatedData.isCompleted
    );
    res.send("Data updated successfully!");
  } catch (error) {
    console.error("Error inserting task: ", error);
  }
});
app.put("/data/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await deleteTask(id);
    res.send("Data updated successfully!");
  } catch (error) {
    console.error("Error inserting task: ", error);
  }
});

app.put("data/:id");

app.listen(3000, () => {
  console.log("Listening to server at http://localhost:3000");
});
