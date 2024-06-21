import { Container, Paper, TextInput } from '@mantine/core';
import React from 'react';

export const NewNote = ({ newNote }: { newNote: any }) => (
  <Container px={0} size="xs">
    <Paper mb="xl" shadow="xl" p="md" withBorder>
      <TextInput
        placeholder="Take a note..."
        styles={{
          input: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 16,
            paddingInline: 0,
            fontWeight: 'bold',
          },
        }}
        onClick={newNote}
      />
    </Paper>
  </Container>
);
