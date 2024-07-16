import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export default function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Hive
        </Text>
      </Title>
      <Title ta="center" order={1}>
        Buzzing with productivity.
      </Title>
    </>
  );
}
