export default function RecipeList({ recipes = [], onSelect, onEdit }) {
    return (
        <div style={{ marginTop: 10 }}>
            <h3>Recipes</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {recipes.map(r => (
                    <li key={r.id} style={{ padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                        <div style={{ cursor: "pointer" }} onClick={() => onSelect(r)}>
                            <strong>{r.title}</strong>
                            <div style={{ fontSize: 12, color: "#666" }}>{r.dietaryTags}</div>
                        </div>
                        <div>
                            <button onClick={() => onEdit(r)}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
