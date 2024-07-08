'use client';

import { Button, Container, Group, Modal, SimpleGrid, Text, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '@/lib/client_functions';
import { DocumentCard } from '@/components/Document';
import { setDocs, setRename } from '@/store/features/documentSlice';
import { RootState } from '@/store/store';

const DocumentsPage = () => {
  const router = useRouter();
  const { rename, docs } = useSelector((state: RootState) => state.document);
  const dispatch = useDispatch();

  const getDocuments = async () => {
    const res = await apiCall('/api/documents');
    dispatch(setDocs(res?.data));
  };

  const updateDocument = async (updatedData: any) => {
    await apiCall('/api/documents', updatedData, 'PUT');
    getDocuments();
  };

  const deleteDocument = async (updatedData: any) => {
    await apiCall(`/api/documents?_id=${updatedData?._id}`, null, 'DELETE');
    getDocuments();
  };

  const goTo = (_id: string) => {
    router.push(`/documents/${_id}`);
  };

  const onRename = (_id: string, title: string) => {
    if (_id) {
      dispatch(setRename({ _id, title }));
    }
  };

  const renameDocument = async () => {
    await apiCall('/api/documents', { title: rename?.title, _id: rename?._id }, 'PUT');
    getDocuments();
    dispatch(setRename({ _id: '', title: '' }));
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <>
      <Container px={0}>
        <Text my="xs" fw={700}>
          Recent Documents
        </Text>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }}>
          {docs?.map((doc) => (
            <DocumentCard
              key={String(doc?._id)}
              doc={doc}
              goTo={goTo}
              onRename={onRename}
              updateDocument={updateDocument}
              deleteDocument={deleteDocument}
            />
          ))}
        </SimpleGrid>
      </Container>
      <Modal
        opened={!!rename._id}
        onClose={() => dispatch(setRename({ _id: '', title: '' }))}
        title="Rename"
      >
        <TextInput
          value={rename?.title}
          onChange={(e) => dispatch(setRename({ ...rename, title: e.target.value }))}
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
