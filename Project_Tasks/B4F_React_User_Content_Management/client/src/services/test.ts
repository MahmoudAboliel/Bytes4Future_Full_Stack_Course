const obj = {
  id: "1",
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496",
    },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};

const x = async () => {
  const xx = await fetch(`http://localhost:3000/users?id=u-001`, {
    // headers: {
    //   "Content-type": "application/json",
    // },
    // method: "POST",
    // body: JSON.stringify(obj),
  });
  const res = await xx.json();
  return res;
};

const s = await x();
console.log(s);
console.log(s.length);
