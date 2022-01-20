const Order = require('../Models/orders')
exports.getAll = (req, res, next) => {
    Order.find()
      .select("_id product quantity")
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({ Message: err });
      })}