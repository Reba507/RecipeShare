import { useEffect, useState } from "react"

function App() {
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Your .NET API (adjust port if needed)
        fetch("http://localhost:5252/api/recipes")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok")
                return res.json()
            })
            .then((data) => {
                setRecipes(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) return <p>Loading recipes...</p>
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>🍳 RecipeShare</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe.id}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default App
