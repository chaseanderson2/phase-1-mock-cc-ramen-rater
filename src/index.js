document.addEventListener("DOMContentLoaded", () => {
  const ramenMenu = document.getElementById("ramen-menu");
  const ramenDetail = document.getElementById("ramen-detail");
  const newRamenForm = document.getElementById("new-ramen");
  const editRamenForm = document.getElementById("edit-ramen");

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

  function showRamenDetails(ramen) {
    ramenDetail.innerHTML = `
      <img src="${ramen.image}" />
      <h2>${ramen.name}</h2>
      <h3>${ramen.restaurant}</h3>
      <p>Rating: ${ramen.rating}</p>
      <p>Comment: ${ramen.comment}</p>
    `;
  }

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
        ramenMenu.appendChild(img);

        img.addEventListener("click", () => {
          showRamenDetails(ramen);
        });

        // Show the details of the new ramen
        showRamenDetails(ramen);

        newRamenForm.reset();
      })
      .catch(error => console.log("Error:", error));
  });

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

  editRamenForm.addEventListener("submit", event => {
    event.preventDefault();
    const ramenId = event.target.dataset.id;
    const updatedRamen = {
      rating: event.target.rating.value,
      comment: event.target.comment.value
    };

    updateRamen(ramenId, updatedRamen)
      .then(ramen => {
        showRamenDetails(ramen);
        editRamenForm.reset();
      })
      .catch(error => console.log(error));
  });

  function updateRamen(ramenId, updatedRamen) {
    return fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(updatedRamen)
    }).then(response => response.json());
  }

  ramenMenu.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
      const ramenId = event.target.parentElement.dataset.id;

      deleteRamen(ramenId)
        .then(() => {
          event.target.parentElement.remove();
          ramenDetail.innerHTML = "";
        })
        .catch(error => console.log(error));
    }
  });

  function deleteRamen(ramenId) {
    return fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: "DELETE"
    }).then(response => response.json());
  }
});
