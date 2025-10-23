const express = require("express")
const mongoose = require("mongoose")
const { ObjectId } = require("mongodb")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// MongoDB Atlas connection string from environment variables
const MONGODB_URI =
  process.env.MONGODB_ATLAS_URI ||
  "mongodb+srv://esrael202324_db_user:dL3OX5FeftPpBiOB@kfs-cluster.mnixxot.mongodb.net/kfs_db?retryWrites=true&w=majority&appName=kfs-cluster"

const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
}

const corsOptions = {
  origin: "*", // Allow all origins for mobile clients
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 200,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("X-Content-Type-Options", "nosniff")
  res.header("X-Frame-Options", "DENY")
  next()
})

// Handle preflight requests
app.options("*", cors(corsOptions))

console.log("🔍 Connection Diagnostics:")
console.log("   MongoDB URI format:", MONGODB_URI.split("@")[1]?.split("/")[0] || "Invalid")
console.log("   Using environment variable:", process.env.MONGODB_ATLAS_URI ? "YES" : "NO (using fallback)")
console.log("   Connection timeout:", connectionOptions.serverSelectionTimeoutMS / 1000, "seconds")
console.log("   CORS enabled for all origins (mobile clients)")
console.log("\n⏳ Attempting to connect to MongoDB Atlas...")

let connectionAttempts = 0
const maxRetries = 3

async function connectWithRetry() {
  try {
    connectionAttempts++
    console.log(`\n🔄 Connection attempt ${connectionAttempts}/${maxRetries}...`)

    await mongoose.connect(MONGODB_URI, connectionOptions)

    console.log("\n✅ SUCCESS! Connected to MongoDB Atlas")
    console.log("📊 Database:", mongoose.connection.db.databaseName)
    console.log("🌐 Host:", mongoose.connection.host)
    console.log("✨ Ready to accept requests\n")
  } catch (err) {
    console.error(`\n❌ Connection attempt ${connectionAttempts} FAILED`)
    console.error("Error type:", err.name)
    console.error("Error message:", err.message)

    if (err.message.includes("ETIMEDOUT") || err.message.includes("ECONNREFUSED")) {
      console.error("\n🔧 TROUBLESHOOTING STEPS:")
      console.error("1. Check if your firewall/antivirus is blocking MongoDB (port 27017)")
      console.error("2. Try disabling VPN if you're using one")
      console.error("3. Verify MongoDB Atlas cluster is running (not paused)")
      console.error("4. Try connecting from MongoDB Compass to test the connection string")
      console.error("5. Check if your network allows outbound connections on port 27017")
      console.error("6. If on corporate/school network, it may block MongoDB connections")
    }

    if (connectionAttempts < maxRetries) {
      const retryDelay = connectionAttempts * 5000
      console.log(`\n⏳ Retrying in ${retryDelay / 1000} seconds...`)
      setTimeout(connectWithRetry, retryDelay)
    } else {
      console.error(
        "\n⚠️ All connection attempts failed. Server will continue running but database operations will fail\n",
      )
    }
  }
}

connectWithRetry()

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err)
})

const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database connection not available",
      message: "The server cannot connect to MongoDB Atlas. Please check your IP whitelist settings.",
      troubleshooting: [
        "1. Go to MongoDB Atlas dashboard (https://cloud.mongodb.com)",
        "2. Navigate to Network Access",
        "3. Add your current IP address or use 0.0.0.0/0 to allow all IPs (for development only)",
        "4. Wait a few minutes for the changes to take effect",
      ],
    })
  }
  next()
}

app.use("/api", checkDatabaseConnection)

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
})

function toObjectId(id) {
  try {
    return new ObjectId(id)
  } catch (error) {
    throw new Error("Invalid ID format")
  }
}

function toDocumentId(id) {
  // Documents use string IDs, not ObjectIds
  // Try to convert to ObjectId first, if it fails, use as string
  try {
    return new ObjectId(id)
  } catch (error) {
    // If not a valid ObjectId, return as string
    return id
  }
}

// === USERS CRUD ===
app.get("/api/users", async (req, res) => {
  try {
    console.log("[v0] Fetching all users")
    const users = await mongoose.connection.db.collection("users").find().toArray()
    console.log("[v0] Found users:", users.length)
    res.json(users)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/users/findOne", async (req, res) => {
  try {
    const { username } = req.query
    console.log("[v0] Finding user by username:", username)

    if (!username) {
      return res.status(400).json({ error: "Username query parameter is required" })
    }

    const user = await mongoose.connection.db.collection("users").findOne({ username: username })

    if (!user) {
      console.log("[v0] User not found:", username)
      return res.status(404).json({ error: "User not found" })
    }

    console.log("[v0] User found:", user.username, "Role:", user.role)
    res.json(user)
  } catch (error) {
    console.error("[v0] Error finding user:", error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body
    console.log("[v0] Login attempt for user:", username)

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" })
    }

    const user = await mongoose.connection.db.collection("users").findOne({ username: username })

    if (!user) {
      console.log("[v0] Login failed: User not found:", username)
      return res.status(401).json({ error: "Invalid username or password" })
    }

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      console.log("[v0] Login failed: Invalid password for user:", username)
      return res.status(401).json({ error: "Invalid username or password" })
    }

    console.log("[v0] Login successful for user:", username, "Role:", user.role)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    res.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("[v0] Error during login:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await mongoose.connection.db.collection("users").findOne({ _id: toObjectId(req.params.id) })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/users", async (req, res) => {
  try {
    console.log("[v0] Creating user:", req.body)
    const result = await mongoose.connection.db.collection("users").insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("[v0] User created:", result.insertedId)
    res.json({ _id: result.insertedId, ...req.body })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/users/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection("users")
      .updateOne({ _id: toObjectId(req.params.id) }, { $set: { ...req.body, updatedAt: new Date() } })
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/api/users/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection("users").deleteOne({ _id: toObjectId(req.params.id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// === DEPARTMENTS CRUD ===
app.get("/api/departments", async (req, res) => {
  try {
    console.log("[v0] Fetching all departments")
    const departments = await mongoose.connection.db.collection("departments").find().toArray()
    console.log("[v0] Found departments:", departments.length)
    res.json(departments)
  } catch (error) {
    console.error("[v0] Error fetching departments:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/departments/:id", async (req, res) => {
  try {
    const department = await mongoose.connection.db
      .collection("departments")
      .findOne({ _id: toObjectId(req.params.id) })
    if (!department) {
      return res.status(404).json({ error: "Department not found" })
    }
    res.json(department)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/departments", async (req, res) => {
  try {
    console.log("[v0] Creating department:", req.body)
    const result = await mongoose.connection.db.collection("departments").insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("[v0] Department created:", result.insertedId)
    res.json({ _id: result.insertedId, ...req.body })
  } catch (error) {
    console.error("[v0] Error creating department:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/departments/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection("departments")
      .updateOne({ _id: toObjectId(req.params.id) }, { $set: { ...req.body, updatedAt: new Date() } })
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Department not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/api/departments/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection("departments").deleteOne({ _id: toObjectId(req.params.id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Department not found" })
    }
    res.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// === DOCUMENTS CRUD ===
app.get("/api/documents", async (req, res) => {
  try {
    console.log("[v0] Fetching all documents")
    const documents = await mongoose.connection.db.collection("documents").find().toArray()
    console.log("[v0] Found documents:", documents.length)
    const documentsWithStringIds = documents.map((document) => ({
      ...document,
      _id: typeof document._id === "string" ? document._id : document._id.toString(),
    }))
    console.log(
      "[v0] Sample document ID:",
      documentsWithStringIds[0]?._id,
      "Type:",
      typeof documentsWithStringIds[0]?._id,
    )
    res.json(documentsWithStringIds)
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/documents/:id", async (req, res) => {
  try {
    const document = await mongoose.connection.db.collection("documents").findOne({ _id: toDocumentId(req.params.id) })
    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.json(document)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/documents", async (req, res) => {
  try {
    console.log("[v0] Creating document:", req.body)
    const result = await mongoose.connection.db.collection("documents").insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("[v0] Document created:", result.insertedId)
    res.json({ _id: result.insertedId, ...req.body })
  } catch (error) {
    console.error("[v0] Error creating document:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/documents/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection("documents")
      .updateOne({ _id: toDocumentId(req.params.id) }, { $set: { ...req.body, updatedAt: new Date() } })
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection("documents").deleteOne({ _id: toDocumentId(req.params.id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// === PAYMENTS CRUD ===
app.get("/api/payments", async (req, res) => {
  try {
    console.log("[v0] Fetching all payments")
    const payments = await mongoose.connection.db.collection("payments").find().toArray()
    console.log("[v0] Found payments:", payments.length)
    const paymentsWithStringIds = payments.map((payment) => ({
      ...payment,
      _id: typeof payment._id === "string" ? payment._id : payment._id.toString(),
    }))
    console.log("[v0] Sample payment ID:", paymentsWithStringIds[0]?._id, "Type:", typeof paymentsWithStringIds[0]?._id)
    res.json(paymentsWithStringIds)
  } catch (error) {
    console.error("[v0] Error fetching payments:", error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/payments/:id", async (req, res) => {
  try {
    const payment = await mongoose.connection.db.collection("payments").findOne({ _id: toObjectId(req.params.id) })
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json(payment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/payments", async (req, res) => {
  try {
    console.log("[v0] Creating payment:", req.body)
    const result = await mongoose.connection.db.collection("payments").insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("[v0] Payment created:", result.insertedId)
    res.json({ _id: result.insertedId, ...req.body })
  } catch (error) {
    console.error("[v0] Error creating payment:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/payments/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection("payments")
      .updateOne({ _id: toObjectId(req.params.id) }, { $set: { ...req.body, updatedAt: new Date() } })
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete("/api/payments/:id", async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection("payments").deleteOne({ _id: toObjectId(req.params.id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/payments/:id/approve", async (req, res) => {
  try {
    const { approvedBy, amount, method, reference } = req.body
    console.log("[v0] ===== PAYMENT APPROVAL DEBUG =====")
    console.log("[v0] Received ID:", req.params.id)
    console.log("[v0] ID type:", typeof req.params.id)
    console.log("[v0] ID length:", req.params.id.length)
    console.log("[v0] Approval data:", { approvedBy, amount, method, reference })

    let objectId
    try {
      objectId = toObjectId(req.params.id)
      console.log("[v0] Successfully converted to ObjectId:", objectId)
    } catch (conversionError) {
      console.error("[v0] ObjectId conversion failed:", conversionError.message)
      console.error("[v0] Invalid ID value:", req.params.id)
      return res.status(400).json({ error: `Invalid ID format: ${conversionError.message}` })
    }

    const payment = await mongoose.connection.db.collection("payments").findOne({ _id: objectId })

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" })
    }

    console.log("[v0] Found payment with documentId:", payment.documentId)

    const result = await mongoose.connection.db.collection("payments").updateOne(
      { _id: objectId },
      {
        $set: {
          status: "Approved",
          amount: amount,
          method: method,
          reference: reference,
          approvedBy: approvedBy,
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    console.log("[v0] Payment update result:", result)

    if (payment.documentId) {
      try {
        console.log("[v0] Approving linked document:", payment.documentId)
        const docResult = await mongoose.connection.db.collection("documents").updateOne(
          { _id: toDocumentId(payment.documentId) },
          {
            $set: {
              status: "Approved",
              paymentStatus: true,
              updatedAt: new Date(),
              approvedBy: approvedBy,
              approvedAt: new Date(),
            },
          },
        )
        console.log("[v0] Document approval result:", docResult)

        if (docResult.matchedCount === 0) {
          console.warn("[v0] Warning: Linked document not found:", payment.documentId)
        } else {
          console.log("[v0] Successfully approved linked document")
        }
      } catch (docError) {
        console.error("[v0] Error approving linked document:", docError)
        // Don't fail the payment approval if document approval fails
      }
    }

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("[v0] Error approving payment:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/payments/:id/reject", async (req, res) => {
  try {
    const { rejectedBy, rejectionReason } = req.body
    const result = await mongoose.connection.db.collection("payments").updateOne(
      { _id: toObjectId(req.params.id) },
      {
        $set: {
          status: "Rejected",
          updatedAt: new Date(),
          rejectedBy: rejectedBy,
          rejectionReason: rejectionReason,
          rejectedAt: new Date(),
        },
      },
    )
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// === APPROVAL ENDPOINTS ===
app.put("/api/documents/:id/approve", async (req, res) => {
  try {
    const { approvedBy } = req.body
    console.log("[v0] Approving document:", req.params.id)
    const result = await mongoose.connection.db.collection("documents").updateOne(
      { _id: toDocumentId(req.params.id) },
      {
        $set: {
          status: "Approved",
          paymentStatus: true,
          updatedAt: new Date(),
          approvedBy: approvedBy,
          approvedAt: new Date(),
        },
      },
    )
    console.log("[v0] Document approval result:", result)
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("[v0] Error approving document:", error)
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/documents/:id/reject", async (req, res) => {
  try {
    const { rejectedBy, rejectionReason } = req.body
    const result = await mongoose.connection.db.collection("documents").updateOne(
      { _id: toDocumentId(req.params.id) },
      {
        $set: {
          status: "Rejected",
          updatedAt: new Date(),
          rejectedBy: rejectedBy,
          rejectionReason: rejectionReason,
          rejectedAt: new Date(),
        },
      },
    )
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Document not found" })
    }
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// === SEARCH AND FILTER ENDPOINTS ===
app.get("/api/documents/search", async (req, res) => {
  try {
    const { status, departmentId } = req.query
    const filter = {}

    if (status) filter.status = status
    if (departmentId) filter.deptId = departmentId

    console.log("[v0] Searching documents with filter:", filter)
    const documents = await mongoose.connection.db.collection("documents").find(filter).toArray()
    res.json(documents)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/payments/search", async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}

    if (status) filter.status = status

    console.log("[v0] Searching payments with filter:", filter)
    const payments = await mongoose.connection.db.collection("payments").find(filter).toArray()
    res.json(payments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error", details: error.message })
})

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.originalUrl })
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  console.log(`🔗 API endpoints available at http://0.0.0.0:${PORT}/api`)
  console.log(`📱 Access from network devices at http://100.86.239.10:${PORT}/api`)
})
