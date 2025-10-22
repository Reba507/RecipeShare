using Microsoft.EntityFrameworkCore;
using RecipeShare.API.Models;
using RecipeShare.API.Data;

namespace RecipeShare.API.Data
{
	public class RecipeDbContext : DbContext
	{
		public RecipeDbContext(DbContextOptions<RecipeDbContext> options) : base(options) { }

		public DbSet<Recipe> Recipes { get; set; } = null!;

        // Seed data 
        public void SeedIfEmpty()
        {
            if (Recipes.Any()) return; 

            Recipes.AddRange(
                new Recipe
                {
                    Title = "Pap and Chakalaka",
                    Ingredients = "Maize meal\nWater\nSalt\nOnion\nTomatoes\nCarrots\nBaked beans\nCurry powder",
                    Steps = "Cook pap until thick\nFry onions and add curry powder\nAdd tomatoes, carrots, and beans for chakalaka\nServe together",
                    CookingTimeMinutes = 40,
                    DietaryTags = "vegan,vegetarian,traditional"
                },
                new Recipe
                {
                    Title = "Grilled Chicken & Veggies",
                    Ingredients = "Chicken breast\nBell peppers\nZucchini\nOlive oil\nSalt\nPepper",
                    Steps = "Season chicken\nGrill chicken and veggies\nServe",
                    CookingTimeMinutes = 35,
                    DietaryTags = "gluten-free"
                },
                new Recipe
                {
                    Title = "Bunny Chow",
                    Ingredients = "1 loaf white bread\nCurry (chicken, lamb, or beans)\nOnion\nGarlic\nSpices",
                    Steps = "Hollow out half a loaf\nFill with hot curry\nServe with sambals or chutney",
                    CookingTimeMinutes = 45,
                    DietaryTags = "street-food,spicy"
                }
            );
            SaveChanges();
        }

    }
}
