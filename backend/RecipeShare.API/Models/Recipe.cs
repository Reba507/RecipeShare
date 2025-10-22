using System.ComponentModel.DataAnnotations;

namespace RecipeShare.API.Models
{
	public class Recipe
	{
		public int Id { get; set; }

		[Required]
		public string Title { get; set; } = string.Empty;

		//  store ingredients and steps as single strings 
		public string Ingredients { get; set; } = string.Empty;
		public string Steps { get; set; } = string.Empty;

		[Range(1, int.MaxValue, ErrorMessage = "Cooking time must be > 0")]
		public int CookingTimeMinutes { get; set; }

		//dietery tags
		public string DietaryTags { get; set; } = string.Empty;
	}
}
