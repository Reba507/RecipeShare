using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.API.Data;
using RecipeShare.API.DTOs;
using RecipeShare.API.Models;

namespace RecipeShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeDbContext _db;

        public RecipesController(RecipeDbContext db)
        {
            _db = db;
        }

        // GET api/recipes?tag=vegetarian
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> GetAll([FromQuery] string? tag)
        {
            IQueryable<Recipe> q = _db.Recipes.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(tag))
            {
                var t = tag.Trim().ToLower();
                q = q.Where(r => r.DietaryTags.ToLower().Split(',', StringSplitOptions.RemoveEmptyEntries).Any(x => x.Trim() == t));
            }

            var list = await q.Select(r => ToDto(r)).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RecipeDto>> Get(int id)
        {
            var r = await _db.Recipes.FindAsync(id);
            if (r == null) return NotFound();
            return Ok(ToDto(r));
        }

        [HttpPost]
        public async Task<ActionResult<RecipeDto>> Create(RecipeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var r = FromDto(dto);
            _db.Recipes.Add(r);
            await _db.SaveChangesAsync();
            dto.Id = r.Id;
            return CreatedAtAction(nameof(Get), new { id = r.Id }, dto);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, RecipeDto dto)
        {
            if (id != dto.Id) return BadRequest("Id mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = await _db.Recipes.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = dto.Title;
            existing.Ingredients = dto.Ingredients;
            existing.Steps = dto.Steps;
            existing.CookingTimeMinutes = dto.CookingTimeMinutes;
            existing.DietaryTags = dto.DietaryTags;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Recipes.FindAsync(id);
            if (existing == null) return NotFound();

            _db.Recipes.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        //benchmark : sequential GET requests against Entity Framework and return timing
        [HttpGet("benchmark")]
        public ActionResult<object> Benchmark([FromQuery] int iterations = 500)
        {
            var sw = System.Diagnostics.Stopwatch.StartNew();
            for (int i = 0; i < iterations; i++)
            {
        //synchronous read via LINQ to simulate typical GET workload
                var all = _db.Recipes.AsNoTracking().ToList();
            }
            sw.Stop();
            var avgMs = sw.Elapsed.TotalMilliseconds / iterations;
            return Ok(new { iterations, totalMs = sw.Elapsed.TotalMilliseconds, averageMs = avgMs });
        }

        private static RecipeDto ToDto(Recipe r) => new RecipeDto
        {
            Id = r.Id,
            Title = r.Title,
            Ingredients = r.Ingredients,
            Steps = r.Steps,
            CookingTimeMinutes = r.CookingTimeMinutes,
            DietaryTags = r.DietaryTags
        };

        private static Recipe FromDto(RecipeDto d) => new Recipe
        {
            Title = d.Title,
            Ingredients = d.Ingredients,
            Steps = d.Steps,
            CookingTimeMinutes = d.CookingTimeMinutes,
            DietaryTags = d.DietaryTags
        };
    }
}
