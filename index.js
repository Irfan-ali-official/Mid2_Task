const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const file = require("express-fileupload");
const bodyparser = require("body-parser");
const path = require("path");
const urlencoded = require("body-parser/lib/types/urlencoded");
const app = express();
app.use(bodyparser.json());
app.use(file());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const connection = mongoose.connect("mongodb://localhost/SecondMidTask");
const database = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  country: String,
  state: String,
  city: String,
  address: String,
  postcode: String,
  img: String,
});
const model_person = mongoose.model("Person", database);
const insert = () => {
  const data = model_person.create({
    name: "irfan",
    email: "ali@7012@gmail.com",
    phone: "020303020303",
    coutnry: "pakistan",
    state: "pakistan",
    address: "ksflsdhfsdf",
    postcode: "7744",
  });
};
insert();
app.get("/", async (req, res) => {
  const data = await model_person.find();
  res.render("home", { data: data });
});
app.get("/insert", (req, res) => {
  res.render("insert");
});
app.post("/save", async (req, res) => {
  const { name, email, phone, country, state, city, address, postcode } =
    req.body;
  const image = req.files.img;
  const saveData = await model_person.create({
    name,
    email,
    phone,
    country,
    state,
    city,
    address,
    postcode,
    img: image.name,
  });
  image.mv(`./public/img/` + image.name, async (e) => {
    if (e) {
      console.log("image uploaded error");
    } else {
      console.log("image uploaded");
    }
  });
  res.redirect("/");
});
app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const savedData = await model_person.findByIdAndDelete(id);
  res.redirect("/");
});
app.get("/data/:id", async (req, res) => {
  const { id } = req.params;
  const savedData = await model_person.findById(id);
  res.render("update", { data: savedData });
});
app.post("/update", async (req, res) => {
  const { id, name, email, phone, city, postcode } = req.body;
  const img = req.files.img;

  const savedData = await model_person.updateOne(
    { _id: id },
    { $set: { name: name, email: email, phone: phone, img: img.name } }
  );
  img.mv(`./public/img/` + img.name, async (e) => {
    if (e) {
      console.log("image uploaded error");
    } else {
      console.log("image uploaded");
    }
  });

  res.redirect("/");
});
app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
