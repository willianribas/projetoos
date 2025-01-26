import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceOrderForm from '../ServiceOrderForm';
import { useForm } from 'react-hook-form';
import { statusOptions } from '../ServiceOrderContent';

const MockServiceOrderForm = () => {
  const form = useForm();
  return (
    <ServiceOrderForm
      form={form}
      isOpen={true}
      setIsOpen={() => {}}
      onSubmit={() => {}}
      statusOptions={statusOptions}
    />
  );
};

describe('ServiceOrderForm', () => {
  it('renders all form fields', () => {
    render(<MockServiceOrderForm />);
    
    expect(screen.getByLabelText(/Número OS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Patrimônio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Equipamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observação/i)).toBeInTheDocument();
  });
});