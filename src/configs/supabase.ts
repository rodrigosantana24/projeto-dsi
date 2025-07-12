import {createClient} from "@supabase/supabase-js"
import Constants from 'expo-constants';
const supabaseurl = Constants.expoConfig.extra.REACT_APP_SUPABASE_URL;
const supabasekey = Constants.expoConfig.extra.REACT_APP_SUPABASE_ANON_KEY;
console.log(supabasekey);


export const supabase = createClient(
    'https://lzmqjagqaeszfztbcdrv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bXFqYWdxYWVzemZ6dGJjZHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTQwNTIsImV4cCI6MjA2NzgzMDA1Mn0.nDdrS3KhfivFRqStK0XvsNGUDxvnYDKfJ4Do_leQ_Hs'
) 