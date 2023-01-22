import React from 'react';
import { render, screen } from '@testing-library/react';
import { RepoPanelContent } from '../src/Panel/Panel';

// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.mock('../src/Services', () => {});
jest.mock('../src/Common');

describe('Panel', () => {
  test('Panel - rendering', () => {
    render(<RepoPanelContent />);

    const textElement = screen.getByText(/Repository Type/i);
    expect(textElement).toBeDefined();
  });

  test('Panel - create button is disabled', () => {
    render(<RepoPanelContent />);

    const button = screen.getByText(/Create/i).closest('button');

    expect(button).toHaveClass('disabled');
  });
});
