import { useEffect, useState } from "react";
import { API_BASE } from "./api";

import RecipeList from "./RecipeList";
import RecipeDetails from "./RecipeDetails";
import RecipeForm from "./RecipeForm";


export const API_BASE = 'http://localhost:5252';  //  backend address


function App() {
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState(null);

    const load = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/recipes`);
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            setError(err.message || String(err));
        }
    };

    useEffect(() => { load(); }, []);

    const onCreate = async (payload) => {
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/recipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || res.statusText);
            }
            await load();
            setEditing(null);
        } catch (err) { setError(err.message); }
    };

    const onUpdate = async (id, payload) => {
        try {
            const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || res.statusText);
            }
            await load();
            setEditing(null);
            setSelected(null);
        } catch (err) { setError(err.message); }
    };

    const onDelete = async (id) => {
        if (!confirm("Delete recipe?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/recipes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            await load();
            setSelected(null);
        } catch (err) { setError(err.message); }
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h1>🍳 RecipeShare</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <div style={{ display: "flex", gap: 20 }}>
                <div style={{ width: 320 }}>
                    <button onClick={() => setEditing({})}>+ New Recipe</button>
                    <RecipeList
                        recipes={recipes}
                        onSelect={r => setSelected(r)}
                        onEdit={r => setEditing(r)}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    {editing ? (
                        <RecipeForm initial={editing} onCancel={() => setEditing(null)} onSave={async (payload) => {
                            if (editing.id) await onUpdate(editing.id, payload);
                            else await onCreate(payload);
                        }} />
                    ) : selected ? (
                        <RecipeDetails recipe={selected} onEdit={() => setEditing(selected)} onDelete={() => onDelete(selected.id)} />
                    ) : (
                        <div>Select a recipe or create a new one.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
