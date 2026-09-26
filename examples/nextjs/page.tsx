// app/settings/page.tsx
'use client';

import { useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListSection,
  NavigationBar,
  SegmentedControl,
  Switch,
  TextField,
  VStack,
  useTheme,
  useToast,
  type ColorSchemePreference,
} from '@lumen/react';

export default function SettingsPage() {
  const toast = useToast();
  const { preference, setPreference } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="lm-canvas-grouped" style={{ minHeight: '100dvh' }}>
      <NavigationBar largeTitle="Settings" maxWidth={680} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
        <VStack gap={8}>
          <ListSection header="Appearance">
            <List>
              <ListItem
                title="Theme"
                trailing={
                  <SegmentedControl<ColorSchemePreference>
                    value={preference}
                    onValueChange={setPreference}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'system', label: 'Auto' },
                    ]}
                  />
                }
              />
              <ListItem
                title="Notifications"
                trailing={<Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Notifications" />}
              />
            </List>
          </ListSection>

          <ListSection header="Profile" footer="Your name is visible to people you collaborate with.">
            <VStack gap={4}>
              <TextField label="Display name" placeholder="Jane Appleseed" clearable />
              <Button fullWidth size="lg" onClick={() => toast.success('Profile saved')}>
                Save
              </Button>
            </VStack>
          </ListSection>
        </VStack>
      </main>
    </div>
  );
}
