# Capacitor — Android & iOS setup

This project is wired for Capacitor so you can wrap **My Driving Diary** as a
native Android (and iOS) app and open it in Android Studio / Xcode.

> The Lovable sandbox cannot run Android Studio or Xcode. You must export
> this project to your own machine (GitHub → clone) and run the steps below
> locally.

---

## 1. Prerequisites (on your machine)

- Node 20+ and `npm` / `bun`
- **Android**: Android Studio (latest), Android SDK + an emulator or device
- **iOS** (macOS only): Xcode 15+, CocoaPods (`sudo gem install cocoapods`)
- Java 17 (bundled with Android Studio)

## 2. Install dependencies

```bash
bun install        # or: npm install
```

Capacitor is already in `package.json`:

- `@capacitor/core`, `@capacitor/cli`
- `@capacitor/android`, `@capacitor/ios`
- `@capacitor/app`, `@capacitor/status-bar`, `@capacitor/haptics`
- `@capacitor/preferences` for native offline storage

## 3. Build the web assets

This is a regular Vite + React Capacitor app. The build creates a static
`www/` folder with `www/index.html`, which Android Studio can bundle normally:

```bash
bun run build
```

`capacitor.config.ts` is already set to `webDir: "www"`.

## 4. Add the native platforms

```bash
npx cap add android
npx cap add ios       # macOS only
```

This creates `android/` and `ios/` folders containing the native projects.
Commit them — they belong in source control.

## 5. Sync web → native and open the IDE

After every web build, push the latest assets into the native projects:

```bash
npx cap sync
```

Then open the platform you want:

```bash
npx cap open android   # opens Android Studio
npx cap open ios       # opens Xcode
```

From there, press **Run** to launch on an emulator / simulator / device.

## 6. Production / offline build

No remote `server.url` is configured. The native app loads only the bundled
files from `www/`, so it works offline after installation. After every change:

```bash
bun run build
npx cap sync
```

## 7. App identity

- **App ID**: `app.lovable.mydrivingdiary`
- **App Name**: `My Driving Diary`

Change these in `capacitor.config.ts` *before* running `cap add`. After the
native folders exist, also update them in `android/app/build.gradle`
(`applicationId`) and Xcode (Bundle Identifier).

## 8. Common issues

- **White screen in app**: run `bun run build` and confirm `www/index.html`
  exists, then run `npx cap sync android` again.
- **`cap` not found**: run via `npx cap ...` or add `./node_modules/.bin` to
  your PATH.
- **Gradle / Android SDK errors**: open `android/` in Android Studio once and
  let it install missing SDK components.

---

For deeper reading: <https://capacitorjs.com/docs>
