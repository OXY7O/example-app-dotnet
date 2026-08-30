using System.Globalization;
using Microsoft.AspNetCore.Mvc;
namespace Example.Api.Controllers;

[ApiController]
[Route("api/examples")]
public sealed class ExamplesController : ControllerBase
{
    [HttpGet("{identifier}")]
    public ActionResult<ExampleResponse> Get(string identifier)
    {
        if (!int.TryParse(identifier, NumberStyles.None, CultureInfo.InvariantCulture, out var id) || id <= 0)
            return BadRequest(new ApiError("invalid-identifier"));
        if (id == 404) return NotFound(new ApiError("resource-not-found"));
        return Ok(new ExampleResponse(id, $"example-{id}"));
    }
}
public sealed record ExampleResponse(int Id, string Name);
public sealed record ApiError(string Code);
