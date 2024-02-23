const fs = require("fs");
const productModel = require("../models/productModel");
const slugify = require("slugify");
const categoryModel = require("../models/categoryModel");

const braintree = require("braintree");
const orderModel = require("../models/orderModel");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const brainTreeTokenController = async (req, res) => {
  try {
    await gateway.clientToken.generate({}, async function (err, response) {
      if (err) {
        res.status(400).send(err);
      } else {
        await res.status(200).send(response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const braintreePaymentsController = async (req, res) => {
  try {
    const { cart, singleProduct, nonce } = req.body;
    // console.log(cart);

    //total cart item
    let total = 0;

    if (singleProduct) {
      total = singleProduct.price;
    } else {
      cart.map((product) => {
        total += product.price;
      });
    }

    //new Transaction
    let newTransaction = await gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },

      function (err, result) {
        if (result) {
          const ordered = new orderModel({
            products: singleProduct ? [singleProduct] : cart,
            payment: result,
            buyer: req.user._id,
          }).save();

          return res.status(200).json({ ok: true, ordered: ordered });
        } else {
          return res.status(500).send(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const createProductController = async (req, res) => {
  try {
    let { name, slug, des, quantity, category, price, shipping } = req.fields;
    let { photo } = req.files;

    if (!name) {
      return res.status(400).json({ message: "  name field" });
    }

    if (!des) {
      return res.status(400).json({ message: "  des is required" });
    }

    if (!price) {
      return res.status(400).json({ message: "  price is required" });
    }

    if (!category) {
      return res.status(400).json({ message: "  category is required" });
    }

    if (!quantity) {
      return res.status(400).json({ message: "  quantity is required" });
    }

    if (!shipping) {
      return res.status(400).json({ message: "  shipping is required" });
    }

    if (!photo || photo.size > 10000000) {
      return res.status(400).json({ message: "  photo is required " });
    }

    //create
    let newProduct = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }
    await newProduct.save();
    return res.status(200).json({
      message: "  product created successfully ",
      newProduct: newProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllProductController = async (req, res) => {
  try {
    let allProducts = await productModel
      .find()
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("category");

    // console.log(allProducts);

    return res.status(200).json({
      allProducts: allProducts,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleProductController = async (req, res) => {
  try {
    let { slug } = req.params;
    let singleProduct = await productModel
      .findOne({ slug: slug })
      .select("-photo")
      .populate("category");

    if (singleProduct) {
      return res.status(200).json({
        singleProduct: singleProduct,
      });
    } else {
      return res.status(400).json({
        message: "product not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    await productModel.deleteOne({ slug: slug });
    return res.status(200).json({
      message: "product deleted ",
    });
  } catch (err) {
    console.log(err);
  }
};

//photo

const getPhotoController = async (req, res) => {
  try {
    let { pid } = req.params;
    let findPhoto = await productModel.findById({ _id: pid }).select("photo");
    if (!findPhoto.photo.data) {
      return res.status(400).json({ message: "photo not found" });
    } else {
      res.set("Content-Type", findPhoto.photo.contentType);
      return res.status(200).send(findPhoto.photo.data);
    }
  } catch (err) {
    console.log(err);
  }
};

const updateProdcutController = async (req, res) => {
  try {
    let { pid } = req.params;
    let { name, slug, des, quantity, category, price, shipping } = req.fields;
    let { photo } = req.files;

    let updateProduct = await productModel.findByIdAndUpdate(
      { _id: pid },
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      updateProduct.photo.data = fs.readFileSync(photo?.path);
      updateProduct.photo.contentType = photo?.type;
    }
    await updateProduct.save();

    return res.status(200).json({
      message: "product updated",
      updateProduct: updateProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

const filterProductController = async (req, res) => {
  try {
    const { checked, price } = req.body;
    console.log(price);

    let args = {};

    if (checked.length > 0) {
      args.category = { $in: checked };
    }

    if (price.length) {
      args.price = { $gte: price[0], $lte: price[1] };
    }

    console.log(args);

    let products = await productModel.find(args);

    return res.status(200).json({ products: products });
  } catch (err) {
    console.log(err);
  }
};

const searchProductController = async (req, res) => {
  try {
    let { keyword } = req.params;
    const products = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { des: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    return res.status(200).json({ products: products });
  } catch (err) {
    console.log(err);
  }
};

const relatedProductController = async (req, res) => {
  try {
    let { pid, cid } = req.params;

    let products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    return res.status(200).json({ products: products });
  } catch (err) {
    console.log(err);
  }
};

const ProductCategoryController = async (req, res) => {
  try {
    let { slug } = req.params;

    let category = await categoryModel.findOne({ slug });
    let products = await productModel.find({ category }).populate("category");

    return res.status(200).json({ products: products });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  createProductController,
  getAllProductController,
  getSingleProductController,
  deleteProductController,
  getPhotoController,
  updateProdcutController,
  filterProductController,
  relatedProductController,
  searchProductController,
  ProductCategoryController,
  brainTreeTokenController,
  braintreePaymentsController,
};
