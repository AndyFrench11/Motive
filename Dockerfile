FROM microsoft/dotnet:2.2-sdk AS build-env
WORKDIR /backend-api/backend-api

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /backend-api/backend-api
COPY --from=build-env /out .
ENTRYPOINT ["dotnet", "backend-api.dll"]