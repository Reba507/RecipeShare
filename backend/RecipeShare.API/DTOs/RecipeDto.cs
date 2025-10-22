using System.ComponentModel.DataAnnotations;

namespace RecipeShare.API.DTOs
{
	public class RecipeDto
	{
		public int Id { get; set; }

		[Required]
		public string Title { get; set; } = string.Empty;

		public string Ingredients { get; set; } = string.Empty;
		public string Steps { get; set; } = string.Empty;

		[Range(1, int.MaxValue, ErrorMessage = "Cooking time must be > 0 sec/min")]
		public int CookingTimeMinutes { get; set; }

		public string DietaryTags { get; set; } = string.Empty;
	}
}
