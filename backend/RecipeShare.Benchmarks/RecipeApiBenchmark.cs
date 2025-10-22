using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using System.Net.Http;
using System.Threading.Tasks;

namespace RecipeShare.Benchmarks
{
    [MemoryDiagnoser] 
    [SimpleJob(BenchmarkDotNet.Engines.RunStrategy.Throughput)]
    public class RecipeApiBenchmark
    {
        private readonly HttpClient _client = new HttpClient();
        private const string Url = "http://localhost:5252/api/recipes";

        [Params(500)] 
        public int Iterations;

        [Benchmark]
        public async Task SequentialGetRecipes()
        {
            for (int i = 0; i < Iterations; i++)
            {
                var res = await _client.GetAsync(Url);
                res.EnsureSuccessStatusCode();
            }
        }
    }

    class Program
    {
        static void Main()
        {
            BenchmarkRunner.Run<RecipeApiBenchmark>();
        }
    }
}
