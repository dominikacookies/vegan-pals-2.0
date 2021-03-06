const promptLogin = () => {
  window.location.replace(`/login`);
};

const promptSignup = () => {
  window.location.replace(`/signup`);
};

const saveToFavourites = async (event) => {
  const title = $('[name="recipe-title"]').text();
  const image = $('[name="recipe-image"]').attr("src");

  const { id } = event.currentTarget;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      title,
      image,
      id,
    }),
  };

  const response = await fetch(`/api/recipe/${id}`, options);

  if (response.status !== 200) {
    console.log("FAILED TO SAVE RECIPE");
  } else {
    window.location.replace(`/myrecipes`);
  }
};

const deleteFromFavourites = async (event) => {
  event.preventDefault();
  const { id } = event.currentTarget;
  console.log(id);

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  const response = await fetch(`/api/recipe/${id}`, options);

  if (response.status === 200) {
    window.location.replace(window.location.pathname);
  } else {
    console.log("Failed to delete recipe");
  }
};

$('button[name="add-to-favourites-btn"]').on("click", saveToFavourites);
$('button[name="remove-from-favourites-btn"]').on(
  "click",
  deleteFromFavourites
);
$("#prompt-login-btn").on("click", promptLogin);
$("#prompt-signup-btn").on("click", promptSignup);
