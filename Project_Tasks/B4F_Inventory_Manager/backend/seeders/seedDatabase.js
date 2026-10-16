import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/ProductModel.js";
import Movement from "../models/MovementModel.js"; // Or path to your Movement model/file
dotenv.config();
// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI ;

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Product.deleteMany({});
    if (mongoose.connection.collections['movements']) {
      await mongoose.connection.collections['movements'].drop().catch(() => {});
    }
    console.log("Old products and movements cleared.");

    // 1. Create 20+ Electronics Products with initial quantity 0 (imageUrl is left null)
    const productsData = [
      { name: "MacBook Pro 16 M3 Max", quantity: 0, minimumQuantity: 3, imageUrl: null },
      { name: "Dell XPS 15 OLED", quantity: 0, minimumQuantity: 5, imageUrl: null },
      { name: "ASUS ROG Strix G16 Gaming Laptop", quantity: 0, minimumQuantity: 2, imageUrl: null },
      { name: "Lenovo ThinkPad X1 Carbon Gen 11", quantity: 0, minimumQuantity: 4, imageUrl: null },
      { name: "HP Spectre x360 14", quantity: 0, minimumQuantity: 3, imageUrl: null },
      { name: "Acer Predator Helios 300", quantity: 0, minimumQuantity: 2, imageUrl: null },
      { name: "Microsoft Surface Laptop 5", quantity: 0, minimumQuantity: 5, imageUrl: null },
      { name: "Custom Gaming PC RTX 4090", quantity: 0, minimumQuantity: 1, imageUrl: null },
      { name: "Budget Office PC i5-12400", quantity: 0, minimumQuantity: 8, imageUrl: null },
      { name: "Logitech MX Master 3S Wireless Mouse", quantity: 0, minimumQuantity: 10, imageUrl: null },
      { name: "Razer DeathAdder V3 Pro Mouse", quantity: 0, minimumQuantity: 8, imageUrl: null },
      { name: "Keychron K2 Wireless Mechanical Keyboard", quantity: 0, minimumQuantity: 10, imageUrl: null },
      { name: "Corsair K95 RGB Platinum Keyboard", quantity: 0, minimumQuantity: 5, imageUrl: null },
      { name: "Sony WH-1000XM5 Wireless Headphones", quantity: 0, minimumQuantity: 7, imageUrl: null },
      { name: "HyperX Cloud III Gaming Headset", quantity: 0, minimumQuantity: 6, imageUrl: null },
      { name: "Dell 27 4K UHD USB-C Monitor", quantity: 0, minimumQuantity: 3, imageUrl: null },
      { name: "LG UltraGear 27 Gaming Monitor", quantity: 0, minimumQuantity: 4, imageUrl: null },
      { name: "Samsung 980 PRO 2TB NVMe SSD", quantity: 0, minimumQuantity: 15, imageUrl: null },
      { name: "Corsair Vengeance RGB 32GB DDR5 RAM", quantity: 0, minimumQuantity: 10, imageUrl: null },
      { name: "Anker 737 Power Bank 24000mAh", quantity: 0, minimumQuantity: 10, imageUrl: null },
      { name: "Elgato Stream Deck MK.2", quantity: 0, minimumQuantity: 4, imageUrl: null }
    ];

    const createdProducts = [];
    for (const pData of productsData) {
      const product = new Product(pData);
      await product.save();
      createdProducts.push(product);
    }
    console.log(`${createdProducts.length} products inserted successfully with initial quantity 0.`);

    // Helper functions
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const inNotes = [
      "Restocked from primary supplier",
      "New shipment arrived from factory",
      "Returned items restocked after inspection",
      "Warehouse transfer inward",
      "Direct import purchase"
    ];

    const outNotes = [
      "Sold to retail customer",
      "Online order fulfillment",
      "B2B corporate sale",
      "Defective item sent for warranty check",
      "Store display unit assigned"
    ];

    // Phase A: Force an initial large stock "in" movement for every product 
    // so they start with a realistic healthy inventory base.
    console.log("Initializing baseline stock via 'in' movements...");
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 90);

    for (const product of createdProducts) {
      const initialStock = getRandomNumber(15, 45);
      currentDate = new Date(currentDate.getTime() + getRandomNumber(1, 10) * 3600 * 1000);
      
      await Movement.create({
        productId: product._id,
        type: "in",
        amount: initialStock,
        note: "Initial warehouse stock setup",
        date: new Date(currentDate)
      });
      // Update local object quantity tracking
      product.quantity += initialStock;
    }

    // Phase B: Generate remaining randomized movements (in / out) 
    // while ensuring quantities update correctly and some fall below minimumQuantity.
    const totalMovementsToGenerate = 100;
    console.log(`Generating ${totalMovementsToGenerate} randomized operational movements...`);

    for (let i = 0; i < totalMovementsToGenerate; i++) {
      const targetProduct = getRandomItem(createdProducts);

      // Decide movement type
      let type = Math.random() > 0.45 ? "out" : "in";
      
      // If current stock is already low or 0, force an 'in' movement
      if (targetProduct.quantity <= 2) {
        type = "in";
      }

      let amount = 1;
      if (type === "in") {
        amount = getRandomNumber(5, 20);
      } else {
        // Allow 'out' amounts that might drop some products below minimumQuantity intentionally
        const maxOut = Math.max(1, targetProduct.quantity - getRandomNumber(0, 2));
        amount = getRandomNumber(1, maxOut);
      }

      const note = type === "in" ? getRandomItem(inNotes) : getRandomItem(outNotes);

      // Advance timeline slightly
      currentDate = new Date(currentDate.getTime() + getRandomNumber(1, 12) * 3600 * 1000);

      // Update local tracking quantity in memory to stay in sync with validations
      if (type === "in") {
        targetProduct.quantity += amount;
      } else {
        targetProduct.quantity -= amount;
      }

      // Use MovementModel.create (updates Product stock and saves movement)
      await Movement.create({
        productId: targetProduct._id,
        type: type,
        amount: amount,
        note: `${note} (Op #${i + 1})`,
        date: new Date(currentDate)
      });
    }

    console.log("All stock movements and baseline setups successfully generated!");
    console.log("Seeding process completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
};

seedDatabase();