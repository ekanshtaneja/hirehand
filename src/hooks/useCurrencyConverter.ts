import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}

export const useCurrencyConverter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (
    amount: number, 
    from: string = 'USD', 
    to: string = 'INR'
  ): Promise<ConversionResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('currency-converter', {
        body: { amount, from, to }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data as ConversionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Conversion failed';
      setError(errorMessage);
      console.error('Currency conversion error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const convertPrice = useCallback((priceString: string, rate: number): string => {
    // Extract number from price string like "$200/hour" or "$180"
    const match = priceString.match(/\$(\d+)/);
    if (!match) return priceString;
    
    const usdAmount = parseInt(match[1]);
    const inrAmount = Math.round(usdAmount * rate);
    
    return priceString.replace(/\$\d+/, `₹${inrAmount.toLocaleString('en-IN')}`);
  }, []);

  return {
    convert,
    convertPrice,
    loading,
    error
  };
};