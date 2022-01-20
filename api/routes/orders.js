const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../Models/orders");
const Product = require("../Models/products")
const orderController = require("../controllers/orders")
router.get("/",orderController.getAll);

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json(res);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  let id = req.params.productId;
  Order.findById(id)
    .select("_id name quantity")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ Message: "No Entry Found!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Message: err });
    });
});
  //req body should have an array of json obj containing propName and value fields for new value.
router.patch("/:productId", (req, res, next) => {
  let id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ Message: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  let id = req.params.productId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ Message: errr });
    });
});

module.exports = router;
