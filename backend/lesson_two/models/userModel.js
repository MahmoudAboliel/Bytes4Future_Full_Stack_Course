class User {
  constructor() {
    this.users = [
      {
        id: 1,
        name: "Mahmoud",
        family: "Abulail",
        age: 28,
      },
      {
        id: 2,
        name: "Ahmad",
        family: "Mansor",
        age: 23,
      },
      {
        id: 3,
        name: "Ali",
        family: "Easser",
        age: 21,
      },
      {
        id: 4,
        name: "Nour",
        family: "Omar",
        age: 22,
      },
    ];

    this.nextId = this.users.length + 1;
  }

  getAll() {
    return this.users;
  }

  getById(id) {
    return this.users.find((u) => u.id === id);
  }

  create(obj = {}) {
    const user = {
      id: this.nextId++,
      ...obj,
    };
    this.users.push(user);
    return user;
  }

  update(id, obj) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updatedUser = {
        ...this.users[index], 
        ...obj,
      };
      this.users[index] = updatedUser;
      return updatedUser;
    }

    return null;
  }

  delete(id) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1);
    }
    return null;
  }
}

export default new User();
