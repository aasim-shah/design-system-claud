import { useState, type ReactNode } from 'react';
import {
  borderRules,
  componentSpecs,
  elevationUsage,
  layoutRules,
  motionUsage,
  radius,
  radiusUsage,
  spacing,
  spacingUsage,
  stateRules,
  zIndexUsage,
  type ComponentSpec,
  type UsageRow,
} from '@lumen/tokens';
import { Button, Card, HStack, Table, Tabs, Text, VStack } from '@lumen/react';
import { Section } from './layout';

type Visual = (row: UsageRow, i: number) => ReactNode;

function UsageTable({ rows, visual, visualHeader = 'Sample' }: { rows: UsageRow[]; visual?: Visual; visualHeader?: string }) {
  const data = rows.map((r, i) => ({ ...r, i }));
  return (
    <Table<(typeof data)[number]>
      rowKey={(r) => r.token}
      rows={data}
      columns={[
        ...(visual ? [{ key: 'visual', header: visualHeader, width: 120, render: (r: (typeof data)[number]) => visual(r, r.i) }] : []),
        { key: 'token', header: 'Token', render: (r) => <Text variant="subheadline" weight="medium" mono>{r.token}</Text> },
        { key: 'value', header: 'Value', render: (r) => <span className="lm-table__muted">{r.value}</span> },
        { key: 'use', header: 'Use for', render: (r) => <span className="sc-wrap">{r.use}</span> },
      ]}
    />
  );
}

const spacingKeys = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24] as const;
const radiusValues = [radius.xs, radius.sm, radius.md, radius.lg, radius.xl, radius['2xl'], 999, 12];

function Anatomy() {
  return (
    <div className="sc-grid sc-grid--3">
      <Card variant="outlined">
        <VStack gap={3}>
          <Text variant="headline">Button · md</Text>
          <div className="sc-anatomy">
            <span className="sc-anatomy__pad">20</span>
            <Button tabIndex={-1}>Continue</Button>
            <span className="sc-anatomy__pad">20</span>
          </div>
          <Text variant="footnote" color="secondary">
            44 tall · 20 side padding · radius 12 · 17pt semibold. Icon gap 8.
          </Text>
        </VStack>
      </Card>
      <Card variant="outlined">
        <VStack gap={3}>
          <Text variant="headline">Nested radius</Text>
          <div className="sc-nest">
            <div className="sc-nest__inner">radius 20 − padding 12 = 8</div>
          </div>
          <Text variant="footnote" color="secondary">
            Inner corners = outer radius − padding, so curves stay parallel.
          </Text>
        </VStack>
      </Card>
      <Card variant="outlined">
        <VStack gap={3}>
          <Text variant="headline">Form rhythm</Text>
          <div className="sc-rhythm">
            <span>Label</span>
            <i>6</i>
            <b />
            <i>6</i>
            <span className="sc-rhythm__help">Help text</span>
            <i className="sc-rhythm__big">16</i>
            <span>Label</span>
            <i>6</i>
            <b />
          </div>
          <Text variant="footnote" color="secondary">
            6 between a label, its field and its help text. 16 between fields, 24 between sections.
          </Text>
        </VStack>
      </Card>
    </div>
  );
}

function ComponentTable() {
  return (
    <Table<ComponentSpec & Record<string, unknown>>
      rowKey={(r) => r.component}
      rows={componentSpecs as (ComponentSpec & Record<string, unknown>)[]}
      columns={[
        { key: 'component', header: 'Component', render: (r) => <Text variant="subheadline" weight="medium">{r.component}</Text> },
        { key: 'height', header: 'Height', render: (r) => <span className="lm-table__muted">{r.height}</span> },
        { key: 'padding', header: 'Padding', render: (r) => <span className="lm-table__muted">{r.padding}</span> },
        { key: 'radius', header: 'Radius', render: (r) => <span className="lm-table__muted">{r.radius}</span> },
        { key: 'type', header: 'Type', render: (r) => <span className="lm-table__muted">{r.type}</span> },
        { key: 'notes', header: 'Notes', render: (r) => <span className="sc-wrap">{r.notes}</span> },
      ]}
    />
  );
}

export function SpecsSection() {
  const [tab, setTab] = useState('spacing');
  return (
    <Section
      id="specs"
      eyebrow="Specs"
      title="Every measurement, written down."
      lead="Spacing, margins, radius, borders, elevation, states, motion and the exact size of every component. All values are in px (pt on iOS, dp on Android) and come from the same token files the components use."
    >
      <VStack gap={10}>
        <Anatomy />
        <Tabs
          label="Spec categories"
          value={tab}
          onValueChange={setTab}
          items={[
            {
              value: 'spacing',
              label: 'Spacing',
              content: (
                <UsageTable
                  rows={spacingUsage}
                  visual={(_, i) => <span className="sc-spec-bar" style={{ width: spacing[spacingKeys[i]] }} />}
                />
              ),
            },
            { value: 'layout', label: 'Layout & margins', content: <UsageTable rows={layoutRules} /> },
            {
              value: 'radius',
              label: 'Radius',
              content: (
                <UsageTable
                  rows={radiusUsage}
                  visual={(_, i) => <span className="sc-spec-radius" style={{ borderRadius: radiusValues[i] }} />}
                />
              ),
            },
            { value: 'borders', label: 'Borders & focus', content: <UsageTable rows={borderRules} /> },
            {
              value: 'elevation',
              label: 'Elevation',
              content: <UsageTable rows={elevationUsage} visual={(_, i) => <span className="sc-spec-shadow" style={{ boxShadow: `var(--lm-shadow-${i})` }} />} />,
            },
            { value: 'states', label: 'States', content: <UsageTable rows={stateRules} /> },
            { value: 'motion', label: 'Motion', content: <UsageTable rows={motionUsage} /> },
            { value: 'layers', label: 'Layers', content: <UsageTable rows={zIndexUsage} /> },
            { value: 'components', label: 'Components', content: <ComponentTable /> },
          ]}
        />
        <HStack gap={2}>
          <Text variant="footnote" color="secondary">
            The same tables live in the repo as docs/SPECS.md and in code as exports from @lumen/tokens.
          </Text>
        </HStack>
      </VStack>
    </Section>
  );
}
