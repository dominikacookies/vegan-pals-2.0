$(".datepicker").datepicker();

let searchResultsOffset = 0

const onSubmit = async (event) => {
  event.preventDefault();

  const searchInput = $("#searchInput").val();

  let searchInputParams = "";

  if (searchInput) {
    searchInputParams = `&query=${searchInput}`;
  }

  const checkedIntolerances = document.querySelectorAll(".intolerance:checked");

  let intoleranceParams = "";

  if (checkedIntolerances.length > 0) {
    const intolerances = Array.prototype.slice.call(checkedIntolerances);

    const getIntoleranceName = (intolerance) => {
      return intolerance.name;
    };

    intoleranceParams =
      "&intolerances=" + intolerances.map(getIntoleranceName).join(",");
  }

  let prepTimeParams = "";

  const prepTime = $("input[type='radio']:checked").attr("id");

  if (prepTime) {
    prepTimeParams = `&maxReadyTime=${prepTime}`;
  }

  window.location.replace(
    `/search-results?${searchInputParams}${intoleranceParams}${prepTimeParams}`
  );
};

const clearSearchResultsOffset = () => {
  searchResultsOffset = 0
}

const renderMoreRecipeCards = (recipe) => {
  $(".card-group").append(`
    <section class="recipe-card-container d-inline-flex flex-wrap">
    <div class="main-recipe-card card">
      <a href="recipe/${recipe.id}" target="_blank">
        <div id="image-block" class="mx-auto">
          <img
            src=${recipe.image}
            class="card-img-top mb-3 recipe-img"
            alt="Image of dish"
          />
          <h5 class="card-title text-center btn recipe-title">
            ${recipe.title}
          </h5>
        </div>
      </a>
    </div>
  </section>
  `)
}

const renderMoreResults = async (event) => {
  searchResultsOffset += 10 
  const requestUrl = $(event.target).data("requesturl")

  console.log(requestUrl)

  const response = await fetch(`${requestUrl}&offset=${searchResultsOffset}`);
  const data = await response.json()
  data.results.forEach(renderMoreRecipeCards)
};

const getPalId = (event) => {
  const palId = $(event.target).data("pal");
  $("#cooktogether-button").attr("data-pal", palId);
};

const createCookTogether = async (event) => {
  const date = $("#date-input").val();
  const mealType = $(".form-check-input:checked").val();
  const message = $(".message").val();
  const contactDetailsForSendingUser = $(".contact-details").val();
  const userIdReceivingInvite = $(event.target).attr("data-pal");

  console.log(date, mealType, message, contactDetailsForSendingUser, userIdReceivingInvite)

  if (!date || !mealType || !userIdReceivingInvite ) {
    $(event.target).siblings("#errors").empty()
    $(event.target).siblings("#errors").append(`
    <p> Please provide all of the above information to send the request. </p>
    `)
    return
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      date,
      mealType,
      message,
      contactDetailsForSendingUser,
      userIdReceivingInvite,
    }),
  };

  const response = await fetch("/api/cooktogether", options);

  if (response.status === 200) {
    $(".offcanvas-body").empty();
    $(".offcanvas-body").append(`
    <h3> Request sent successfully! </h3>`);

    setTimeout(() => {
      window.location.replace(`/cooktogether`);
    }, 1000);
  }
  //handle errors
};

const acceptCooktogether = async (event) => {
  const parentContainer = $(event.target).parent();
  const cooktogetherId = parentContainer.attr("id");
  const contactDetails = $(event.target).siblings("#contact-info").val();

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactDetails,
    }),
    redirect: "follow",
  };

  const response = await fetch(`/api/cooktogether/${cooktogetherId}`, options);

  if (response.status === 200) {
    parentContainer.empty();
    parentContainer.append(`
    <p> It's all set! </p>
    `);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
};

const provideCooktogetherContactDetails = async (event) => {
  const parentContainer = $(event.target).parent();
  parentContainer.empty();
  parentContainer.append(`
    <p class="small-text-bolded"> Insta, Whatsapp or pigeon mail? </p>
    <input id="contact-info" placeholder="Contact details">
    <button class="accept-request-button primary-button"> Accept </button>
  `);

  $(".accept-request-button").on("click", acceptCooktogether);
};

const deleteCooktogether = async (event) => {
  const parentContainer = $(event.target).parent();
  const cooktogetherId = parentContainer.attr("id");

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  const response = await fetch(`/api/cooktogether/${cooktogetherId}`, options);
  console.log(response.status)
  if (response.status === 200) {
    parentContainer.empty();
    parentContainer.append(`
    <p> Deleted successfully. </p>
    `);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
};

const saveBio = async () => {
  const userBio = $("#bio").val();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      bio: userBio,
    }),
  };
  //if response is false, error message displayed
  const response = await fetch("/api/saveBio", options);
};

$("#searchButton").on("click", onSubmit);
$("#renderMoreResults").on("load", clearSearchResultsOffset);
$("#renderMoreResults").on("click", renderMoreResults);
$("#cooktogether-button").on("click", createCookTogether);
$('[data-name="pal-selector"]').on("click", getPalId);
$(".extra-info-button").on("click", provideCooktogetherContactDetails);
$(".cancel-request-button").on("click", deleteCooktogether);
$(".decline-request-button").on("click", deleteCooktogether);
$("#bioBtn").on("click", saveBio);
