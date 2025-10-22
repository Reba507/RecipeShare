using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.API.Controllers;
using RecipeShare.API.Data;
using RecipeShare.API.DTOs;
using RecipeShare.API.Models;
using Xunit;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeShare.Tests
{
    public class RecipesControllerTests
    {
        private RecipeDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<RecipeDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            var context = new RecipeDbContext(options);
            context.Database.EnsureDeleted(); // fresh db
            context.Database.EnsureCreated();
            context.Recipes.AddRange(
                new Recipe { Title = "Pasta", Ingredients = "Noodles, Sauce", Steps = "Boil, Mix", CookingTimeMinutes = 20, DietaryTags = "vegetarian" },
                new Recipe { Title = "Salad", Ingredients = "Lettuce, Tomato", Steps = "Chop, Mix", CookingTimeMinutes = 10, DietaryTags = "vegan, gluten-free" }
            );
            context.SaveChanges();
            return context;
        }

        [Fact]
        public async Task GetAll_ReturnsAllRecipes()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var result = await controller.GetAll(null);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var recipes = Assert.IsAssignableFrom<System.Collections.Generic.IEnumerable<RecipeDto>>(okResult.Value);

            Assert.Equal(2, recipes.Count());
        }

        [Fact]
        public async Task GetAll_WithTagFilter_ReturnsMatchingRecipes()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var result = await controller.GetAll("vegan");
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var recipes = Assert.IsAssignableFrom<System.Collections.Generic.IEnumerable<RecipeDto>>(okResult.Value);

            Assert.Single(recipes);
            Assert.Contains("Salad", recipes.First().Title);
        }

        [Fact]
        public async Task Get_ReturnsRecipe_WhenExists()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);
            var existingId = db.Recipes.First().Id;

            var result = await controller.Get(existingId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var recipe = Assert.IsType<RecipeDto>(okResult.Value);

            Assert.Equal("Pasta", recipe.Title);
        }

        [Fact]
        public async Task Get_ReturnsNotFound_WhenMissing()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var result = await controller.Get(999);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Create_AddsRecipeSuccessfully()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var dto = new RecipeDto
            {
                Title = "Soup",
                Ingredients = "Water, Veggies",
                Steps = "Boil",
                CookingTimeMinutes = 15,
                DietaryTags = "vegan"
            };

            var result = await controller.Create(dto);
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdRecipe = Assert.IsType<RecipeDto>(createdResult.Value);

            Assert.Equal("Soup", createdRecipe.Title);
            Assert.Equal(3, db.Recipes.Count());
        }

        [Fact]
        public async Task Update_ChangesRecipe_WhenValid()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);
            var recipe = db.Recipes.First();

            var dto = new RecipeDto
            {
                Id = recipe.Id,
                Title = "Updated Pasta",
                Ingredients = recipe.Ingredients,
                Steps = recipe.Steps,
                CookingTimeMinutes = recipe.CookingTimeMinutes,
                DietaryTags = recipe.DietaryTags
            };

            var result = await controller.Update(recipe.Id, dto);
            Assert.IsType<NoContentResult>(result);

            var updated = await db.Recipes.FindAsync(recipe.Id);
            Assert.Equal("Updated Pasta", updated.Title);
        }

        [Fact]
        public async Task Update_ReturnsBadRequest_WhenIdMismatch()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var dto = new RecipeDto { Id = 999, Title = "Test" };
            var result = await controller.Update(1, dto);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Id mismatch", badRequest.Value);
        }

        [Fact]
        public async Task Delete_RemovesRecipe_WhenExists()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);
            var id = db.Recipes.First().Id;

            var result = await controller.Delete(id);
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(1, db.Recipes.Count());
        }

        [Fact]
        public async Task Delete_ReturnsNotFound_WhenMissing()
        {
            var db = GetDbContext();
            var controller = new RecipesController(db);

            var result = await controller.Delete(999);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
