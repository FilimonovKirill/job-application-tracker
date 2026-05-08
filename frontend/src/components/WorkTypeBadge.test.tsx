import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkTypeBadge from './WorkTypeBadge';

describe('WorkTypeBadge', () => {
  it('renders with correct text for remote', () => {
    render(<WorkTypeBadge workType="remote" />);
    expect(screen.getByText('remote')).toBeInTheDocument();
  });

  it('renders with correct text for hybrid', () => {
    render(<WorkTypeBadge workType="hybrid" />);
    expect(screen.getByText('hybrid')).toBeInTheDocument();
  });

  it('renders with correct text for on-site', () => {
    render(<WorkTypeBadge workType="on-site" />);
    expect(screen.getByText('on-site')).toBeInTheDocument();
  });

  it('renders with default style for unknown type', () => {
    render(<WorkTypeBadge workType="other" />);
    expect(screen.getByText('other')).toBeInTheDocument();
  });
});
