const URL = "http://localhost:3000";

export const request = async (endPoint = "", method = "GET", data = {}) => {
  try {
    const res = await fetch(`${URL}/${endPoint}`, {
      method: method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(res.status);
    }

    const result = await res.json();
    return result;
  } catch (er) {
    console.error("server error:", er);
  }
};

const users = await request("users", "POST", {
  name: "mahmoud",
  email: "mahmoud@gmail.com",
});
console.log(users);
