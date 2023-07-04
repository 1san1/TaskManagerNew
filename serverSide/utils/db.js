import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(taskData) {
  try {
    const user = await prisma.user.create({
      data: {
        task: taskData,
      },
    });
    console.log(user);
  } catch (error) {
    throw new Error("error creating task!");
  }
}
async function getAllTasks() {
  try {
    const tasks = await prisma.user.findMany();
    return tasks;
  } catch (error) {
    throw new Error("Error retrieving tasks");
  }
}
async function updateTask(id, task, isProcessing, completed) {
  try {
    const tasks = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        task,
        isProcessing,
        completed,
      },
    });
  } catch (error) {
    throw new Error("Error in updating");
  }
}
async function deleteTask(id) {
  try {
    const tasks = await prisma.user.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error("Error in updating");
  }
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

export { main, getAllTasks, updateTask, deleteTask };
