# Google IDX development environment for React Native
{ pkgs, ... }: {
  # Core packages for React Native development
  packages = [
    pkgs.nodejs_18
    pkgs.yarn
    pkgs.git
    pkgs.curl
    pkgs.unzip
    pkgs.openjdk11
    pkgs.gradle
    pkgs.android-studio
  ];

  # IDX workspace configuration
  idx = {
    extensions = [
      "ms-vscode.vscode-typescript-next"
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
    ];

    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        # Start Metro bundler
        metro = "npm start";
      };
    };

    # Preview configuration for web version
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "web"];
          manager = "web";
        };
      };
    };
  };
}