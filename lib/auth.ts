import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Fetch user from database
        const { data: user, error } = await supabaseAdmin
          .from("admin_users")
          .select("*")
          .eq("email", credentials.email)
          .eq("is_active", true)
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        await supabaseAdmin
          .from("admin_users")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/go",
    error: "/go",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper to create admin user (run this once to create your first admin)
export async function createAdminUser(email: string, password: string, name?: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .insert([
      {
        email,
        password_hash: passwordHash,
        name: name || email,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create admin user: ${error.message}`);
  }

  return data;
}

// Helper to create password reset token
export async function createPasswordResetToken(email: string) {
  // Find user
  const { data: user, error: userError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  // Generate token
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

  const { data, error } = await supabaseAdmin
    .from("password_reset_tokens")
    .insert([
      {
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create reset token: ${error.message}`);
  }

  return { token, expiresAt };
}

// Helper to reset password with token
export async function resetPasswordWithToken(token: string, newPassword: string) {
  // Find valid token
  const { data: resetToken, error: tokenError } = await supabaseAdmin
    .from("password_reset_tokens")
    .select("*, admin_users(id)")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (tokenError || !resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  const { error: updateError } = await supabaseAdmin
    .from("admin_users")
    .update({ password_hash: passwordHash })
    .eq("id", resetToken.user_id);

  if (updateError) {
    throw new Error("Failed to update password");
  }

  // Mark token as used
  await supabaseAdmin
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", resetToken.id);

  return true;
}
