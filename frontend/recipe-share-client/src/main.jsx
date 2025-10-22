import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const API_URL = "http://localhost:5252/api/recipes"; // backend port

function App() {
    const [recipes, setRecipes] = useState([]);
    const [tag, setTag] = useState("");
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        id: null,
        title: "",
        ingredients: "",
        steps: "",
        cookingTimeMinutes: "",
        dietaryTags: ""
    });
    // filter state
    const [filter, setFilter] = useState("");

    // Dropdown or buttons for filter
    <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="gluten-free">Gluten-Free</option>
    </select>

    {
        recipes
            .filter(r => {
                if (!filter) return true; 
                // Normalize tags for comparison
                const tags = r.dietaryTags?.toLowerCase().split(",").map(t => t.trim());
                return tags.includes(filter.toLowerCase());
            })
        .map(r => (
            <div key={r.id} className="recipe-card">
                <h2>{r.title}</h2>
                <p><strong>Ingredients:</strong> {r.ingredients}</p>
                <p><strong>Steps:</strong> {r.steps}</p>
                <p><strong>Cooking Time:</strong> {r.cookingTimeMinutes} min</p>
                <div className="tags">
                    {r.dietaryTags?.split(",").map(tag => (
                        <span key={tag} className="tag">{tag.trim()}</span>
                    ))}
                </div>
                <button onClick={() => deleteRecipe(r.id)}>Delete</button>
            </div>
        ))
    }


    useEffect(() => {
        fetchRecipes();
    }, [tag]);

    // Fetch all recipes or filter by tag
    async function fetchRecipes() {
        setLoading(true);
        try {
            const url = tag ? `${API_URL}?tag=${tag}` : API_URL;
            const res = await fetch(url);
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            console.error("Fetch error:", err);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    }

    // Create or update recipe
    async function saveRecipe(e) {
        e.preventDefault();

        // Removed Id because it was giving issues when creating new recipe
        const bodyData = {
            ...(form.id ? { id: form.id } : {}),  
            title: form.title.trim(),
            ingredients: form.ingredients.trim(),
            steps: form.steps.trim(),
            cookingTimeMinutes: parseInt(form.cookingTimeMinutes) || 0,
            dietaryTags: form.dietaryTags.trim()
        };

        const method = form.id ? "PUT" : "POST";
        const url = form.id ? `${API_URL}/${form.id}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) {
                const errText = await res.text(); // get backend error message
                throw new Error(`Failed to save recipe: ${errText}`);
            }

            // Clear form and reload
            setForm({ id: null, title: "", ingredients: "", steps: "", cookingTimeMinutes: "", dietaryTags: "" });
            fetchRecipes();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }


    // Delete recipe
    async function deleteRecipe(id) {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            fetchRecipes();
        } catch (err) {
            console.error(err);
        }
    }

    // Load recipe into form for editing
    function editRecipe(r) {
        setForm({
            id: r.id,
            title: r.title,
            ingredients: r.ingredients,
            steps: r.steps,
            cookingTimeMinutes: r.cookingTimeMinutes,
            dietaryTags: r.dietaryTags
        });
    }

    return (
        <div style={{ maxWidth: "700px", margin: "30px auto" }}>
            <h1> Recipe Share</h1>

            {/* Tag filter */}
            <div className="filter-container">
                <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Filter by tag e.g., vegetarian"
                />
                <button onClick={fetchRecipes}>Apply</button>
            </div>

            {/* Recipe form */}
            <form onSubmit={saveRecipe} style={{ marginBottom: "20px", background: "#fff6f6", padding: "15px", borderRadius: "12px" }}>
                <h2>{form.id ? "Edit Recipe" : "Add New Recipe"}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Ingredients"
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Steps"
                    value={form.steps}
                    onChange={(e) => setForm({ ...form, steps: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Cooking Time (minutes)"
                    value={form.cookingTimeMinutes}
                    onChange={(e) => setForm({ ...form, cookingTimeMinutes: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Dietary Tags (comma-separated)"
                    value={form.dietaryTags}
                    onChange={(e) => setForm({ ...form, dietaryTags: e.target.value })}
                />
                <button type="submit">{form.id ? "Update Recipe" : "Add Recipe"}</button>
                {form.id && <button type="button" onClick={() => setForm({ id: null, title: "", ingredients: "", steps: "", cookingTimeMinutes: "", dietaryTags: "" })} style={{ marginLeft: "10px" }}>Cancel</button>}
            </form>

            {/* Recipe list */}
            {loading ? (
                <p style={{ textAlign: "center" }}>Loading recipes...</p>
            ) : recipes.length === 0 ? (
                <p style={{ textAlign: "center" }}>No recipes found.</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((r) => (
                        <div key={r.id} className="recipe-card">
                            <h2> {r.title}</h2>
                            <p><strong> Cooking Time:</strong> {r.cookingTimeMinutes} min</p>
                            <p><strong> Ingredients:</strong> {r.ingredients}</p>
                            <p><strong> Steps:</strong> {r.steps}</p>
                            <p className="recipe-tags">
                                {r.dietaryTags.split(',').map((t, i) => (
                                    <span key={i}>{t.trim()}</span>
                                ))}
                            </p>
                            <div style={{ marginTop: "10px" }}>
                                <button onClick={() => editRecipe(r)} style={{ marginRight: "8px" }}>Edit</button>
                                <button onClick={() => deleteRecipe(r.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
