# Known Issues

This document catalogs known limitations and issues in the wrldflix application that require attention but are not addressed in the current security-focused maintenance cycle.

## 1. TV Playback Hardcoded to Season 1, Episode 1

**File**: `src/pages/Home/TV/TvDetails.jsx` (line 97)  
**Issue**: TV details page passes only `tvId` to the `VideoPlayer` component, which defaults to `season=1` and `episode=1`.

**Code**:
```jsx
// TvDetails.jsx line 97
<MemoizedVideoPlayer tvId={tvId} />

// VideoPlayer.jsx line 4
const VideoPlayer = ({ tvId, season = 1, episode = 1 }) => {
  // Line 53: Always uses season 1, episode 1
  const iframeSrc = `https://vidsrc.dev/embed/tv/${tvId}/${season}/${episode}`;
```

**Impact**: Users cannot browse different seasons or episodes of TV shows. All TV content plays S1E1 regardless of selection.

**Resolution**: Would require:
- Season/episode selector UI in TvDetails.jsx
- State management for selected season/episode
- Pass selected values to VideoPlayer component
- Update UI to reflect current viewing selection

---

## 2. Routing Structure is Vestigial (No Multi-Page Routing)

**File**: `src/App.jsx`  
**Issue**: React Router is configured with only a single route (/) that loads the Home component. The catch-all route catches 404s but there are no additional pages.

**Code**:
```jsx
// App.jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
```

**Impact**: 
- The `<Outlet />` pattern isn't used in Home component
- All routing logic is contained within the Home page components
- React Router adds complexity without providing routing benefits

**Resolution**: Consider removing React Router if single-page navigation is the intended architecture, or implement proper multi-page structure with dedicated route pages.

---

## 3. Unlicensed Video Source (vidsrc.dev)

**File**: `src/pages/Home/TV/VideoPlayer.jsx` (line 53)  
**Issue**: Video playback uses vidsrc.dev, an unlicensed/third-party video streaming source.

**Code**:
```jsx
const iframeSrc = `https://vidsrc.dev/embed/tv/${tvId}/${season}/${episode}`;
```

**Additional Context**:
- Anti-popup machinery present (lines 8-48) suggests awareness of ad/malware issues
- Source has no licensing agreement with content providers
- May violate terms of service for deployed applications

**Impact**: 
- Legal/copyright risk depending on deployment context
- No guarantee of content availability or stability
- Potential security/malware exposure from third-party iframes

**Resolution**: 
- Implement proper licensed video playback (e.g., integrate TMDB's official video API or licensed streaming partners)
- Consider noting in documentation that this is for educational/demo purposes only

---

## 4. README Outdated (Port and Start Command)

**File**: `README.md` (lines 60, 63)  
**Issue**: Documentation references incorrect development server port and start command.

**Current Errors**:
- **Line 60**: `npm start` — should be `npm run dev` (Vite-specific)
- **Line 63**: `http://localhost:3000` — should be `http://localhost:5173` (Vite default port)

**Actual Configuration**:
- Package.json defines dev script: `"dev": "vite"`
- Vite default development server: `http://localhost:5173`

**Impact**: New developers following README will not be able to start the development server.

**Resolution**: Update README with correct commands:
```bash
# Line 58-63 should be:
5. Start the development server:
   npm run dev

6. Open your browser and navigate to http://localhost:5173
```

---

## Summary

| Issue | Severity | Component | Fix Complexity |
|-------|----------|-----------|-----------------|
| TV Playback S1E1 Only | Medium | TvDetails.jsx | Medium (UI + state mgmt) |
| Vestigial Routing | Low | App.jsx | Low (refactor or remove) |
| Unlicensed Video Source | High | VideoPlayer.jsx | High (requires integration) |
| README Port/Command | Low | README.md | Low (documentation) |

---

**Last Updated**: 2026-09-12  
**Scope**: Do not fix in this maintenance cycle. Document for future development planning.
