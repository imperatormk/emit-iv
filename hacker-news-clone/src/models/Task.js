export class Task {
  constructor(title, description, priority = "Medium") {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    this.createdAt = new Date();
  }
}
