// src/features/invoices/InvoiceDetail.tsx
import React from 'react';
import InvoiceDetailContainer from '../invoiceDetails/InvoiceDetailContainer';

/**
 * Invoice Detail page component
 * This is now a simple wrapper around the refactored container component
 */
const InvoiceDetail: React.FC = () => {
  return <InvoiceDetailContainer />;
};

export default InvoiceDetail;