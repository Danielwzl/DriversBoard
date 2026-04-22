# Engineer Take-Home Assignment

## The Scenario

You're joining a logistics startup that is scaling driver onboarding across multiple markets. We run acquisition campaigns (Facebook ads, Google, referral programs) and need to track which channels convert best. Your job is to build the core onboarding and analytics tooling.

Budget **4-8 hours total**. A working MVP with clear trade-off documentation beats over-engineered polish every time.

## AI Policy

We encourage you to use AI tools -- Cursor, Copilot, ChatGPT, Claude, whatever you prefer. We will ask about your AI workflow in the follow-up interview. What we evaluate is not whether you used AI, but whether you can **ship working software quickly** and **catch when AI leads you astray**.

---

## The Build

Build a **driver sign-up flow** and a **campaign dashboard**.
The driver sign up flow will be mostly used on phones.

### Driver Sign-Up Form

A web form that collects the driver's personal information:

- Full name
- Email
- Phone number
- Driver's license number
- Driver's license state/province

Requirements:
- Each sign-up URL includes a `?ref=<campaign_id>` query parameter. Store this campaign reference with the driver record

### Vehicle Registration

After signing up, a driver registers their vehicle(s) in a separate step:

- Vehicle make
- Vehicle model
- Vehicle year
- Insurance policy number
- Insurance expiry date

### Campaign Dashboard

A dashboard view that displays:

- List of campaigns, each showing:
  - Campaign name
  - Referral source (e.g., "facebook", "google", "referral")
  - Total sign-ups (drivers who submitted the sign-up form)
  - Completed sign-ups (drivers who also registered at least one vehicle with valid insurance)
  - Conversion rate (completed / total)
  - Sign-ups over time
- Date range filter

### Technical Requirements

- **Stack**: Your choice. Pick whatever you ship fastest with. The choice itself is part of the evaluation.
- **Storage**: SQLite or file-based. No external database required.
- **The app must run with a single command** documented in a `SETUP.md` file you create.

### Deliverables

Create these files alongside your code:

- `SETUP.md` -- How to run your app (must work with a single command)
- `DECISIONS.md` -- Document the decisions you made and why
- `PROMPTS.md` -- The prompts you used with AI tools and the responses you got

---

## Submission

When you're done:

```bash
git bundle create <your-name>.bundle --all
```

Email the `.bundle` file with the subject line: `Wrapped Engineer Take-Home -- <Your Name>`.

We review the full git history, so commit early and often. Your commit history tells us how you work.

---

## FAQ

**Q: Can I use third-party libraries/frameworks?**
A: Yes. Use whatever you'd use in a real project.

**Q: Do I need to deploy this?**
A: No. It just needs to run locally via the instructions in your `SETUP.md`.

**Q: What if I need more than 4-8 hours?**
A: That's fine. Take the time you need to do it well.

**Q: Do I need to write tests?**
A: Yes. We will read them.
