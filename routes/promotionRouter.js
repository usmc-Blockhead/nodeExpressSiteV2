const express = require("express");
const Promotion = require("../models/promotion");
const authenticate = require('../authenticate');

const promotionRouter = express.Router();

promotionRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get((req, res, next) => {
        Promotion.find()
            .then((promotions) => {
                res.json(promotions);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log("Promotion Created ", promotion);
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end("PUT operation not supported on /promotions");
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.deleteMany()
            .then((response) => {
                res.json(response);
            })
            .catch((err) => next(err));
    });

promotionRouter
    .route("/:promotionId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        next();
    })
    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
            .then((promotion) => {
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end(
            `POST operation not supported on /promotions/${req.params.promotionId}`
        );
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndUpdate(
            req.params.promotionId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then((promotion) => {
                res.json(promotion);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => next(err));
    });

module.exports = promotionRouter;
