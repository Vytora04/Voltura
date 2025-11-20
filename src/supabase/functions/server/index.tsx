import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client with service role key for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Create Supabase client with anon key for user operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Health check endpoint
app.get("/make-server-7c7b6658/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-7c7b6658/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, company, phone } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseAdmin();

    // Check if user already exists first
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (existingUsers) {
      const userExists = existingUsers.users.find(u => u.email === email);
      if (userExists) {
        console.log(`User already exists: ${email}`);
        return c.json({ 
          error: 'A user with this email address has already been registered. Please login instead.',
          errorCode: 'USER_EXISTS'
        }, 400);
      }
    }

    // Create user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, company, phone },
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`, error);
      
      // Handle specific error cases
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return c.json({ 
          error: 'This email is already registered. Please login instead.',
          errorCode: 'USER_EXISTS'
        }, 400);
      }
      
      return c.json({ 
        error: `Signup failed: ${error.message}`,
        details: error
      }, 400);
    }

    console.log(`User created successfully: ${email}`);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ 
      error: 'Internal server error during signup. Please try again.',
      details: String(error)
    }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-7c7b6658/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log(`🔐 Sign in attempt for: ${email}`);

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabaseAdmin = getSupabaseAdmin();

    // First, verify user exists and check their status
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = existingUsers?.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return c.json({ error: 'Invalid email or password' }, 400);
    }

    console.log(`✅ User found in database: ${email}`);
    console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Confirmed at: ${user.email_confirmed_at || 'Not confirmed'}`);

    // Try to sign in using a fresh client with the provided credentials
    // This validates the password against Supabase's stored hash
    const supabaseClient = getSupabaseClient();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`❌ Error signing in user: ${error.message}`);
      console.log(`   Error status: ${error.status}`);
      console.log(`   Error name: ${error.name}`);
      
      // If signInWithPassword fails, it means wrong password or auth issue
      return c.json({ error: 'Invalid email or password' }, 400);
    }

    if (!data.session) {
      console.log(`❌ No session created for user: ${email}`);
      return c.json({ error: 'Authentication failed. Please try again.' }, 400);
    }

    console.log(`✅ User signed in successfully: ${email}`);
    return c.json({ 
      success: true, 
      user: data.user,
      session: data.session 
    });
  } catch (error) {
    console.log(`❌ Server error during signin: ${error}`);
    return c.json({ error: 'Internal server error during signin. Please try again.' }, 500);
  }
});

// Get user profile endpoint (requires authentication)
app.get("/make-server-7c7b6658/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Error getting user profile: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.log(`Server error getting profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save user setup data (requires authentication)
app.post("/make-server-7c7b6658/user/setup", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Authorization error while saving user setup data: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { powerCategory, kwhPrice, monthlyBill, devices } = body;

    if (!powerCategory || !kwhPrice || !monthlyBill || !devices) {
      return c.json({ error: 'Missing required setup data fields' }, 400);
    }

    // Store setup data in KV store with user-specific key
    const setupKey = `user_setup_${user.id}`;
    const setupData = {
      powerCategory,
      kwhPrice,
      monthlyBill,
      devices,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(setupKey, JSON.stringify(setupData));

    console.log(`✅ Setup data saved for user: ${user.email}`);
    return c.json({ success: true, message: 'Setup data saved successfully' });
  } catch (error) {
    console.log(`❌ Server error saving setup data: ${error}`);
    return c.json({ error: 'Internal server error while saving setup data' }, 500);
  }
});

// Get user setup data (requires authentication)
app.get("/make-server-7c7b6658/user/setup", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Authorization error while fetching user setup data: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Retrieve setup data from KV store
    const setupKey = `user_setup_${user.id}`;
    const setupDataJson = await kv.get(setupKey);

    if (!setupDataJson) {
      console.log(`No setup data found for user: ${user.email}`);
      return c.json({ success: true, setupData: null });
    }

    const setupData = JSON.parse(setupDataJson);
    console.log(`✅ Setup data retrieved for user: ${user.email}`);
    return c.json({ success: true, setupData });
  } catch (error) {
    console.log(`❌ Server error fetching setup data: ${error}`);
    return c.json({ error: 'Internal server error while fetching setup data' }, 500);
  }
});

// Save user profile data (requires authentication)
app.post("/make-server-7c7b6658/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Authorization error while saving user profile data: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, email, company, phone } = body;

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { name, company, phone } }
    );

    if (updateError) {
      console.log(`❌ Error updating user profile: ${updateError.message}`);
      return c.json({ error: 'Failed to update profile' }, 400);
    }

    console.log(`✅ Profile data saved for user: ${user.email}`);
    return c.json({ success: true, message: 'Profile data saved successfully' });
  } catch (error) {
    console.log(`❌ Server error saving profile data: ${error}`);
    return c.json({ error: 'Internal server error while saving profile data' }, 500);
  }
});

// Delete user setup data (requires authentication)
app.delete("/make-server-7c7b6658/user/setup", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.log(`Authorization error while deleting user setup data: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Delete setup data from KV store
    const setupKey = `user_setup_${user.id}`;
    await kv.del(setupKey);

    console.log(`✅ Setup data deleted for user: ${user.email}`);
    return c.json({ success: true, message: 'Setup data deleted successfully' });
  } catch (error) {
    console.log(`❌ Server error deleting setup data: ${error}`);
    return c.json({ error: 'Internal server error while deleting setup data' }, 500);
  }
});

Deno.serve(app.fetch);