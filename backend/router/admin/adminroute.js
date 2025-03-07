const express = require("express");
const { all: Intern, Domainlist } = require("../../models/user"); // Ensure correct imports
const router = express.Router();
router.use(express.json());

// Utility function for error handling
const handleError = (res, error, message = "Server error") => {
  console.error(error);
  res.status(500).json({ message, error: error.message });
};

// POST: Add a new intern
router.post("/interns", async (req, res) => {
  try {
    const { Domain, personal_details, educational_details, internship_details, identification_documents } = req.body;

    if (!Domain || !personal_details?.email || !educational_details || !internship_details || !identification_documents?.aadhaar_number) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if Domain exists
    const domainExists = await Domainlist.findOne({ Domain });
    if (!domainExists) {
      return res.status(400).json({ message: "Invalid domain. Please choose an existing domain." });
    }

    // Check for existing intern with the same email or Aadhaar number
    const existingIntern = await Intern.findOne({
      $or: [
        { "personal_details.email": personal_details.email },
        { "identification_documents.aadhaar_number": identification_documents.aadhaar_number },
      ],
    });

    if (existingIntern) {
      return res.status(400).json({ message: "Intern with this email or Aadhaar number already exists." });
    }

    // Save the new intern
    const newIntern = new Intern(req.body);
    await newIntern.save();

    res.status(201).json({ message: "Intern added successfully", intern: newIntern });
  } catch (error) {
    handleError(res, error, "Error adding intern");
  }
});

// GET: Fetch all interns (optionally by domain)
router.get("/interns", async (req, res) => {
  try {
    const { domain } = req.query;
    const filter = domain ? { Domain: domain } : {};
    const interns = await Intern.find(filter);
    if (!interns.length) {
      return res.status(404).json({ message: "No interns found" });
    }
    res.status(200).json(interns);
  } catch (error) {
    handleError(res, error, "Error fetching interns");
  }
});

// ✅ MISSING `/` ROUTE: Fetch all interns
router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find();
    if (!interns.length) {
      return res.status(404).json({ message: "No interns found" });
    }
    res.status(200).json(interns);
  } catch (error) {
    handleError(res, error, "Error fetching interns");
  }
});

// GET: Fetch a single intern by ID
router.get("/interns/:id", async (req, res) => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json(intern);
  } catch (error) {
    handleError(res, error, "Error fetching intern");
  }
});

// PUT: Update intern by ID
router.put("/interns/:id", async (req, res) => {
  try {
    const updatedIntern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json({ message: "Intern updated successfully", intern: updatedIntern });
  } catch (error) {
    handleError(res, error, "Error updating intern");
  }
});

// DELETE: Remove intern by ID
router.delete("/interns/:id", async (req, res) => {
  try {
    const deletedIntern = await Intern.findByIdAndDelete(req.params.id);
    if (!deletedIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json({ message: "Intern deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting intern");
  }
});

// DOMAIN CRUD OPERATIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// POST: Add a new domain
router.post("/domain", async (req, res) => {
  try {
    const { Domain } = req.body;
    if (!Domain) {
      return res.status(400).json({ message: "Domain is required" });
    }

    // Check if domain already exists
    const domainExists = await Domainlist.findOne({ Domain });
    if (domainExists) {
      return res.status(400).json({ message: "Domain already exists" });
    }

    const newDomain = new Domainlist({ Domain });
    await newDomain.save();

    res.status(201).json(await Domainlist.find());
  } catch (error) {
    handleError(res, error, "Error saving domain");
  }
});

// PUT: Update an existing domain and update all related interns
router.put("/domain/:id", async (req, res) => {
  try {
    const { newDomain } = req.body;
    if (!newDomain) {
      return res.status(400).json({ message: "New domain name is required" });
    }

    const oldDomain = await Domainlist.findById(req.params.id);
    if (!oldDomain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Update domain in Domainlist and intern records
    await Domainlist.findByIdAndUpdate(req.params.id, { Domain: newDomain });
    await Intern.updateMany({ Domain: oldDomain.Domain }, { $set: { Domain: newDomain } });

    res.status(200).json({ message: "Domain updated successfully" });
  } catch (error) {
    handleError(res, error, "Domain update failed");
  }
});

// DELETE: Remove a domain and all related interns
router.delete("/domain/:id", async (req, res) => {
  try {
    const domainToDelete = await Domainlist.findById(req.params.id);
    if (!domainToDelete) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // Delete all interns under this domain
    await Intern.deleteMany({ Domain: domainToDelete.Domain });

    // Delete the domain itself
    await Domainlist.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Domain and all related interns deleted successfully" });
  } catch (error) {
    handleError(res, error, "Domain deletion failed");
  }
});

// GET: Fetch all domains
router.get("/domain", async (req, res) => {
  try {
    const records = await Domainlist.find();
    if (!records.length) {
      return res.status(404).json({ message: "No domains found" });
    }
    res.status(200).json(records);
  } catch (error) {
    handleError(res, error, "Error fetching domains");
  }
});

module.exports = router;
