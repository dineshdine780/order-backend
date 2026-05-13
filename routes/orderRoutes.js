const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/Item");
const Payment = require("../models/Payment");


router.post("/", async (req, res) => {
  try {
    const { shopId, items, totalAmount, discount, paymentMethod, creditAmount, paidAmount } = req.body;

    if (!shopId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

   
    for (let i of items) {
      const item = await Item.findOne({
  name: i.name,
});

      if (!item || item.actualQuantity < i.qty) {
        return res.status(400).json({
          message: `${i.name} is out of stock`,
        });
      }
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const finalTotalAmount = Number(totalAmount || 0);

   const finalPaidAmount = Number(paidAmount || 0);

   const balanceAmount = finalTotalAmount - finalPaidAmount;

   

    const updatedItems = items.map(item => ({
  ...item,
  delivered: false,
}));

const order = new Order({
  orderId,
  shopId,
  items: updatedItems,
  totalAmount: finalTotalAmount,
  discount: Number(discount || 0),
  paymentMethod,
  paidAmount: finalPaidAmount,
  balanceAmount,
  orderStatus: "Pending",
});

    await order.save();

    
    await Promise.all(
      items.map(i =>
        Item.findOneAndUpdate(
          {
  name: i.name,
  shopId,
},
          { $inc: { actualQuantity: -i.qty } }
        )
      )
    );

    res.json({ message: "Order created", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("shopId");

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put(
  "/status/:id",
  async (req, res) => {

    try {

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            orderStatus:
              req.body.orderStatus,
          },
          { new: true }
        );

      res.json(order);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });
    }
  }
); 


router.get(
  "/today/:shopId",
  async (req, res) => {

    try {

      const today =
        new Date();

      today.setHours(0, 0, 0, 0);

      const orders =
        await Order.find({
          shopId:
            req.params.shopId,

          createdAt: {
            $gte: today,
          },
        });

      res.json(orders);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });
    }
  }
);



router.put(
  "/edit-item/:id",
  async (req, res) => {

    try {

      const {
        itemIndex,
        qty,
      } = req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.items[itemIndex].qty =
        qty;

      order.totalAmount =
        order.items.reduce(
          (sum, item) =>
            sum +
            item.qty * item.price,
          0
        );

      await order.save();

      res.json(order);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });
    }
  }
);



router.put("/delivered/:id", async (req, res) => {

  try {

    if (!req.params.id) {
      return res.status(400).json({
        message: "Order ID missing"
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          orderStatus: "Delivered",
        },
        { new: true }
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});



router.put(
  "/deliver-items/:id",
  async (req, res) => {

    try {

      const { itemIndexes } = req.body;

      const order =
        await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      itemIndexes.forEach(index => {

        if (order.items[index]) {
          order.items[index].delivered = true;
        }

      });

      // CHECK ALL ITEMS DELIVERED

      const allDelivered =
        order.items.every(
          item => item.delivered
        );

      if (allDelivered) {
        order.orderStatus = "Delivered";
      }

      await order.save();

      res.json(order);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }
  }
);



router.put(
  "/deliver-selected",
  async (req, res) => {

    try {

      const { items } = req.body;

      for (let selected of items) {

        const order =
          await Order.findById(
            selected.orderId
          );

        if (!order) continue;

        

        if (
  order.items[selected.itemIndex]
) {

  order.items[
    selected.itemIndex
  ].delivered = true;

  const deliveredItem =
    order.items[selected.itemIndex];

  await Item.findOneAndUpdate(
    {
      name: deliveredItem.name,
    },
    {
      $inc: {
        actualQuantity:
          -deliveredItem.qty,
      },
    }
  );

}

        

        const allDelivered =
          order.items.every(
            item => item.delivered === true
          );

        

        if (allDelivered) {

          order.orderStatus =
            "Delivered";

        } else {

          order.orderStatus =
            "Pending";

        }

        await order.save();
      }

      res.json({
        message:
          "Selected items delivered",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }
  }
);



router.put(
  "/payment/:id",
  async (req, res) => {

    try {

      const {
        paidAmount,
        balanceAmount,
      } = req.body;

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            paidAmount,
            balanceAmount,
          },
          { new: true }
        );

      res.json(order);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }
  }
);



router.delete("/:id", async (req, res) => {

  try {

    await Order.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Order deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});



router.get("/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.params.shopId,
    })
      .populate("shopId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("shopId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 




module.exports = router;