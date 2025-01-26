import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceOrderForm from '../ServiceOrderForm';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const MockServiceOrderForm = () => {
  const form = useForm();
  return (
    <ServiceOrderForm
      form={form}
      isOpen={true}
      setIsOpen={() => {}}
      onSubmit={() => {}}
      statusOptions={[
        { value: 'pending', label: 'Pendente', color: 'text-yellow-500' },
        { value: 'in_progress', label: 'Em Andamento', color: 'text-blue-500' },
        { value: 'completed', label: 'Concluído', color: 'text-green-500' },
      ]}
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