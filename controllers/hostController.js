const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log(`home not found for editing..`);
        return res.redirect("/host/host-home-list");
      }
      res.render("host/edit-home", {
        pageTitle: "Edit Your Home",
        currentPage: "host-homes",
        editing: editing,
        home: home,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error occured while edit host homes", error);
    });
};

exports.getHostHomes = (req, res, next) => {
  Home.find()
    .then((registeredHomes) => {
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Host Homes List",
        currentPage: "host-homes",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error occured while fetch host homes", error);
    });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(req.file);

  if (!req.file) {
    return res.status(422).send("file not found or please valid format image");
  }
  const photo = req.file.path;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home
    .save()
    .then(() => res.redirect("/host/host-home-list"))
    .catch((err) => {
      console.log("Error saving home:", err);
      res.status(500).send("Error occured while saving home");
    });
};

exports.postEditHome = (req, res, next) => {
  const { houseName, price, location, rating, description, id } = req.body;
  Home.findById(id)
    .then((home) => {
      (home.houseName = houseName),
        (home.price = price),
        (home.location = location),
        (home.rating = rating),
        (home.description = description);

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          console.log("error while unlink/delete image while edit");
        });
        home.photo = req.file.path;
      }
      home
        .save()
        .then((result) => {
          console.log("home updated sucessfully.");
        })
        .catch((err) => {
          console.log("error while save updated home", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("error while deleting home", error);
      res.status(500).send("error deleting home");
    });
};
