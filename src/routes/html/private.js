const { Router } = require("express");
const {
  renderCookTogether,
  renderMyRecipes,
  renderMyRecipesCookTogether,
  renderCookTogetherPals,
} = require("../../controllers/html/private");

const router = Router();

router.get("/cooktogether/cooktogethers", renderCookTogether);
router.get("/cooktogether/myrecipes/pals/:recipeId", renderCookTogetherPals);
router.get("/cooktogether/myrecipes/", renderMyRecipesCookTogether);
router.get("/myrecipes", renderMyRecipes);

module.exports = router;
