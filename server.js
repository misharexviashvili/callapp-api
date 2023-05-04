const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/data", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/api/data", (req, res) => {
  const newData = req.body;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      const existingData = JSON.parse(data);
      existingData.push(newData);
      fs.writeFile("data.json", JSON.stringify(existingData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing data file");
        } else {
          res.json(existingData);
        }
      });
    }
  });
});

app.delete("/api/data/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      let existingData = JSON.parse(data);
      existingData = existingData.filter((item) => item.id !== id);
      fs.writeFile("data.json", JSON.stringify(existingData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing data file");
        } else {
          res.json(existingData);
        }
      });
    }
  });
});

app.patch("/api/data/:id", (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading data file");
    } else {
      let existingData = JSON.parse(data);
      existingData = existingData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...newData,
          };
        } else {
          return item;
        }
      });
      fs.writeFile("data.json", JSON.stringify(existingData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error writing data file");
        } else {
          res.json(existingData);
        }
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
