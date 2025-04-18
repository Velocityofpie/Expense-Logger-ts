// src/features/invoices/invoicesApi.ts
import axios from 'axios';
import { Invoice, InvoiceFormData, UploadResult } from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Create axios instance with common configuration
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fetch all invoices with optional pagination
export const fetchInvoices = async (skip = 0, limit = 100, userId = null): Promise<Invoice[]> => {
  try {
    let url = `/invoices/?skip=${skip}&limit=${limit}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Fetch a single invoice by ID
export const fetchInvoiceById = async (id: number | string): Promise<Invoice> => {
  try {
    const response = await apiClient.get(`/invoice/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
};

// Upload an invoice file
export const uploadInvoice = async (formData: FormData): Promise<UploadResult> => {
  try {
    // Debug log to check formData contents
    console.log('Uploading with FormData:', 
      Array.from(formData.entries()).map(([key, value]) => {
        // Don't log the actual file contents
        return key === 'file' ? `${key}: [File]` : `${key}: ${value}`;
      })
    );
    
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Enhanced version with explicit OCR template parameter
export const uploadInvoiceWithOCR = async (
  file: File, 
  useOcrTemplates: boolean = false,
  metadata: { category?: string, tags?: string[] } = {}
): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("use_templates", useOcrTemplates.toString());
    
    if (metadata.category) {
      formData.append("category", metadata.category);
    }
    
    if (metadata.tags && metadata.tags.length > 0) {
      metadata.tags.forEach(tag => formData.append("tags", tag));
    }
    
    console.log('Uploading with OCR templates:', useOcrTemplates);
    
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Add a new invoice entry (no file)
export const addInvoiceEntry = async (invoiceData: InvoiceFormData): Promise<Invoice> => {
  try {
    const response = await apiClient.post('/add-entry/', invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error adding invoice entry:", error);
    throw error;
  }
};

// Update an invoice
export const updateInvoice = async (id: number | string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
  try {
    const response = await apiClient.put(`/update/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// Soft delete an invoice
export const deleteInvoice = async (id: number | string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

// Fetch tags
export const fetchTags = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/tags/');
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// Fetch categories
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/categories/');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Delete a category from the database
 * @param categoryName - Name of the category to delete
 * @returns Promise that resolves to the response data
 */
export const deleteCategory = async (categoryName: string): Promise<any> => {
  try {
    // Make sure to encode the category name to handle special characters
    const encodedCategoryName = encodeURIComponent(categoryName);
    const response = await axios.delete(`${API_URL}/categories/${encodedCategoryName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

/**
 * Delete a tag from the database
 * @param tagName - Name of the tag to delete
 * @returns Promise that resolves to the response data
 */
export const deleteTag = async (tagName: string): Promise<any> => {
  try {
    // Make sure to encode the tag name to handle special characters
    const encodedTagName = encodeURIComponent(tagName);
    const response = await axios.delete(`${API_URL}/tags/${encodedTagName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};

// Add a payment for an invoice
export const addPayment = async (
  invoiceId: number | string,
  cardNumberId: number | string,
  amount: number | string,
  transactionId: string
): Promise<{ success: boolean; payment_id: number }> => {
  try {
    const response = await apiClient.post('/payments/', {
      invoice_id: invoiceId,
      card_number_id: cardNumberId,
      amount: amount,
      transaction_id: transactionId,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

// Get payments for an invoice
export const getInvoicePayments = async (invoiceId: number | string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/payments/invoice/${invoiceId}`);
    return response.data.payments || [];
  } catch (error) {
    console.error(`Error fetching payments for invoice ${invoiceId}:`, error);
    throw error;
  }
};

export default {
  fetchInvoices,
  fetchInvoiceById,
  uploadInvoice,
  addInvoiceEntry,
  updateInvoice,
  deleteInvoice,
  fetchTags,
  fetchCategories,
  deleteCategory,
  addPayment,
  getInvoicePayments
};