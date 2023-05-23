const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");
const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate('campsites')
            .then((favorite) => {
                res.json(favorite);
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
            if (!favorite) {
                let campsites = [];
                req.body.forEach((row) => {
                    campsites.push(row._id);
                });
                Favorite.create({ user: req.user._id, campsites })
                    .then((favorite) => {
                        console.log("Favorite created ", favorite);
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            } else {
                req.body.forEach((row) => {
                    if (!favorite.campsites.includes(row._id)) {
                        favorite.campsites.push(row._id);
                    }
                });
                favorite
                    .save()
                    .then((favorite) => {
                        console.log("Favorite added ", favorite);
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
            `PUT operation not supported on /favorites/${req.params.campsiteId}`
        );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
        .then((favorite) => {
            if (favorite) {
                res.json(favorite);
            } else {
                res.setHeader("Content-Type", "text/plain");
                res.json("You do not have any favorites to delete");
            }
        })
        .catch((err) => next(err));
    })

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) =>{
        res.statusCode = 403;
        res.end(
            `GET operation not supported on /favorites/${req.params.campsiteId}`
        );
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }).then((favorites) => {
            if (favorites) {
                if (!favorites.campsites.includes(req.params.campsiteId)) {
                    favorites.campsites.push(req.params.campsiteId);
                    favorites
                        .save()
                        .then((favorite) => {
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.json("That campsite is already in your favorites");
                }
            }  else {
                Favorite.create({
                    user: req.user._id,
                    campsites: [req.params.campsieID],
                })
                    .then((favorite) => {
                        console.log("Favorite created ", favorite);
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            }
    });
})
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
            `PUT operation not supported on /favorites/${req.params.campsiteId}`
        );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites = favorite.campsites.filter(
                            (campsite) =>
                                // !campsite.equals(req.params.campsiteId)
                                campsite.toString()!==req.params.campsiteId
                        );
                        favorite
                            .save()
                            .then((favorite) => {
                                res.json(favorite);
                            })
                            .catch((err) => next(err));
                    } else {
                        res.json(favorite);
                    }
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.json("There are no favorites to delete");
                }
            })
            .catch((err) => next(err));
    })

module.exports = favoriteRouter;