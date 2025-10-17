const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI =
  process.env.MONGODB_ATLAS_URI ||
  "mongodb+srv://esrael202324_db_user:dL3OX5FeftPpBiOB@kfs-cluster.mnixxot.mongodb.net/kfs_db?retryWrites=true&w=majority&appName=kfs-cluster"

console.log("🧪 Testing MongoDB Connection...")
console.log("📍 Connection String:", MONGODB_URI.replace(/:[^:@]+@/, ":****@"))

const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
}

mongoose
  .connect(MONGODB_URI, options)
  .then(async () => {
    console.log("\n✅ Connection successful!")
    console.log("📊 Database:", mongoose.connection.db.databaseName)
    console.log("🌐 Host:", mongoose.connection.host)

    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log("\n📁 Available collections:", collections.map((c) => c.name).join(", ") || "None")

    console.log("\n✨ Everything is working! You can now run the server.")
    process.exit(0)
  })
  .catch((err) => {
    console.error("\n❌ Connection failed!")
    console.error("Error:", err.message)

    if (err.message.includes("ETIMEDOUT")) {
      console.error("\n🔧 This is a TIMEOUT error. Possible causes:")
      console.error("   • Firewall blocking MongoDB (port 27017)")
      console.error("   • Antivirus blocking the connection")
      console.error("   • Network restrictions (school/work network)")
      console.error("   • VPN interfering with connection")
      console.error("\n💡 Try:")
      console.error("   1. Temporarily disable firewall/antivirus")
      console.error("   2. Use a different network (mobile hotspot)")
      console.error("   3. Check MongoDB Atlas cluster status")
    }

    process.exit(1)
  })
