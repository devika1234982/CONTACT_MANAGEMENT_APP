import Contact from "../models/contact.js";

//GET CONTACT
export const getContacts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const sort = req.query.sort || "latest";
    const countryCode = req.query.countryCode;

    const skip = (page - 1) * limit;

    let filter = {};


    if (countryCode && countryCode.trim() !== "") {
      filter.countryCode = countryCode.trim();
    }

    if (req.query.search && req.query.search.trim() !== "") {
      const search = req.query.search.trim();

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search } }
      ];
    }



    let sortOption = sort === "latest" ? { createdAt: -1 } : { createdAt: 1 };

    const contacts = await Contact.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ADD CONTACT
export const addContact = async (req, res) => {
  try {
    const { name, phone, countryCode } = req.body;

    if (!name || !phone || !countryCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, phone, countryCode });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// EDIT CONTACT 

export const editContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, countryCode } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, phone, countryCode },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CONTACT

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


