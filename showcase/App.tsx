import { useState, type ReactNode } from 'react';
import { semantic, textStyles, spacing, radius, type TextVariant } from '@lumen/tokens';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckIcon,
  ChevronLeftIcon,
  Dialog,
  Divider,
  HStack,
  Icon,
  IconButton,
  InfoIcon,
  List,
  ListIcon,
  ListItem,
  ListSection,
  NavigationBar,
  PlusIcon,
  Progress,
  Radio,
  RadioGroup,
  SearchField,
  SearchIcon,
  SegmentedControl,
  Select,
  Sheet,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Text,
  TextArea,
  TextField,
  ThemeProvider,
  useTheme,
  useToast,
  VStack,
  ToastProvider,
  type ColorSchemePreference,
} from '@lumen/react';

/* Small inline glyphs for the demo (any 24px stroke icon set works) */
const Wifi = () => (
  <Icon strokeWidth={2.4}>
    <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0" />
    <circle cx="12" cy="19.2" r="0.6" fill="currentColor" />
  </Icon>
);
const Bell = () => (
  <Icon strokeWidth={2.4}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
  </Icon>
);
const Moon = () => (
  <Icon strokeWidth={2.4}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </Icon>
);
const Lock = () => (
  <Icon strokeWidth={2.4}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);
const Heart = () => (
  <Icon>
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.6 3.8 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.2 0 5.3 3.1 4.2 6.2C19.5 15.4 12 20 12 20z" />
  </Icon>
);
const Share = () => (
  <Icon>
    <path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </Icon>
);

function Section({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="sc-section">
      <VStack gap={2} className="sc-section__head">
        <Text variant="subheadline" color="accent" weight="semibold">
          {eyebrow}
        </Text>
        <Text variant="title1" as="h2" balance>
          {title}
        </Text>
        {lead && (
          <Text variant="body" color="secondary" className="sc-lead">
            {lead}
          </Text>
        )}
      </VStack>
      {children}
    </section>
  );
}

function Demo({ label, children, grouped }: { label?: string; children: ReactNode; grouped?: boolean }) {
  return (
    <div className="sc-demo" data-grouped={grouped ? '' : undefined}>
      {label && (
        <Text variant="footnote" color="secondary" weight="medium" className="sc-demo__label">
          {label}
        </Text>
      )}
      {children}
    </div>
  );
}

function Swatch({ name, token, light, dark }: { name: string; token: string; light: string; dark: string }) {
  const { scheme } = useTheme();
  const value = scheme === 'dark' ? dark : light;
  return (
    <div className="sc-swatch">
      <div className="sc-swatch__chip" style={{ background: `var(${token})` }} />
      <div className="sc-swatch__meta">
        <Text variant="subheadline" weight="semibold">
          {name}
        </Text>
        <Text variant="caption1" color="secondary" mono truncate>
          {value}
        </Text>
      </div>
    </div>
  );
}

function Header() {
  const { preference, setPreference } = useTheme();
  return (
    <NavigationBar
      maxWidth={1120}
      leading={
        <HStack gap={2}>
          <span className="sc-logo" aria-hidden />
          <Text variant="headline">Lumen</Text>
          <Text variant="footnote" color="tertiary">
            v0.2
          </Text>
        </HStack>
      }
      trailing={
        <HStack gap={3}>
          <SegmentedControl<ColorSchemePreference>
            label="Appearance"
            value={preference}
            onValueChange={setPreference}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'Auto' },
            ]}
          />
        </HStack>
      }
    />
  );
}

function Hero() {
  return (
    <div className="sc-hero">
      <VStack gap={5} align="center">
        <Text variant="subheadline" color="secondary" weight="medium">
          For Web, Next.js & React Native
        </Text>
        <Text variant="display" align="center" balance>
          Quiet by design.
          <br />
          <Text as="span" variant="display" color="tertiary">Clear by default.</Text>
        </Text>
        <Text variant="title3" as="p" weight="regular" color="secondary" align="center" balance className="sc-hero__lead">
          Lumen is a calm, minimal design system with one set of tokens and matching components for the web and
          native mobile.
        </Text>
        <HStack gap={3} wrap justify="center">
          <Button size="lg" shape="capsule" href="#components">
            Explore components
          </Button>
          <Button size="lg" shape="capsule" variant="plain" href="#foundations">
            Foundations
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}

function Foundations() {
  const semanticGroups: { title: string; items: [string, string, keyof typeof semantic.light, string?][] }[] = [
    {
      title: 'Accent & status',
      items: [
        ['Accent', '--lm-color-accent', 'accent', 'default'],
        ['Success', '--lm-color-success', 'success', 'default'],
        ['Warning', '--lm-color-warning', 'warning', 'default'],
        ['Danger', '--lm-color-danger', 'danger', 'default'],
      ],
    },
    {
      title: 'Label',
      items: [
        ['Primary', '--lm-color-label-primary', 'label', 'primary'],
        ['Secondary', '--lm-color-label-secondary', 'label', 'secondary'],
        ['Tertiary', '--lm-color-label-tertiary', 'label', 'tertiary'],
        ['Quaternary', '--lm-color-label-quaternary', 'label', 'quaternary'],
      ],
    },
    {
      title: 'Background',
      items: [
        ['Primary', '--lm-color-background-primary', 'background', 'primary'],
        ['Secondary', '--lm-color-background-secondary', 'background', 'secondary'],
        ['Tertiary', '--lm-color-background-tertiary', 'background', 'tertiary'],
        ['Grouped', '--lm-color-background-grouped', 'background', 'grouped'],
      ],
    },
    {
      title: 'Fill & separator',
      items: [
        ['Fill', '--lm-color-fill-primary', 'fill', 'primary'],
        ['Fill tertiary', '--lm-color-fill-tertiary', 'fill', 'tertiary'],
        ['Separator', '--lm-color-separator', 'separator', 'default'],
        ['Separator opaque', '--lm-color-separator-opaque', 'separator', 'opaque'],
      ],
    },
  ];

  const variants = Object.keys(textStyles) as TextVariant[];

  return (
    <Section
      id="foundations"
      eyebrow="Foundations"
      title="Ink, paper, and very little else."
      lead="Lumen is monochrome by default. Color appears only when it means something: success, a warning, or a destructive action. Add a brand color with one line if you need one."
    >
      <VStack gap={10}>
        {semanticGroups.map((g) => (
          <VStack gap={3} key={g.title}>
            <Text variant="headline">{g.title}</Text>
            <div className="sc-grid sc-grid--swatches">
              {g.items.map(([name, token, group, key]) => {
                const pick = (s: 'light' | 'dark') => {
                  const v = semantic[s][group] as unknown as Record<string, string>;
                  return v[key ?? 'default'];
                };
                return <Swatch key={token} name={name} token={token} light={pick('light')} dark={pick('dark')} />;
              })}
            </div>
          </VStack>
        ))}


        <VStack gap={3}>
          <Text variant="headline">Type scale</Text>
          <Card variant="outlined" padding="none">
            {variants.map((v, i) => (
              <div key={v}>
                {i > 0 && <Divider />}
                <div className="sc-type-row">
                  <Text variant="caption1" color="secondary" mono className="sc-type-row__meta">
                    {v}
                    <br />
                    {textStyles[v].fontSize}/{textStyles[v].lineHeight} · {textStyles[v].fontWeight}
                  </Text>
                  <Text variant={v} as="div" truncate>
                    The quick brown fox jumps over the lazy dog
                  </Text>
                </div>
              </div>
            ))}
          </Card>
        </VStack>

        <div className="sc-grid sc-grid--2">
          <VStack gap={3}>
            <Text variant="headline">Spacing · 4pt grid</Text>
            <Card variant="outlined">
              <VStack gap={2}>
                {([1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const).map((k) => (
                  <HStack key={k} gap={3}>
                    <Text variant="caption1" color="secondary" mono className="sc-space-label">
                      {k} · {spacing[k]}px
                    </Text>
                    <span className="sc-space-bar" style={{ width: spacing[k] * 2 }} />
                  </HStack>
                ))}
              </VStack>
            </Card>
          </VStack>
          <VStack gap={3}>
            <Text variant="headline">Radius & elevation</Text>
            <Card variant="filled">
              <div className="sc-radii">
                {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((r, i) => (
                  <VStack key={r} gap={2} align="center">
                    <div className="sc-radius" style={{ borderRadius: radius[r], boxShadow: `var(--lm-shadow-${Math.min(i, 4)})` }} />
                    <Text variant="caption1" color="secondary" mono>
                      {r} · {radius[r]}
                    </Text>
                  </VStack>
                ))}
              </div>
            </Card>
          </VStack>
        </div>
      </VStack>
    </Section>
  );
}

function Buttons() {
  const [loading, setLoading] = useState(false);
  return (
    <VStack gap={4}>
      <Demo label="Variants — filled · tinted · gray · outline · plain">
        <HStack gap={3} wrap>
          <Button>Continue</Button>
          <Button variant="tinted">Tinted</Button>
          <Button variant="gray">Gray</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="plain">Plain</Button>
        </HStack>
      </Demo>
      <Demo label="Tones">
        <HStack gap={3} wrap>
          <Button tone="neutral" variant="outline">Secondary</Button>
          <Button tone="danger">Delete</Button>
          <Button tone="danger" variant="tinted">
            Remove
          </Button>
          <Button variant="gray" leadingIcon={<CheckIcon strokeWidth={2.6} />}>
            Done
          </Button>
        </HStack>
      </Demo>
      <Demo label="Sizes, icons & states">
        <HStack gap={3} wrap>
          <Button size="sm" variant="tinted" leadingIcon={<PlusIcon strokeWidth={2.6} />}>
            Add
          </Button>
          <Button size="lg" shape="capsule">
            Get started
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1800);
            }}
          >
            Save changes
          </Button>
          <Button disabled>Disabled</Button>
          <IconButton label="Favorite" icon={<Heart />} />
          <IconButton label="Share" icon={<Share />} variant="tinted" />
          <IconButton label="Add" icon={<PlusIcon strokeWidth={2.6} />} variant="filled" size="sm" />
        </HStack>
      </Demo>
    </VStack>
  );
}

function Inputs() {
  const [email, setEmail] = useState('');
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="sc-grid sc-grid--2">
      <Demo>
        <VStack gap={4}>
          <TextField label="Full name" placeholder="Jane Appleseed" clearable />
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={invalid ? 'Enter a valid email address.' : undefined}
            description="We’ll never share it."
            clearable
          />
          <TextField label="Amount" leading="$" trailing="USD" placeholder="0.00" inputMode="decimal" />
        </VStack>
      </Demo>
      <Demo>
        <VStack gap={4}>
          <SearchField placeholder="Search" />
          <Select
            label="Country"
            placeholder="Choose a country"
            defaultValue=""
            options={[
              { value: 'us', label: 'United States' },
              { value: 'pk', label: 'Pakistan' },
              { value: 'de', label: 'Germany' },
              { value: 'jp', label: 'Japan' },
            ]}
          />
          <TextArea label="Notes" placeholder="Anything we should know?" rows={3} />
        </VStack>
      </Demo>
    </div>
  );
}

function Controls() {
  const [view, setView] = useState('week');
  const [vol, setVol] = useState(64);
  return (
    <div className="sc-grid sc-grid--2">
      <Demo label="Switch, checkbox & radio">
        <VStack gap={5}>
          <HStack gap={4} wrap>
            <Switch defaultChecked aria-label="Wi-Fi" />
            <Switch aria-label="Bluetooth" />

            <Switch size="sm" defaultChecked aria-label="Small" />
            <Switch disabled aria-label="Disabled" />
          </HStack>
          <Divider />
          <Checkbox label="Email me about updates" description="About once a month. No spam." defaultChecked />
          <Checkbox label="Circle checkbox" shape="circle" />
          <Checkbox label="Indeterminate" indeterminate />
          <Divider />
          <RadioGroup defaultValue="standard" label="Shipping" orientation="horizontal">
            <Radio value="standard" label="Standard" />
            <Radio value="express" label="Express" />
            <Radio value="pickup" label="Pickup" />
          </RadioGroup>
        </VStack>
      </Demo>
      <Demo label="Segmented control & slider">
        <VStack gap={6}>
          <SegmentedControl
            fullWidth
            label="Range"
            value={view}
            onValueChange={setView}
            options={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
          />
          <SegmentedControl
            size="lg"
            fullWidth
            label="Mode"
            defaultValue="list"
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
            ]}
          />
          <VStack gap={2}>
            <HStack justify="between">
              <Text variant="subheadline" weight="medium">
                Volume
              </Text>
              <Text variant="subheadline" color="secondary" tabular>
                {vol}%
              </Text>
            </HStack>
            <Slider value={vol} onValueChange={setVol} aria-label="Volume" />
          </VStack>
        </VStack>
      </Demo>
    </div>
  );
}

function SettingsExample() {
  const [wifi, setWifi] = useState(true);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState('English');
  return (
    <div className="sc-phone">
      <div className="sc-phone__screen lm-canvas-grouped">
        <NavigationBar
          leading={
            <Button variant="plain" size="sm" leadingIcon={<ChevronLeftIcon strokeWidth={2.6} />}>
              Back
            </Button>
          }
          trailing={<IconButton label="Info" variant="plain" size="sm" icon={<InfoIcon />} />}
          largeTitle="Settings"
        />
        <div className="sc-phone__body">
          <VStack gap={6}>
            <SearchField />
            <List>
              <ListItem
                leading={<Avatar name="Jane Appleseed" size="lg" />}
                title={<Text variant="title3" as="span">Jane Appleseed</Text>}
                subtitle="Account, Cloud & Media"
                onClick={() => {}}
              />
            </List>
            <ListSection header="Connectivity">
              <List>
                <ListItem
                  leading={<ListIcon><Wifi /></ListIcon>}
                  title="Wi-Fi"
                  trailing={<Switch checked={wifi} onCheckedChange={setWifi} aria-label="Wi-Fi" />}
                />
                <ListItem
                  leading={<ListIcon><Bell /></ListIcon>}
                  title="Notifications"
                  trailing={<Switch checked={notif} onCheckedChange={setNotif} aria-label="Notifications" />}
                />
                <ListItem
                  leading={<ListIcon><Moon /></ListIcon>}
                  title="Dark Appearance"
                  trailing={<Switch checked={dark} onCheckedChange={setDark} aria-label="Dark" />}
                />
              </List>
            </ListSection>
            <ListSection header="Language" footer="Apps and websites will use the first language in this list that they support.">
              <List>
                {['English', 'Deutsch', 'اردو'].map((l) => (
                  <ListItem key={l} title={l} selected={lang === l} onClick={() => setLang(l)} />
                ))}
              </List>
            </ListSection>
            <ListSection>
              <List>
                <ListItem leading={<ListIcon><Lock /></ListIcon>} title="Privacy" detail="On" onClick={() => {}} />
                <ListItem title="Storage" detail="48.2 GB of 128 GB" onClick={() => {}} />
                <ListItem title="Sign Out" destructive onClick={() => {}} />
              </List>
            </ListSection>
          </VStack>
        </div>
      </div>
    </div>
  );
}

function Surfaces() {
  return (
    <div className="sc-grid sc-grid--3">
      <Card>
        <VStack gap={3}>
          <HStack justify="between">
            <Badge tone="neutral" dot>
              Active
            </Badge>
            <Text variant="footnote" color="secondary">
              Pro plan
            </Text>
          </HStack>
          <Text variant="title2" as="h3">
            $24<Text variant="body" as="span" color="secondary">/mo</Text>
          </Text>
          <Text variant="subheadline" color="secondary">
            Renews on October 26. Cancel anytime.
          </Text>
          <Progress value={68} label="Usage" />
          <Text variant="caption1" color="secondary">
            68 GB of 100 GB used
          </Text>
        </VStack>
      </Card>
      <Card variant="filled" onClick={() => {}}>
        <VStack gap={4}>
          <HStack justify="between">
            <AvatarGroup>
              <Avatar name="Ada Lovelace" size="sm" />
              <Avatar name="Alan Turing" size="sm" />
              <Avatar name="Grace Hopper" size="sm" />
            </AvatarGroup>
            <Badge count={3} variant="solid" />
          </HStack>
          <VStack gap={1}>
            <Text variant="headline">Design review</Text>
            <Text variant="subheadline" color="secondary">
              Interactive card — hover to lift, press to sink.
            </Text>
          </VStack>
        </VStack>
      </Card>
      <Card variant="outlined">
        <VStack gap={3}>
          <Text variant="headline">Loading states</Text>
          <HStack gap={3}>
            <Skeleton shape="circle" width={40} />
            <VStack gap={1} style={{ flex: 1 }}>
              <Skeleton shape="text" width="70%" />
              <Skeleton shape="text" width="45%" />
            </VStack>
          </HStack>
          <Skeleton height={64} />
          <HStack gap={4}>
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Progress style={{ flex: 1 }} label="Loading" />
          </HStack>
        </VStack>
      </Card>
    </div>
  );
}

function Feedback() {
  const toast = useToast();
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState(false);
  const [sheet, setSheet] = useState(false);
  return (
    <VStack gap={4}>
      <Demo label="Badges & avatars">
        <HStack gap={3} wrap>
          <Badge>Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="neutral">Neutral</Badge>
          <Badge variant="solid">New</Badge>
          <Badge variant="solid" count={128} />
          <Divider orientation="vertical" style={{ height: 24 }} />
          <Avatar name="Tim Cook" size="xs" />
          <Avatar name="Jony Ive" size="sm" status />
          <Avatar name="Aasim Shah" size="md" />
          <Avatar name="Lumen" size="lg" shape="rounded" />
        </HStack>
      </Demo>
      <Demo label="Toasts, dialogs & sheets">
        <HStack gap={3} wrap>
          <Button variant="gray" onClick={() => toast.success('Changes saved')}>
            Success toast
          </Button>
          <Button
            variant="gray"
            onClick={() =>
              toast.show({
                title: 'Message archived',
                action: (
                  <Button size="sm" variant="plain">
                    Undo
                  </Button>
                ),
              })
            }
          >
            Toast with action
          </Button>
          <Button variant="gray" onClick={() => toast.error('Couldn’t connect', { description: 'Check your network and try again.' })}>
            Error toast
          </Button>
          <Button variant="gray" onClick={() => setDialog(true)}>
            Dialog
          </Button>
          <Button variant="gray" onClick={() => setAlert(true)}>
            Alert
          </Button>
          <Button variant="gray" onClick={() => setSheet(true)}>
            Sheet
          </Button>
        </HStack>
      </Demo>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Invite collaborators"
        description="People you invite can view and edit this project."
        actions={
          <>
            <Button variant="gray" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialog(false);
                toast.success('Invitation sent');
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <div style={{ paddingTop: 8 }}>
          <TextField placeholder="name@company.com" leading={<SearchIcon />} autoFocus />
        </div>
      </Dialog>

      <Dialog
        open={alert}
        onClose={() => setAlert(false)}
        align="center"
        title="Delete this photo?"
        description="This photo will be deleted from all your devices. You can’t undo this action."
        actions={
          <>
            <Button variant="gray" onClick={() => setAlert(false)}>
              Cancel
            </Button>
            <Button tone="danger" onClick={() => setAlert(false)}>
              Delete
            </Button>
          </>
        }
      />

      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="New Reminder"
        headerLeading={
          <Button variant="plain" size="sm" onClick={() => setSheet(false)}>
            Cancel
          </Button>
        }
        headerTrailing={
          <Button variant="plain" size="sm" onClick={() => setSheet(false)}>
            <strong>Add</strong>
          </Button>
        }
      >
        <VStack gap={5}>
          <TextField placeholder="Title" aria-label="Title" size="lg" />
          <TextArea placeholder="Notes" aria-label="Notes" rows={3} />
          <List variant="filled">
            <ListItem title="Date" trailing={<Switch defaultChecked aria-label="Date" />} />
            <ListItem title="Time" trailing={<Switch aria-label="Time" />} />
            <ListItem title="Priority" detail="None" onClick={() => {}} />
          </List>
        </VStack>
      </Sheet>
    </VStack>
  );
}

function Components() {
  return (
    <Section
      id="components"
      eyebrow="Components"
      title="Familiar, focused, and friendly to every thumb."
      lead="Every control is at least 44pt tall, keyboard accessible, and ships with the same API on web and React Native."
    >
      <VStack gap={16}>
        <VStack gap={4}>
          <Text variant="title3">Buttons</Text>
          <Buttons />
        </VStack>
        <VStack gap={4}>
          <Text variant="title3">Text input</Text>
          <Inputs />
        </VStack>
        <VStack gap={4}>
          <Text variant="title3">Selection controls</Text>
          <Controls />
        </VStack>
        <div className="sc-split">
          <VStack gap={4} className="sc-split__text">
            <Text variant="title3">Lists</Text>
            <Text variant="body" color="secondary">
              Inset grouped lists are the backbone of settings, profiles and detail screens. Rows support leading icon
              tiles, avatars, subtitles, detail values, switches, checkmarks and disclosure chevrons — with hairline
              separators inset to the text.
            </Text>
            <Text variant="body" color="secondary">
              Try the switches and the language picker — it’s all live.
            </Text>
          </VStack>
          <SettingsExample />
        </div>
        <VStack gap={4}>
          <Text variant="title3">Cards & loading</Text>
          <Surfaces />
        </VStack>
        <VStack gap={4}>
          <Text variant="title3">Feedback & overlays</Text>
          <Feedback />
        </VStack>
      </VStack>
    </Section>
  );
}

export function App() {
  return (
    <ThemeProvider storageKey="lumen-showcase-scheme">
      <ToastProvider>
        <Header />
        <main className="sc-main">
          <Hero />
          <Foundations />
          <Components />
          <footer className="sc-footer">
            <Text variant="footnote" color="secondary" align="center">
              Lumen Design System · Tokens, React & React Native · MIT
            </Text>
          </footer>
        </main>
      </ToastProvider>
    </ThemeProvider>
  );
}
