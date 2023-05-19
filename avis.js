export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    // Récuperation des avis en fonction de l'id de la pièce.
    for (let i = 0; i < piecesElements.length; i++) {

      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        const avis = await reponse.json();
        window.localStorage.setItem(`avis-pieces-${id}`, JSON.stringify(avis))
        const pieceElement = event.target.parentElement;
        afficherAvis(pieceElement, avis)
      });
    }
}

export function afficherAvis(pieceElement, avis) {
  //Pour chaque avis on crée un balise P qui contient le nom d'utilisateur et le commentaire lié.
  const avisElement = document.createElement("p");
  for(let i = 0; i < avis.length; i++) {
      avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b>${avis[i].commentaire} <br>`;
  }
  pieceElement.appendChild(avisElement);
}


export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function(event) {
      event.preventDefault();

  // Création de l’objet du nouvel avis.
     const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: event.target.querySelector("[name=etoiles]").value,
    };
    // Création de la charge utile au format JSON
      const chargeUtile = JSON.stringify(avis);
      // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    });
}