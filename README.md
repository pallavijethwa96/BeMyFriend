# BeMyFriend — Frontend integration kit

Connects the React app/website to the backend API. Two files:

- **`api.js`** — a typed-ish fetch client with token storage and automatic refresh-and-retry on 401.
- **`useAuth.jsx`** — a React context/provider + `useAuth()` hook for sign-in state.

> These are for the **real app build** (Vite/Next/React Native), not the in-chat prototype artifact. The prototype keeps everything in memory; this kit is how you swap that for the live backend.

## Setup
1. Copy `api.js` and `useAuth.jsx` into your app's source.
2. Set the API base URL via `API_BASE_URL` (e.g. in `.env`): `API_BASE_URL=https://api.bemyfriend.app`. Defaults to `http://localhost:4000`.
3. Wrap your root:
```jsx
import { AuthProvider } from "./useAuth";

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

## Wiring the prototype's screens to the API

The current `Havenn.jsx` / `HavennWeb.jsx` use local React state. Replace those in-memory handlers with API calls:

| Prototype action | Replace with |
|---|---|
| Account setup → "Send code" | `const { challengeId, devCode } = await startLogin(email, phone)` |
| Enter OTP → verify | `const { isNewUser } = await verifyLogin(challengeId, code)` |
| Onboarding "done" | `await api.saveOnboarding({ displayName, country, ageRange, sex, anonDefault, languages, goals })` |
| Consent checkbox | `await api.acceptConsent([{ doc:"terms" }, { doc:"privacy" }, { doc:"guidelines" }])` |
| Home groups list | `const { groups } = await api.getGroups()` |
| Open a group | `const { posts } = await api.getFeed(slug)` |
| Compose post | `await api.createPost(slug, body, isAnonymous)` |
| Open thread | `const { post, replies } = await api.getPost(id)` |
| Reply | `await api.reply(postId, body, isAnonymous)` |
| "Sending support" | `await api.support(id)` / `await api.unsupport(id)` |
| Aria chat | `const { reply } = await api.ariaSend(text)` (history is server-side) |
| Need-support screen | `const { national, global } = await api.crisisResources(country)` |
| Report / Block (to add) | `await api.report("post", id, reason)` / `await api.block(userId)` |

## Example: sign-in screen
```jsx
import { useState } from "react";
import { useAuth } from "./useAuth";

function SignIn({ onSignedIn }) {
  const { startLogin, verifyLogin } = useAuth();
  const [step, setStep] = useState("details");
  const [challengeId, setChallengeId] = useState(null);
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [code, setCode] = useState("");

  async function send() {
    const { challengeId } = await startLogin(email, phone);
    setChallengeId(challengeId);
    setStep("verify");
  }
  async function verify() {
    const { isNewUser } = await verifyLogin(challengeId, code);
    onSignedIn(isNewUser); // route to onboarding or home
  }
  // ...render details/verify steps...
}
```

## Notes
- **Storage:** `api.js` uses `localStorage` for web. For React Native, swap the `storage` functions for `AsyncStorage` (or `expo-secure-store` for the refresh token).
- **localStorage doesn't work inside the chat artifact** — that's expected; this runs in your real build.
- The client refreshes the access token automatically; if the refresh token is invalid it clears tokens and the provider drops to `signed_out`.
