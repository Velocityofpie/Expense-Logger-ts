// src/features/invoices/invoiceDetail/hooks/useInvoiceData.ts
import { useState, useEffect } from 'react';
import { fetchInvoiceById, fetchInvoices, fetchTags, fetchCategories } from '../../invoicesApi';
import { Invoice, LineItem } from '../../types';
import { normalizeDateFormat } from '../utils/dateUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useInvoiceData = (id: string | undefined) => {
  // State for the invoice data
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<LineItem[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  
  // State for tags and categories
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string>('');
  
  // Navigation state
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  // Fetch all invoices for navigation and the current invoice details
  useEffect(() => {
    async function loadInvoicesAndOptions() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all invoices for navigation
        const invoicesData = await fetchInvoices();
        setAllInvoices(invoicesData);
        
        // Find current invoice index
        const index = invoicesData.findIndex(inv => inv.invoice_id === parseInt(id || '0'));
        setCurrentIndex(index);
        
        // Fetch invoice details
        await loadInvoiceDetails(id);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading invoices:", error);
        setError("Failed to load invoice data. Please try again.");
        setIsLoading(false);
      }
    }
    
    if (id) {
      loadInvoicesAndOptions();
    }
  }, [id]);

  // Load invoice details
  const loadInvoiceDetails = async (invoiceId: string | undefined) => {
    if (!invoiceId) return;
    
    try {
      // Fetch invoice details
      const refreshedData = await fetchInvoiceById(invoiceId);
      setInvoice({
        ...refreshedData,
        merchant_name: refreshedData.merchant_name || ''
      });
      setItems(refreshedData.items || []);
      setTags(refreshedData.tags || []);
      setCategories(refreshedData.categories || []);
      
      // Set PDF URL if filename exists
      if (refreshedData.file_name) {
        setPdfUrl(`${API_URL}/uploads/${encodeURIComponent(refreshedData.file_name)}`);
      } else {
        setPdfUrl('');
      }
      
      // Fetch available tags and categories
      const [tagsData, categoriesData] = await Promise.all([
        fetchTags(),
        fetchCategories()
      ]);
      
      setAvailableTags(tagsData);
      setAvailableCategories(categoriesData);
      
    } catch (error) {
      console.error("Error loading invoice:", error);
      throw error;
    }
  };

  // Handle changes to invoice fields with date normalization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!invoice) return;
    
    const { name, value } = e.target;
    
    // Apply date normalization for purchase_date
    if (name === "purchase_date") {
      const normalizedDate = normalizeDateFormat(value);
      setInvoice({ ...invoice, [name]: normalizedDate });
    } else {
      setInvoice({ ...invoice, [name]: value });
    }
  };

  // Handle paste event for the purchase_date field to auto-format pasted dates
  const handleDatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!invoice) return;
    
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const normalizedDate = normalizeDateFormat(pastedText);
    setInvoice({ ...invoice, purchase_date: normalizedDate });
  };

  return {
    invoice,
    items,
    tags,
    categories,
    pdfUrl,
    isLoading,
    error,
    isSaving,
    setIsSaving,
    savedMessage,
    setSavedMessage,
    allInvoices,
    currentIndex,
    availableTags,
    availableCategories,
    setInvoice,
    setItems,
    setTags,
    setCategories,
    loadInvoiceDetails,
    handleInputChange,
    handleDatePaste
  };
};