import { useState } from "react";

export default function RecipeForm({ initial = {}, onSave, onCancel }) {
    const [title, setTitle] = useState(initial.title ?? "");
    const [ingredients, setIngredients] = useState(initial.ingredients ?? "");
    const [steps, setSteps] = useState(initial.steps ?? "");
    const [cookingTime, setCookingTime] = useState(initial.cookingTimeMinutes ?? 10);
    const [tags, setTags] = useState(initial.dietaryTags ?? "");
    const [error, setError] = useState(null);

    const save = async () => {
        if (!title.trim()) { setError("Title is required"); return; }
        if (cookingTime <= 0) { setError("Cooking time must be > 0"); return; }

        setError(null);
        const payload = {
            id: initial.id ?? 0,
            title,
            ingredients,
            steps,
            cookingTimeMinutes: Number(cookingTime),
            dietaryTags: tags
        };

        try {
            await onSave(payload);
        } catch (err) {
            setError(err.message || String(err));
        }
    };

    return (
        <div>
            <h3>{initial.id ? "Edit Recipe" : "New Recipe"}</h3>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div style={{ marginBottom: 8 }}>
                <label>Title</label>
                <br />
                <input value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Cooking Time (minutes)</label>
                <br />
                <input type="number" value={cookingTime} onChange={e => setCookingTime(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Dietary Tags (comma-separated)</label>
                <br />
                <input value={tags} onChange={e => setTags(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Ingredients (one per line)</label>
                <br />
                <textarea rows={5} value={ingredients} onChange={e => setIngredients(e.target.value)} />
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Steps (one per line)</label>
                <br />
                <textarea rows={6} value={steps} onChange={e => setSteps(e.target.value)} />
            </div>

            <div>
                <button onClick={save}>{initial.id ? "Save" : "Create"}</button>
                <button onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
        </div>
    );
}
