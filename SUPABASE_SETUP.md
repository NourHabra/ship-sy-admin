# Supabase Setup Guide

This guide will help you set up Supabase for your Roadlink application and connect it to the frontend.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase project URL and anon key

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `roadlink` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for it to be set up

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied from Step 2.

**Important:** Never commit your `.env` file to version control. It should already be in `.gitignore`.

## Step 4: Database Schema

Your Supabase database should already have the following tables set up:

- **drivers** - Stores driver personal information and license details
- **license_types** - Stores available license types (Class A, B, C, D)
- **user_roles** - Maps users to their roles (driver, customer, etc.)

The driver sign-up form will automatically:
1. Create a user account in Supabase Auth
2. Insert driver information into the `drivers` table
3. Set the user role to 'driver' in the `user_roles` table

Make sure your `drivers` table has the following structure:
- `id` (UUID, references auth.users)
- `first_name`, `last_name`
- `national_number`
- `date_of_birth`, `place_of_birth`
- `country` (defaults to 'Syria')
- `city`, `address`
- `phone`, `email`
- `license_number`
- `license_type` (bigint, foreign key to license_types)
- `license_issue_date`, `license_expiry_date`
- `is_verified` (boolean, defaults to false)
- `updated_at` (timestamp)

If you need to verify or create these tables, check your Supabase dashboard under **Table Editor**.

## Step 5: Configure Authentication Settings (Optional)

If you want to disable email confirmation for development:

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Under "Email Auth", you can toggle "Enable email confirmations"
3. For production, it's recommended to keep email confirmations enabled

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to the driver sign-up page: `/create-driver-profile`
3. Fill out the form with:
   - Personal information (name, national number, date/place of birth, phone, address, city)
   - License information (license number, type, issue date, expiry date)
   - Account credentials (email, password)
4. Submit the form
5. Check your Supabase dashboard:
   - **Authentication** → **Users** should show the new user
   - **Table Editor** → **drivers** should show the new driver record
   - **Table Editor** → **user_roles** should show the user with role 'driver'

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file exists in the project root
- Verify the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Restart your development server after adding/changing environment variables

### Error: "relation 'drivers' does not exist"
- Make sure the `drivers` table exists in your Supabase database
- Check that the table was created in the correct database schema (public)

### Error: "new row violates row-level security policy"
- Verify that the RLS policies were created correctly
- Check that the user is authenticated when trying to insert/update

### Sign-up works but profile creation fails
- Check the browser console for detailed error messages
- Verify that all required fields are being sent
- Check the Supabase logs in the dashboard under **Logs** → **Postgres Logs**

## Next Steps

- Set up email templates in Supabase for better user experience
- Configure additional authentication providers (Google, GitHub, etc.) if needed
- Set up database backups
- Configure production environment variables
- Add more tables as needed for your application

## Security Notes

- The `anon` key is safe to use in the frontend, but it's restricted by Row Level Security (RLS) policies
- Never expose your `service_role` key in the frontend
- Always use RLS policies to protect your data
- Regularly review and update your RLS policies as your application grows

