import { Button, Group } from '@mantine/core';

const FormButtons = () => {
  return (
    <Group justify="right">
      <Button type="reset" color="red">
        Reset
      </Button>
      <Button type="submit" color="teal">
        Submit
      </Button>
    </Group>
  );
};

export default FormButtons;
