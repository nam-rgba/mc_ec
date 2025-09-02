// db.init.js
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/rise";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      // options hiện tại mongoose 7+ không cần nhiều
      serverSelectionTimeoutMS: 5000, // timeout khi không kết nối được
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // dừng app nếu không kết nối được
  }

  // Dev mode: bật debug log
  if (process.env.NODE_ENV === "development") {
    mongoose.set("debug", { color: true });
  }
}

// gọi connect luôn khi import
connectDB();

module.exports = mongoose;
