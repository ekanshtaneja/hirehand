import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, amount } = await req.json();
    
    console.log(`Converting ${amount} ${from} to ${to}`);

    // Use free exchange rate API
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.rates[to];
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${to}`);
    }
    
    const convertedAmount = amount * rate;
    
    console.log(`Conversion successful: ${amount} ${from} = ${convertedAmount} ${to} (rate: ${rate})`);
    
    return new Response(JSON.stringify({
      from,
      to,
      amount,
      convertedAmount,
      rate,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Currency conversion error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Currency conversion failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});