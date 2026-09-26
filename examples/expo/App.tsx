// App.tsx — Expo / React Native
import { useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Glyph,
  List,
  ListIcon,
  ListItem,
  ListSection,
  SearchField,
  SegmentedControl,
  Sheet,
  Switch,
  Text,
  TextField,
  ThemeProvider,
  ToastProvider,
  VStack,
  HStack,
  useTheme,
  useToast,
} from '@lumen/react-native';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Home />
      </ToastProvider>
    </ThemeProvider>
  );
}

function Home() {
  const theme = useTheme();
  const toast = useToast();
  const [wifi, setWifi] = useState(true);
  const [range, setRange] = useState('week');
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <StatusBar barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={{ backgroundColor: theme.colors.background.grouped }}
        contentContainerStyle={{ padding: 16, paddingTop: 72, gap: 28 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text variant="largeTitle">Settings</Text>
        <SearchField />

        <List>
          <ListItem
            leading={<Avatar name="Jane Appleseed" size="lg" />}
            title={<Text variant="title3">Jane Appleseed</Text>}
            subtitle="Account, Cloud & Media"
            onPress={() => setSheet(true)}
          />
        </List>

        <ListSection header="Connectivity" footer="Lumen rows, switches and separators match iOS Settings.">
          <List>
            <ListItem
              leading={
                <ListIcon color={theme.palette.blue}>
                  <Glyph name="search" size={16} color="#fff" />
                </ListIcon>
              }
              title="Wi-Fi"
              trailing={<Switch value={wifi} onValueChange={setWifi} accessibilityLabel="Wi-Fi" />}
            />
            <ListItem title="Storage" detail="48.2 GB" onPress={() => {}} />
            <ListItem title="Sign Out" destructive onPress={() => setDialog(true)} />
          </List>
        </ListSection>

        <SegmentedControl
          value={range}
          onValueChange={setRange}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />

        <Card>
          <VStack gap={3}>
            <HStack justify="between">
              <Text variant="headline">Pro plan</Text>
              <Badge tone="success" dot>
                Active
              </Badge>
            </HStack>
            <Text variant="subheadline" color="secondary">
              Renews on October 26.
            </Text>
            <Button fullWidth onPress={() => toast.success('Plan updated')}>
              Manage
            </Button>
          </VStack>
        </Card>
      </ScrollView>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Edit Profile">
        <VStack gap={4}>
          <TextField label="Name" defaultValue="Jane Appleseed" clearable />
          <Button fullWidth size="lg" onPress={() => setSheet(false)}>
            Done
          </Button>
        </VStack>
      </Sheet>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Sign out?"
        description="You can sign back in at any time."
        actions={[
          <Button key="c" variant="gray" style={{ flex: 1 }} fullWidth onPress={() => setDialog(false)}>
            Cancel
          </Button>,
          <Button key="s" tone="danger" style={{ flex: 1 }} fullWidth onPress={() => setDialog(false)}>
            Sign Out
          </Button>,
        ]}
      />
    </>
  );
}
