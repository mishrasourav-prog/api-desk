import { Router } from "express";
import { createDeck, getUserDecks, deleteDeck, getDeckById, updateDeck} from "../controllers/deck.controller";
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router();

router.use(verifyJWT);

router.post("/create", verifyJWT, createDeck);      
router.get("/list", verifyJWT, getUserDecks);        
router.delete("/:id", (req, res, next) => {
  console.log("DELETE ROUTE HIT:", req.params.id);
  next();
}, deleteDeck);      

router.get("/:id", verifyJWT, getDeckById);

router.put("/:id", verifyJWT, updateDeck);

export default router;