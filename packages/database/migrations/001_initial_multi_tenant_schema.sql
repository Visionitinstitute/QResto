-- ==============================================================================
-- MERARESTO MULTI-TENANT DATABASE SCHEMA (PHASE 4)
-- ==============================================================================
-- Zero-downtime, fully tenant-isolated schema with RLS, audit logs, and backward-compatible views.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'manager', 'chef', 'waiter', 'cashier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'INCOMPLETE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. RESTAURANTS (Tenant Root)
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    tagline TEXT,
    description TEXT,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    timezone TEXT DEFAULT 'Asia/Kolkata' NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    fssai_license TEXT,
    gstin TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. RESTAURANT MEMBERS (RBAC)
CREATE TABLE IF NOT EXISTS public.restaurant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'waiter' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(restaurant_id, user_id)
);

-- 6. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.plans (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'starter', 'pro', 'enterprise'
    name TEXT NOT NULL,
    description TEXT,
    monthly_price_inr NUMERIC(10, 2) NOT NULL,
    yearly_price_inr NUMERIC(10, 2) NOT NULL,
    max_tables INT NOT NULL,
    max_menu_items INT NOT NULL,
    max_staff INT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID UNIQUE NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL REFERENCES public.plans(id),
    status subscription_status DEFAULT 'TRIALING' NOT NULL,
    trial_ends_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    razorpay_subscription_id TEXT,
    razorpay_customer_id TEXT,
    cancel_at_period_end BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. OUTLETS / BRANCHES
CREATE TABLE IF NOT EXISTS public.outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_main BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(restaurant_id, slug)
);

-- 9. DINING TABLES
CREATE TABLE IF NOT EXISTS public.dining_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    outlet_id UUID REFERENCES public.outlets(id) ON DELETE SET NULL,
    table_number VARCHAR(20) NOT NULL,
    capacity INT DEFAULT 4 NOT NULL,
    section TEXT DEFAULT 'Main Dining',
    is_occupied BOOLEAN DEFAULT FALSE NOT NULL,
    active_order_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(restaurant_id, table_number)
);

-- 10. QR CODES
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.dining_tables(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL, -- Secure hash for direct scan routing
    target_url TEXT NOT NULL,
    scan_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    image_url TEXT,
    preparation_time_minutes INT DEFAULT 15,
    spice_level INT DEFAULT 0, -- 0=None, 1=Mild, 2=Medium, 3=Spicy
    allergens TEXT[],
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. ITEM VARIANTS
CREATE TABLE IF NOT EXISTS public.item_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. Half, Full, Large
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. ADD-ONS / CUSTOMIZATIONS
CREATE TABLE IF NOT EXISTS public.add_ons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. Extra Cheese, Garlic Dip
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES public.dining_tables(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL, -- e.g. ORD-1092
    status order_status DEFAULT 'PENDING' NOT NULL,
    payment_status payment_status DEFAULT 'PENDING' NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.item_variants(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. ORDER STATUS LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 18. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    method TEXT DEFAULT 'UPI' NOT NULL, -- UPI, CASH, CARD, RAZORPAY
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    status payment_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 19. AUDIT LOGS (Security & Compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ZERO-DOWNTIME BACKWARD COMPATIBILITY: HOTELS VIEW & INSTEAD OF TRIGGERS
-- ==============================================================================
-- If existing monolith routes query 'hotels', this view seamlessly forwards to 'restaurants'.
CREATE OR REPLACE VIEW public.hotels AS
SELECT
    id,
    name,
    slug,
    logo_url,
    created_at,
    updated_at
FROM public.restaurants;

-- ==============================================================================
-- INDEXING FOR PERFORMANCE & MULTI-TENANCY ISOLATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_user ON public.restaurant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_lookup ON public.restaurant_members(restaurant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_dining_tables_tenant ON public.dining_tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_token ON public.qr_codes(token);
CREATE INDEX IF NOT EXISTS idx_categories_tenant ON public.categories(restaurant_id, display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_tenant ON public.menu_items(restaurant_id, category_id, is_available);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON public.orders(restaurant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dining_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is user super admin?
CREATE OR REPLACE FUNCTION public.is_super_admin(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles WHERE id = uid AND is_super_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Is user a member of restaurant with specific roles?
CREATE OR REPLACE FUNCTION public.is_restaurant_member(restaurant_id UUID, uid UUID, allowed_roles user_role[] DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF allowed_roles IS NULL THEN
        RETURN EXISTS (
            SELECT 1 FROM public.restaurant_members
            WHERE restaurant_members.restaurant_id = is_restaurant_member.restaurant_id
              AND restaurant_members.user_id = uid
        );
    ELSE
        RETURN EXISTS (
            SELECT 1 FROM public.restaurant_members
            WHERE restaurant_members.restaurant_id = is_restaurant_member.restaurant_id
              AND restaurant_members.user_id = uid
              AND restaurant_members.role = ANY(allowed_roles)
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_super_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Restaurants Policies
CREATE POLICY "Public can view active restaurants" ON public.restaurants
    FOR SELECT USING (is_active = TRUE OR public.is_super_admin(auth.uid()));

CREATE POLICY "Members can view their restaurant" ON public.restaurants
    FOR SELECT USING (public.is_restaurant_member(id, auth.uid()));

CREATE POLICY "Owners and Super Admins can update restaurant" ON public.restaurants
    FOR UPDATE USING (
        public.is_restaurant_member(id, auth.uid(), ARRAY['owner'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- Restaurant Members Policies
CREATE POLICY "Members can view coworkers" ON public.restaurant_members
    FOR SELECT USING (
        public.is_restaurant_member(restaurant_id, auth.uid())
        OR public.is_super_admin(auth.uid())
    );

CREATE POLICY "Owners can manage team members" ON public.restaurant_members
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid(), ARRAY['owner'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- Dining Tables Policies
CREATE POLICY "Public can view tables for menu" ON public.dining_tables
    FOR SELECT USING (TRUE);

CREATE POLICY "Staff can manage dining tables" ON public.dining_tables
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid(), ARRAY['owner'::user_role, 'manager'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- QR Codes Policies
CREATE POLICY "Public can read QR codes" ON public.qr_codes
    FOR SELECT USING (TRUE);

CREATE POLICY "Staff can manage QR codes" ON public.qr_codes
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid(), ARRAY['owner'::user_role, 'manager'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- Categories Policies
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = TRUE OR public.is_restaurant_member(restaurant_id, auth.uid()));

CREATE POLICY "Staff can manage categories" ON public.categories
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid(), ARRAY['owner'::user_role, 'manager'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- Menu Items Policies
CREATE POLICY "Public can view available menu items" ON public.menu_items
    FOR SELECT USING (is_available = TRUE OR public.is_restaurant_member(restaurant_id, auth.uid()));

CREATE POLICY "Staff can manage menu items" ON public.menu_items
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid(), ARRAY['owner'::user_role, 'manager'::user_role, 'chef'::user_role])
        OR public.is_super_admin(auth.uid())
    );

-- Orders Policies
CREATE POLICY "Public can create orders" ON public.orders
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can view placed order by ID" ON public.orders
    FOR SELECT USING (TRUE);

CREATE POLICY "Staff can view and manage restaurant orders" ON public.orders
    FOR ALL USING (
        public.is_restaurant_member(restaurant_id, auth.uid())
        OR public.is_super_admin(auth.uid())
    );

-- Order Items Policies
CREATE POLICY "Public can create order items" ON public.order_items
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public can view order items" ON public.order_items
    FOR SELECT USING (TRUE);

-- Realtime publication enablement
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.dining_tables;
EXCEPTION
    WHEN others THEN null;
END $$;
