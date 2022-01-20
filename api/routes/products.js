const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checker = require('../middleware/check-auth')
const Product = require("../Models/products");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) =>
    cb(null,req.body.name + " " + file.originalname),
});
const filefilter = (req, file, cb)=>
{
  if(file.mimeType==='image/jpeg'||file.mimeType==='image/png'){cb(null, true)}
  else{cb(null, false)}
}
const upload = multer({ storage: storage,fileFilter: filefilter });
router.get("/",checker, (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});
router.post("/", upload.single("productImage"), (req, res, next) => {
  let prod = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage : req.file.path
  });
  prod
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ Message: err });
    });
});
router.get("/:id", (req, res, next) => {
  let id = req.params.id;
  Product.findById(id)
    .select("_id name price")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Valid Entry!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ Error: err });
    });
});
//req body should have an array of json obj containing propName and value fields for new value.
router.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
      console.log(err);
    });
});

router.delete("/:id", (req, res, next) => {
  let id = req.params.id;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
