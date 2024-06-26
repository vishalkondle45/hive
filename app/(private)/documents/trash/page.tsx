'use client';

import { Button, Container, Group, Modal, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/client_functions';
import { DocumentType } from '@/models/Document';
import { DocumentCard } from '@/components/Document';

const DocumentsPage = () => {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentType[]>([]);
  const [rename, setRename] = useState({ _id: '', title: '' });

  const getDocuments = async () => {
    const res = await apiCall('/api/documents?isTrashed=true');
    setDocs(res?.data);
  };

  const updateDocument = async (updatedData: any) => {
    await apiCall('/api/documents', updatedData, 'PUT');
    getDocuments();
  };

  const goTo = (_id: string) => {
    router.push(`/documents/${_id}`);
  };

  const onRename = (_id: string, title: string) => {
    if (_id) {
      setRename({ _id, title });
    }
  };

  const renameDocument = async () => {
    await apiCall('/api/documents', { title: rename?.title, _id: rename?._id }, 'PUT');
    getDocuments();
    setRename({ _id: '', title: '' });
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <>
      <Container px={0}>
        <Text my="xs" fw={700}>
          Trashed Documents
        </Text>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }}>
          {docs?.map((doc) => (
            <DocumentCard
              doc={doc}
              goTo={goTo}
              onRename={onRename}
              updateDocument={updateDocument}
            />
          ))}
        </SimpleGrid>
      </Container>
      <Modal opened={!!rename._id} onClose={() => setRename({ _id: '', title: '' })} title="Rename">
        <TextInput
          value={rename?.title}
          onChange={(e) => setRename({ ...rename, title: e.target.value })}
          data-autofocus
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => e.key === 'Enter' && renameDocument()}
        />
        <Group mt="md" justify="right">
          <Button color="red" onClick={() => setRename({ _id: '', title: '' })}>
            Cancel
          </Button>
          <Button color="teal" onClick={renameDocument}>
            Ok
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DocumentsPage;
