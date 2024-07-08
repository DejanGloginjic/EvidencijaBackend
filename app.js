const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./db");
app.use(cors());
app.use(express.json());
app.set("open browser", false);
const PORT = 3000;

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM record ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/maintenanceRecords", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM maintenancerecords ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/record/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM record where id=$1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/maintenanceRecord/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      "SELECT * FROM maintenancerecords where id=$1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/record/:id", async (req, res) => {
  try {
    const recordId = req.params.id;

    const sql =
      "UPDATE record SET firstname=$1, lastname=$2, date=$3, amount=$4, remark=$5, burialPlace=$6 WHERE id=$7 RETURNING *";
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.date,
      req.body.amount,
      req.body.remark,
      req.body.burialplace,
      recordId,
    ];

    const result = await db.query(sql, values);

    if (result.rows.length === 0) {
      res.status(404).send("Record not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.put("/maintenanceRecord/:id", async (req, res) => {
  try {
    const recordId = req.params.id;

    const sql =
      "UPDATE maintenancerecords SET firstname=$1, lastname=$2, paymentYear=$3, amount=$4, remark=$5, burialPlace=$6 WHERE id=$7 RETURNING *";
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.paymentYear,
      req.body.amount,
      req.body.remark,
      req.body.burialplace,
      recordId,
    ];

    const result = await db.query(sql, values);

    if (result.rows.length === 0) {
      res.status(404).send("Record not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/record", async (req, res) => {
  try {
    const sql =
      "INSERT INTO record (firstname, lastname, date, amount, remark, burialPlace) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.date,
      req.body.amount,
      req.body.remark,
      req.body.burialPlace,
    ];

    console.log("Vrednosti koje se ubacuju u SQL upit:", values); // Dodajte ovu liniju
    console.log("SQL upit:", sql); // Dodajte ovu liniju

    const result = await db.query(sql, values);

    console.log("Rezultat upita:", result); // Dodajte ovu liniju

    res.json(result.rows[0]); // Vraća prvi (i jedini) red iz rezultata
  } catch (err) {
    console.error("Greška prilikom izvršavanja upita:", err); // Dodajte ovu liniju
    res.status(500).send("Internal Server Error");
  }
});

app.post("/maintenanceRecord", async (req, res) => {
  try {
    const sql =
      "INSERT INTO maintenancerecords (firstname, lastname, paymentYear, amount, remark, burialPlace) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.paymentYear,
      req.body.amount,
      req.body.remark,
      req.body.burialPlace,
    ];

    console.log("Vrednosti koje se ubacuju u SQL upit:", values); // Dodajte ovu liniju
    console.log("SQL upit:", sql); // Dodajte ovu liniju

    const result = await db.query(sql, values);

    console.log("Rezultat upita:", result); // Dodajte ovu liniju

    res.json(result.rows[0]); // Vraća prvi (i jedini) red iz rezultata
  } catch (err) {
    console.error("Greška prilikom izvršavanja upita:", err); // Dodajte ovu liniju
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/record/:id", async (req, res) => {
  try {
    const recordId = req.params.id; // Preuzimanje ID-a iz URL-a

    const sql = "DELETE FROM record WHERE id=$1";
    const result = await db.query(sql, [recordId]);

    res.json(result);
  } catch (err) {
    console.error("Greška prilikom izvršavanja upita:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/maintenanceRecord/:id", async (req, res) => {
  try {
    const recordId = req.params.id; // Preuzimanje ID-a iz URL-a

    const sql = "DELETE FROM maintenancerecords WHERE id=$1";
    const result = await db.query(sql, [recordId]);

    res.json(result);
  } catch (err) {
    console.error("Greška prilikom izvršavanja upita:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
