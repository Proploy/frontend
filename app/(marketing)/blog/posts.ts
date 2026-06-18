/**
 * Blog content for the Proploy field guide.
 *
 * Single source of truth for both the blog index (`blog/page.tsx`) and the
 * individual post route (`blog/[slug]/page.tsx`). Posts are static fixtures —
 * no live fetch — so the marketing pages stay fast and prerenderable.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }

export interface Post {
  slug: string
  category: string
  title: string
  excerpt: string
  author: string
  role: string
  date: string
  readTime: string
  /** Featured posts get the large hero card treatment on the index. */
  featured?: boolean
  /** One-line standfirst shown under the title on the detail page. */
  standfirst: string
  body: Block[]
}

export const CATEGORIES = [
  'All posts',
  'Software selection',
  'Implementation playbooks',
  'Vendor evaluation',
  'Change management',
] as const

export const POSTS: Post[] = [
  {
    slug: 'first-30-days-erp-rollout',
    category: 'Implementation playbooks',
    title: 'The first 30 days of an ERP rollout decide the next 12 months',
    excerpt:
      'Most ERP programs fail in discovery, not deployment. Here is the kickoff sequence our vetted leads use to lock scope, map data ownership, and surface the integration landmines before a single record is migrated.',
    author: 'Priya Raman',
    role: 'NetSuite & ERP implementation lead',
    date: 'Jun 9, 2026',
    readTime: '11 min read',
    featured: true,
    standfirst:
      'Cutover gets the attention, but the program is usually won or lost in the four weeks before anyone touches a system. Here is the kickoff sequence that holds.',
    body: [
      {
        type: 'p',
        text: 'When an ERP program slips, the post-mortem almost always points at the same place: go-live. The data was dirty, an integration broke, finance could not close the month. But those are symptoms. The decisions that caused them were made — or quietly skipped — in the first thirty days, long before anyone migrated a record.',
      },
      {
        type: 'p',
        text: 'The teams that ship on time treat discovery as the highest-leverage phase of the entire program. They spend the opening month forcing clarity on scope, ownership, and risk while it is still cheap to change course. Below is the kickoff sequence we run with vetted leads on the network.',
      },
      { type: 'h2', text: 'Week 1 — Lock the scope before anyone falls in love with it' },
      {
        type: 'p',
        text: 'The fastest way to blow a budget is to let scope stay implicit. Get every in-scope process onto one page, in writing, and get the sponsor to sign it. Then write down what is explicitly out of scope — that list is more valuable than the in-scope one, because it is the thing people will quietly try to add back in month three.',
      },
      {
        type: 'ul',
        items: [
          'Name every business process the system will touch, and rate each as configure / customize / leave-alone.',
          'Write the out-of-scope list and have the sponsor acknowledge it in the same meeting.',
          'Tie each in-scope process to a named owner — not a department, a person.',
        ],
      },
      { type: 'h2', text: 'Week 2 — Map data ownership, not just data' },
      {
        type: 'p',
        text: 'Everyone plans the data migration. Almost no one plans data ownership. For every master record — customers, items, vendors, the chart of accounts — there must be one person accountable for its quality going in and its quality coming out. Without that, reconciliation becomes a committee, and committees do not reconcile.',
      },
      {
        type: 'quote',
        text: 'If you cannot name the person who owns the customer master, you do not have a migration plan. You have a hope.',
        cite: 'Priya Raman',
      },
      { type: 'h2', text: 'Week 3 — Surface the integration landmines early' },
      {
        type: 'p',
        text: 'Integrations are where timelines die, because they depend on systems and teams you do not control. Inventory every inbound and outbound connection in week three, while there is still time to renegotiate. For each one, confirm the contract, the data shape, the owner on the other side, and the failure behavior.',
      },
      {
        type: 'ol',
        items: [
          'List every integration and its direction of data flow.',
          'Confirm a real technical contact on the other side — not a vendor sales rep.',
          'Decide, in writing, what happens when each integration is down at cutover.',
        ],
      },
      { type: 'h2', text: 'Week 4 — Rehearse the decision-making, not just the system' },
      {
        type: 'p',
        text: 'The last week of discovery is for stress-testing how the program makes decisions. Run a tabletop exercise on a realistic mid-project conflict — a scope-change request that pushes the date. Watch who decides, how fast, and against what criteria. If that process is slow now, it will be catastrophic at cutover.',
      },
      {
        type: 'p',
        text: 'Do this well and the next eleven months get boring — which, in an ERP rollout, is exactly what you want. Boring means the surprises happened on paper in month one, not in production in month nine.',
      },
    ],
  },
  {
    slug: 'buy-build-or-configure',
    category: 'Software selection',
    title: 'Buy, build, or configure: a decision framework for mid-market teams',
    excerpt:
      'A three-question test that tells you when off-the-shelf wins, when configuration pays off, and when custom build is the only honest answer.',
    author: 'Marco Vidal',
    role: 'Solutions architect',
    date: 'Jun 4, 2026',
    readTime: '8 min read',
    standfirst:
      'Most "should we build it?" debates are really arguments about three questions nobody has separated. Separate them and the answer usually picks itself.',
    body: [
      {
        type: 'p',
        text: 'The build-versus-buy debate generates more heat than almost any other software decision, and most of that heat comes from people arguing about different things at once. Untangle it into three questions and the answer tends to fall out cleanly.',
      },
      { type: 'h2', text: 'Question 1 — Is this process a differentiator?' },
      {
        type: 'p',
        text: 'If a process is genuinely how you win — the thing customers notice, the thing competitors cannot easily copy — then it may be worth owning the software that runs it. If it is table stakes that every company in your industry does roughly the same way, building it is a tax you pay forever. Payroll is not a differentiator. Your pricing engine might be.',
      },
      { type: 'h2', text: 'Question 2 — How weird are your requirements, honestly?' },
      {
        type: 'p',
        text: 'Teams routinely overestimate how unique they are. Before concluding that nothing off-the-shelf fits, pull three vendors into structured demos against your real workflows. Most "we need custom" conclusions collapse the moment a configurable product is tested against the actual process instead of a wishlist.',
      },
      {
        type: 'quote',
        text: 'Configuration is buying with the lights on. You get the vendor’s roadmap and your own fit — but only if you test fit before you sign, not after.',
        cite: 'Marco Vidal',
      },
      { type: 'h2', text: 'Question 3 — Can you staff the maintenance for a decade?' },
      {
        type: 'p',
        text: 'A custom build is not a project, it is a permanent team. The honest cost is not the first release — it is the engineers who keep it patched, secure, and evolving for ten years. If you cannot commit to that staffing, you are not choosing build; you are choosing future technical debt with extra steps.',
      },
      {
        type: 'ul',
        items: [
          'Differentiator + weird requirements + can staff it → build.',
          'Not a differentiator → buy the closest fit, do not customize it.',
          'Differentiator but standard-ish requirements → configure a strong platform.',
        ],
      },
      {
        type: 'p',
        text: 'The trap in the middle is configuring a product so heavily that you have built custom software inside someone else’s pricing model — all the maintenance cost of a build, none of the control. If you find yourself there, stop and revisit question one.',
      },
    ],
  },
  {
    slug: 'demos-that-predict-implementation-risk',
    category: 'Vendor evaluation',
    title: 'How to run a software demo that actually predicts implementation risk',
    excerpt:
      'Scripted demos sell. Structured demos reveal. Use these eight scenarios to make vendors prove fit against your real workflows, not their happy path.',
    author: 'Dana Okafor',
    role: 'Procurement advisor',
    date: 'May 28, 2026',
    readTime: '7 min read',
    standfirst:
      'A vendor’s scripted demo is a sales asset, not an evaluation. Take control of the script and the same hour tells you where implementation will actually hurt.',
    body: [
      {
        type: 'p',
        text: 'A scripted vendor demo is engineered to look effortless, because the vendor chose the data, the path, and the questions. That tells you the product can do its happy path. It tells you nothing about your implementation. To learn that, you have to take the pen.',
      },
      { type: 'h2', text: 'Send your scenarios in advance' },
      {
        type: 'p',
        text: 'Write five to eight scenarios drawn from your messiest real workflows — the edge cases, the exceptions, the handoffs that break. Send them ahead and ask the vendor to demo against your script, with your data shapes, live. A vendor who resists this is telling you something.',
      },
      { type: 'h2', text: 'The scenarios that reveal risk' },
      {
        type: 'ul',
        items: [
          'A record that violates a business rule — show me the error, not the success path.',
          'A bulk correction across 500 rows after a mistake was made.',
          'A handoff between two roles with different permissions.',
          'A report that finance actually needs, built live, not pre-canned.',
          'An integration writing back to a system you already run.',
          'A configuration change made by an admin, not an engineer.',
        ],
      },
      {
        type: 'quote',
        text: 'Ask to see the error message. How a product fails is a better predictor of your implementation than how it succeeds.',
        cite: 'Dana Okafor',
      },
      { type: 'h2', text: 'Score fit, not polish' },
      {
        type: 'p',
        text: 'After each scenario, score it on a simple scale: works out of the box, needs configuration, needs custom work, or cannot do it. The pattern of those scores is your implementation risk profile. A product that scores "configuration" everywhere is a long project; one that scores "custom" on a core workflow is a warning.',
      },
      {
        type: 'p',
        text: 'You are not buying the demo. You are buying the implementation that follows it — and a structured demo is the cheapest look you will ever get at how that implementation is going to feel.',
      },
    ],
  },
  {
    slug: 'adoption-is-a-metric',
    category: 'Change management',
    title: 'Adoption is a metric, not a hope: tracking it from day one',
    excerpt:
      'Go-live is the start line. Here is the instrumentation we put in place so leadership can see real usage — and intervene — before a rollout quietly stalls.',
    author: 'Jordan Avery',
    role: 'Change & enablement specialist',
    date: 'May 21, 2026',
    readTime: '9 min read',
    standfirst:
      'A rollout rarely fails loudly. It stalls quietly, in usage data nobody is watching. Instrument adoption on day one and you can intervene while it still matters.',
    body: [
      {
        type: 'p',
        text: 'The most expensive failure in enterprise software is the system that technically launched and quietly went unused. There is no outage, no incident — just a slow drift back to spreadsheets and the old way. By the time leadership notices, the budget is spent and the momentum is gone.',
      },
      {
        type: 'p',
        text: 'The fix is to treat adoption as a measured outcome from go-live, not a hope you check on at the quarterly review. That means defining what adoption means for your rollout and instrumenting it before launch, not after.',
      },
      { type: 'h2', text: 'Define adoption in behaviors, not logins' },
      {
        type: 'p',
        text: 'Logins are vanity. The real signal is whether the work is happening in the new system. Pick the two or three behaviors that prove the process actually moved, and measure those.',
      },
      {
        type: 'ul',
        items: [
          'Are records being created in the system, or imported in bulk from a shadow spreadsheet?',
          'Are the people who own a step completing it in-app, or emailing someone who does it for them?',
          'Is the data fresh — updated in the flow of work — or batch-entered the day before a report?',
        ],
      },
      {
        type: 'quote',
        text: 'If your adoption dashboard only counts logins, you will find out the rollout failed at the same time everyone else does — too late to fix it.',
        cite: 'Jordan Avery',
      },
      { type: 'h2', text: 'Build the dashboard before launch' },
      {
        type: 'p',
        text: 'Stand up an adoption view that leadership can read in ten seconds, and have it live on day one. Segment it by team, because adoption is never uniform — one group stalling is the early warning the whole rollout is at risk. The point is to make a stall visible while it is still a single team and a single conversation.',
      },
      { type: 'h2', text: 'Intervene on the leading indicator' },
      {
        type: 'p',
        text: 'When a team’s usage flattens, the cause is usually one of three things: a workflow gap the system does not handle, a training gap, or a manager who has not made the new way the only way. Each has a different fix, and all three are cheap to address in week two and expensive to address in month six.',
      },
      {
        type: 'p',
        text: 'Adoption you can see is adoption you can save. Go-live is the start line, not the finish.',
      },
    ],
  },
  {
    slug: 'data-migration-without-the-war-room',
    category: 'Implementation playbooks',
    title: 'Data migration without the weekend war room',
    excerpt:
      'Cutover should be boring. We break down the dry-run cadence, reconciliation checks, and rollback plan that keep migrations calm and reversible.',
    author: 'Lena Schmidt',
    role: 'Data migration lead',
    date: 'May 14, 2026',
    readTime: '10 min read',
    standfirst:
      'A migration that needs a heroic weekend was under-rehearsed. The calm cutovers are the ones that were boring by the third dry run.',
    body: [
      {
        type: 'p',
        text: 'The all-hands weekend war room has been romanticized into a rite of passage. It should be treated as a planning failure. A migration that requires heroics on Saturday night is one that was not rehearsed enough during the week. The calmest cutovers are the most boring ones — because by go-live, the team had already done it three times.',
      },
      { type: 'h2', text: 'Dry runs are the whole game' },
      {
        type: 'p',
        text: 'Run the full migration end to end, on production-scale data, at least three times before the real one. The first dry run will be ugly and will surface problems you did not know you had. That is the point — you want those problems in a rehearsal, not at cutover.',
      },
      {
        type: 'ol',
        items: [
          'Dry run one: find the breakages. Expect failure; log everything.',
          'Dry run two: prove the fixes and time every phase.',
          'Dry run three: a dress rehearsal that should be uneventful — if it is not, you are not ready.',
        ],
      },
      { type: 'h2', text: 'Reconcile on counts and money, automatically' },
      {
        type: 'p',
        text: 'Manual spot-checks miss the errors that matter. Build automated reconciliation that runs the moment a load finishes: record counts by object, control totals on every financial field, and a referential-integrity sweep. The migration is not done when the load succeeds — it is done when reconciliation is green.',
      },
      {
        type: 'quote',
        text: 'Trust the totals, not the eyeballs. A migration that balances to the cent is one you can defend at the audit.',
        cite: 'Lena Schmidt',
      },
      { type: 'h2', text: 'Have a rollback you have actually tested' },
      {
        type: 'p',
        text: 'A rollback plan you have never executed is a document, not a plan. Practice the rollback during a dry run so the team knows it works and how long it takes. Knowing you can reverse the cutover is what lets you make the go/no-go call calmly at 2am instead of gambling.',
      },
      {
        type: 'p',
        text: 'Decide the go/no-go criteria in advance, in writing, when everyone is rested. Then at cutover you are checking the data against a checklist, not negotiating under pressure. Boring is the goal.',
      },
    ],
  },
  {
    slug: 'reading-an-implementation-sow',
    category: 'Vendor evaluation',
    title: 'Reading an implementation SOW: the clauses that protect your budget',
    excerpt:
      'Scope creep lives in the gaps. Learn which acceptance criteria, change-order terms, and milestone definitions to insist on before you sign.',
    author: 'Marco Vidal',
    role: 'Solutions architect',
    date: 'May 6, 2026',
    readTime: '6 min read',
    standfirst:
      'The number on the SOW is not the price. The price is whatever the gaps in the SOW let it become. Close the gaps before you sign.',
    body: [
      {
        type: 'p',
        text: 'The dollar figure on a statement of work is the price you pay if nothing is ambiguous. Everything that is ambiguous becomes a change order, and change orders are priced after you have already committed and lost your leverage. The clauses below are where budgets quietly double.',
      },
      { type: 'h2', text: 'Acceptance criteria: who decides "done"?' },
      {
        type: 'p',
        text: 'A deliverable with no objective acceptance criteria is a deliverable the vendor declares complete on their own schedule. Insist that every milestone names the specific, testable condition that marks it done — and who signs off. "Configuration complete" is not a criterion. "These twelve workflows pass these defined tests, signed by the process owner" is.',
      },
      { type: 'h2', text: 'Change orders: define the process, not just the rate' },
      {
        type: 'ul',
        items: [
          'A written definition of what counts as in-scope versus a change.',
          'A fixed turnaround for change-order quotes, so they cannot stall the project.',
          'A blended rate agreed up front, not negotiated mid-project under deadline pressure.',
        ],
      },
      {
        type: 'quote',
        text: 'You have all the leverage before you sign and almost none after. Spend it on the change-order clause.',
        cite: 'Marco Vidal',
      },
      { type: 'h2', text: 'Milestones tied to outcomes, not calendar dates' },
      {
        type: 'p',
        text: 'Payment milestones pegged to dates pay for time. Milestones pegged to accepted deliverables pay for progress. Tie money to the acceptance criteria above and the incentives line up: the vendor is paid when the thing works, not when the calendar turns.',
      },
      {
        type: 'p',
        text: 'None of this is adversarial. A good implementation partner wants these clauses too, because they make the engagement predictable for both sides. The vendor who resists defining "done" is the one you most need it from.',
      },
    ],
  },
  {
    slug: 'scoping-a-crm-migration',
    category: 'Software selection',
    title: 'Scoping a CRM migration when nobody agrees on the requirements',
    excerpt:
      'Conflicting stakeholders are the norm, not the exception. This workshop format turns a wishlist into a ranked, build-ready requirements doc in a day.',
    author: 'Priya Raman',
    role: 'NetSuite & ERP implementation lead',
    date: 'Apr 29, 2026',
    readTime: '8 min read',
    standfirst:
      'Stakeholders never agree on requirements — and waiting for them to is how projects die in committee. Here is a one-day format that forces a ranked answer.',
    body: [
      {
        type: 'p',
        text: 'Every CRM migration begins with a wishlist that is internally contradictory, because sales, marketing, and support each described their own system. Treating that wishlist as a requirements document is how projects end up six months in with everyone unhappy. The job in scoping is not to collect requirements — it is to force a ranked, agreed set out of a room that does not agree.',
      },
      { type: 'h2', text: 'Get every stakeholder in one room for one day' },
      {
        type: 'p',
        text: 'Asynchronous requirement-gathering produces a union of every team’s wants and a resolution of none of the conflicts. A single facilitated day, with a decision-maker present, does in hours what email threads fail to do in weeks. The decision-maker’s presence is not optional — it is the mechanism that breaks ties.',
      },
      { type: 'h2', text: 'Force-rank against one shared goal' },
      {
        type: 'ol',
        items: [
          'Agree on the single business outcome the migration serves, before any feature is discussed.',
          'List every requested requirement on the wall, deduplicated, with no owner attached.',
          'Force-rank them against that one outcome — no ties allowed, every item gets a number.',
          'Draw the line: above it is in scope, below it is the backlog, and everyone sees where the line falls.',
        ],
      },
      {
        type: 'quote',
        text: 'You cannot rank requirements until you agree what the project is for. Most disagreements about features are really disagreements about the goal.',
        cite: 'Priya Raman',
      },
      { type: 'h2', text: 'Leave with a build-ready document' },
      {
        type: 'p',
        text: 'The output is a ranked list, a visible scope line, and a backlog everyone watched get created — which means no one is surprised later that their pet feature is below the line. That shared memory of the trade-off is worth more than the document itself; it is what stops the scope fights from reopening at every milestone.',
      },
      {
        type: 'p',
        text: 'Disagreement is not the problem to avoid. Unresolved disagreement is. A day spent resolving it on a wall is the cheapest day in the whole program.',
      },
    ],
  },
]

/* --------------------------------------------------------------- helpers */

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}

export function getFeatured(): Post {
  return POSTS.find((p) => p.featured) ?? POSTS[0]
}

/** Posts for the index grid (everything that is not the featured hero). */
export function getGridPosts(): Post[] {
  return POSTS.filter((p) => !p.featured)
}

/** Up to `n` other posts, preferring the same category. */
export function getRelated(slug: string, n = 3): Post[] {
  const current = getPost(slug)
  if (!current) return []
  const others = POSTS.filter((p) => p.slug !== slug)
  const sameCat = others.filter((p) => p.category === current.category)
  const rest = others.filter((p) => p.category !== current.category)
  return [...sameCat, ...rest].slice(0, n)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}
