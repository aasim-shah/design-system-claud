import { useState, type FormEvent } from 'react';
import {
  Accordion,
  ActionSheet,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  ChipGroup,
  Dialog,
  Divider,
  EmptyState,
  FileDrop,
  Form,
  FormActions,
  FormRow,
  FormSection,
  HStack,
  Icon,
  IconButton,
  Kbd,
  Menu,
  MoreIcon,
  Pagination,
  PasswordField,
  PinInput,
  Popover,
  Radio,
  RadioGroup,
  SearchField,
  SearchIcon,
  Select,
  Sheet,
  Sidebar,
  Stepper,
  Steps,
  Switch,
  TabBar,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tooltip,
  useToast,
  VStack,
} from '@lumen/react';
import { Demo, Section } from './layout';

/* Demo glyphs (24px stroke — any icon set with the same grid matches) */
const g = (d: string) => () => (
  <Icon>
    <path d={d} />
  </Icon>
);
const HomeIcon = g('M3.5 10.5L12 3.5l8.5 7M5.5 9v11h13V9');
const InboxIcon = g('M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5M5.5 5h13l2 8.5V19H3.5v-5.5z');
const UserIcon = g('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0');
const GearIcon = g('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.8a7 7 0 0 1-2.1 1.2L14.7 21h-4l-.3-2.5a7 7 0 0 1-2.1-1.2l-1.9.8-2-3.4 1.6-1.2a7 7 0 0 1 0-3L4.4 9.3l2-3.4 1.9.8a7 7 0 0 1 2.1-1.2L10.7 3h4l.3 2.5a7 7 0 0 1 2.1 1.2l1.9-.8 2 3.4-1.6 1.2a7 7 0 0 1 0 3z');
const ChartIcon = g('M4 20V10M10 20V4M16 20v-7M22 20H2');
const FolderIcon = g('M3.5 6.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z');
const PencilIcon = g('M4 20h4L19.5 8.5a2.1 2.1 0 0 0-4-4L4 16z');
const CopyIcon = g('M9 9h11v11H9zM5 15H4V4h11v1');
const TrashIcon = g('M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13');
const ShareIcon = g('M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7');
const ArchiveIcon = g('M3.5 4.5h17v4h-17zM5 8.5V19h14V8.5M10 12.5h4');

/* ------------------------------------------------------------------ Forms */

const interestsAll = ['Design', 'Engineering', 'Product', 'Marketing', 'Research', 'Sales'];

function SignupForm() {
  const toast = useToast();
  const [step] = useState(1);
  const [values, setValues] = useState({ first: '', last: '', email: '', password: '' });
  const [touched, setTouched] = useState(false);
  const [interests, setInterests] = useState<string[]>(['Design']);
  const [plan, setPlan] = useState('pro');
  const [seats, setSeats] = useState(3);
  const [terms, setTerms] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const errors = {
    first: !values.first ? 'Enter your first name.' : undefined,
    email: !/^\S+@\S+\.\S+$/.test(values.email) ? 'Enter an email like name@company.com.' : undefined,
    password: values.password.length < 8 ? 'Use at least 8 characters.' : undefined,
    terms: !terms ? 'Please accept the terms to continue.' : undefined,
  };
  const show = (k: keyof typeof errors) => (touched ? errors[k] : undefined);
  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues({ ...values, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) {
      toast.error('Check the highlighted fields');
      return;
    }
    toast.success('Account created', { description: `${plan === 'pro' ? 'Pro' : 'Starter'} plan · ${seats} seats` });
  };

  return (
    <Card variant="outlined" padding="lg">
      <VStack gap={8}>
        <VStack gap={2}>
          <Text variant="title2" as="h3">
            Create your account
          </Text>
          <Text variant="subheadline" color="secondary">
            A complete form built only from Lumen parts. Submit it empty to see validation.
          </Text>
        </VStack>
        <Steps current={step} steps={[{ label: 'Email' }, { label: 'Account' }, { label: 'Plan' }, { label: 'Done' }]} />
        <Form onSubmit={submit}>
          <FormSection title="Account" description="This is how people will see you.">
            <FormRow>
              <TextField label="First name" autoComplete="given-name" placeholder="Jane" value={values.first} onChange={set('first')} error={show('first')} />
              <TextField label="Last name" autoComplete="family-name" placeholder="Appleseed" value={values.last} onChange={set('last')} />
            </FormRow>
            <TextField
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={values.email}
              onChange={set('email')}
              error={show('email')}
              clearable
            />
            <PasswordField
              label="Password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={set('password')}
              error={show('password')}
              showStrength
            />
          </FormSection>

          <FormSection title="Profile" description="Optional details you can change later.">
            <FormRow>
              <TextField label="Date of birth" type="date" />
              <Select
                label="Country"
                defaultValue="pk"
                options={[
                  { value: 'pk', label: 'Pakistan' },
                  { value: 'us', label: 'United States' },
                  { value: 'gb', label: 'United Kingdom' },
                  { value: 'de', label: 'Germany' },
                ]}
              />
            </FormRow>
            <TextArea label="Bio" placeholder="A sentence or two about you" rows={3} description="Up to 160 characters." maxLength={160} />
            <VStack gap={2}>
              <Text variant="subheadline" weight="medium" style={{ paddingInline: 4 }}>
                Interests
              </Text>
              <ChipGroup aria-label="Interests">
                {interestsAll.map((i) => (
                  <Chip
                    key={i}
                    selected={interests.includes(i)}
                    onSelectedChange={(on) => setInterests(on ? [...interests, i] : interests.filter((x) => x !== i))}
                  >
                    {i}
                  </Chip>
                ))}
              </ChipGroup>
            </VStack>
            <FileDrop label="Profile photo" hint="PNG or JPG, up to 5 MB" accept="image/*" maxSize={5 * 1024 * 1024} files={files} onFilesChange={setFiles} />
          </FormSection>

          <FormSection title="Plan">
            <RadioGroup value={plan} onValueChange={setPlan} label="Plan">
              <Radio value="starter" label="Starter" description="Free for up to 3 people." />
              <Radio value="pro" label="Pro — $12 per seat" description="Unlimited projects, version history and priority support." />
            </RadioGroup>
            <HStack justify="between" wrap gap={3}>
              <VStack gap={0.5}>
                <Text variant="body">Seats</Text>
                <Text variant="footnote" color="secondary">
                  You can add more at any time.
                </Text>
              </VStack>
              <Stepper label="Seats" value={seats} onValueChange={setSeats} min={1} max={50} />
            </HStack>
            <HStack justify="between" gap={3}>
              <VStack gap={0.5}>
                <Text variant="body">Product updates</Text>
                <Text variant="footnote" color="secondary">
                  About once a month.
                </Text>
              </VStack>
              <Switch defaultChecked aria-label="Product updates" />
            </HStack>
            <VStack gap={1}>
              <Checkbox label="I agree to the Terms of Service and Privacy Policy" checked={terms} onCheckedChange={setTerms} />
              {show('terms') && (
                <Text variant="footnote" color="danger" style={{ paddingLeft: 34 }}>
                  {show('terms')}
                </Text>
              )}
            </VStack>
          </FormSection>

          <FormActions>
            <Button variant="gray" type="reset" onClick={() => setTouched(false)}>
              Cancel
            </Button>
            <Button type="submit">Create account</Button>
          </FormActions>
        </Form>
      </VStack>
    </Card>
  );
}

function VerifyCard() {
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  return (
    <Card variant="outlined" padding="lg">
      <VStack gap={5} align="start">
        <VStack gap={1}>
          <Text variant="title3" as="h3">
            Check your email
          </Text>
          <Text variant="subheadline" color="secondary">
            We sent a 6-digit code to jane@lumen.dev. Try <Text as="span" mono>123456</Text>.
          </Text>
        </VStack>
        <PinInput
          groupSize={3}
          value={code}
          onValueChange={(v) => {
            setCode(v);
            setError(undefined);
          }}
          onComplete={(v) => (v === '123456' ? toast.success('Email verified') : setError('That code didn’t match. Try again.'))}
          error={error}
        />
        <HStack gap={3}>
          <Button variant="plain" size="sm">
            Resend code
          </Button>
          <Text variant="footnote" color="tertiary">
            Available in 0:42
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

function SignInCard() {
  return (
    <Card variant="outlined" padding="lg">
      <Form onSubmit={(e) => e.preventDefault()}>
        <VStack gap={1}>
          <Text variant="title3" as="h3">
            Sign in
          </Text>
          <Text variant="subheadline" color="secondary">
            Welcome back.
          </Text>
        </VStack>
        <VStack gap={4}>
          <TextField label="Email" type="email" placeholder="name@company.com" autoComplete="email" />
          <PasswordField label="Password" placeholder="Password" />
          <HStack justify="between">
            <Checkbox label="Remember me" defaultChecked />
            <a href="#forms" style={{ fontSize: 15 }}>
              Forgot password?
            </a>
          </HStack>
        </VStack>
        <VStack gap={3}>
          <Button type="submit" fullWidth size="lg">
            Sign in
          </Button>
          <Button variant="outline" tone="neutral" fullWidth size="lg">
            Continue with Apple
          </Button>
        </VStack>
      </Form>
    </Card>
  );
}

export function FormsSection() {
  return (
    <Section
      id="forms"
      eyebrow="Forms"
      title="Forms that feel effortless."
      lead="Labels above fields, helpful descriptions, errors that say how to fix them, and the right keyboard on every phone. Everything below is live."
    >
      <div className="sc-forms">
        <SignupForm />
        <VStack gap={4}>
          <SignInCard />
          <VerifyCard />
        </VStack>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Navigation */

function AppShell() {
  const [nav, setNav] = useState('projects');
  const [tab, setTab] = useState('overview');
  const [page, setPage] = useState(4);
  return (
    <div className="sc-shell">
      <aside className="sc-shell__side">
        <HStack gap={2} style={{ padding: '4px 12px 16px' }}>
          <span className="sc-logo" aria-hidden />
          <Text variant="headline">Acme</Text>
        </HStack>
        <Sidebar
          value={nav}
          onValueChange={setNav}
          sections={[
            {
              items: [
                { value: 'home', label: 'Home', icon: <HomeIcon /> },
                { value: 'inbox', label: 'Inbox', icon: <InboxIcon />, count: 12 },
                { value: 'projects', label: 'Projects', icon: <FolderIcon /> },
                { value: 'reports', label: 'Reports', icon: <ChartIcon /> },
              ],
            },
            {
              heading: 'Workspace',
              items: [
                { value: 'members', label: 'Members', icon: <UserIcon /> },
                { value: 'settings', label: 'Settings', icon: <GearIcon /> },
              ],
            },
          ]}
        />
      </aside>
      <div className="sc-shell__main">
        <VStack gap={5}>
          <HStack justify="between" wrap gap={3}>
            <VStack gap={2}>
              <Breadcrumbs
                items={[{ label: 'Acme', href: '#navigation' }, { label: 'Projects', href: '#navigation' }, { label: 'Mobile', href: '#navigation' }, { label: 'Website', href: '#navigation' }, { label: 'Redesign 2026' }]}
                maxItems={4}
              />
              <Text variant="title2" as="h3">
                Redesign 2026
              </Text>
            </VStack>
            <HStack gap={2}>
              <Tooltip content="Share project">
                <IconButton label="Share" icon={<ShareIcon />} variant="plain" />
              </Tooltip>
              <Button size="sm" variant="tinted">
                Invite
              </Button>
            </HStack>
          </HStack>
          <Tabs
            label="Project sections"
            value={tab}
            onValueChange={setTab}
            items={[
              {
                value: 'overview',
                label: 'Overview',
                content: (
                  <Text variant="subheadline" color="secondary">
                    Tabs switch between views of the same object. Use the arrow keys to move between them.
                  </Text>
                ),
              },
              { value: 'tasks', label: 'Tasks', content: <Text variant="subheadline" color="secondary">24 open tasks, 3 due this week.</Text> },
              { value: 'files', label: 'Files', content: <Text variant="subheadline" color="secondary">128 files · 2.4 GB</Text> },
              { value: 'activity', label: 'Activity', content: <Text variant="subheadline" color="secondary">Jane updated the timeline 2 hours ago.</Text> },
              { value: 'archived', label: 'Archived', disabled: true },
            ]}
          />
          <Divider />
          <HStack justify="between" wrap gap={3}>
            <Text variant="footnote" color="secondary">
              Showing 31–40 of 97
            </Text>
            <Pagination page={page} pageCount={10} onPageChange={setPage} />
          </HStack>
        </VStack>
      </div>
    </div>
  );
}

function PhoneTabBar() {
  const [tab, setTab] = useState('home');
  const titles: Record<string, string> = { home: 'Home', search: 'Search', inbox: 'Inbox', profile: 'Profile' };
  return (
    <div className="sc-phone sc-phone--sm">
      <div className="sc-phone__screen sc-phone__screen--tabs lm-canvas-grouped">
        <div className="sc-phone__content">
          <Text variant="largeTitle">{titles[tab]}</Text>
          <EmptyState
            icon={<InboxIcon />}
            title="Nothing here yet"
            description="Tap the tabs below. The bar stays put and marks where you are."
          />
        </div>
        <TabBar
          value={tab}
          onValueChange={setTab}
          items={[
            { value: 'home', label: 'Home', icon: <HomeIcon /> },
            { value: 'search', label: 'Search', icon: <SearchIcon /> },
            { value: 'inbox', label: 'Inbox', icon: <InboxIcon />, badge: 3 },
            { value: 'profile', label: 'Profile', icon: <UserIcon /> },
          ]}
        />
      </div>
    </div>
  );
}

export function NavigationSection() {
  return (
    <Section
      id="navigation"
      eyebrow="Navigation"
      title="Always know where you are."
      lead="Sidebar and breadcrumbs for desktop apps, tabs for views of the same thing, pagination for long lists, and a tab bar for phones."
    >
      <div className="sc-split sc-split--nav">
        <AppShell />
        <PhoneTabBar />
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- Data & content */

type Invoice = { id: string; customer: string; email: string; status: 'Paid' | 'Pending' | 'Overdue'; amount: number; date: string };
const invoices: Invoice[] = [
  { id: 'INV-2041', customer: 'Northwind Ltd', email: 'billing@northwind.co', status: 'Paid', amount: 4200, date: 'Sep 24' },
  { id: 'INV-2040', customer: 'Fabrikam', email: 'ap@fabrikam.com', status: 'Pending', amount: 1850.5, date: 'Sep 21' },
  { id: 'INV-2039', customer: 'Contoso', email: 'finance@contoso.io', status: 'Overdue', amount: 960, date: 'Sep 12' },
  { id: 'INV-2038', customer: 'Tailspin Toys', email: 'hello@tailspin.dev', status: 'Paid', amount: 12400, date: 'Sep 03' },
];

export function DataSection() {
  const [alerts, setAlerts] = useState({ info: true, warn: true });
  const [query, setQuery] = useState('');
  const rows = invoices.filter((r) => (r.customer + r.id).toLowerCase().includes(query.toLowerCase()));
  return (
    <Section
      id="data"
      eyebrow="Data & content"
      title="Dense information, calmly presented."
      lead="Tables with tabular numbers, banners that don’t shout, empty states that point the way, and disclosure for the details."
    >
      <VStack gap={10}>
        <VStack gap={4}>
          <HStack justify="between" wrap gap={3}>
            <Text variant="title3">Table</Text>
            <div style={{ width: 260, maxWidth: '100%' }}>
              <SearchField placeholder="Filter invoices" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </HStack>
          <Table<Invoice>
            caption="Invoices"
            rowKey={(r) => r.id}
            rows={rows}
            empty={<EmptyState icon={<SearchIcon />} title="No matching invoices" description={`Nothing matches “${query}”.`} />}
            columns={[
              {
                key: 'customer',
                header: 'Customer',
                render: (r) => (
                  <HStack gap={3}>
                    <Avatar name={r.customer} size="sm" />
                    <VStack>
                      <Text variant="subheadline" weight="medium">
                        {r.customer}
                      </Text>
                      <Text variant="footnote" color="secondary">
                        {r.email}
                      </Text>
                    </VStack>
                  </HStack>
                ),
              },
              { key: 'id', header: 'Invoice', render: (r) => <span className="lm-table__muted">{r.id}</span> },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <Badge dot tone={r.status === 'Paid' ? 'success' : r.status === 'Overdue' ? 'danger' : 'neutral'}>
                    {r.status}
                  </Badge>
                ),
              },
              { key: 'date', header: 'Date', render: (r) => <span className="lm-table__muted">{r.date}</span> },
              { key: 'amount', header: 'Amount', align: 'end', render: (r) => `$${r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
              {
                key: 'menu',
                header: <span className="lm-visually-hidden">Actions</span>,
                align: 'end',
                width: 56,
                render: (r) => (
                  <Menu
                    align="end"
                    trigger={(p) => <IconButton {...p} ref={p.ref as never} label={`Actions for ${r.id}`} variant="plain" size="sm" icon={<MoreIcon />} />}
                    items={[
                      { label: 'View invoice', icon: <FolderIcon /> },
                      { label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D' },
                      { type: 'separator' },
                      { label: 'Delete', icon: <TrashIcon />, destructive: true },
                    ]}
                  />
                ),
              },
            ]}
          />
        </VStack>

        <div className="sc-grid sc-grid--2">
          <VStack gap={4}>
            <Text variant="title3">Alerts</Text>
            {alerts.info && (
              <Alert title="New sign-in from Chrome on Mac" onDismiss={() => setAlerts({ ...alerts, info: false })}>
                Lahore, Pakistan · Just now. If this wasn’t you, secure your account.
              </Alert>
            )}
            <Alert tone="success" title="Backup complete">
              Your files were backed up 2 minutes ago.
            </Alert>
            {alerts.warn && (
              <Alert
                tone="warning"
                title="Storage almost full"
                actions={
                  <>
                    <Button size="sm">Upgrade</Button>
                    <Button size="sm" variant="plain" onClick={() => setAlerts({ ...alerts, warn: false })}>
                      Not now
                    </Button>
                  </>
                }
              >
                You’ve used 92% of 100 GB.
              </Alert>
            )}
            <Alert tone="danger" title="Payment failed">
              We couldn’t charge the card ending in 4242. Update your payment method to keep Pro.
            </Alert>
          </VStack>
          <VStack gap={4}>
            <Text variant="title3">Accordion</Text>
            <Accordion
              defaultValue={['what']}
              items={[
                { value: 'what', title: 'What is Lumen?', content: 'A calm, monochrome design system with matching components for React, Next.js and React Native.' },
                { value: 'dark', title: 'Does it support dark mode?', content: 'Yes. It follows the system setting automatically, and you can force light or dark.' },
                { value: 'brand', title: 'Can I use my brand color?', content: 'Pass accent="#hex" to ThemeProvider. Pressed and tinted variants are derived for you.' },
                { value: 'a11y', title: 'Is it accessible?', content: 'Real buttons, dialogs and labels, visible focus rings, 44pt touch targets and checked contrast.' },
              ]}
            />
            <Card variant="filled" padding="sm">
              <HStack gap={2} wrap>
                <Text variant="footnote" color="secondary">
                  Keyboard:
                </Text>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
                <Text variant="footnote" color="secondary">
                  to search ·
                </Text>
                <Kbd>Esc</Kbd>
                <Text variant="footnote" color="secondary">
                  to close
                </Text>
              </HStack>
            </Card>
          </VStack>
        </div>

        <Card variant="outlined" padding="none">
          <EmptyState
            icon={<FolderIcon />}
            title="No projects yet"
            description="Projects keep your files, tasks and people together. Create one to get started."
            actions={
              <>
                <Button>New project</Button>
                <Button variant="gray">Import</Button>
              </>
            }
          />
        </Card>
      </VStack>
    </Section>
  );
}

/* --------------------------------------------------------------- Overlays */

export function OverlaysSection() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [actions, setActions] = useState(false);
  return (
    <Section
      id="overlays"
      eyebrow="Overlays"
      title="Interruptions, used sparingly."
      lead="Menus and popovers for quick choices, action sheets for context, dialogs for decisions, sheets for focused tasks and toasts for confirmation. Esc and outside clicks always close."
    >
      <div className="sc-grid sc-grid--2">
        <Demo label="Menus, popovers & tooltips">
          <HStack gap={3} wrap>
            <Menu
              trigger={(p) => (
                <Button {...p} ref={p.ref as never} variant="gray" trailingIcon={<MoreIcon />}>
                  Actions
                </Button>
              )}
              items={[
                { type: 'heading', label: 'Document' },
                { label: 'Rename', icon: <PencilIcon />, shortcut: '⌘R', onSelect: () => toast.show('Rename') },
                { label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D', onSelect: () => toast.show('Duplicated') },
                { label: 'Share…', icon: <ShareIcon />, onSelect: () => toast.show('Share') },
                { label: 'Archive', icon: <ArchiveIcon />, disabled: true },
                { type: 'separator' },
                { label: 'Delete', icon: <TrashIcon />, destructive: true, onSelect: () => setConfirm(true) },
              ]}
            />
            <Popover
              padded
              trigger={(p) => (
                <Button {...p} ref={p.ref as never} variant="gray">
                  Popover
                </Button>
              )}
            >
              {(close) => (
                <VStack gap={3} style={{ width: 260 }}>
                  <Text variant="headline">Quick note</Text>
                  <TextArea aria-label="Note" rows={3} placeholder="Write something…" />
                  <HStack justify="end" gap={2}>
                    <Button size="sm" variant="plain" onClick={close}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        close();
                        toast.success('Note saved');
                      }}
                    >
                      Save
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Popover>
            <Tooltip content="Tooltips explain icons. Keep them short.">
              <IconButton label="Info" icon={<Icon><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.6v.1" /></Icon>} />
            </Tooltip>
            <Tooltip content="Also on keyboard focus" side="bottom">
              <Button variant="plain">Hover me</Button>
            </Tooltip>
          </HStack>
        </Demo>
        <Demo label="Dialogs, sheets & toasts">
          <HStack gap={3} wrap>
            <Button variant="gray" onClick={() => setDialog(true)}>
              Dialog
            </Button>
            <Button variant="gray" onClick={() => setConfirm(true)}>
              Confirm
            </Button>
            <Button variant="gray" onClick={() => setSheet(true)}>
              Bottom sheet
            </Button>
            <Button variant="gray" onClick={() => setActions(true)}>
              Action sheet
            </Button>
            <Button variant="gray" onClick={() => toast.success('Saved to Photos')}>
              Toast
            </Button>
          </HStack>
        </Demo>
      </div>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Rename project"
        description="Choose a short name your team will recognise."
        actions={
          <>
            <Button variant="gray" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialog(false);
                toast.success('Project renamed');
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div style={{ paddingTop: 8 }}>
          <TextField aria-label="Project name" defaultValue="Redesign 2026" autoFocus />
        </div>
      </Dialog>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        align="center"
        title="Delete “Redesign 2026”?"
        description="The project and its 128 files will be removed for everyone. You can’t undo this."
        actions={
          <>
            <Button variant="gray" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              tone="danger"
              onClick={() => {
                setConfirm(false);
                toast.show({ title: 'Project deleted', action: <Button size="sm" variant="plain">Undo</Button> });
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Filters"
        headerLeading={
          <Button variant="plain" size="sm" onClick={() => setSheet(false)}>
            Reset
          </Button>
        }
        headerTrailing={
          <Button variant="plain" size="sm" onClick={() => setSheet(false)}>
            <strong>Done</strong>
          </Button>
        }
      >
        <VStack gap={6}>
          <VStack gap={3}>
            <Text variant="subheadline" weight="medium">
              Status
            </Text>
            <ChipGroup>
              <Chip selected onSelectedChange={() => {}}>
                Open
              </Chip>
              <Chip selected={false} onSelectedChange={() => {}}>
                In review
              </Chip>
              <Chip selected={false} onSelectedChange={() => {}}>
                Closed
              </Chip>
            </ChipGroup>
          </VStack>
          <FormRow>
            <TextField label="From" type="date" />
            <TextField label="To" type="date" />
          </FormRow>
          <HStack justify="between">
            <Text>Only my items</Text>
            <Switch aria-label="Only my items" />
          </HStack>
        </VStack>
      </Sheet>

      <ActionSheet
        open={actions}
        onClose={() => setActions(false)}
        title="IMG_2041.HEIC"
        message="Taken Sep 24 · 3.2 MB"
        actions={[
          { label: 'Share…', onSelect: () => toast.show('Share') },
          { label: 'Duplicate', onSelect: () => toast.show('Duplicated') },
          { label: 'Save to Files', onSelect: () => toast.success('Saved') },
          { label: 'Delete Photo', destructive: true, onSelect: () => toast.show('Photo deleted') },
        ]}
      />
    </Section>
  );
}
