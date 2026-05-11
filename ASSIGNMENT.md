# Assignment 2 — Advanced Website based on Modern Front-end Libraries

**Due:** 24 May 2026 at 23:59
**Total marks:** 40 (Group: 15% of subject total, Individual: 25% of subject total)
**Group size:** 1 (individual — group component treated as individual component)

## Project Topic: Expense Tracker

Three entities for CRUD operations:
- `user` — registration/login with JWT + password hashing
- `expense_item` — live search filtering in real-time as user types
- `user_activity` — admin manages all accounts and views login/logout/CRUD activities

## Key Requirements

- SPA — single `.html`, dynamically rewrite page (no full reloads)
- All CRUD operations on a database
- Seamless, streamlined UI (no interrupted interactions)
- Comparable complexity to the three sample topics

## Submission Checklist

- [ ] Public GitHub repo link
- [ ] Video demo ≤3 minutes (browser only — no source code, DB, or running env shown)
- [ ] Source code in repo
- [ ] Database export (`.sql` / `.csv` / `.json`)
- [ ] README (see below)
- [ ] Workload allocation statement

## README Must Include

1. Project title + description (what problem does it solve?)
2. Tech stack, how to run, dependencies
3. Folder structure explanation

## Rubric

### GROUP - Suitability and Comprehensiveness `2 pts`
Is the app appropriate for this assignment (not over-simplistic or unrealistic)?  
Does the app's business logic involve CRUD operations on at least three conceptual entities?  
_Deduct 1 mark for each missing aspect._

### GROUP - Overall Business, Design, and Performance `6 pts`
1. Does the business logic fit intuition or industry practices?
2. Soundness of website structure, consistent layout/style, and intuitive navigation.
3. Functional completeness and website responsiveness/speed.

_Deduct 1–2 marks on each aspect depending on severity and scale of the issue._

### GROUP - The Readme File `3 pts`
1. A clear project title and description — what problem does this website solve?
2. An illustration of the technical stack, how to run the app, and any dependencies.
3. A clear illustration of the folder structure — what is in each folder?

_Give 1 or 0 mark on each aspect depending on whether meaningful information is provided. A decimal mark like 0.5 is okay._

### GROUP - Allocation of Workload `4 pts`
1. A clear statement of workload allocation among group members, detailing a list of files written by each member. May use a shared GitHub repository or add a file-level header comment in each file to explicitly declare the author. _(2 marks)_
2. Does the workload allocation make sense in terms of avoiding relying on a single member? _(2 marks)_

_This information can be put in the README or a separate file._

### INDIVIDUAL - Workload and App Features `6 pts`
1. Is the work sufficient and meeting the stated requirements? _(2 marks)_
2. Rationale of technical/interface design (e.g., `useState` vs `useReducer` vs `useRef`). _(2 marks)_
3. Is appropriate security incorporated, such as JWT and role-based access control, if relevant? _(2 marks)_

### INDIVIDUAL - Code Quality and Structure `10 pts`
1. Code cleanliness and conciseness, including compliance with naming conventions and consistency. _(2 marks)_
2. Readability: meaningful names for variables/functions and comments/documentation for non-obvious logic. _(2 marks)_
3. Is there redundant logic, dead code, or interface duplication — including reusable functions/classes instead of copy-paste? _(2 marks)_
4. Are there any critical issues impacting user experience or performance? _(2 marks)_
5. Is there appropriate error handling — e.g., input validation, avoiding showing a blank page on API failure? _(2 marks)_

### INDIVIDUAL - Professional Practices `6 pts`
1. Git repository initialized and used throughout (not one giant initial commit). _(2 marks)_
2. Commit messages are meaningful (not "stuff", "fix", "asdfgh"). _(2 marks)_
3. No hardcoded credentials or sensitive data. _(2 marks)_

_Deduct 1–2 marks on each aspect depending on severity and scale of the issue._

### INDIVIDUAL - Progress Demo and Q&A `3 pts`
Tutors will check progress in the last tutorial class (in-person/online) and ask relevant questions.  
0–3 marks for students who:
1. Have completed at least 50% of this assignment work, AND
2. Can answer the tutor's questions well or demonstrate advanced skills.

---

| Criterion | Pts |
|-----------|-----|
| GROUP - Suitability & Comprehensiveness | 2 |
| GROUP - Business, Design & Performance | 6 |
| GROUP - README | 3 |
| GROUP - Workload Allocation | 4 |
| INDIVIDUAL - Workload & App Features | 6 |
| INDIVIDUAL - Code Quality & Structure | 10 |
| INDIVIDUAL - Professional Practices | 6 |
| INDIVIDUAL - Progress Demo & Q&A | 3 |
| **Total** | **40** |

## Extensions & Late Penalty

- ≤72 hrs: "Assignment Extension" tab in Canvas (available 2 weeks before due)
- ≤7 days: email subject coordinator
- >7 days: eRequest (Accessibility / Special Consideration)
- Late penalty: 5% per calendar day, max 35%; after 7 days → 0 marks
