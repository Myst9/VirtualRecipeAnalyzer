const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoute.js");
const recipeRoutes = require("./routes/recipeRoute.js");
const postRoutes = require("./routes/postRoute.js");

const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://varshithab03:admin123@mern-app.mh39wli.mongodb.net/recipe-lab",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

mongoose.connection.once("open", () => console.log("Now connected in the cloud."));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(process.env.PORT || 4000, () => {
	console.log(`API is now online on port ${process.env.PORT || 4000}`)
});

app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/posts", postRoutes);