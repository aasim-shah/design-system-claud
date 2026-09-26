# React Native components (`@lumen/react-native`)

Import components from `@lumen/react-native` and icons from `@lumen/icons/native` (needs
`react-native-svg`). Wrap the app in `<ThemeProvider brand="…">` and `<ToastProvider>`. For exact
props, read `node_modules/@lumen/react-native/dist/components/<File>.d.ts`.

The names and props mirror the web package. The differences:
- Handlers are `onPress` and `onValueChange` / `onCheckedChange`.
- Icons that need the current color are passed as render functions: `(color) => <HomeIcon color={color} />`.
- Styling uses `theme` objects instead of CSS variables.

## Theme & styling

```tsx
import { ThemeProvider, useTheme, makeStyles, textStyle, navigationTheme } from '@lumen/react-native';

<ThemeProvider brand="orange">{app}</ThemeProvider>          // follows the OS light/dark automatically
const theme = useTheme();                                    // theme.colors, spacing, radius, scheme, setPreference
const useStyles = makeStyles((t) => ({
  panel: { padding: t.spacing[6], borderRadius: 24, backgroundColor: t.colors.background.groupedSecondary },
  shadow: t.elevation.native(2, t.scheme),
}));
<NavigationContainer theme={navigationTheme(theme)}>        // React Navigation
```
Screens with grouped content use `backgroundColor: theme.colors.background.grouped`.

## Components

```tsx
<Text variant="largeTitle">Settings</Text>   <Text variant="footnote" color="secondary">…</Text>
<VStack gap={4} padding={4}>…</VStack>   <HStack gap={2} justify="between">…</HStack>

<Button onPress={save} loading={saving}>Save</Button>
<Button variant="gray" leadingIcon={(c) => <PlusIcon size={18} color={c} />}>Add</Button>
<Button tone="danger" fullWidth size="lg">Delete account</Button>
<IconButton label="Share" icon={(c) => <ShareIcon size={20} color={c} />} />

<TextField label="Email" keyboardType="email-address" autoCapitalize="none" error={err} clearable />
<PasswordField label="Password" />      <SearchField value={q} onChangeText={setQ} />
<PinInput length={6} onComplete={verify} error={codeError} />

<Switch value={on} onValueChange={setOn} accessibilityLabel="Wi-Fi" />
<Checkbox label="Remember me" checked={c} onCheckedChange={setC} />
<RadioGroup value={plan} onValueChange={setPlan} options={[{ value: 'pro', label: 'Pro' }]} />
<SegmentedControl value={range} onValueChange={setRange} options={[{ value: 'week', label: 'Week' }]} />
<ChipGroup><Chip label="Open" selected={s} onSelectedChange={setS} /></ChipGroup>
<Stepper label="Seats" value={n} onValueChange={setN} min={1} />

<ListSection header="Connectivity">
  <List>
    <ListItem leading={<ListIcon><WifiIcon size={18} color={theme.colors.label.primary} /></ListIcon>} title="Wi-Fi"
              trailing={<Switch value={wifi} onValueChange={setWifi} />} />
    <ListItem title="Storage" detail="48 GB" onPress={openStorage} />
    <ListItem title="Sign Out" destructive onPress={signOut} />
  </List>
</ListSection>

<Card onPress={open}>…</Card>   <Badge tone="success" dot>Paid</Badge>   <Avatar name="Jane Appleseed" source={{ uri }} />
<Alert tone="warning" title="Storage almost full">You've used 92%.</Alert>
<EmptyState icon={<FolderIcon size={26} color={theme.colors.label.secondary} />} title="No projects" actions={<Button>New</Button>} />
<IconCircle variant="tinted" color={theme.colors.success.default} icon={(c, s) => <CheckIcon color={c} size={s} />} />
<Progress value={64} />   <Spinner />   <Skeleton shape="text" width="60%" />   <Divider />
<Accordion items={[{ value: 'a', title: 'Question', content: 'Answer' }]} />
<Tabs items={[{ value: 'a', label: 'Overview' }]} value={t} onValueChange={setT} />
<Steps steps={['Cart', 'Shipping', 'Pay']} current={1} />
<Breadcrumbs items={[{ label: 'Projects', onPress: back }, { label: 'Redesign' }]} />
<TabBar value={tab} onValueChange={setTab} items={[{ value: 'home', label: 'Home', icon: (c) => <HomeIcon color={c} /> }]} />

<Sheet open={o} onClose={close} title="Edit profile">…</Sheet>           // swipe down to dismiss
<Dialog open={o} onClose={close} title="Sign out?" description="…"
        actions={[<Button key="c" variant="gray" style={{ flex: 1 }} fullWidth onPress={close}>Cancel</Button>,
                  <Button key="s" tone="danger" style={{ flex: 1 }} fullWidth onPress={signOut}>Sign Out</Button>]} />
<ActionSheet open={o} onClose={close} actions={[{ label: 'Share', onSelect: share }, { label: 'Delete', destructive: true }]} />
const toast = useToast(); toast.success('Saved');
```

## Notes
- **Safe areas:** `Sheet`, `ActionSheet`, `TabBar` and `ToastProvider` take `bottomInset` / `topInset`. Pass values from `react-native-safe-area-context` if the app uses it.
- **Fallback glyphs:** `Glyph` (chevron, check, close, plus, minus, search) is a dependency-free fallback. Prefer `@lumen/icons/native`.
- **React Navigation:** use Lumen `TabBar` through the navigator's `tabBar` prop, and headers styled by `navigationTheme`.
