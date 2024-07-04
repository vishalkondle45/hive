'use client';

import {
  ActionIcon,
  Button,
  Container,
  FileInput,
  Group,
  Modal,
  rem,
  Select,
  SelectProps,
  Stack,
  Text,
} from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconPhoto, IconPrinter } from '@tabler/icons-react';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import { RichTextEditor, Link, getTaskListExtension } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import usePreventCtrlS from '@/hooks/usePreventCtrlS';
import { FONTS } from '@/lib/constants';
import { apiCall, failure } from '@/lib/client_functions';
import { RootState } from '@/store/store';
import { setImage } from '@/store/features/documentSlice';

interface Props {
  content: string;
  onUpdate: (str: string) => void;
}

const Document = ({ content, onUpdate }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dispatch = useDispatch();
  const { image } = useSelector((state: RootState) => state.document);
  usePreventCtrlS();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextStyle,
      Image,
      FontFamily.configure({ types: ['textStyle'] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'test-item' } }),
    ],
    content,
    onUpdate({ editor: Editor }) {
      const html = Editor.getHTML();
      onUpdate(html);
    },
  });

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
    <Text px={0} ff={option.value} size="sm">
      {option.label}
    </Text>
  );
  const onChange = (data: any) =>
    editor
      ?.chain()
      .focus()
      .setFontFamily(data || '')
      .run();

  const InputStyles = {
    input: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
      fontFamily: editor?.getAttributes('textStyle').fontFamily,
    },
  };

  const onClose = () => {
    close();
    dispatch(setImage(null));
  };

  const onUpload = async () => {
    if (!image) {
      failure('Please select an image');
      onClose();
      return null;
    }
    const formData = new FormData();
    formData.append('file', image);
    const res = await apiCall('/api/upload', formData, 'POST');
    editor?.chain().focus().setImage({ src: res?.data }).run();
    onClose();
    return null;
  };

  const onPrint = () => {
    const printWindow = window.open();
    printWindow?.document.write(editor?.getHTML() || '');
    printWindow?.document.close();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <>
      <RichTextEditor fz={rem(isMobile ? 6 : 16)} bg="white" editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <Select
              data={FONTS}
              placeholder="Font family"
              onChange={onChange}
              value={editor?.getAttributes('textStyle').fontFamily}
              renderOption={renderSelectOption}
              styles={InputStyles}
              p={0}
              defaultValue=""
              allowDeselect={false}
              size="sm"
              w={120}
              checkIconPosition="left"
            />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.TaskList />
            <RichTextEditor.TaskListLift />
            <RichTextEditor.TaskListSink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <ActionIcon.Group>
              <ActionIcon variant="default" onClick={open}>
                <IconPhoto style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="default" onClick={onPrint}>
                <IconPrinter style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </ActionIcon.Group>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <Container px={0}>
          <RichTextEditor.Content py={isMobile ? 'xs' : 'xl'} />
        </Container>
      </RichTextEditor>

      <Modal opened={opened} onClose={onClose} withCloseButton={false}>
        <Stack>
          <FileInput
            label="Upload Image"
            placeholder="Image.jpeg"
            value={image}
            onChange={(img) => dispatch(setImage(img))}
            accept="image/*"
            required
          />
          <Group justify="right">
            <Button size="compact-md" color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button size="compact-md" color="teal" onClick={onUpload}>
              Upload
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Document;
