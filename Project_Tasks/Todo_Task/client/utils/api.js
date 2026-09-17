const URL = "http://localhost:3000";

export const request = async (endPoint = "", method = "GET", data) => {
  try {
    const res = await fetch(`${URL}/${endPoint}`, {
      method: method,
      headers: {
        "Content-type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!res.ok) {
      throw new Error(
        res.status == 404
          ? "not found."
          : res.status == 400
            ? "bad request."
            : res.status == 403
              ? "access denied."
              : res.status == 500
                ? "server error."
                : "something went wrong.",
      );
    }

    const result = await res.json();
    return { status: res.status, data: result, message: "done successfully." };
  } catch (error) {
    console.error(error.message);
  }
};

// const users = await request("users");
// console.log(users);
