export default function RecipeDetails({ recipe, onEdit, onDelete }) {
    if (!recipe) return null;
    return (
        <div>
            <h2>{recipe.title}</h2>
            <div><strong>Cooking Time:</strong> {recipe.cookingTimeMinutes} min</div>
            <div><strong>Tags:</strong> {recipe.dietaryTags}</div>

            <h4>Ingredients</h4>
            <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.ingredients}</pre>

            <h4>Steps</h4>
            <pre style={{ whiteSpace: "pre-wrap" }}>{recipe.steps}</pre>

            <div style={{ marginTop: 10 }}>
                <button onClick={onEdit}>Edit</button>
                <button onClick={onDelete} style={{ marginLeft: 8 }}>Delete</button>
            </div>
        </div>
    );
}
