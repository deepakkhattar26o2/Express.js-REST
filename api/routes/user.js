const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({ Message: "user already exists!" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ Message: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(200).json({ Message: "User Created"});
              })
              .catch((err) => {
                res.status(500).json({ Message: err });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ Message: err });
    });
});
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email }).exec().then(
      user=>{
        if(user.length<1){
            return res.status(401).json({Message: 'Auth Failed!'})
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(500).json({Message: err})
            }
            if(result){
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },'secret_key', {expiresIn: "1h"})
                return res.status(200).json({Message: 'Auth Successful', Token: token})
            }
            res.status(401).json({Message: 'Auth Failed!'})
        })
      }
  ).catch();
});
router.delete("/:userId", (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ Message: `${req.params.userId} deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).json({ Message: err });
    });
});

module.exports = router;
