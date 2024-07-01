import { Checkbox, Group, Paper, rem, Table, Text, ThemeIcon } from '@mantine/core';
import { IconFile, IconFolderFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  data: any[];
  openFile: (item: any) => void;
  checked: string[];
  setChecked: (value: string[]) => void;
}

const FileTable = ({ data, openFile, checked, setChecked }: Props) => (
  <Paper w="100%">
    <Table.ScrollContainer minWidth={500} type="native">
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ whiteSpace: 'nowrap' }}>
              <Group gap={0} wrap="nowrap">
                <Checkbox
                  checked={!!checked?.length && checked?.length === data?.length}
                  onChange={() =>
                    setChecked(checked?.length === data?.length ? [] : data.map((item) => item._id))
                  }
                />
                <Table.Td>Name</Table.Td>
              </Group>
            </Table.Th>
            <Table.Th style={{ whiteSpace: 'nowrap' }}>Last modified</Table.Th>
            <Table.Th style={{ whiteSpace: 'nowrap' }}>File size</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.length ? (
            data?.map((item: any) => (
              <Table.Tr key={item?._id}>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <Checkbox.Group size="xs" value={checked} onChange={setChecked}>
                      <Checkbox value={item?._id} />
                    </Checkbox.Group>
                    <Group
                      wrap="nowrap"
                      gap={rem(4)}
                      style={{ cursor: 'pointer' }}
                      onClick={() => openFile(item)}
                    >
                      <ThemeIcon variant="transparent" size="sm">
                        {item?.link ? <IconFile /> : <IconFolderFilled />}
                      </ThemeIcon>
                      <Text style={{ overflow: 'unset', whiteSpace: 'nowrap' }}>
                        {decodeURI(item?.name)}
                      </Text>
                    </Group>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text style={{ overflow: 'unset', whiteSpace: 'nowrap' }}>
                    {dayjs(item?.updatedAt).format('MMM DD, YYYY HH:mm A')}
                  </Text>
                </Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                  {item?.link && <Text>{(Number(item?.size) / 1024 / 1024).toFixed(5)} MB</Text>}
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td align="center" colSpan={4}>
                No files found.
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  </Paper>
);

export default FileTable;
