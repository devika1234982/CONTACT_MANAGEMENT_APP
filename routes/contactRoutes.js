import express from "express";
import { getContacts, addContact, editContact, deleteContact } from "../controllers/contactController.js";


const router = express.Router();


router.get("/contacts", getContacts);

router.post("/contacts", addContact);

router.put("/contacts/:id", editContact);

router.delete("/contacts/:id", deleteContact);



export default router;