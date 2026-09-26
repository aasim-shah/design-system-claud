# Web components (`@lumen/react`)

Everything imports from `@lumen/react`, icons included. This file has the key props and a short
example for each component. For the full prop types, read
`node_modules/@lumen/react/dist/components/<File>.d.ts`.

## Contents
Text & layout · Buttons · Text entry · Choices · Forms · Lists · Surfaces & status · Navigation ·
Overlays · Data · Icons · Theme

---

## Text & layout

```tsx
<Text variant="title1">Invoices</Text>                         // h2 by default; pass as="h1" when needed
<Text variant="subheadline" color="secondary">Due in 3 days</Text>
<Text variant="body" weight="semibold" truncate tabular>{amount}</Text>
```
- `variant`: display · largeTitle · title1 · title2 · title3 · headline · body · callout · subheadline · footnote · caption1 · caption2
- `color`: primary · secondary · tertiary · accent · success · warning · danger
- Other props: `weight` (regular…heavy), `align`, `truncate`, `tabular`, `balance`, `mono`, `as`

```tsx
<VStack gap={4}>…</VStack>                 // column, 16px gap
<HStack gap={2} justify="between" wrap>…</HStack>
```
`gap` takes a 4pt-grid key: 0.5 · 1 · 1.5 · 2 · 3 · 4 · 5 · 6 · 8 · 10 · 12 · 16 · 24. It also accepts a CSS length.

## Buttons

```tsx
<Button onClick={save} loading={saving}>Save</Button>          // filled, accent: the one primary action
<Button variant="gray">Cancel</Button>
<Button variant="tinted" leadingIcon={<PlusIcon />}>Add</Button>
<Button tone="danger">Delete</Button>
<Button href="/pricing" variant="plain">See pricing</Button>   // renders <a>; `disabled` drops the href and sets aria-disabled
<Button size="lg" fullWidth shape="capsule">Get started</Button>
<IconButton label="Share" icon={<ShareIcon />} />              // variant gray by default; label required
```
- `variant`: filled · tinted · gray · outline · plain
- `tone`: accent · neutral · danger · success
- `size`: sm (32) · md (44) · lg (52)

## Text entry

```tsx
<TextField label="Email" type="email" placeholder="name@company.com" value={v} onChange={e => setV(e.target.value)}
           error={err} description="We'll never share it." clearable />
<TextField label="Amount" leading="$" trailing="USD" inputMode="decimal" />
<PasswordField label="Password" autoComplete="new-password" showStrength />
<SearchField placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
<TextArea label="Notes" rows={4} />
<Select label="Country" placeholder="Choose…" options={[{ value: 'pk', label: 'Pakistan' }]} />
<PinInput length={6} groupSize={3} onComplete={verify} error={codeError} />
```
- `size`: sm · md · lg
- Errors: pass `error` as a message saying how to fix the problem. It also marks the field invalid.

## Choices

```tsx
<Switch checked={on} onCheckedChange={setOn} aria-label="Wi-Fi" />         // tone="success" for iOS green
<Checkbox label="Remember me" checked={c} onCheckedChange={setC} description="…" />
<RadioGroup value={plan} onValueChange={setPlan} label="Plan">
  <Radio value="starter" label="Starter" description="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
<SegmentedControl value={range} onValueChange={setRange} options={[{ value: 'week', label: 'Week' }, …]} fullWidth />
<ChipGroup aria-label="Filters"><Chip selected={s} onSelectedChange={setS}>Open</Chip></ChipGroup>
<Chip onRemove={() => remove(tag)}>{tag}</Chip>                            // removable tag
<Slider value={v} onValueChange={setV} aria-label="Volume" />
<Stepper label="Seats" value={n} onValueChange={setN} min={1} max={50} />
```

## Forms

```tsx
<Form onSubmit={submit}>                     {/* noValidate; show errors via field `error` props */}
  <FormSection title="Account" description="How people see you.">
    <FormRow><TextField label="First name" /><TextField label="Last name" /></FormRow>
    <TextField label="Email" type="email" />
  </FormSection>
  <FormSection title="Photo"><FileDrop label="Avatar" accept="image/*" maxSize={5_000_000} hint="PNG or JPG, up to 5 MB" /></FormSection>
  <FormActions><Button variant="gray" type="reset">Cancel</Button><Button type="submit">Save</Button></FormActions>
</Form>
```
- `FormRow` makes 2 columns (`columns` prop) and stacks on phones.
- `FormActions` right-aligns the buttons.
- Put the submit button last.

## Lists (settings-style)

Use these on a grouped canvas: `className="lm-canvas-grouped"` on the page wrapper, or `bg-background-grouped` with Tailwind.
```tsx
<ListSection header="Connectivity" footer="Explain the section here if needed.">
  <List>
    <ListItem leading={<ListIcon><WifiIcon /></ListIcon>} title="Wi-Fi"
              trailing={<Switch checked={wifi} onCheckedChange={setWifi} aria-label="Wi-Fi" />} />
    <ListItem title="Storage" detail="48 GB" onClick={openStorage} />   // chevron appears automatically
    <ListItem title="English" selected onClick={() => setLang('en')} /> // checkmark
    <ListItem title="Sign Out" destructive onClick={signOut} />
  </List>
</ListSection>
```
- `List` `variant`: inset (default, padded card) · filled · plain
- `ListIcon` is a neutral circle. Pass `color` for a solid colored circle with a white glyph.
- `ListItem` also accepts `href`, `subtitle`, `disabled` and `chevron`.

## Surfaces & status

```tsx
<Card>…</Card>                                  // elevated; also variant="filled" | "grouped" | "outlined"
<Card href="/project/1" padding="lg">…</Card>   // interactive: lifts on hover
<Badge tone="success" dot>Paid</Badge>  <Badge count={12} variant="solid" />
<Alert tone="warning" title="Storage almost full" actions={<Button size="sm">Upgrade</Button>} onDismiss={close}>You've used 92%.</Alert>
<EmptyState icon={<FolderIcon />} title="No projects yet" description="…" actions={<Button>New project</Button>} />
<Progress value={64} />  <Progress />   // indeterminate
<Spinner />  <Skeleton shape="text" width="60%" />  <Skeleton height={120} />
<Avatar name="Jane Appleseed" src={url} status />  <AvatarGroup>…</AvatarGroup>
<IconCircle icon={<BellIcon />} variant="tinted" color="var(--lm-color-warning)" size="lg" />
<Divider />
```
- `Badge` `tone`: accent · success · warning · danger · info · neutral
- `Alert` `tone`: neutral · success · warning · danger
- `Card` `padding`: none · sm · md · lg

## Navigation

```tsx
<NavigationBar title="Inbox" largeTitle="Inbox" leading={<Button variant="plain" size="sm" leadingIcon={<ChevronLeftIcon />}>Back</Button>}
               trailing={<IconButton label="New" variant="plain" icon={<EditIcon />} />} maxWidth={1080} />
<Sidebar value={route} onValueChange={go} sections={[{ items: [{ value: 'home', label: 'Home', icon: <HomeIcon />, href: '/' }] }]} />
<Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: 'Redesign' }]} />
<Tabs value={tab} onValueChange={setTab} items={[{ value: 'overview', label: 'Overview', content: <Overview /> }]} />
<Pagination page={page} pageCount={10} onPageChange={setPage} />
<TabBar fixed value={tab} onValueChange={setTab} items={[{ value: 'home', label: 'Home', icon: <HomeIcon />, badge: 2 }]} />
<Steps current={1} steps={[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Pay' }]} />
```

## Overlays

```tsx
<Dialog open={open} onClose={close} title="Rename project" description="…"
        actions={<><Button variant="gray" onClick={close}>Cancel</Button><Button onClick={save}>Save</Button></>}>
  <TextField aria-label="Name" defaultValue={name} autoFocus />
</Dialog>
<Dialog open={confirm} onClose={…} align="center" title="Delete photo?" description="You can't undo this."
        actions={<><Button variant="gray">Cancel</Button><Button tone="danger">Delete</Button></>} />
<Sheet open={o} onClose={close} title="Filters" headerLeading={<Button variant="plain" size="sm">Reset</Button>}>…</Sheet>
<ActionSheet open={o} onClose={close} title="IMG_2041" actions={[{ label: 'Share…', onSelect: share }, { label: 'Delete', destructive: true, onSelect: del }]} />
<Menu trigger={(p) => <IconButton {...p} ref={p.ref as never} label="More" variant="plain" icon={<MoreIcon />} />}
      items={[{ label: 'Rename', icon: <EditIcon />, onSelect: rename }, { type: 'separator' }, { label: 'Delete', destructive: true }]} />
<Popover padded trigger={(p) => <Button {...p} ref={p.ref as never} variant="gray">Note</Button>}>{(close) => …}</Popover>
<Tooltip content="Copy link"><IconButton label="Copy" icon={<LinkIcon />} /></Tooltip>

const toast = useToast();   // inside <ToastProvider>
toast.success('Saved'); toast.error("Couldn't connect", { description: 'Try again.' });
toast.show({ title: 'Archived', action: <Button size="sm" variant="plain">Undo</Button> });
```
- Dialog and sheet use the native `<dialog>` element: focus trap and Esc work out of the box.
- The `Sheet` is a bottom sheet on phones and a centered card on desktop.

## Data

```tsx
<Table<Invoice> caption="Invoices" rows={rows} rowKey={(r) => r.id} onRowClick={open}
  empty={<EmptyState title="No invoices" />}
  columns={[
    { key: 'customer', header: 'Customer' },
    { key: 'status', header: 'Status', render: (r) => <Badge dot tone={r.paid ? 'success' : 'neutral'}>{r.paid ? 'Paid' : 'Pending'}</Badge> },
    { key: 'amount', header: 'Amount', align: 'end', render: (r) => money(r.amount) },
  ]} />
<Accordion type="single" items={[{ value: 'q1', title: 'What is it?', content: '…' }]} />
<Kbd>⌘</Kbd><Kbd>K</Kbd>
```
Row types must extend `Record<string, unknown>`. Amounts are right-aligned (`align: 'end'`), and the table uses tabular numbers.

## Icons

```tsx
import { HomeIcon, LumenIcon } from '@lumen/react';
<HomeIcon />  <HomeIcon size={20} />  <LumenIcon name="arrow-right" />  <HomeIcon label="Home" />  // label = not decorative
```
Icons inherit the text color and size (1.15em). The stroke is 2 and the corners are rounded. See `icons.md` for all 85 names.

## Theme

```tsx
const { scheme, preference, setPreference } = useTheme();   // 'light' | 'dark' | 'system'
<ThemeProvider brand="orange">…</ThemeProvider>              // or accent="#hex"; optional on web
<ThemeScript />                                              // in <head>: no flash of the wrong theme
```
