import {
  brandAccent,
  brandLabel,
  brandNames,
  brandPresets,
  contrastRatio,
  type BrandName,
} from '@lumen/tokens';
import {
  Badge,
  BellIcon,
  Button,
  Card,
  Checkbox,
  Chip,
  HStack,
  IconCircle,
  Progress,
  Switch,
  Text,
  VStack,
} from '@lumen/react';
import { Section } from './layout';

const swatch = (b: BrandName) => brandAccent(b, 'light').default;

/** Compact brand dots for the header. */
export function BrandPicker({ value, onChange }: { value: BrandName; onChange: (b: BrandName) => void }) {
  return (
    <HStack gap={1.5} className="sc-brands" role="radiogroup" aria-label="Brand color">
      {brandNames.map((b) => (
        <button
          key={b}
          type="button"
          role="radio"
          aria-checked={value === b}
          aria-label={brandLabel(b)}
          title={brandLabel(b)}
          className="sc-brand-dot"
          style={{ background: swatch(b) }}
          onClick={() => onChange(b)}
        />
      ))}
    </HStack>
  );
}

function BrandCard({ name, active, onPick }: { name: BrandName; active: boolean; onPick: () => void }) {
  const light = brandAccent(name, 'light');
  const ratio = contrastRatio(light.default, '#FFFFFF');
  return (
    <div data-brand={name} className="sc-brand-card" data-active={active ? '' : undefined}>
      <Card variant="outlined">
        <VStack gap={4}>
          <HStack justify="between">
            <HStack gap={3}>
              <IconCircle variant="solid" icon={<BellIcon />} />
              <VStack>
                <Text variant="headline">{brandLabel(name)}</Text>
                <Text variant="caption1" color="secondary" mono>
                  {light.default} · {ratio.toFixed(1)}:1
                </Text>
              </VStack>
            </HStack>
            <Badge variant="solid" size="sm">
              3
            </Badge>
          </HStack>
          <HStack gap={2} wrap>
            <Button size="sm" onClick={onPick}>
              {active ? 'In use' : 'Use this'}
            </Button>
            <Button size="sm" variant="tinted">
              Tinted
            </Button>
            <Button size="sm" variant="plain">
              Link
            </Button>
          </HStack>
          <HStack justify="between">
            <Checkbox label="Remember" defaultChecked />
            <Switch defaultChecked aria-label={`${brandLabel(name)} switch`} />
          </HStack>
          <HStack gap={2}>
            <Chip selected onSelectedChange={() => {}}>
              Selected
            </Chip>
            <Chip selected={false} onSelectedChange={() => {}}>
              Idle
            </Chip>
          </HStack>
          <Progress value={64} label="Progress" />
        </VStack>
      </Card>
    </div>
  );
}

export function BrandsSection({ brand, setBrand }: { brand: BrandName; setBrand: (b: BrandName) => void }) {
  return (
    <Section
      id="brands"
      eyebrow="Brands"
      title="One system, a color per product."
      lead="Every app keeps the same calm neutrals, type and shapes. Only the accent changes: buttons, switches, selection, focus rings, tabs and progress. Light shades pass WCAG AA on white; dark shades are the vivid system hues."
    >
      <VStack gap={8}>
        <div className="sc-brand-grid">
          {brandNames.map((b) => (
            <BrandCard key={b} name={b} active={b === brand} onPick={() => setBrand(b)} />
          ))}
        </div>
        <Card variant="filled">
          <VStack gap={3}>
            <Text variant="headline">Use it in an app</Text>
            <pre className="sc-code">{`// Next.js — app/layout.tsx (no JavaScript needed, no flash)
<html lang="en" data-brand="orange">

// …or with the provider
<ThemeProvider brand="orange">

// React Native
<ThemeProvider brand="orange">

// A color that isn't a preset
<ThemeProvider accent="#FF5A1F">          // pressed, tint & label derived
<ThemeProvider accent={{ light: '#C95100', dark: '#FF9F0A' }}>`}</pre>
            <Text variant="footnote" color="secondary">
              Presets: {Object.keys(brandPresets).join(', ')} — or graphite (monochrome, the default). `data-brand` also works on any element, so
              one page can host several brands.
            </Text>
          </VStack>
        </Card>
      </VStack>
    </Section>
  );
}
