import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceOrderForm from '../ServiceOrderForm';
import { useForm } from 'react-hook-form';
import { statusOptions } from '../ServiceOrderContent';

// Mock the entire ServiceOrderProvider
vi.mock('@/components/ServiceOrderProvider', () => ({
  useServiceOrders: () => ({
    createServiceOrder: vi.fn(),
    serviceOrders: [],
    isLoading: false,
  }),
}));

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

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

  it('form fields can be filled without triggering actual submission', async () => {
    render(<MockServiceOrderForm />);
    
    const numeroOsInput = screen.getByLabelText(/Número OS/i);
    const patrimonioInput = screen.getByLabelText(/Patrimônio/i);
    const equipamentoInput = screen.getByLabelText(/Equipamento/i);
    
    fireEvent.change(numeroOsInput, { target: { value: 'TEST-001' } });
    fireEvent.change(patrimonioInput, { target: { value: 'PAT-001' } });
    fireEvent.change(equipamentoInput, { target: { value: 'Equipment Test' } });
    
    expect(numeroOsInput).toHaveValue('TEST-001');
    expect(patrimonioInput).toHaveValue('PAT-001');
    expect(equipamentoInput).toHaveValue('Equipment Test');
  });
});