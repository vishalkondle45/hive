import { render, screen } from '@/test-utils';
import FormButtons from './FormButtons';

describe('FormButtons component', () => {
  it('has correct labels for buttons', () => {
    render(<FormButtons />);
    expect(screen.getByText('Reset')).toBeDefined();
    expect(screen.getByText('Submit')).toBeDefined();
  });
});
