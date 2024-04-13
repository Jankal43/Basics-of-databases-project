import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SystemZarzadzania",
  password: "qwerty",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {

    res.render("index.ejs");
  } catch (err) {
    console.log(err);
  }
});


async function getItemsFromTable(table) {
  try {
    const result = await db.query(`SELECT * FROM ${table}`);
    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

app.post("/show", async (req, res) => {
  const tableName = req.body.tableName; 
    let items = [];

  if (tableName === "devices" || tableName === "employees" || tableName === "projects") {
    items = await getItemsFromTable(tableName);
  }

  res.render("index.ejs", {
    listItems: items,
    tableName: tableName, 
  });
});

app.post("/new", async (req, res) => {
   try {
     db.query(
       "INSERT INTO Employees (FirstName, LastName, Position, PhoneNumber, Email) VALUES ($1, $2, $3, $4, $5)",
       [req.body.firstName, req.body.lastName, req.body.position, req.body.phonenumber, req.body.email]
     );
   } catch (err) {
     console.log(err);
   }
});

app.post("/delete2", async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM ${req.body.tableName2} WHERE ${req.body.Names} ${req.body.char} $1;`,
      [req.body.toDelete],
    );
      
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error"); 
  }
});

app.post("/select", async (req, res) => {
  const tableName2 = req.body.sTable; 
    let items2 = [];

  if (tableName2 === "devices" || tableName2 === "employees" || tableName2 === "projects") {
    items2 = await getItemsFromTable(tableName2);
  }

  res.render("index.ejs", {
    listItems2: items2,
    tableName2: tableName2, 

  });
});

app.post("/update", async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE ${req.body.tableName2} SET ${req.body.Names1} = $1 WHERE ${req.body.Names2} ${req.body.char} $2`,
      [req.body.condition1, req.body.condition2]
    );
      
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error"); 
  }
});

app.post("/Innerjoin", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT Employees.FirstName, Employees.LastName, Projects.ProjectName FROM Employees INNER JOIN Projects ON Employees.EmployeeID = Projects.ProjectID`);

    const rows = result.rows;

    res.render("index.ejs", {
      listItems5: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/Leftjoin", async (req, res) => {
  try {
    const result = await db.query(`
    SELECT Employees.FirstName, Employees.LastName, Projects.ProjectName
    FROM Employees
    LEFT JOIN Projects ON Employees.EmployeeID = Projects.ProjectID;
    `);

    const rows = result.rows;

    res.render("index.ejs", {
      listItems5: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


 