import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const users = [
    {
        name: "Mahmoud",
        family: "Abulail",
        age: 28
    },
    {
        name: "Ahmad",
        family: "Mansor",
        age: 23
    },
    {
        name: "Ali",
        family: "Easser",
        age: 21
    },
    {
        name: "Nour",
        family: "Omar",
        age: 22
    },
];

app.get("/send", (req, res) => {
  res.send("<div style='background-color: red;'><h2>MD</h2></div>");
});

app.get('/json', (req, res) => {
    res.json(users)
})

app.get("/send-file", (req, res) => {
    const filePath = path.join(__dirname, "public", "hello.html");
    res.sendFile(filePath);
})

app.get("/send-docx", (req, res) => {
    const filePath = path.join(__dirname, "public", "x.docx");
    res.sendFile(filePath);
})

app.get("/render-page", (req, res) => {
  res.render("hello", { title: "Render Page", name: "Mahmoud Abulail" });
});

app.get("/", (req, res) => {
    res.send(`
        <ul>
            <li>
                <a href='/send-file'>Send File</a>
            </li>
            <li>
                <a href='/json'>Json File</a>
            </li>
            <li>
                <a href='/send-docx'>Docx File</a>
            </li>
        </ul>`);
})

app.listen(PORT, () => {
  console.log("server is running...");
});
