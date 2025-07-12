import {createClient} from "@supabase/supabase-js"
import Constants from 'expo-constants';


const supabaseUrl = Constants.expoConfig.extra.SUPABASE_API_URL;
const supabaseKey = Constants.expoConfig.extra.SUPABASE_API_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
) 