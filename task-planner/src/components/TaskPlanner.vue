<template>
  <div class="task-list-container">
    <form @submit.prevent="addTask">
      <input
        type="text"
        v-model="newTask.title"
        placeholder="Task Title"
        required
      />
      <textarea
        v-model="newTask.description"
        placeholder="Task Description"
      ></textarea>
      <select v-model="newTask.priority">
        <option value="High">High</option>
        <option value="Medium" selected>Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add Task</button>
    </form>

    <div class="filters">
      <label>
        Filter by:
        <select v-model="filters.priority">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <label>
        Completion Status:
        <select v-model="filters.completed">
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
      </label>
      <label>
        Sort by:
        <select v-model="sortBy">
          <option value="createdAt">Date Created</option>
          <option value="title">Alphabetically</option>
        </select>
      </label>
    </div>

    <ul class="task-list">
      <li
        v-for="task in filteredAndSortedTasks"
        :key="task.id"
        :class="{ completed: task.completed }"
      >
        <div>
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <small>Priority: {{ task.priority }}</small>
          <small
            >Created: {{ new Date(task.createdAt).toLocaleString() }}</small
          >
        </div>
        <div class="actions">
          <button class="complete" @click="toggleTaskCompletion(task)">
            ✔
          </button>
          <button class="delete" @click="deleteTask(task)">✗</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { Task } from "@/models/Task";

const tasks = reactive(JSON.parse(localStorage.getItem("tasks") || "[]"));

const newTask = reactive({
  title: "",
  description: "",
  priority: "Medium",
});

const filters = reactive({
  priority: "",
  completed: "",
});
const sortBy = ref("createdAt");

const filteredAndSortedTasks = computed(() => {
  let result = tasks;

  if (filters.priority) {
    result = result.filter((task) => task.priority === filters.priority);
  }

  if (filters.completed !== "") {
    result = result.filter(
      (task) => String(task.completed) === filters.completed
    );
  }

  if (sortBy.value === "title") {
    result = result.slice().sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy.value === "createdAt") {
    result = result.slice().sort((a, b) => b.createdAt - a.createdAt);
  }

  return result;
});

const addTask = () => {
  tasks.push(new Task(newTask.title, newTask.description, newTask.priority));
  saveTasksToLocalStorage();
  resetNewTask();
};

const deleteTask = (task) => {
  const index = tasks.indexOf(task);
  if (index > -1) tasks.splice(index, 1);
  saveTasksToLocalStorage();
};

const toggleTaskCompletion = (task) => {
  task.completed = !task.completed;
  saveTasksToLocalStorage();
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const resetNewTask = () => {
  newTask.title = "";
  newTask.description = "";
  newTask.priority = "Medium";
};

watch(tasks, saveTasksToLocalStorage, { deep: true });
</script>

<style scoped>
.task-list-container {
  width: 650px;
  margin: 20px auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

form input,
form textarea,
form select,
form button {
  padding: 12px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
}

form input:focus,
form textarea:focus,
form select:focus,
form button:focus {
  border-color: #007bff;
}

button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-list li {
  padding: 15px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-list li.completed {
  background: #d4edda;
}

.task-list .actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-list .actions button {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.task-list .actions button.complete {
  color: #28a745;
}
.task-list .actions button.delete {
  color: #dc3545;
}

small {
  color: #777;
  font-size: 12px;
  display: block;
  margin-top: 6px;
}
</style>
