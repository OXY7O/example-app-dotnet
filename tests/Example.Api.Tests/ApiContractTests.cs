using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Example.Api.Tests;

public sealed class ApiContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client;

    public ApiContractTests(WebApplicationFactory<Program> factory)
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthIsDeterministicJson()
    {
        using var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal("{\"status\":\"healthy\"}", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task NumericIdentifierReturnsTheExpectedResource()
    {
        using var response = await client.GetAsync("/api/examples/42");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("{\"id\":42,\"name\":\"example-42\"}", await response.Content.ReadAsStringAsync());
    }

    [Theory]
    [InlineData("abc")]
    [InlineData("0")]
    [InlineData("-1")]
    public async Task InvalidIdentifierReturnsBadRequest(string identifier)
    {
        using var response = await client.GetAsync($"/api/examples/{identifier}");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetailsContract>();
        Assert.Equal("invalid-identifier", problem?.Code);
    }

    [Fact]
    public async Task MissingResourceReturnsNotFound()
    {
        using var response = await client.GetAsync("/api/examples/404");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetailsContract>();
        Assert.Equal("resource-not-found", problem?.Code);
    }

    [Fact]
    public async Task UnsupportedMethodIsRejected()
    {
        using var response = await client.PostAsync("/api/examples/42", null);
        Assert.Equal(HttpStatusCode.MethodNotAllowed, response.StatusCode);
    }

    private sealed record ProblemDetailsContract(string Code);
}
