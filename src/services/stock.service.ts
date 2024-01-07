import Product, { IProduct } from "../models/product.model";

async function checkAndNotifyLowStock() {
  const products = await Product.find({ isActive: true }).exec();

  products.forEach((product) => {
    if (product.stock <= product.lowStockThreshold) {
      sendLowStockNotification(product);
    }
  });

  console.log("checkAndNotifyLowStock() executed");
}

const sendLowStockNotification = (product: IProduct) => {
  const message = `The stock for ${product.name} is low (${product.stock} items left).`;
  console.log(message);
};

export { checkAndNotifyLowStock };
