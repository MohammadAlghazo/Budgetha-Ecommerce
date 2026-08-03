# Use the official .NET 8 SDK as a build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the solution file and project files first (for caching restore)
COPY *.sln .
COPY src/Budgetha.API/*.csproj ./src/Budgetha.API/
COPY src/Budgetha.Application/*.csproj ./src/Budgetha.Application/
COPY src/Budgetha.Domain/*.csproj ./src/Budgetha.Domain/
COPY src/Budgetha.Infrastructure/*.csproj ./src/Budgetha.Infrastructure/

# Restore dependencies
RUN dotnet restore src/Budgetha.API/Budgetha.API.csproj

# Copy the rest of the source code
COPY src/ ./src/

# Build and publish the application
WORKDIR /app/src/Budgetha.API
RUN dotnet publish -c Release -o /out

# Use the official .NET 8 ASP.NET Core runtime as the final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Render exposes the port in the PORT environment variable
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Budgetha.API.dll"]
