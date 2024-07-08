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
  IconDownload,
  IconFile,
  IconFileUpload,
  IconFolder,
  IconFolderPlus,
  IconFolderSymlink,
  IconTrash,
} from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FileTable from '@/components/Drive/FileTable';
import { apiCall, failure, openModal, Preview } from '@/lib/client_functions';
import {
  __setPath,
  _setPath,
  setDriveData,
  setOpenMoveDialog,
  setChecked,
  setValue,
  setFolderName,
  setPreview,
} from '@/store/features/driveSlice';
import { RootState } from '@/store/store';

const DrivePage = () => {
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get('_id') ?? null;
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const ref = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();
  const { driveData, openMoveDialog, __path, _path, checked, value, folderName, preview } =
    useSelector((state: RootState) => state.drive);

  const handleNewFolder = async () => {
    await apiCall('/api/drive/files', { name: folderName, parent: currentFolder }, 'POST');
    close();
    dispatch(setFolderName('Untitled folder'));
    getPath();
  };

  const getFile = async (Key: string) => {
    const res = await apiCall(`/api/drive/files/upload?Key=${encodeURI(Key)}`);
    dispatch(setPreview(res?.data));
  };

  const deleteFile = async () => {
    await apiCall(`/api/drive/files?_id=${JSON.stringify(checked)}`, null, 'DELETE');
    getPath();
    dispatch(setChecked([]));
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
      formData.append('parent', currentFolder ?? '');
      await apiCall('/api/drive/files/upload', formData, 'POST');
      getPath();
      notifications.update({
        id,
        color: 'green',
        message: 'File uploaded successfully',
        icon: <IconCheck size={rem(20)} />,
        loading: false,
        autoClose: 2000,
      });
    } catch (err) {
      failure('Error uploading file');
    } finally {
      dispatch(setValue([]));
    }
  };

  const openFile = (item: any) =>
    item.link ? getFile(item.link) : router.push(`/drive?_id=${item?._id}`);

  const moveFile = async (item: any) => {
    await apiCall('/api/drive/files', item, 'PUT');
    dispatch(setOpenMoveDialog(false));
    dispatch(_setPath([]));
    dispatch(__setPath(item.__path));
    getPath();
    dispatch(setChecked([]));
  };

  const getPath = async () => {
    try {
      const res = await apiCall(
        `/api/drive/files${__path ? `?parent=${__path}` : currentFolder ? `?parent=${currentFolder}` : ''}`
      );
      dispatch(_setPath(res?.data?.files));
      if (!__path) {
        dispatch(setDriveData(res?.data));
      }
    } catch (err) {
      router.push('/drive');
    }
  };

  useEffect(() => {
    if (value.length) {
      handleSubmit();
    }
  }, [value]);

  useEffect(() => {
    getPath();
  }, [__path, currentFolder]);

  return (
    <>
      {__path}
      <Group mb="md" justify="space-between">
        <Breadcrumbs path={driveData?.path} />
        <Group>
          <ActionIconGroup>
            {checked.length ? (
              <>
                <ActionIcon
                  variant="filled"
                  size="lg"
                  color="indigo"
                  onClick={() => {
                    dispatch(__setPath(''));
                    getPath();
                    dispatch(setOpenMoveDialog(true));
                  }}
                >
                  <IconFolderSymlink size={20} />
                </ActionIcon>
                <ActionIcon
                  onClick={() =>
                    openModal('Are you sure? You want to delete selected files??', deleteFile)
                  }
                  variant="filled"
                  size="lg"
                  color="red"
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </>
            ) : (
              <>
                <ActionIcon variant="filled" size="lg" color="green" onClick={open}>
                  <IconFolderPlus size={20} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => ref.current?.click()}
                  variant="filled"
                  size="lg"
                  color="blue"
                >
                  <IconFileUpload size={20} />
                </ActionIcon>
              </>
            )}
          </ActionIconGroup>
        </Group>
      </Group>
      <FileInput
        style={{ display: 'none' }}
        ref={ref}
        value={value}
        onChange={(values) => dispatch(setValue(values))}
        multiple
      />
      <FileTable
        data={driveData?.files}
        checked={checked}
        setChecked={(checks: string[]) => dispatch(setChecked(checks))}
        openFile={openFile}
      />
      <Modal title="New Folder" opened={opened} onClose={close}>
        <TextInput
          value={folderName}
          onChange={(e) => dispatch(setFolderName(e.target.value))}
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
      <Modal
        title={_path?.[0]?.parent?.name ? `/${_path?.[0]?.parent?.name}` : '/drive'}
        opened={!!openMoveDialog}
        onClose={() => {
          dispatch(setOpenMoveDialog(false));
          dispatch(_setPath([]));
          dispatch(__setPath(''));
        }}
      >
        {__path}
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Tr>
            <Table.Td
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(__setPath(_path?.[0]?.parent?.parent || '/'))}
            >
              ...
            </Table.Td>
          </Table.Tr>
          {_path
            ?.filter(({ _id }) => !checked.includes(_id))
            ?.map((test) => (
              <Table.Tr key={test?._id}>
                <Table.Td>
                  <Group
                    style={{ cursor: !test?.link ? 'pointer' : 'default' }}
                    onClick={() => !test?.link && dispatch(__setPath(test?._id || '/'))}
                  >
                    <ThemeIcon variant="transparent" size="sm">
                      {test?.link ? <IconFile /> : <IconFolder />}
                    </ThemeIcon>
                    <Text>{test?.name}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table>
        <Group mt="md" justify="right">
          <Button
            color="red"
            onClick={() => {
              dispatch(setOpenMoveDialog(false));
              dispatch(_setPath([]));
              dispatch(__setPath(''));
            }}
          >
            Cancel
          </Button>
          <Button color="teal" onClick={() => moveFile({ parent: __path, ids: checked })}>
            Move
          </Button>
        </Group>
      </Modal>

      <Modal
        size="auto"
        centered
        opened={!!preview}
        onClose={() => dispatch(setPreview(''))}
        title={
          <Button
            onClick={() => window.open(preview, '_blank', 'noopener,noreferrer')}
            color="teal"
            leftSection={<IconDownload size={16} />}
          >
            Download
          </Button>
        }
      >
        {Preview(preview)}
      </Modal>
    </>
  );
};

export default DrivePage;
