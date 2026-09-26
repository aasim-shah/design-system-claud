import { useMemo, useState } from 'react';
import {
  BellIcon,
  Card,
  EmptyState,
  HStack,
  IconCircle,
  LumenIcon,
  MessageIcon,
  SearchField,
  SearchIcon,
  SegmentedControl,
  ShieldIcon,
  SparkleIcon,
  Text,
  useToast,
  VStack,
  WifiIcon,
  iconCategories,
  type IconName,
} from '@lumen/react';
import { Section } from './layout';

export function IconsSection() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [weight, setWeight] = useState('1.75');
  const groups = useMemo(
    () =>
      Object.entries(iconCategories)
        .map(([cat, names]) => [cat, names.filter((n) => n.includes(q.trim().toLowerCase()))] as const)
        .filter(([, names]) => names.length > 0),
    [q],
  );

  return (
    <Section
      id="icons"
      eyebrow="Icons"
      title="Lumen Rounded."
      lead="85 icons drawn for this system on a 24px grid: 1.75 stroke, round ends, soft 2–3.5 corners and small filled dots as a signature detail. The same set ships for React and React Native, and circles hold them wherever an icon needs a container."
    >
      <VStack gap={10}>
        <div className="sc-grid sc-grid--4">
          {(
            [
              ['soft', 'Soft', 'Default. List rows, empty states.'],
              ['outline', 'Outline', 'On busy or tinted surfaces.'],
              ['solid', 'Solid', 'Primary or selected items.'],
              ['tinted', 'Tinted', 'Status: pair with success, warning or danger.'],
            ] as const
          ).map(([variant, name, use]) => (
            <Card key={variant} variant="outlined" padding="sm">
              <VStack gap={3}>
                <HStack gap={2}>
                  <IconCircle variant={variant} size="lg" icon={<WifiIcon />} color={variant === 'tinted' ? 'var(--lm-color-success)' : undefined} />
                  <IconCircle variant={variant} icon={<BellIcon />} color={variant === 'tinted' ? 'var(--lm-color-warning)' : undefined} />
                  <IconCircle variant={variant} size="sm" icon={<ShieldIcon />} color={variant === 'tinted' ? 'var(--lm-color-danger)' : undefined} />
                  <IconCircle variant={variant} size="xs" icon={<MessageIcon />} />
                </HStack>
                <VStack gap={0.5}>
                  <Text variant="headline">{name}</Text>
                  <Text variant="footnote" color="secondary">
                    {use}
                  </Text>
                </VStack>
              </VStack>
            </Card>
          ))}
        </div>

        <HStack justify="between" wrap gap={3}>
          <div style={{ width: 280, maxWidth: '100%' }}>
            <SearchField placeholder="Search 85 icons" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <SegmentedControl
            label="Stroke"
            value={weight}
            onValueChange={setWeight}
            options={[
              { value: '1.5', label: 'Light 1.5' },
              { value: '1.75', label: 'Regular 1.75' },
              { value: '2.25', label: 'Bold 2.25' },
            ]}
          />
        </HStack>

        {groups.length === 0 ? (
          <EmptyState icon={<SearchIcon />} title="No icons found" description={`Nothing is called “${q}”. Try “arrow” or “user”.`} />
        ) : (
          groups.map(([cat, names]) => (
            <VStack key={cat} gap={3}>
              <Text variant="footnote" color="secondary" weight="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {cat} · {names.length}
              </Text>
              <div className="sc-icons">
                {names.map((n: IconName) => (
                  <button
                    key={n}
                    type="button"
                    className="sc-icon"
                    title={`Copy <${n.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())}Icon />`}
                    onClick={() => {
                      const jsx = `<${n.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())}Icon />`;
                      navigator.clipboard?.writeText(jsx).then(
                        () => toast.success('Copied', { description: jsx }),
                        () => toast.show({ title: jsx }),
                      );
                    }}
                  >
                    <LumenIcon name={n} strokeWidth={Number(weight)} />
                    <span>{n}</span>
                  </button>
                ))}
              </div>
            </VStack>
          ))
        )}

        <Card variant="filled">
          <HStack gap={4} align="start">
            <IconCircle variant="solid" size="lg" icon={<SparkleIcon />} />
            <VStack gap={1}>
              <Text variant="headline">Use</Text>
              <Text variant="subheadline" color="secondary">
                Web: <Text as="span" mono>{'import { HomeIcon } from \'@lumen/react\''}</Text> · React Native:{' '}
                <Text as="span" mono>{'import { HomeIcon } from \'@lumen/icons/native\''}</Text> (needs react-native-svg). Icons inherit text color and
                scale with font size; pass <Text as="span" mono>size</Text> and <Text as="span" mono>strokeWidth</Text> to adjust.
              </Text>
            </VStack>
          </HStack>
        </Card>
      </VStack>
    </Section>
  );
}
