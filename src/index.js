document.addEventListener("DOMContentLoaded", main);

function main() {
  displayRamens();
  addSubmitListener();
}

function displayRamens() {
  const ramenMenu = document.getElementById("ramen-menu");

  fetch("http://localhost:3000/ramens")
    .then(response => response.json())
    .then(data => {
      data.forEach(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        ramenMenu.appendChild(img);

        img.addEventListener("click", () => {
          showRamenDetails(ramen);
        });
      });
    })
    .catch(error => console.log(error));
}

function showRamenDetails(ramen) {
  const ramenDetail = document.getElementById("ramen-detail");
  ramenDetail.innerHTML = `
    <img src="${ramen.image}" />
    <h2>${ramen.name}</h2>
    <h3>${ramen.restaurant}</h3>
    <p>Rating: ${ramen.rating}</p>
    <p>Comment: ${ramen.comment}</p>
  `;
}

function addSubmitListener() {
  const newRamenForm = document.getElementById("new-ramen");

  newRamenForm.addEventListener("submit", event => {
    event.preventDefault();
    const newRamen = {
      image: event.target['new-image'].value,
      name: event.target['new-name'].value,
      restaurant: event.target['new-restaurant'].value,
      rating: event.target['new-rating'].value,
      comment: event.target['new-comment'].value
    };

    createRamen(newRamen)
      .then(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        document.getElementById("ramen-menu").appendChild(img);

        img.addEventListener("click", () => {
          showRamenDetails(ramen);
        });

        newRamenForm.reset();
      })
      .catch(error => console.log("Error:", error));
  });
}

function createRamen(ramen) {
  return fetch("http://localhost:3000/ramens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(ramen)
  }).then(response => response.json());
}
