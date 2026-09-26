import { type ReactNode } from 'react';
import { Text, VStack } from '@lumen/react';

export function Section({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead?: string; children: ReactNode }) {
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

export function Demo({ label, children, grouped }: { label?: string; children: ReactNode; grouped?: boolean }) {
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

