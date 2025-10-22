using Microsoft.EntityFrameworkCore;
using RecipeShare.API.Data;



var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// In-memory EF Core
builder.Services.AddDbContext<RecipeDbContext>(opt =>
{
    opt.UseInMemoryDatabase("RecipeShareDb");
});

// CORS for Vite frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite", p =>
    {
        p.WithOrigins("http://localhost:5173")
         .AllowAnyHeader()
         .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<RecipeDbContext>();
    db.SeedIfEmpty();
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowVite");
app.UseAuthorization();
app.MapControllers();



app.Run();

