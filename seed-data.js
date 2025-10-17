// Script to seed initial data into MongoDB for testing
const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI =
  process.env.MONGODB_ATLAS_URI ||
  "mongodb+srv://esrael202324_db_user:dL3OX5FeftPpBiOB@kfs-cluster.mnixxot.mongodb.net/kfs_db?retryWrites=true&w=majority&appName=kfs-cluster"

async function seedData() {
  try {
    console.log("🌱 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB Atlas\n")

    const db = mongoose.connection.db

    console.log("📁 Seeding Departments...")
    const departments = [
      {
        name: "Human Resources",
        description: "Manages employee relations and recruitment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Finance",
        description: "Handles financial operations and budgeting",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "IT Department",
        description: "Manages technology infrastructure",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Health Services",
        description: "Provides healthcare and medical services",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Education",
        description: "Manages educational programs and schools",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("departments").deleteMany({})
    const deptResult = await db.collection("departments").insertMany(departments)
    const deptIds = Object.values(deptResult.insertedIds)
    console.log(`✅ Seeded ${deptIds.length} departments\n`)

    console.log("👥 Seeding Users...")
    const users = [
      // Super Admin
      {
        fullName: "Admin User",
        username: "admin",
        password: "admin123",
        email: "admin@kfs.com",
        phone: "+251911000001",
        role: "Super Admin",
        departmentId: deptIds[1].toString(), // Finance department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Finance Head
      {
        fullName: "Finance Head User",
        username: "finhead",
        password: "finhead123",
        email: "finhead@kfs.com",
        phone: "+251911000002",
        role: "Finance Head",
        departmentId: deptIds[1].toString(), // Finance department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Finance Officer
      {
        fullName: "Finance Officer User",
        username: "finofficer",
        password: "finofficer123",
        email: "finofficer@kfs.com",
        phone: "+251911000003",
        role: "Finance Officer",
        departmentId: deptIds[1].toString(), // Finance department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Head - HR
      {
        fullName: "HR Department Head",
        username: "hrhead",
        password: "hrhead123",
        email: "hrhead@kfs.com",
        phone: "+251911000004",
        role: "Head",
        departmentId: deptIds[0].toString(), // HR department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Officer - HR
      {
        fullName: "HR Officer",
        username: "hrofficer",
        password: "hrofficer123",
        email: "hrofficer@kfs.com",
        phone: "+251911000005",
        role: "Officer",
        departmentId: deptIds[0].toString(), // HR department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Head - IT
      {
        fullName: "IT Department Head",
        username: "ithead",
        password: "ithead123",
        email: "ithead@kfs.com",
        phone: "+251911000006",
        role: "Head",
        departmentId: deptIds[2].toString(), // IT department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Officer - IT
      {
        fullName: "IT Officer",
        username: "itofficer",
        password: "itofficer123",
        email: "itofficer@kfs.com",
        phone: "+251911000007",
        role: "Officer",
        departmentId: deptIds[2].toString(), // IT department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Officer - Health
      {
        fullName: "Health Officer",
        username: "healthofficer",
        password: "healthofficer123",
        email: "healthofficer@kfs.com",
        phone: "+251911000008",
        role: "Officer",
        departmentId: deptIds[3].toString(), // Health department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Department Head - Education
      {
        fullName: "Education Head",
        username: "eduhead",
        password: "eduhead123",
        email: "eduhead@kfs.com",
        phone: "+251911000009",
        role: "Head",
        departmentId: deptIds[4].toString(), // Education department
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("users").deleteMany({})
    const userResult = await db.collection("users").insertMany(users)
    const userIds = Object.values(userResult.insertedIds)
    console.log(`✅ Seeded ${userIds.length} users\n`)

    console.log("📄 Seeding Documents...")
    const documents = [
      // HR Department Documents
      {
        title: "Employee Recruitment Request",
        description: "Request to hire 5 new employees for HR department",
        deptId: deptIds[0].toString(),
        createdBy: userIds[4].toString(), // HR Officer
        status: "Pending",
        custName: "Abebe Kebede",
        docFor: "Recruitment",
        phNum: "+251911111001",
        hNumber: "HR-001",
        paymentStatus: false,
        customFields: { positions: "5", urgency: "High" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Training Program Budget",
        description: "Budget allocation for employee training programs",
        deptId: deptIds[0].toString(),
        createdBy: userIds[3].toString(), // HR Head
        status: "Approved",
        custName: "Tigist Alemu",
        docFor: "Training Budget",
        phNum: "+251911111002",
        hNumber: "HR-002",
        paymentStatus: true,
        customFields: { duration: "3 months", participants: "50" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Office Supplies Request",
        description: "Monthly office supplies for HR department",
        deptId: deptIds[0].toString(),
        createdBy: userIds[4].toString(), // HR Officer
        status: "Pending",
        custName: "Meron Tadesse",
        docFor: "Office Supplies",
        phNum: "+251911111003",
        hNumber: "HR-003",
        paymentStatus: false,
        customFields: { items: "Stationery, Paper, Pens" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // IT Department Documents
      {
        title: "Server Upgrade Request",
        description: "Upgrade existing servers to improve performance",
        deptId: deptIds[2].toString(),
        createdBy: userIds[6].toString(), // IT Officer
        status: "Pending",
        custName: "Dawit Haile",
        docFor: "Infrastructure Upgrade",
        phNum: "+251911222001",
        hNumber: "IT-001",
        paymentStatus: false,
        customFields: { servers: "3", estimatedCost: "50000" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Software License Renewal",
        description: "Annual renewal of software licenses",
        deptId: deptIds[2].toString(),
        createdBy: userIds[5].toString(), // IT Head
        status: "Approved",
        custName: "Sara Mohammed",
        docFor: "License Renewal",
        phNum: "+251911222002",
        hNumber: "IT-002",
        paymentStatus: true,
        customFields: { licenses: "Microsoft Office, Adobe Creative" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Health Department Documents
      {
        title: "Medical Equipment Purchase",
        description: "Purchase of essential medical equipment",
        deptId: deptIds[3].toString(),
        createdBy: userIds[7].toString(), // Health Officer
        status: "Approved",
        custName: "Dr. Yohannes Bekele",
        docFor: "Equipment Purchase",
        phNum: "+251911333001",
        hNumber: "HLT-001",
        paymentStatus: true,
        customFields: { equipment: "X-Ray Machine, ECG Monitor" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Vaccination Campaign",
        description: "Community vaccination campaign budget",
        deptId: deptIds[3].toString(),
        createdBy: userIds[7].toString(), // Health Officer
        status: "Pending",
        custName: "Nurse Hanna Girma",
        docFor: "Health Campaign",
        phNum: "+251911333002",
        hNumber: "HLT-002",
        paymentStatus: false,
        customFields: { targetPopulation: "5000", duration: "2 weeks" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Education Department Documents
      {
        title: "School Construction Project",
        description: "Construction of new primary school building",
        deptId: deptIds[4].toString(),
        createdBy: userIds[8].toString(), // Education Head
        status: "Approved",
        custName: "Ato Mulugeta Assefa",
        docFor: "Construction",
        phNum: "+251911444001",
        hNumber: "EDU-001",
        paymentStatus: true,
        customFields: { classrooms: "12", capacity: "600 students" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Textbook Procurement",
        description: "Purchase of textbooks for all grade levels",
        deptId: deptIds[4].toString(),
        createdBy: userIds[8].toString(), // Education Head
        status: "Pending",
        custName: "W/ro Almaz Tesfaye",
        docFor: "Educational Materials",
        phNum: "+251911444002",
        hNumber: "EDU-002",
        paymentStatus: false,
        customFields: { books: "5000", grades: "1-8" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Finance Department Documents
      {
        title: "Annual Audit Report",
        description: "Comprehensive financial audit for fiscal year",
        deptId: deptIds[1].toString(),
        createdBy: userIds[2].toString(), // Finance Officer
        status: "Approved",
        custName: "Ato Getachew Worku",
        docFor: "Audit",
        phNum: "+251911555001",
        hNumber: "FIN-001",
        paymentStatus: true,
        customFields: { fiscalYear: "2024", auditor: "External Firm" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("documents").deleteMany({})
    const docResult = await db.collection("documents").insertMany(documents)
    const docIds = Object.values(docResult.insertedIds)
    console.log(`✅ Seeded ${docIds.length} documents\n`)

    console.log("💰 Seeding Payments...")
    const payments = [
      // Pending payments
      {
        documentId: docIds[0].toString(), // HR Recruitment
        amount: 25000.0,
        method: "Bank Transfer",
        status: "Pending",
        reference: "PAY-HR-001",
        notes: "Payment for recruitment process",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: docIds[2].toString(), // HR Office Supplies
        amount: 5000.0,
        method: "Cash",
        status: "Pending",
        reference: "PAY-HR-003",
        notes: "Monthly office supplies",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: docIds[3].toString(), // IT Server Upgrade
        amount: 150000.0,
        method: "Bank Transfer",
        status: "Pending",
        reference: "PAY-IT-001",
        notes: "Server infrastructure upgrade",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: docIds[6].toString(), // Health Vaccination
        amount: 35000.0,
        method: "Bank Transfer",
        status: "Pending",
        reference: "PAY-HLT-002",
        notes: "Community vaccination campaign",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: docIds[8].toString(), // Education Textbooks
        amount: 75000.0,
        method: "Bank Transfer",
        status: "Pending",
        reference: "PAY-EDU-002",
        notes: "Textbook procurement for grades 1-8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Approved payments
      {
        documentId: docIds[1].toString(), // HR Training Budget
        amount: 45000.0,
        method: "Bank Transfer",
        status: "Approved",
        reference: "PAY-HR-002",
        notes: "Employee training program budget",
        approvedBy: userIds[1].toString(), // Finance Head
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        documentId: docIds[4].toString(), // IT License Renewal
        amount: 30000.0,
        method: "Bank Transfer",
        status: "Approved",
        reference: "PAY-IT-002",
        notes: "Annual software license renewal",
        approvedBy: userIds[2].toString(), // Finance Officer
        approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        documentId: docIds[5].toString(), // Health Equipment
        amount: 200000.0,
        method: "Bank Transfer",
        status: "Approved",
        reference: "PAY-HLT-001",
        notes: "Medical equipment purchase",
        approvedBy: userIds[1].toString(), // Finance Head
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        documentId: docIds[7].toString(), // Education School Construction
        amount: 500000.0,
        method: "Bank Transfer",
        status: "Approved",
        reference: "PAY-EDU-001",
        notes: "School construction project - Phase 1",
        approvedBy: userIds[1].toString(), // Finance Head
        approvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        documentId: docIds[9].toString(), // Finance Audit
        amount: 80000.0,
        method: "Bank Transfer",
        status: "Approved",
        reference: "PAY-FIN-001",
        notes: "Annual audit service fee",
        approvedBy: userIds[1].toString(), // Finance Head
        approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]

    await db.collection("payments").deleteMany({})
    const paymentResult = await db.collection("payments").insertMany(payments)
    console.log(`✅ Seeded ${Object.keys(paymentResult.insertedIds).length} payments\n`)

    console.log("🎉 Database seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Departments: ${deptIds.length}`)
    console.log(`   Users: ${userIds.length}`)
    console.log(`   Documents: ${docIds.length}`)
    console.log(`   Payments: ${Object.keys(paymentResult.insertedIds).length}`)

    console.log("\n🔐 Test User Credentials:")
    console.log("   Super Admin: admin / admin123")
    console.log("   Finance Head: finhead / finhead123")
    console.log("   Finance Officer: finofficer / finofficer123")
    console.log("   HR Department Head: hrhead / hrhead123")
    console.log("   HR Officer: hrofficer / hrofficer123")
    console.log("   IT Department Head: ithead / ithead123")
    console.log("   IT Officer: itofficer / itofficer123")
    console.log("   Health Officer: healthofficer / healthofficer123")
    console.log("   Education Head: eduhead / eduhead123")

    console.log("\n✨ You can now test role-based access control!")
    console.log("   - Department Officers can only see their department's documents")
    console.log("   - Department Heads can edit unapproved documents in their department")
    console.log("   - Finance Officers can view and approve all payments")
    console.log("   - Finance Heads can edit payments before and after approval")
    console.log("   - Super Admin has full access to everything")

    await mongoose.connection.close()
    console.log("\n👋 Connection closed")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
