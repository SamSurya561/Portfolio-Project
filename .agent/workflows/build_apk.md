---
description: How to build an Android APK for the Admin App
---

# Build Android APK (Expo EAS)

This workflow explains how to build a standalone APK for your Android device using Expo Application Services (EAS).

## Prerequisites
1.  **Expo Account**: You need an account at [expo.dev](https://expo.dev).
2.  **EAS CLI**: Installed via `npm install -g eas-cli` (or use `npx eas-cli`).

## Steps

1.  **Login to Expo**
    ```bash
    npx eas-cli login
    ```

2.  **Configure Project**
    Run this once to generate `eas.json`:
    ```bash
    npx eas-cli build:configure
    ```
    *   Select `Android`.

3.  **Edit `eas.json`**
    Modify `eas.json` to add a `preview` profile for APK generation (instead of AAB for Play Store):
    ```json
    {
      "build": {
        "preview": {
          "android": {
            "buildType": "apk"
          }
        },
        "production": {}
      }
    }
    ```

4.  **Run the Build**
    ```bash
    npx eas-cli build -p android --profile preview
    ```

5.  **Download**
    *   Wait for the build to finish in the terminal or Expo dashboard.
    *   Download the `.apk` file and install it on your device.
