const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI =
  process.env.MONGODB_ATLAS_URI ||
  "mongodb+srv://esrael202324_db_user:dL3OX5FeftPpBiOB@kfs-cluster.mnixxot.mongodb.net/kfs_db?retryWrites=true&w=majority&appName=kfs-cluster"

console.log("🔍 MongoDB Connection Diagnostics Tool")
console.log("=".repeat(50))
console.log("\n📋 Configuration:")
console.log("   Using .env file:", process.env.MONGODB_ATLAS_URI ? "YES ✓" : "NO (using hardcoded)")
console.log("   Cluster host:", MONGODB_URI.split("@")[1]?.split("/")[0] || "Invalid")
console.log("   Database name:", MONGODB_URI.split("/")[3]?.split("?")[0] || "Unknown")
console.log("   Username:", MONGODB_URI.split("://")[1]?.split(":")[0] || "Unknown")
console.log("\n⏳ Testing connection...")
console.log("   Timeout: 10 seconds")
console.log("   Please wait...\n")

const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
}

mongoose
  .connect(MONGODB_URI, connectionOptions)
  .then(async () => {
    console.log("✅ SUCCESS! Connection established")
    console.log("\n📊 Connection Details:")
    console.log("   Database:", mongoose.connection.db.databaseName)
    console.log("   Host:", mongoose.connection.host)
    console.log("   Ready State:", mongoose.connection.readyState, "(1 = connected)")

    console.log("\n📁 Testing database access...")
    try {
      const collections = await mongoose.connection.db.listCollections().toArray()
      console.log("   Collections found:", collections.length)
      collections.forEach((col) => console.log("      -", col.name))

      console.log("\n✨ Everything looks good! Your database is working.")
      console.log("   You can now run your server with: node server.js")
    } catch (err) {
      console.error("   ⚠️ Could not list collections:", err.message)
    }

    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED")
    console.error("\n📋 Error Details:")
    console.error("   Type:", err.name)
    console.error("   Message:", err.message)

    console.error("\n🔧 TROUBLESHOOTING STEPS:\n")

    if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
      console.error("❌ AUTHENTICATION ERROR")
      console.error("   Your username or password is incorrect.\n")
      console.error("   Fix this by:")
      console.error("   1. Go to MongoDB Atlas → Database Access")
      console.error("   2. Check your database user credentials")
      console.error("   3. Reset the password if needed")
      console.error("   4. Update your connection string with the correct credentials")
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
      console.error("❌ DNS/NETWORK ERROR")
      console.error("   Cannot resolve the MongoDB cluster hostname.\n")
      console.error("   Fix this by:")
      console.error("   1. Check your internet connection")
      console.error("   2. Verify the cluster hostname in your connection string")
      console.error("   3. Make sure the cluster exists in MongoDB Atlas")
      console.error("   4. Try disabling VPN if you're using one")
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("timed out")) {
      console.error("❌ CONNECTION TIMEOUT")
      console.error("   The connection attempt timed out.\n")
      console.error("   Fix this by:")
      console.error("   1. Check MongoDB Atlas → Network Access")
      console.error("   2. Verify 0.0.0.0/0 is in the IP whitelist")
      console.error("   3. Check if your cluster is PAUSED (common with free tier)")
      console.error("      → Go to Database → Clusters → Check status")
      console.error("   4. Check firewall/antivirus settings")
      console.error("   5. Try a different network")
    } else {
      console.error("❌ UNKNOWN ERROR")
      console.error("   Please check the error message above.\n")
      console.error("   General troubleshooting:")
      console.error("   1. Verify your MongoDB Atlas cluster is running")
      console.error("   2. Check Network Access settings")
      console.error("   3. Verify Database Access credentials")
      console.error("   4. Try connecting with MongoDB Compass to test")
    }

    console.error("\n📚 Need more help?")
    console.error("   MongoDB Atlas Docs: https://docs.atlas.mongodb.com/")
    console.error("   Connection Troubleshooting: https://docs.atlas.mongodb.com/troubleshoot-connection/")

    process.exit(1)
  })
