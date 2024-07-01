'use client';

import {
  ActionIcon,
  ActionIconGroup,
  Button,
  FileInput,
  Group,
  Modal,
  rem,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconFile,
  IconFileUpload,
  IconFolder,
  IconFolderPlus,
  IconFolderSymlink,
  IconTrash,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FileTable from '@/components/Drive/FileTable';
import useFetchData from '@/hooks/useFetchData';
import { apiCall, failure, openModal } from '@/lib/client_functions';

const DrivePage = () => {
  const params = useParams();
  const { data, refetch } = useFetchData(`/api/drive/files?parent=${params?.path}`);
  const { data: path } = useFetchData(`/api/drive/get-path?file=${params?.path}`);

  const [openMoveDialog, setOpenMoveDialog] = useState(false);
  const [__path, __setPath] = useState('');
  const [_path, _setPath] = useState<any[]>();
  const [checked, setChecked] = useState<string[]>([]);
  const [value, setValue] = useState<File[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [folderName, setFolderName] = useState('Untitled folder');
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);

  const handleNewFolder = async () => {
    await apiCall('/api/drive/files', { name: folderName, parent: params.path }, 'POST');
    close();
    setFolderName('Untitled folder');
    refetch();
  };

  const getFile = async (Key: string) => {
    const res = await apiCall(`/api/drive/files/upload?Key=${encodeURI(Key)}`);
    window.open(res?.data, '_blank', 'noopener,noreferrer');
  };

  const deleteFile = async () => {
    await apiCall(`/api/drive/files?_id=${JSON.stringify(checked)}`, null, 'DELETE');
    refetch();
    setChecked([]);
  };

  const handleSubmit = async () => {
    const id = notifications.show({
      loading: true,
      title: 'Uploading files',
      message: 'Please wait while we upload your files',
      autoClose: false,
      withCloseButton: false,
    });
    try {
      const formData = new FormData();
      value.forEach((file) => formData.append('file', file, file.name));
      formData.append('parent', String(params.path));
      await apiCall('/api/drive/files/upload', formData, 'POST');
    } catch (err) {
      failure('Error uploading file');
    } finally {
      setValue([]);
      refetch();
      notifications.update({
        id,
        color: 'green',
        message: 'File uploaded successfully',
        icon: <IconCheck size={rem(20)} />,
        loading: false,
        autoClose: 2000,
      });
    }
  };

  const openFile = (item: any) =>
    item.link ? getFile(item.link) : router.push(`/drive/${item?._id}`);

  const moveFile = async (item: any) => {
    await apiCall('/api/drive/files', item, 'PUT');
    setOpenMoveDialog(false);
    _setPath([]);
    __setPath('');
    refetch();
    setChecked([]);
  };

  const getPath = async () => {
    if (__path) {
      const res = await apiCall(`/api/drive/files?parent=${__path}`);
      _setPath(res?.data);
    } else {
      const res = await apiCall('/api/drive/files');
      _setPath(res?.data);
    }
  };

  useEffect(() => {
    if (value.length) {
      handleSubmit();
    }
  }, [value]);

  useEffect(() => {
    getPath();
  }, [__path]);

  return (
    <>
      <Group my="md" justify="space-between">
        <Breadcrumbs path={path} />
        <Group>
          <ActionIconGroup>
            <ActionIcon variant="outline" color="green" onClick={open}>
              <IconFolderPlus size={20} />
            </ActionIcon>
            <ActionIcon onClick={() => ref.current?.click()} variant="outline" color="blue">
              <IconFileUpload size={20} />
            </ActionIcon>
            {!!checked.length && (
              <>
                <ActionIcon
                  variant="outline"
                  color="indigo"
                  onClick={() => {
                    setOpenMoveDialog(true);
                    __setPath(String(params?.path));
                  }}
                >
                  <IconFolderSymlink size={20} />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    openModal('Are you sure? You want to delete selected files??', deleteFile)
                  }
                  variant="outline"
                  color="red"
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </>
            )}
          </ActionIconGroup>
        </Group>
      </Group>
      <FileInput style={{ display: 'none' }} ref={ref} value={value} onChange={setValue} multiple />
      <FileTable data={data} checked={checked} setChecked={setChecked} openFile={openFile} />
      <Modal title="New Folder" opened={opened} onClose={close}>
        <TextInput
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Untitled file"
          data-autofocus
          onFocus={(e) => e.target.select()}
        />
        <Group mt="md" justify="right">
          <Button color="red" onClick={close}>
            Cancel
          </Button>
          <Button color="teal" onClick={handleNewFolder}>
            Create
          </Button>
        </Group>
      </Modal>

      <Modal title="New Folder" opened={!!openMoveDialog} onClose={() => setOpenMoveDialog(false)}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          {_path?.[0]?.parent && (
            <Table.Tr>
              <Table.Td
                style={{ cursor: 'pointer' }}
                onClick={() => __setPath(_path?.[0]?.parent?.parent || '')}
              >
                ...
              </Table.Td>
            </Table.Tr>
          )}
          {_path
            ?.filter(({ _id }) => !checked.includes(_id))
            ?.map((test) => (
              <Table.Tr key={test?._id}>
                <Table.Td>
                  <Group
                    style={{ cursor: !test.link ? 'pointer' : 'default' }}
                    onClick={() => !test.link && __setPath(test._id || '')}
                  >
                    <ThemeIcon variant="transparent" size="sm">
                      {test.link ? <IconFile /> : <IconFolder />}
                    </ThemeIcon>
                    <Text>{test.name}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table>
        <Group mt="md" justify="right">
          <Button
            color="red"
            onClick={() => {
              setOpenMoveDialog(false);
              _setPath([]);
              __setPath('');
            }}
          >
            Cancel
          </Button>
          <Button color="teal" onClick={() => moveFile({ parent: __path, ids: checked })}>
            Move
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DrivePage;
