(function () {
  var form = document.getElementById("formulaire");
  var msg = document.getElementById("message");
  var bouton = document.getElementById("envoyer");
  var texte = document.getElementById("histoire");
  var compte = document.getElementById("compte");

  texte.addEventListener("input", function () {
    compte.textContent = texte.value.length;
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var nom = form.nom.value.trim();
    var histoire = form.histoire.value.trim();
    if (!nom || !histoire) return;

    if (!window.CONFIG || window.CONFIG.ACCESS_KEY.indexOf("COLLE_ICI") === 0) {
      msg.className = "erreur";
      msg.textContent = "Configuration manquante : la clé n’est pas renseignée dans config.js.";
      return;
    }

    bouton.disabled = true;
    msg.className = "";
    msg.textContent = "Envoi en cours…";

    try {
      var rep = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: window.CONFIG.ACCESS_KEY,
          subject: "Histoire – Joueur " + window.JOUEUR + " – " + nom,
          from_name: "Jeu des histoires",
          joueur: "Joueur " + window.JOUEUR,
          nom: nom,
          histoire: histoire,
          botcheck: form.botcheck.checked
        })
      });
      var data = await rep.json();
      if (data.success) {
        form.querySelectorAll("input, textarea").forEach(function (el) { el.disabled = true; });
        bouton.style.display = "none";
        msg.className = "ok";
        msg.textContent = "Merci " + nom + " ! Ton histoire a bien été envoyée.";
      } else {
        throw new Error(data.message || "Erreur");
      }
    } catch (err) {
      bouton.disabled = false;
      msg.className = "erreur";
      msg.textContent = "L’envoi a échoué. Garde ton texte (copie-le) et réessaie dans un instant.";
    }
  });
})();
