FROM microsoft/dotnet:2.2-sdk AS build-env
WORKDIR /backend-api

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
ENV ASPNETCORE_URLS=http://+:8081
RUN dotnet publish -c Release -o out

# Build runtime image
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /backend-api
COPY --from=build-env /backend-api/out .
ENTRYPOINT ["dotnet", "backend-api.dll"]
