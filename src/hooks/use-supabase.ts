
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/types/database';

// Custom hook for fetching data from any table with proper typing
export function useSupabaseQuery<T extends keyof Database['public']['Tables']>(
  tableName: T,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
  } = {}
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from(tableName);
        
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
        
        setData(result || []);
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
export async function updateSupabaseRecord<T extends keyof Database['public']['Tables']>(
  tableName: T,
  id: string,
  data: Partial<any>
) {
  try {
    const { error } = await supabase
      .from(tableName)
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
export async function insertSupabaseRecord<T extends keyof Database['public']['Tables']>(
  tableName: T,
  data: Partial<any>
) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
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
