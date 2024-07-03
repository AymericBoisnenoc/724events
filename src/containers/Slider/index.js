import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trier les événements par date du plus ancien au plus récent
  const byDateDesc = data?.focus?.slice().sort((evtA, evtB) =>
    new Date(evtA.date) - new Date(evtB.date)
  );

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length);
  };

  // Utiliser useEffect pour changer la carte toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(nextCard, 5000);
    return () => clearInterval(interval); // Nettoyage de l'intervalle à la désactivation du composant
  }, [byDateDesc]);

  // Si byDateDesc est vide ou n'est pas défini, afficher un message ou rien du tout
  if (!byDateDesc || byDateDesc.length === 0) {
    return null;
  }

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event) => (
        // Utilisation de event.id || event.title pour garantir une clé unique pour chaque élément
        <div key={event.id || event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === byDateDesc.indexOf(event) ? "display" : "hide"
            }`}
          >
            {event.cover ? (
              <img src={event.cover} alt={event.title} />
            ) : (
              // Affichage d'un message de remplacement si l'URL de l'image n'est pas définie
              <div className="SlideCard__placeholder">Image non disponible</div>
            )}
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((paginationEvent) => (
                // Utilisation de event.id || event.title pour garantir une clé unique pour chaque bouton radio
                <input
                  key={paginationEvent.id || paginationEvent.title}
                  type="radio"
                  name="radio-button"
                  checked={index === byDateDesc.indexOf(paginationEvent)}
                  readOnly
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
