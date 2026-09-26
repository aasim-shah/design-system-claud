# Screen recipes

Complete, working screens that show how Lumen parts fit together. Adapt the content and keep the
structure: spacing, hierarchy, one primary action, and the empty, loading and error states. Every
block below is typechecked against the real packages in the Lumen repo's CI.

## Contents
1. Settings page (web) — grouped lists, switches, selection, destructive row
2. Sign-in (web) — form, validation, loading button, toast
3. Dashboard (web) — sidebar shell, stats cards, table with menu, empty/loading/error states
4. Settings screen with tab bar (React Native)
5. Data-state helper (web) — one component for loading/empty/error/ready

---

## 1. Settings page (web)

```tsx
// @check web settings.tsx
'use client';
import { useState } from 'react';
import {
  BellIcon, List, ListIcon, ListItem, ListSection, LockIcon, MoonIcon, NavigationBar,
  SearchField, Switch, VStack, useTheme,
} from '@lumen/react';

export default function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  return (
    <div className="lm-canvas-grouped" style={{ minHeight: '100dvh' }}>
      <NavigationBar largeTitle="Settings" maxWidth={680} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '8px 16px 48px' }}>
        <VStack gap={8}>
          <SearchField placeholder="Search settings" />
          <ListSection header="General">
            <List>
              <ListItem
                leading={<ListIcon><BellIcon /></ListIcon>}
                title="Notifications"
                trailing={<Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Notifications" />}
              />
              <ListItem
                leading={<ListIcon><MoonIcon /></ListIcon>}
                title="Dark appearance"
                trailing={
                  <Switch
                    checked={preference === 'dark'}
                    onCheckedChange={(on) => setPreference(on ? 'dark' : 'light')}
                    aria-label="Dark appearance"
                  />
                }
              />
              <ListItem leading={<ListIcon><LockIcon /></ListIcon>} title="Privacy" detail="On" href="/settings/privacy" />
            </List>
          </ListSection>
          <ListSection header="Language" footer="Apps use the first language they support.">
            <List>
              {['English', 'Deutsch', 'اردو'].map((l) => (
                <ListItem key={l} title={l} selected={language === l} onClick={() => setLanguage(l)} />
              ))}
            </List>
          </ListSection>
          <List>
            <ListItem title="Sign out" destructive onClick={() => {}} />
          </List>
        </VStack>
      </main>
    </div>
  );
}
```

## 2. Sign-in (web)

```tsx
// @check web sign-in.tsx
'use client';
import { useState, type FormEvent } from 'react';
import { Button, Card, Checkbox, Form, HStack, PasswordField, Text, TextField, VStack, useToast } from '@lumen/react';

export default function SignIn() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError = submitted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an email like name@company.com.' : undefined;
  const passwordError = submitted && password.length < 8 ? 'Use at least 8 characters.' : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // call your API here
      toast.success('Signed in');
    } catch {
      toast.error('Couldn’t sign in', { description: 'Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card variant="outlined" padding="lg" style={{ width: '100%', maxWidth: 400 }}>
        <Form onSubmit={onSubmit}>
          <VStack gap={1}>
            <Text variant="title2" as="h1">Sign in</Text>
            <Text variant="subheadline" color="secondary">Welcome back.</Text>
          </VStack>
          <VStack gap={4}>
            <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
            <PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />
            <HStack justify="between">
              <Checkbox label="Remember me" defaultChecked />
              <a href="/forgot">Forgot password?</a>
            </HStack>
          </VStack>
          <Button type="submit" size="lg" fullWidth loading={loading}>Sign in</Button>
        </Form>
      </Card>
    </main>
  );
}
```

## 3. Dashboard (web)

```tsx
// @check web dashboard.tsx
'use client';
import { useState } from 'react';
import {
  Alert, Badge, Button, Card, EmptyState, FolderIcon, HomeIcon, HStack, IconButton, InboxIcon, Menu,
  MoreIcon, PlusIcon, SettingsIcon, Sidebar, Skeleton, Table, Text, TrashIcon, VStack,
} from '@lumen/react';

type Project = { id: string; name: string; owner: string; status: 'Active' | 'Paused'; tasks: number };

export default function Dashboard({ projects, loading, error }: { projects: Project[]; loading: boolean; error?: string }) {
  const [nav, setNav] = useState('projects');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', minHeight: '100dvh' }}>
      <aside style={{ padding: 16, background: 'var(--lm-color-background-secondary)' }}>
        <Sidebar
          value={nav}
          onValueChange={setNav}
          sections={[
            { items: [{ value: 'home', label: 'Home', icon: <HomeIcon /> }, { value: 'inbox', label: 'Inbox', icon: <InboxIcon />, count: 4 }, { value: 'projects', label: 'Projects', icon: <FolderIcon /> }] },
            { heading: 'Workspace', items: [{ value: 'settings', label: 'Settings', icon: <SettingsIcon /> }] },
          ]}
        />
      </aside>
      <main style={{ padding: 32, maxWidth: 1080, width: '100%' }}>
        <VStack gap={8}>
          <HStack justify="between" wrap gap={3}>
            <Text variant="title1" as="h1">Projects</Text>
            <Button leadingIcon={<PlusIcon />}>New project</Button>
          </HStack>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[['Active', '12'], ['Tasks due', '38'], ['Members', '9']].map(([label, value]) => (
              <Card key={label} variant="filled" padding="sm">
                <Text variant="footnote" color="secondary">{label}</Text>
                <Text variant="title1" tabular>{value}</Text>
              </Card>
            ))}
          </div>

          {error ? (
            <Alert tone="danger" title="Couldn’t load projects" actions={<Button size="sm" variant="gray">Try again</Button>}>{error}</Alert>
          ) : loading ? (
            <VStack gap={2}>{[0, 1, 2].map((i) => <Skeleton key={i} height={52} />)}</VStack>
          ) : (
            <Table<Project>
              caption="Projects"
              rows={projects}
              rowKey={(p) => p.id}
              empty={<EmptyState icon={<FolderIcon />} title="No projects yet" description="Create one to get started." actions={<Button>New project</Button>} />}
              columns={[
                { key: 'name', header: 'Name', render: (p) => <Text variant="subheadline" weight="medium">{p.name}</Text> },
                { key: 'owner', header: 'Owner', render: (p) => <span className="lm-table__muted">{p.owner}</span> },
                { key: 'status', header: 'Status', render: (p) => <Badge dot tone={p.status === 'Active' ? 'success' : 'neutral'}>{p.status}</Badge> },
                { key: 'tasks', header: 'Tasks', align: 'end' },
                {
                  key: 'menu', header: <span className="lm-visually-hidden">Actions</span>, align: 'end', width: 56,
                  render: (p) => (
                    <Menu
                      align="end"
                      trigger={(t) => <IconButton {...t} ref={t.ref as never} label={`Actions for ${p.name}`} variant="plain" size="sm" icon={<MoreIcon />} />}
                      items={[{ label: 'Open' }, { type: 'separator' }, { label: 'Delete', icon: <TrashIcon />, destructive: true }]}
                    />
                  ),
                },
              ]}
            />
          )}
        </VStack>
      </main>
    </div>
  );
}
```

## 4. Settings screen with tab bar (React Native)

```tsx
// @check native settings-screen.tsx
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Avatar, List, ListIcon, ListItem, ListSection, SearchField, Switch, TabBar, Text, useTheme,
} from '@lumen/react-native';
import { BellIcon, HomeIcon, MoonIcon, UserIcon } from '@lumen/icons/native';

export function SettingsScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const c = theme.colors.label.primary;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 64, gap: 28 }}>
        <Text variant="largeTitle">Settings</Text>
        <SearchField />
        <List>
          <ListItem leading={<Avatar name="Jane Appleseed" size="lg" />} title="Jane Appleseed" subtitle="Account & security" onPress={() => {}} />
        </List>
        <ListSection header="General">
          <List>
            <ListItem
              leading={<ListIcon><BellIcon size={18} color={c} /></ListIcon>}
              title="Notifications"
              trailing={<Switch value={notifications} onValueChange={setNotifications} accessibilityLabel="Notifications" />}
            />
            <ListItem
              leading={<ListIcon><MoonIcon size={18} color={c} /></ListIcon>}
              title="Dark appearance"
              trailing={<Switch value={theme.scheme === 'dark'} onValueChange={(on) => theme.setPreference(on ? 'dark' : 'light')} accessibilityLabel="Dark appearance" />}
            />
          </List>
        </ListSection>
        <List>
          <ListItem title="Sign out" destructive onPress={() => {}} />
        </List>
      </ScrollView>
      <TabBar
        value={tab}
        onValueChange={setTab}
        items={[
          { value: 'home', label: 'Home', icon: (color) => <HomeIcon color={color} /> },
          { value: 'profile', label: 'Profile', icon: (color) => <UserIcon color={color} />, badge: 1 },
        ]}
      />
    </View>
  );
}
```

## 5. Data-state helper (web)

```tsx
// @check web data-state.tsx
import type { ReactNode } from 'react';
import { Alert, Button, EmptyState, InboxIcon, Skeleton, VStack } from '@lumen/react';

/** Render loading, error, empty and ready states consistently. */
export function DataState<T>({
  loading, error, items, onRetry, emptyTitle, emptyAction, children,
}: {
  loading: boolean;
  error?: string;
  items: T[];
  onRetry?: () => void;
  emptyTitle: string;
  emptyAction?: ReactNode;
  children: (items: T[]) => ReactNode;
}) {
  if (loading) return <VStack gap={2}>{[0, 1, 2].map((i) => <Skeleton key={i} height={52} />)}</VStack>;
  if (error)
    return (
      <Alert tone="danger" title="Something went wrong" actions={onRetry && <Button size="sm" variant="gray" onClick={onRetry}>Try again</Button>}>
        {error}
      </Alert>
    );
  if (items.length === 0) return <EmptyState icon={<InboxIcon />} title={emptyTitle} actions={emptyAction} />;
  return <>{children(items)}</>;
}
```
