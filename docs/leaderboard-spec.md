# Feature Spec: Leaderboard

**Status:** Draft v1
**Author:** (Hermes draft for GabePerrott / AFW team)
**Date:** 2026-09-16

## 1. Summary

A public `/leaderboard` page showing the fastest game completions across all
registered players, ranked by solve duration (time between starting the word
and submitting the winning guess). Each row shows the player, the word they
solved, their time, and when they did it.

Because the app currently only records a game when the player **wins**
(`App.tsx → handleWin → submitGame`), the leaderboard is implicitly a
**fastest-wins board**. Give-ups remain unrecorded (intentional per current
gameplay design).

## 2. User stories

- As a logged-in player, I can see my name next to my solve time so I can
  brag.
- As any visitor (logged in or not), I can view the leaderboard to see who
  is fastest.
- As a logged-in player, I can see my own rank highlighted, even if I am
  outside the top N.

## 3. Definitions

- **Duration**: `time_end − time_start` for a game row, in whole seconds.
  Rows with a missing `time_start` or `time_end` are excluded.
- **Rank**: position in the ordering, 1 = fastest. Ties are broken by
  earlier `time_end` (first to achieve the time wins the tie). No rank
  sharing.
- **Player display name**: `users.name`. Note: users created today get
  their raw `auth0|...` id as `name` (see `wordRoutes.ts:91`) — see Open
  Questions Q3.

## 4. API

### `GET /api/v1/leaderboard?limit=10`

Public (no auth required to read). Returns the top `limit` fastest games.

**Query params**

| Param   | Type   | Default | Max | Notes                          |
|---------|--------|---------|-----|--------------------------------|
| `limit` | number | 10      | 100 | Invalid values fall back to 10 |

**Response `200`**

```json
{
  "entries": [
    {
      "rank": 1,
      "userId": 4,
      "playerName": "Gabe",
      "word": "skibbidi",
      "durationSeconds": 42,
      "completedAt": "2026-09-15T08:12:31.000Z"
    }
  ],
  "totalPlayers": 7
}
```

**Notes**

- `word` is safe to expose here: the game is finished, so revealing it
  leaks nothing in-progress.
- One row per game, not per player — the same player may appear multiple
  times (fastest wins board, not "best per player"). See Open Questions
  Q2.
- Errors: `500 { message: "Something went wrong" }` on DB failure,
  matching the existing route convention.

### Optional: `GET /api/v1/leaderboard/me`

Requires `checkJwt`. Returns the caller's best entry and rank, or
`{ "rank": null }` if they have no recorded games:

```json
{ "rank": 23, "best": { "word": "rizz", "durationSeconds": 31, "completedAt": "..." } }
```

This lets the page show "You: rank 23" without fetching the whole board.

## 5. Server implementation

Following the existing pattern (DB module → route function → router →
mount in `server.ts`):

- **`server/db/leaderboard.ts`** (new)
  - `getLeaderboard(limit, db = connection)` — join `games` → `users`
    and `words`, filter out null timestamps, compute duration, order by
    duration ASC then `time_end` ASC, apply limit.
  - `getMyLeaderboardEntry(auth0Id, db = connection)` — same ordering,
    windowed to the user's best row plus its global rank.
  - Duration in SQL: SQLite supports
    `strftime('%s', time_end) - strftime('%s', time_start) AS duration_seconds`.
    Keep this in one query function so a future Postgres move only touches
    that file (`EXTRACT(EPOCH FROM ...)`).
  - `totalPlayers`: `COUNT(DISTINCT user_id)` from `games`.
- **`server/routes/leaderboardRoutes.ts`** (new) — thin handlers, same
  try/catch + status conventions as `wordRoutes.ts`. Validate `limit`
  (non-numeric or out of range → default/max, never into SQL).
- **`server/server.ts`** — `server.use('/api/v1/leaderboard', leaderboardRoutes)`.
  Mount **before** the production catch-all (it already is, by convention).

**Deliberately not reusing `getGamesByUserId`** — that is per-user and
returns raw rows; the leaderboard needs a join and aggregation.

## 6. Client implementation

- **`client/apis/leaderboard.ts`** (new) — `getLeaderboard(limit)`,
  `getMyRank(token)` via superagent, same `rootURL` pattern as
  `client/apis/games.ts`.
- **`client/hooks/useLeaderboard.ts`** (new) — TanStack Query wrapper,
  `queryKey: ['leaderboard', limit]`. Separate `useMyRank()` hook with
  `enabled: isAuthenticated` (mirrors `useGameStats`).
- **`client/components/LeaderboardPage.tsx`** (new) — route component:
  - Table: Rank | Player | Word | Time | Completed
  - Time formatted as `m:ss` (e.g. `1:23`); durations < 60s show `0:42`.
  - Rows for the current user highlighted (accent background).
  - "Your rank" strip at top when logged in (from `/me`), showing
    "You haven't won a game yet" when rank is null.
  - Loading / error / empty states matching existing style
    (`Loading...`, `Could not load leaderboard`, friendly empty message).
- **`client/routes.tsx`** — add `<Route path="leaderboard" element={<LeaderboardPage />} />`.
- **Entry points** — "Leaderboard" link next to "View Stats" in
  `Account.tsx` (visible to everyone, not just authenticated users), and
  a "Back to Game" link on the page like `StatsPage` has.

## 7. Edge cases

| Case | Behaviour |
|------|-----------|
| No games recorded at all | Empty-state message, HTTP 200 with `entries: []` |
| Game row with null `time_start`/`time_end` | Excluded from ranking |
| Tied durations | Earlier `time_end` ranks higher |
| Same player multiple times | Multiple rows allowed (see Q2) |
| Logged-out visitor | Board visible; no "your rank" strip |
| Logged-in with zero wins | "Your rank: —" / "win a game to appear" |
| Negative or zero duration (clock weirdness) | Excluded from ranking (guard `duration > 0`) |
| `limit` abuse (`?limit=999999`) | Clamped to 100 |

## 8. Trust model (known limitation, accepted for now)

`startTime` and `endTime` are sent by the client in `POST /words/games`.
A determined player can submit a 1-second game for a word they revealed.
This is acceptable for a bootcamp joke app, but the spec notes the
upgrade path: record `time_start` server-side when the word is fetched
(session or a `pending_games` table) and stamp `time_end` server-side on
submission, so durations are never client-controlled. **Do not build that
now** — just don't make the problem worse (e.g. don't add rewards).

## 9. Out of scope

- Loss/give-up leaderboards (gameplay decision: losses untracked).
- Per-word leaderboards (see Q1).
- Friend/social features, pagination beyond the top-100 clamp.
- Retroactive backfill of user display names.

## 10. Acceptance criteria

1. `GET /api/v1/leaderboard` returns entries ordered by duration ASC,
   ties broken by `time_end` ASC, with correct rank numbering starting
   at 1.
2. Server tests (supertest, mirroring `words.test.ts` style): ordering,
   limit clamping, exclusion of null-timestamp rows, empty-board case.
3. `/leaderboard` route renders the table; logged-in user's rows are
   highlighted; `/me` strip shows correct rank or the no-wins message.
4. `npx tsc --noEmit` and `npm run lint` pass with no new errors.
5. Board is viewable while logged out.

## 11. Open questions (team to decide)

- **Q1 — Global or per-word?** Current spec: one global board mixing all
  words. A 3-letter word is trivially faster than an 11-letter one, so the
  global board favours short words. Alternative: per-word tabs, or rank
  by duration normalised per word length. Simplest honest option: keep
  global but show the word (as specced) so nobody is misled.
- **Q2 — Best-per-player or every game?** Spec allows repeat players.
  If the board gets noisy, switch to each player's single best time.
- **Q3 — Display names.** Users currently have `auth0|...` as `name`.
  Should sign-up populate the real name from the Auth0 profile
  (`user.name` / `user.nickname`)? Affects how good the leaderboard
  looks more than anything else in this spec.
- **Q4 — Should the leaderboard be public or login-gated to view?**
  Spec assumes public read. Trivial to flip to `checkJwt` if the team
  prefers.
