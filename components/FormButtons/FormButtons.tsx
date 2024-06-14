import { Button, Group } from '@mantine/core';

const FormButtons = () => (
  <Group justify="right">
    <Button name="reset" type="reset" color="red">
      Reset
    </Button>
    <Button name="submit" type="submit" color="teal">
      Submit
    </Button>
  </Group>
);

export default FormButtons;
