export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    // Récuperation des avis en fonction de l'id de la pièce.
    for (let i = 0; i < piecesElements.length; i++) {

      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        const avis = await reponse.json();
        const pieceElement = event.target.parentElement;
    //Pour chaque avis on crée un balise P qui contient le nom d'utilisateur et le commentaire lié.
        const avisElement = document.createElement("p");
        for(let i = 0; i < avis.length; i++) {
            avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b>${avis[i].commentaire} <br>`;
        }
        pieceElement.appendChild(avisElement);
      });

    }

    
}