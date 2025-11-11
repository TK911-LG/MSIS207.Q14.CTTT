export default function Card({ children, className = '', title = null }) {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">{children}</div>
        </div>
    )
}
