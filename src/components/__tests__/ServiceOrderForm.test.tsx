import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
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
  toast: vi.fn(),
}));

const MockServiceOrderForm = () => {
  const form = useForm();
  return (
    <ServiceOrderForm
      form={form}
      onSubmit={() => {}}
      statusOptions={statusOptions}
    />
  );
};

describe('ServiceOrderForm', () => {
  it('renders all form fields', () => {
    render(<MockServiceOrderForm />);
    
    // Open the dialog by clicking the trigger button
    const openButton = screen.getByRole('button', { name: /Nova Ordem de Serviço/i });
    fireEvent.click(openButton);
    
    expect(screen.getByLabelText(/Número OS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Patrimônio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Equipamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observação/i)).toBeInTheDocument();
  });

  it('form fields can be filled without triggering actual submission', async () => {
    render(<MockServiceOrderForm />);
    
    // Open the dialog by clicking the trigger button
    const openButton = screen.getByRole('button', { name: /Nova Ordem de Serviço/i });
    fireEvent.click(openButton);
    
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