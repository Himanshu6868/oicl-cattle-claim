function Card({ title, icon, onClick }) {
  return (
    <div className="policies-col3" onClick={onClick}>

      {icon && (
        <img
          src={icon}
          className="card-icon"
          alt={title}
        />
      )}

      <div className="card-title">
        {title}
      </div>

    </div>
  );
}

export default Card;