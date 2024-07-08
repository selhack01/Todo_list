const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const r = require('rethinkdbdash')({
    servers: [
        {
            host: "localhost",
            port: 28015
        }
    ]
});

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.get("/", async (req, res) => {
    try {
        const veriler = await r.db("ToDoList").table("Tasks").orderBy({ index: r.asc('priority') }).run();
        res.send(veriler);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
        res.status(500).send("Sunucu hatası");
    }
});

app.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;

        if (id) {
            const deleting = await r.db("ToDoList").table("Tasks").get(id).delete().run();
            res.send(deleting);
        }
        else {
            res.send(error)
        }

    } catch (error) {
        console.error(error);

    }
});

app.post('/add', async (req, res) => {
    try {
        const receivedData = await req.body;
        const adding = r.db("ToDoList").table("Tasks").insert(receivedData).run();
        res.send(adding);

    } catch (error) {
        console.error("Veri gönderme hatası:", error);
        res.status(500).send("Sunucu hatası");
    }
});

app.put('/update', async (req, res) => {
    try {
        const { id, updates } = await req.body;
        // console.log(req.body);
        const result = await r.db("ToDoList").table("Tasks").get(id).update(updates).run();
        res.send(result);

    } catch (error) {
        console.error(error);
    }
})

const port = 3000;
app.listen(port, () => {
console.log(`Sunucu ${port} portunda aktif`);
});
