```
████████▄     ▄████████       ▄█    █▄   ▄█  ███▄▄▄▄    ▄████████  ▄█  
███   ▀███   ███    ███      ███    ███ ███  ███▀▀▀██▄ ███    ███ ███  
███    ███   ███    ███      ███    ███ ███▌ ███   ███ ███    █▀  ███▌ 
███    ███   ███    ███      ███    ███ ███▌ ███   ███ ███        ███▌ 
███    ███ ▀███████████      ███    ███ ███▌ ███   ███ ███        ███▌ 
███    ███   ███    ███      ███    ███ ███  ███   ███ ███    █▄  ███  
███   ▄███   ███    ███      ███    ███ ███  ███   ███ ███    ███ ███  
████████▀    ███    █▀        ▀██████▀  █▀    ▀█   █▀  ████████▀  █▀   
                                                                       
```

Source for ASCII-fonts: https://www.coolgenerator.com/ascii-text-generator
(Font: Delta Corps Priest 1


# What is this?
A simple API to bridge the communication to open AI services to be used as a 
Siri shortcut (as an example).

It will make the test api available via http://localhost:8090/api/davinci.
Provide a POST in the following form:
```
{
    "question": "Tell a story about a green elephant in four sentences."
}
```
The answer will be JSON in a property "answer".

# What's the motivation?
The bridge approach provides more control than contacting the open ai services directly. 
Further, the interface can be stripped down to make it easier for the shortcut which 
could also primarily use a device in the local network first.

# Installation
Provide a .env file in the root directory and provide an Open AI API key for "openai.apiKey".

Make sure pnpm is installed (`npm install -g pnpm`).
```
pnpm i
```
To create a docker image use `pnpm build-image`.


# How to use
To run the API server locally (without docker compose) use the VS Code launch config.
With docker (compose), run `pnpm up-container` and `pnpm down-container` correspondingly.

The API port is configurable via an environment variable "API_PORT".
The VS Code launch config (.vscode/launch.json) and the provided docker compose file (config/local-api/docker-compose.yaml) set the API_PORT to 8081.

# Update all packages to the latest version
`pnpm up --latest` to update all packages to the latest version.

# Add a package to the project
`pnpm add -Dw <package>` to add a package to the project. The `-D` flag is for development dependencies and the `-w` flag is for workspace.


# Release History

## v0.1.0 (Untagged)
- Your text here.

