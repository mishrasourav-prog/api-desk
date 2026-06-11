import { Router } from "express";
import { createDeck, getUserDecks, deleteDeck, getDeckById, updateDeck} from "../controllers/deck.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createMockRouteSchema } from "../schema/deck.schema";


const router = Router();

router.use(verifyJWT);

router.post("/create", validate(createMockRouteSchema) , createDeck);      
router.get("/list", getUserDecks);        
router.delete("/:id", (req, res, next) => {
  console.log("DELETE ROUTE HIT:", req.params.id);
  next();
}, deleteDeck);      

router.get("/:id", getDeckById);

router.put("/:id",validate(createMockRouteSchema), updateDeck);

export default router;