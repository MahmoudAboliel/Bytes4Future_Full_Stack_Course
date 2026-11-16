class User {
  constructor() {
    this.users = [
      { id: 1, name: "Ammar", family: "Farha", age: 25 },
      { id: 2, name: "Gadanfar", family: "Hosain", age: 44 },
      { id: 3, name: "Charly", family: "Chaplen", age: 60 },
      { id: 4, name: "Ammar", family: "Farha", age: 25 },
      { id: 5, name: "Gadanfar", family: "Hosain", age: 44 },
      { id: 6, name: "Charly", family: "Chaplen", age: 60 },
      { id: 7, name: "Ammar", family: "Farha", age: 25 },
      { id: 8, name: "Gadanfar", family: "Hosain", age: 44 },
      { id: 9, name: "Charly", family: "Chaplen", age: 60 },
      { id: 10, name: "Ammar", family: "Farha", age: 25 },
      { id: 11, name: "Gadanfar", family: "Hosain", age: 44 },
      { id: 12, name: "Charly", family: "Chaplen", age: 60 },
      { id: 13, name: "Ammar", family: "Farha", age: 25 },
      { id: 14, name: "Gadanfar", family: "Hosain", age: 44 },
      { id: 15, name: "Charly", family: "Chaplen", age: 60 },
    ];
    this.nextId = 4;
  }
  find() {
    return this.users;
  }
  findById(id) {
    return this.users.find((user) => {
      return user.id === Number(id);
    });
  }
  create(obj) {
    const user = { id: this.nextId++, ...obj };
    this.users.push(user);
    return user;
  }
  update(id, obj) {
    const user = this.findById(id);
    if (!user) return null;
    Object.assign(user, obj);
    return user;
  }
  delete(id) {
    const index = this.users.findIndex((u) => u.id === Number(id));
    if (index === -1) return null;
    return this.users.splice(index, 1)[0];
  }
}
export default new User();
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   { name: { type: String }, family: { type: String }, age: { type: Number } },
//   { timestamps: true },
// );

// const User = mongoose.model("User", userSchema);
// export default User;
