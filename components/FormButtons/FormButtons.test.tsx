import { render, screen } from '@/test-utils';
import FormButtons from './FormButtons';

describe('FormButtons component', () => {
  it('has correct Next.js theming section link', () => {
    render(<FormButtons />);
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');
  });
});
