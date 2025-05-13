
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Upload a file to a Supabase storage bucket
export async function uploadFile(
  bucketName: string,
  fileName: string,
  file: File
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return {
      success: true,
      data: {
        path: data?.path,
        publicUrl: publicUrlData?.publicUrl
      }
    };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    toast({
      title: "Upload Failed",
      description: error.message || "Could not upload file",
      variant: "destructive"
    });
    return { success: false, error };
  }
}

// Download a file from a Supabase storage bucket
export async function downloadFile(bucketName: string, filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) throw error;
    
    // Create a download URL
    const url = URL.createObjectURL(data);
    
    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error downloading file:", error);
    toast({
      title: "Download Failed",
      description: error.message || "Could not download file",
      variant: "destructive"
    });
    return { success: false, error };
  }
}

// Get the public URL for a file in a Supabase storage bucket
export function getPublicUrl(bucketName: string, filePath: string) {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

// List all files in a Supabase storage bucket
export async function listFiles(bucketName: string, folder: string = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error listing files:", error);
    return { success: false, error };
  }
}
