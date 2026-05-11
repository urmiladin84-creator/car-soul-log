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

## 3. Build the web assets

Capacitor copies a static `dist/` folder into the native app. Build the web
app first:

```bash
bun run build
```

If your build outputs to a different folder (TanStack Start may emit to
`.output/public`), update `webDir` in `capacitor.config.ts` to match, then
re-run the command.

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

## 6. Hot reload during development (optional)

`capacitor.config.ts` includes a `server.url` pointing at the Lovable preview.
While that line is present, the installed app loads the live preview — you
can edit in Lovable and see changes on the device instantly.

For a **production / offline** build, comment out the `server.url` line so
the app loads its bundled assets:

```ts
server: {
  // url: "https://...lovableproject.com?forceHideBadge=true",
  cleartext: true,
  androidScheme: "https",
},
```

Then rebuild and re-sync:

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

- **White screen in app**: `webDir` doesn't match your build output. Check
  the folder produced by `bun run build` and update `capacitor.config.ts`.
- **`cap` not found**: run via `npx cap ...` or add `./node_modules/.bin` to
  your PATH.
- **Gradle / Android SDK errors**: open `android/` in Android Studio once and
  let it install missing SDK components.

---

For deeper reading: <https://capacitorjs.com/docs>
