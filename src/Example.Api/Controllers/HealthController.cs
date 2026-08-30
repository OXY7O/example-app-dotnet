using Microsoft.AspNetCore.Mvc;
namespace Example.Api.Controllers;

[ApiController]
[Route("health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult<HealthResponse> Get() => Ok(new HealthResponse("healthy"));
}
public sealed record HealthResponse(string Status);
