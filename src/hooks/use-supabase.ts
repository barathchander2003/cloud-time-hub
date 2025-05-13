
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/types/database';

// Custom hook for fetching data from any table with proper typing
export function useSupabaseQuery<T extends keyof Tables>(
  tableName: T,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  } = {}
) {
  const [data, setData] = useState<Tables[T][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use type assertion to work around TypeScript limitations
        let query = supabase.from(tableName as string);
        
        if (options.columns) {
          query = query.select(options.columns);
        } else {
          query = query.select('*');
        }
        
        // Apply filters if provided
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              query = query.eq(key, value);
            }
          });
        }
        
        // Apply ordering if provided
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          });
        }
        
        // Apply limit if provided
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        const { data: result, error } = await query;
        
        if (error) throw error;
        
        // Type assertion to handle the custom tables
        setData(result as Tables[T][]);
      } catch (err: any) {
        setError(err);
        console.error(`Error fetching ${String(tableName)}:`, err);
        toast({
          title: "Error",
          description: `Failed to load ${String(tableName)}: ${err.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tableName, JSON.stringify(options)]);
  
  return { data, loading, error, refetch: () => {} };
}

// Helper function to update data in any table
export async function updateSupabaseRecord<T extends keyof Tables>(
  tableName: T,
  id: string,
  data: Partial<Tables[T]>
) {
  try {
    // Use type assertion to work around TypeScript limitations
    const { error } = await supabase
      .from(tableName as string)
      .update(data)
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (err: any) {
    console.error(`Error updating ${String(tableName)}:`, err);
    toast({
      title: "Error",
      description: `Failed to update: ${err.message}`,
      variant: "destructive",
    });
    return { success: false, error: err };
  }
}

// Helper function to insert data into any table
export async function insertSupabaseRecord<T extends keyof Tables>(
  tableName: T,
  data: Partial<Tables[T]>
) {
  try {
    // Use type assertion to work around TypeScript limitations
    const { data: result, error } = await supabase
      .from(tableName as string)
      .insert(data)
      .select();
      
    if (error) throw error;
    
    return { success: true, data: result?.[0] };
  } catch (err: any) {
    console.error(`Error inserting into ${String(tableName)}:`, err);
    toast({
      title: "Error",
      description: `Failed to save: ${err.message}`,
      variant: "destructive",
    });
    return { success: false, error: err };
  }
}
