require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require("./routes/authRoutes");

app.use('/api/v1', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

