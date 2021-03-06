const { Router } = require("express");

const {
  createCookTogether,
  updateCookTogether,
  deleteCookTogether,
  saveRecipe,
  deleteRecipe,
  saveBio,
} = require("../../controllers/api");

const router = Router();

router.post("/cooktogether", createCookTogether);
router.put("/cooktogether/:cookTogetherId", updateCookTogether);
router.delete("/cooktogether/:cookTogetherId", deleteCookTogether);

router.post("/recipe/:id", saveRecipe);
router.delete("/recipe/:recipeId", deleteRecipe);
router.post ("/saveBio", saveBio)
module.exports = router;
