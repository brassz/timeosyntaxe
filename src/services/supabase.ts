import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yzmxyqtfbthtrlnhrnpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bXh5cXRmYnRodHJsbmhybnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3ODUwMjcsImV4cCI6MjA3NTM2MTAyN30.Cn9MFWJ8VEFKEEy6sNAPR0h14nHKkaj-XcA7k10pu24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      checklists: {
        Row: {
          id: string;
          operator: string;
          machine: string;
          location: string;
          date: string;
          horimeter: string;
          mileage: string;
          tag: string;
          items: any;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          operator: string;
          machine: string;
          location: string;
          date: string;
          horimeter: string;
          mileage: string;
          tag: string;
          items: any;
          completed: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          operator?: string;
          machine?: string;
          location?: string;
          date?: string;
          horimeter?: string;
          mileage?: string;
          tag?: string;
          items?: any;
          completed?: boolean;
          created_at?: string;
        };
      };
      service_orders: {
        Row: {
          id: string;
          order_number: number;
          date: string;
          time: string;
          vehicle: string;
          km_initial: string;
          km_final: string;
          equipment: string;
          tag: string;
          horimeter: string;
          maintenance_type: string[];
          service_description: string;
          parts_applied: string;
          observations: string;
          mechanic: string;
          responsible: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number?: number;
          date: string;
          time: string;
          vehicle: string;
          km_initial: string;
          km_final: string;
          equipment: string;
          tag: string;
          horimeter: string;
          maintenance_type: string[];
          service_description: string;
          parts_applied: string;
          observations: string;
          mechanic: string;
          responsible: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          date?: string;
          time?: string;
          vehicle?: string;
          km_initial?: string;
          km_final?: string;
          equipment?: string;
          tag?: string;
          horimeter?: string;
          maintenance_type?: string[];
          service_description?: string;
          parts_applied?: string;
          observations?: string;
          mechanic?: string;
          responsible?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Initialize database tables
export const initSupabaseTables = async () => {
  // Create checklists table
  const { error: checklistError } = await supabase.rpc('create_checklists_table', {});
  if (checklistError && !checklistError.message.includes('already exists')) {
    console.error('Error creating checklists table:', checklistError);
  }

  // Create service_orders table
  const { error: ordersError } = await supabase.rpc('create_service_orders_table', {});
  if (ordersError && !ordersError.message.includes('already exists')) {
    console.error('Error creating service_orders table:', ordersError);
  }
};

// Cleanup checklists older than 7 days
export const cleanupOldChecklists = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { error } = await supabase
    .from('checklists')
    .delete()
    .lt('created_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Error cleaning up old checklists:', error);
  }
};

// Checklist operations
export const saveChecklistToSupabase = async (checklist: any) => {
  const { data, error } = await supabase
    .from('checklists')
    .upsert({
      id: checklist.id,
      operator: checklist.operator,
      machine: checklist.machine,
      location: checklist.location,
      date: checklist.date,
      horimeter: checklist.horimeter,
      mileage: checklist.mileage,
      tag: checklist.tag,
      items: checklist.items,
      completed: checklist.completed,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving checklist:', error);
    throw error;
  }

  return data;
};

export const getChecklistsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('checklists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching checklists:', error);
    throw error;
  }

  return data;
};

export const deleteChecklistFromSupabase = async (id: string) => {
  const { error } = await supabase
    .from('checklists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting checklist:', error);
    throw error;
  }
};

// Service order operations
export const saveServiceOrder = async (order: any) => {
  const { data, error } = await supabase
    .from('service_orders')
    .insert(order)
    .select()
    .single();

  if (error) {
    console.error('Error saving service order:', error);
    throw error;
  }

  return data;
};

export const getServiceOrders = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service orders:', error);
    throw error;
  }

  return data;
};

export const getNextOrderNumber = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select('order_number')
    .order('order_number', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching order number:', error);
    return 2200; // Start from 2200 as shown in the image
  }

  return data ? data.order_number + 1 : 2200;
};
