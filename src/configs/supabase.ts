import {createClient} from "@supabase/supabase-js"
import Constants from 'expo-constants';
const supabaseurl = Constants.expoConfig.extra.REACT_APP_SUPABASE_URL;
const supabasekey = Constants.expoConfig.extra.REACT_APP_SUPABASE_ANON_KEY;
console.log(supabasekey);


export const supabase = createClient(
    'url',
    'key'
) 